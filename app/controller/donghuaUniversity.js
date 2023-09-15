
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
}
module.exports = DHController;
