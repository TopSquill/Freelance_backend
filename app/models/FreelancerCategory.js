'use strict';
const {
  Model
} = require('sequelize');

const { FreelancerProfile, Tag } = require('.');
module.exports = (sequelize, DataTypes) => {
  class FreelancerCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FreelancerCategory.belongsTo(models['FreelancerProfile'], { as: 'joinedFreelancerProfile' });
      FreelancerCategory.belongsTo(models['Tag'],  { as: 'joinedTag' });
    }
  }
  FreelancerCategory.init({
    freelancer_id: {
      type: DataTypes.BIGINT,
      references: {
        model: 'freelancer_profiles',
        key: 'id'
      }
    },
    catgegory_id: {
      type: DataTypes.BIGINT,
      references: {
        model: 'categories',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'FreelancerCategory',
    name: 'FreelancerCategory',
    underscored: true
  });
  return FreelancerCategory;
};