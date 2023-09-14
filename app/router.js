'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 线上环境默认每次启动构建数据库
  if (app.config.env === 'prod') {
    // 初始化数据库 { force: true }重置
    app.model.sync({
      alter: true
    });
  }
  router.get('/class/start', controller.home.start);
};
