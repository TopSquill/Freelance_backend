'use strict';
const {
  Model
} = require('sequelize');
const { Tag } = require('.');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models['Project'], {
        through: models['ProjectCategory'],
        as: 'Project'
      })
      this.hasMany(models['Tag'], { as: 'tags', foreignKey: 'category_id', onDelete: 'CASCADE' })
      this.belongsToMany(models['FreelancerProfile'], { through: 'FreelancerCategory', as: 'freelancerProfiles', foreignKey: 'freelancer_id' })
    }
  }
  Category.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      },
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Category',
    name: 'Category',
    timestamps: false,
    underscored: true,
  });

  return Category;
};