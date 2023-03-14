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

  return ProjectTag;
};