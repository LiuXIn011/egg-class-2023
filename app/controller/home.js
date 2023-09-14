'use strict';

// 引入webdriver
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
// 引入chromedriver
require('chromedriver');
// 引入axios模块
const axios = require('axios');

const { Controller } = require('egg');

class HomeController extends Controller {
  async start() {
    const { ctx } = this;
    ctx.logger.info('开始处理');
    // 实例化selenium
    const chromeData = new chrome.Options();
    chromeData.addArguments('--no-sandbox');
    // chromeData.addArguments('--headless'); // 不打开浏览器运行;
    chromeData.addArguments('--disable-gpu');
    const By = webdriver.By;
    const driver = new webdriver.Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeData)
      .usingServer('http://192.168.186.130:3000/webdriver')
      .build();
    try {
      await driver.get('https://dhcj.ct-edu.com.cn/');
      // 点击显示二维码
      await driver.wait(webdriver.until.elementLocated(By.css('.extra>button')), 10000).click();
      // 进入iframe
      console.log('进入iframe');
      const iframe = await driver.wait(webdriver.until.elementLocated(By.css('iframe')), 10000);
      await driver.switchTo().frame(iframe);
      driver.sleep(3000);
      // 获取路径
      console.log('获取路径');
      const qrcodePath = await driver.wait(webdriver.until.elementLocated(By.css('.wrp_code>img')), 10000).getAttribute('src');
      const render = ctx.render('home.html', { qrcodePath });
      // 获取token
      this.getToken(driver, By);
      return render;
    } catch (error) {
      ctx.logger.error(error);
      ctx.logger.error('启动失败');
      await driver.quit();
    }
  }
  async getToken(driver, By) {
    const { ctx } = this;
    try {
    // 登录成功
      await driver.wait(webdriver.until.elementLocated(By.className('log-out')), 120000);
      ctx.logger.info('登录成功');
      // 获取student-access-token
      const studentAccessToken = (await driver.manage().getCookie('student-access-token')).value;
      // 获取用户信息
      let userInfo = {};
      await axios({
        url: 'https://dhcj.ct-edu.com.cn/ws/student/personal/studentPersonal/queryPersonalInfoData',
        method: 'post',
        headers: {
          Authorization: `Bearer ${studentAccessToken}`
        }
      }).then(async ({ data }) => {
        if (data.responseCode === 'SUCCESS') {
          userInfo = data.infoData;
          await ctx.service.donghuaUniversity.create(userInfo);
        } else {
          ctx.logger.error('获取用户信息失败');
          await driver.quit();
        }
      });
      // 获取课程列表
      await axios({
        url: 'https://dhcj.ct-edu.com.cn/ws/student/learn/studentLearningCourse/queryLearningCourseData',
        method: 'post',
        headers: {
          Authorization: `Bearer ${studentAccessToken}`
        }
      }).then(async ({ data }) => {
        if (data.responseCode === 'SUCCESS') {
          ctx.logger.info('查询成功课程列表成功');
          // 处理数据
          const allClassUrl = (data.courseList || [])
            // 过滤没有发布课程的
            .filter(item => !item.flagFixedCourse && item.flagLearningPlatform)
            // 组合url
            .map(item => {
              return `https://dhcj.ct-edu.com.cn${item.learningUrl}&access_token=${studentAccessToken}`;
            });
          ctx.logger.info('可学习的课程地址');
          ctx.logger.info(allClassUrl);
          // 打开页面 获取上课信息
          await this.openPage(0, allClassUrl, driver, By, 0, 0, [], 0, userInfo);

        } else {
          ctx.logger.error(`查询课程列表失败：${data.message}`);
          await driver.quit();
        }
      }).catch(async err => {
        ctx.logger.error('查询课程列表失败：错误信息');
        ctx.logger.info(err);
        await driver.quit();
      });
    } catch (error) {
      ctx.logger.error(error);
      ctx.logger.error('登录失败');
      await driver.quit();
    }
  }
  async openPage(
    classIndex,
    allClassUrl,
    driver,
    By,
    completeClassLengthData,
    continueClassLengthData,
    noStudyClassInfoData,
    classLengthData,
    userInfo
  ) {
    const { ctx } = this;
    // 已经学过
    let completeClassLength = completeClassLengthData;
    // 学习中
    let continueClassLength = continueClassLengthData;
    // 所有未学视频信息
    const noStudyClassInfo = noStudyClassInfoData;
    // 未学习的视频
    let classLength = classLengthData;
    // 打开课程地址
    ctx.logger.info('打开课程地址：' + allClassUrl[classIndex]);
    await driver.get(allClassUrl[classIndex]);
    await driver.sleep(1000);
    // 获取url
    const url = await driver.getCurrentUrl();
    ctx.logger.info('跳转url为：' + url);
    // 获取资源id参数
    let courseId = '';
    try {
      courseId = url.split('/').slice(-4, -3)[0];
    } catch (error) {
      await driver.quit();
      ctx.logger.error('未正常获取资源id');
    }
    ctx.logger.info('资源id为：' + courseId);
    // 获取token
    const accessToken = (await driver.manage().getCookie('accessToken')).value;
    ctx.logger.info('学习平台cookie为：' + accessToken);
    // 获取录播课列表
    const formData = new URLSearchParams();
    formData.append('courseId', courseId);
    await axios({
      url: 'https://www.learnin.com.cn/app/user/student/course/space/overview/appStudentCourseOverview/loadCourseOutlineData',
      method: 'post',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      data: formData
    }).then(async ({ data }) => {
      if (data.errorCode === 0) {
        ctx.logger.info('录播课列表查询成功');
        // 拆分已学习数据
        const videoCompleted = (data.learnRecords || []).filter(item => item.completeState === 'Completed').map(item => item.sectionContentId);
        // 拆分学习中数据
        const videoContinue = (data.learnRecords || []).filter(item => item.completeState === 'Continue').map(item => item.sectionContentId);
        // 组合url
        (data.sectionContents || []).forEach(item => {
          if (item.additionTypeCode === 'VIDEO') {
            if (videoCompleted.includes(item.id)) {
              // 已经学过
              completeClassLength++;
            } else if (videoContinue.includes(item.id)) {
              // 学习中
              continueClassLength++;
              item.classPath = `https://www.learnin.com.cn/user/#/user/student/course/${courseId}/learn/${item.id}?hideChapter=true`;
              noStudyClassInfo.push(item);
            } else {
              // 未学习
              classLength++;
              item.classPath = `https://www.learnin.com.cn/user/#/user/student/course/${courseId}/learn/${item.id}?hideChapter=true`;
              noStudyClassInfo.push(item);
            }
          }
        });
      } else {
        await driver.quit();
        ctx.logger.error(data.message);
      }
    }).catch(async err => {
      ctx.logger.error('录播课列表查询失败，错误信息：');
      ctx.logger.info(err);
      await driver.quit();
    });

    // 循环调用所有课程
    if (classIndex < allClassUrl.length - 1) {
      await this.openPage(
        classIndex + 1,
        allClassUrl,
        driver,
        By,
        completeClassLength,
        continueClassLength,
        noStudyClassInfo,
        classLength,
        userInfo
      );
    } else {
      // 查询完毕更新数据
      const studentData = {
        regNo: userInfo.regNo,
        completeClass: completeClassLength,
        continueClass: continueClassLength,
        classLength
      };
      await ctx.service.donghuaUniversity.updateClassLength(studentData);
      // 开始上课
      await this.setClassGoOn(noStudyClassInfo, driver, By, studentData);
    }
  }
  async setClassGoOn(noStudyClassInfo, driver, By, studentData) {
    const { ctx } = this;
    ctx.logger.info(`剩余课程数量：${noStudyClassInfo.length}`);
    if (noStudyClassInfo.length === 0) {
      // 停止巡查
      await driver.quit();
      ctx.logger.info('课程全部结束，停止巡查，感谢使用！');
      return;
    }
    // 分割数据
    const currentClass = noStudyClassInfo.splice(0, 1)[0];
    ctx.logger.info('当前课程数据');
    ctx.logger.info(currentClass);
    ctx.logger.info('打开地址');
    await driver.executeScript(`window.open('${currentClass.classPath}','_blank');`);
    // 所有窗口handel
    const allWindowHandles = await driver.getAllWindowHandles();
    // 切换最新窗口
    await driver.switchTo().window(allWindowHandles[allWindowHandles.length - 1]);
    ctx.logger.info('等待视频加载');
    await driver.sleep(3000);
    // 设置静音
    await driver.executeScript('document.querySelector("#vjs_video_3_html5_api").volume=0');
    // 设置自动循环播放
    // await driver.executeScript(`document.querySelector("#vjs_video_3_html5_api").setAttribute("loop","")`)
    ctx.logger.info('开始播放');
    await driver.wait(webdriver.until.elementLocated(By.css('.pv-controls-left>button')), 10000).click();
    // 点击二倍速
    ctx.logger.info('二倍速播放');
    await driver.executeScript('document.querySelector(\'.pv-controls-right>div:first-child>div>div>div:nth-child(1)\').click()');
    ctx.logger.info('=======================================================================');
    // 运行巡查程序
    await this.inspectionClass(currentClass, driver, By, noStudyClassInfo, studentData);
  }
  async inspectionClass(currentClass, driver, By, noStudyClassInfo, studentData) {
    const { ctx } = this;
    ctx.logger.info(`课程：${currentClass.title}=》巡查程序运行中`);
    // 每分钟巡查一次
    const timer = setInterval(async function() {
      ctx.logger.info(`课程：${currentClass.title}=》开始巡查`);
      // 获取url
      const url = await driver.getCurrentUrl();
      ctx.logger.info('url为：' + url);
      // 获取资源id参数
      let courseId = '';
      try {
        courseId = url.split('/').slice(-3, -2)[0];
      } catch (error) {
        ctx.logger.error('未正常获取资源id');
      }
      ctx.logger.info('资源id为：' + courseId);
      // 获取token
      const accessToken = (await driver.manage().getCookie('accessToken')).value;
      // 获取录播课列表
      const formData = new URLSearchParams();
      formData.append('courseId', courseId);
      await axios({
        url: 'https://www.learnin.com.cn/app/user/student/course/space/overview/appStudentCourseOverview/loadCourseOutlineData',
        method: 'post',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        data: formData
      }).then(async ({ data }) => {
        if (data.errorCode === 0) {
          for (let i = 0; i < (data.learnRecords || []).length; i++) {
            const item = (data.learnRecords || [])[i];
            if (item.sectionContentId === currentClass.id) {
            // 当前数据
              ctx.logger.info('当前数据');
              ctx.logger.info(item);
              if (item.completeState === 'Completed') {
              // 播放完成
                ctx.logger.info('课程状态：播放完成');
                ctx.logger.info('=======================================================================');
                clearInterval(timer);
                // 更新数据
                studentData.completeClassLength++;
                studentData.classLength--;
                await ctx.service.donghuaUniversity.updateClassLength(studentData);
                // 继续上课
                await this.setClassGoOn(noStudyClassInfo, driver, By, studentData);
              } else {
              // 未结束
                ctx.logger.info('课程状态：进行中');
                ctx.logger.info('=======================================================================');
              }
              break;
            }
          }
        } else {
          ctx.logger.error(data.message);
          await driver.quit();
        }
      }).catch(async err => {
        ctx.logger.error('录播课列表查询失败，错误信息：');
        ctx.logger.info(err);
        await driver.quit();
      });
    }, 60000);
  }
}

module.exports = HomeController;
