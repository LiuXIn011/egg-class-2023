/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1694656736413_1617';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    mailName: '',
    mailPassword: ''
  };
  // 数据库配置
  config.sequelize = {
    dialect: 'mysql',
    port: 3306,
    timezone: '+08:00',
    database: '',
    host: '',
    username: '',
    password: ''
  };
  config.view = {
    mapping: {
      '.html': 'ejs'
    }
  };
  // 跨域配置
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };
  config.security = {
    csrf: {
      enable: false
    }
  };
  return {
    ...config,
    ...userConfig
  };
};
