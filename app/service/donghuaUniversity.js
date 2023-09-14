const { Service } = require('egg');
class DonghuaUniversityService extends Service {
  async create(data) {
    const currentData = await this.ctx.model.DonghuaUniversity.findOne({
      where: {
        regNo: data.regNo
      }
    });
    if (currentData) {
      currentData.name = data.name;
      currentData.regNo = data.regNo;
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
      // currentData.completeClass = data.completeClass;
      // currentData.continueClass = data.continueClass;
      // currentData.classLength = data.classLength;
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
}
module.exports = DonghuaUniversityService;
