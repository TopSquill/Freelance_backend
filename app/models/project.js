'use strict';
const {
  Model
} = require('sequelize');

const db = require('.');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models['User'])
    }
  }
  Project.init({
    headline: DataTypes.STRING,
    description: DataTypes.TEXT,
    budget: DataTypes.FLOAT,
    budgetType: DataTypes.ENUM(['FIXED', 'HOURLY', 'MONTHLY']),
    attachments: DataTypes.ARRAY(DataTypes.STRING),
    postedByUserId: DataTypes.BIGINT
  }, {
    sequelize,
    name: 'Project',
    modelName: 'Project',
    timestamps: true
  });


  return Project;
};