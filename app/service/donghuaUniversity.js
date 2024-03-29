const { Service } = require('egg');
class DonghuaUniversityService extends Service {
  async create(data) {
    const currentData = await this.ctx.model.DonghuaUniversity.findOne({
      where: {
        regNo: data.regNo
      }
    });
    if (currentData) {
      if (
        currentData.status === 1
      ) {
        // 正在上课中
        currentData.id = data.id;
        currentData.save();
        return false;
      }
      if (currentData.status !== 3) {
        currentData.errorLog = '';
      }
      currentData.id = data.id;
      currentData.name = data.name;
      currentData.status = data.status;
      currentData.address = data.address;
      currentData.birthday = data.birthday;
      currentData.cardNo = data.cardNo;
      currentData.cardType = data.cardType;
      currentData.email = data.email;
      currentData.folk = data.folk;
      currentData.gender = data.gender;
      currentData.grade = data.grade;
      currentData.mobilephone = data.mobilephone;
      currentData.orientEdutype = data.orientEdutype;
      currentData.photoLink = data.photoLink;
      currentData.polity = data.polity;
      currentData.recruitDate = data.recruitDate;
      currentData.site = data.site;
      currentData.xueli = data.xueli;
      currentData.save();
      return currentData;
    }
    return await this.ctx.model.DonghuaUniversity.create(data);
  }
  async updateClassLength(data) {
    const currentData = await this.ctx.model.DonghuaUniversity.findOne({
      where: {
        regNo: data.regNo
      }
    });
    currentData.completeClass = data.completeClass;
    currentData.continueClass = data.continueClass;
    currentData.classLength = data.classLength;
    currentData.save();
    return currentData;
  }
  async setInClass({
    regNo,
    status,
    errorLog
  }) {
    const currentData = await this.ctx.model.DonghuaUniversity.findOne({
      where: {
        regNo
      }
    });
    if (currentData) {
      currentData.status = status;
      currentData.errorLog = errorLog || '';
      currentData.save();
      return currentData;
    }
    return false;
  }
  async getProgress(id) {
    return await this.ctx.model.DonghuaUniversity.findOne({
      where: {
        id
      },
      attributes: [ 'regNo', 'name', 'email', 'completeClass', 'continueClass', 'classLength', 'status' ]
    });
  }
  async getStatusByRegNo(regNo) {
    return await this.ctx.model.DonghuaUniversity.findOne({
      where: {
        regNo
      },
      attributes: [ 'regNo', 'name', 'status' ]
    });
  }
  async getList() {
    const { app, ctx } = this;
    const Op = app.Sequelize.Op;
    return await ctx.model.DonghuaUniversity.findAndCountAll({
      where: {
        status: {
          [Op.ne]: 5
        }
      },
      attributes: [ 'regNo', 'name', 'email', 'mobilephone', 'orientEdutype', 'photoLink', 'completeClass', 'continueClass', 'classLength', 'status', 'errorLog', 'createdAt', 'updatedAt' ],
      order: [
        [ 'createdAt', 'DESC' ]
      ]
    });
  }
  async updateStatusByRegNo({ regNo, status }) {
    const currentData = await this.ctx.model.DonghuaUniversity.findOne({
      where: {
        regNo
      }
    });
    currentData.status = status;
    currentData.save();
    return currentData;
  }
  async stopByRegNoMultiple({ regNoList, status }) {
    const { app, ctx } = this;
    const Op = app.Sequelize.Op;
    return await ctx.model.DonghuaUniversity.update({ status }, {
      where: {
        regNo: {
          [Op.or]: regNoList
        },
        status: 1
      }
    });
  }
  async removeById(id) {
    return await this.ctx.model.DonghuaUniversity.destroy({
      where: {
        id
      }
    });
  }
}
module.exports = DonghuaUniversityService;
