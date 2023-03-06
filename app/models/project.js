'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
  Project.init({
    headline: DataTypes.STRING,
    description: DataTypes.TEXT,
    budget: DataTypes.FLOAT,
    budgetType: DataTypes.ENUM(['FIXED', 'HOURLY', 'MONTHLY']),
    attachments: DataTypes.ARRAY,
    userId: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Project',
  });

  Project.hasOne('users');
  return Project;
};