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
    freelancerId: {
      type: DataTypes.BIGINT,
      references: {
        model: 'freelancer_profiles',
        key: 'id'
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
    modelName: 'FreelancerCategory',
    name: 'FreelancerCategory',
    underscored: true,
    timestamps: false
  });

  FreelancerCategory.bulkCreateRaw = async (freelancerId, categoryIds, options) => {
    let values = '';
    categoryIds?.forEach((categoryId, idx) => { 
      values += `(${freelancerId}, ${categoryId})`;
      values += `${categoryIds.length - 1 == idx ? '' : ', '}`
    });

    await sequelize.query(`INSERT INTO freelancer_categories (freelancer_id, category_id) values ${values} `, options)
  }
  return FreelancerCategory;
};