
'use strict';

const { Controller } = require('egg');
class DHController extends Controller {
  async getProgress() {
    const { ctx } = this;
    const id = ctx.query.q;
    ctx.body = await ctx.service.donghuaUniversity.getProgress(id);
  }
}
module.exports = DHController;
