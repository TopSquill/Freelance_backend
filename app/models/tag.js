'use strict';
const {
  Model
} = require('sequelize');
const { ProjectTag } = require('.');

module.exports = (sequelize, DataTypes) => {
  class tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models['Category'], { as: 'category' })
      this.belongsToMany(models.Project, { through: models['ProjectTag'], as: 'TaggedProject', foreignKey: 'tag_id' });
    }
  }
  tag.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    categoryId: {
      type: DataTypes.BIGINT,
      references: {
        model: 'categories',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Tag',
    name: 'Tag',
    underscored: true,
    timestamps: false,
    defaultScope: {
      attributes: ['id', 'title']
    }
  });
  return tag;
};