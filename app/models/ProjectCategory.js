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
      ProjectCategory.belongsTo(models['Project'], { foreignKey: 'project_id', as: 'project' });
      ProjectCategory.belongsTo(models['Category'], { foreignKey: 'category_id', as: 'category' });
    }
  }
  ProjectCategory.init({
    projectId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'project_id',
      references: {
        model: 'Project',
        key: 'id'
      }
    },
    categoryId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'category_id',
      references: {
        model: 'Category',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'ProjectCategory',
    underscored: true,
    name: 'ProjectCategory',
    timestamps: false
  });

  return ProjectCategory;
};