/* indent size: 2 */
const dayjs = require('dayjs');

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('donghuaUniversity', {
    regNo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'reg_no',
      primaryKey: true,
      comment: '学号'
    },
    id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'id',
      comment: '刷课进程id'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'name',
      comment: '姓名'
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'address',
      comment: '住址'
    },
    birthday: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'birthday',
      comment: '生日'
    },
    cardNo: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'card_no',
      comment: '证件号'
    },
    cardType: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'card_type',
      comment: '证件类型'
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'email',
      comment: '邮箱'
    },
    folk: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'folk',
      comment: '民族'
    },
    gender: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'gender',
      comment: '性别'
    },
    grade: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'grade',
      comment: '年级'
    },
    mobilephone: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'mobilephone',
      comment: '手机号'
    },
    orientEdutype: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'orient_edutype',
      comment: '专业'
    },
    photoLink: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'photo_link',
      comment: '头像'
    },
    polity: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'polity',
      comment: '政治面貌'
    },
    recruitDate: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'recruit_date',
      comment: '入学时间'
    },
    site: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'site',
      comment: '校区'
    },
    xueli: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'xueli',
      comment: '学历'
    },
    completeClass: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: 'complete_class',
      comment: '已经学过视频数量'
    },
    continueClass: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: 'continue_class',
      comment: '学习中视频数量'
    },
    classLength: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: 'class_length',
      comment: '没有学过视频数量'
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: 'status',
      comment: '是否正在上课 0未开始 1进行中  2完成 3出错暂停 4停止上课 5未绑定的微信 99内存过载'
    },
    errorLog: {
      type: DataTypes.STRING(2550),
      allowNull: true,
      field: 'error_log',
      comment: '错误日志'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
      get() {
        return dayjs(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      comment: '创建时间'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
      get() {
        return dayjs(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      comment: '最近更新时间'
    }
  }, {
    tableName: 'donghua_university',
    comment: '东华大学刷课信息'
  });

  Model.associate = function() {

  };

  return Model;
};
