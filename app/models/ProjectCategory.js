'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProjectCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models['Project']);
      this.belongsTo(models['Category']);
    }
  }
  ProjectCategory.init({
    projectId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ProjectCategory',
    underscored: true,
    name: 'ProjectCategory'
  });

  return ProjectCategory;
};