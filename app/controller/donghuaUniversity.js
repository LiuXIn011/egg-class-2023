
'use strict';

const { Controller } = require('egg');
class DHController extends Controller {
  async getProgress() {
    const { ctx } = this;
    const id = ctx.query.q;
    ctx.body = await ctx.service.donghuaUniversity.getProgress(id);
  }
  async getProgressView() {
    const { ctx } = this;
    const rules = {
      q: 'string'
    };
    ctx.validate(rules, ctx.query);
    const id = ctx.query.q;
    const data = await ctx.service.donghuaUniversity.getProgress(id);
    if (data) {
      return ctx.render('progress.html', { data });
    }
    ctx.body = '未查询到记录，请确认地址是否正确，或稍后刷新重试！';
  }
  async getUserList() {
    const { ctx } = this;
    const data = await ctx.service.donghuaUniversity.getList();
    return ctx.render('userList.html', { data });
  }
  async updateStatusByRegNo() {
    const { ctx } = this;
    const rules = {
      regNo: 'string',
      status: 'number'
    };
    ctx.validate(rules, ctx.request.body);
    await ctx.service.donghuaUniversity.updateStatusByRegNo(ctx.request.body);
    ctx.body = 'success';
  }
  async sendMessage() {
    const { ctx } = this;
    const data = ctx.request.body;
    const rules = {
      emailList: 'array',
      content: 'string'
    };
    ctx.validate(rules, data);
    await ctx.service.tools.sendMail(
      data.emailList,
      '刷课提醒',
      data.content
    );
    ctx.body = 'success';
  }
}
module.exports = DHController;
