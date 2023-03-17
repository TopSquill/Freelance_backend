'use strict';
const {
  Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class ProjectTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProjectTag.belongsTo(models['Project'], { as: 'Project' });
      ProjectTag.belongsTo(models['Tag'], { as: 'Tag' });
    }
  }
  ProjectTag.init({
    projectId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      
    },
    tagId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    }
  }, {
    sequelize,
    underscored: true,
    name: 'ProjectTag',
    modelName: 'ProjectTag',
    timestamps: false
  });

  ProjectTag.bulkCreateRaw = async (projectIds, tagIds, options) => {
    let values = ''
     projectIds?.forEach((projectId, projIdx) => {
      tagIds?.forEach((tagId, tagIdx) => {
        values = values + `(${projectId}, ${tagId})
        ${projectIds.length - 1 == projIdx && tagIds.length - 1 == tagIdx ? '' : ', '}`
      })
    })
    await sequelize.query(`INSERT INTO project_tags (project_id, tag_id) values ${values} `, options)
  }

  return ProjectTag;
};