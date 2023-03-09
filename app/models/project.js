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
      this.belongsTo(models['User'])
      Project.hasMany(models['ProjectCategory']);
      Project.hasMany(models['ProjectTag'])
    }
  }
  Project.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true
    },
    headline: DataTypes.STRING,
    description: DataTypes.TEXT,
    budget: DataTypes.FLOAT,
    budgetType: DataTypes.ENUM(['FIXED', 'HOURLY', 'MONTHLY']),
    attachments: DataTypes.ARRAY(DataTypes.STRING),
    postedByUserId: DataTypes.BIGINT,
    duration: {
      allowNull: true,
      type: DataTypes.ENUM(['1_MONTH+', '2_MONTHS+', '3_MONTHS+', '6_MONTHS+'])
    },
  }, {
    sequelize,
    name: 'Project',
    modelName: 'Project',
    underscored: true,
    timestamps: true
  });

  return Project;
};