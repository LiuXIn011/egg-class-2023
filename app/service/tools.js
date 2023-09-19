const { Service } = require('egg');
// 引入nodemailer
const nodemailer = require('nodemailer');
const user_email = '2498553107@qq.com';// 账号
const auth_code = 'snraqvtjzzeqeaac';// 授权码
// 封装发送者信息
const transporter = nodemailer.createTransport({
  service: 'qq', // 调用qq服务器
  secureConnection: true, // 启动
  SSLport: 465, // 端口就是465
  auth: {
    user: user_email, // 账号
    pass: auth_code // 授权码
  }
});
class ToolsService extends Service {
  async sendMail(email, subject, html) {
    console.log(email, subject, html);
    const mailOptions = {
      from: user_email, // 发送者,与上面的user一致
      to: email, // 接收者,可以同时发送多个,以逗号隔开
      subject, // 标题html,
      html
    };
    try {
      // 调用函数，发送邮件
      await transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      return false;
    }
  }
}
module.exports = ToolsService;
