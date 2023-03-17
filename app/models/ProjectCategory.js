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
      // ProjectCategory.belongsTo(models['Project'], { foreignKey: 'project_id', as: 'project' });
      // ProjectCategory.belongsTo(models['Category'], { foreignKey: 'category_id', as: 'category' });
    }
  }
  ProjectCategory.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
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

  ProjectCategory.bulkCreateRaw = async (projectIds, categoryIds, options) => {
    let values = ''
     projectIds?.forEach((projectId, projIdx) => {
      categoryIds?.forEach((categoryId, categoryIdx) => {
        values = values + `(${projectId}, ${categoryId})
        ${projectIds.length - 1 == projIdx && categoryIds.length - 1 == categoryIdx ? '' : ', '}`
      })
    })
    await sequelize.query(`INSERT INTO project_categories (project_id, category_id) values ${values} `, options)
  }
  return ProjectCategory;
};