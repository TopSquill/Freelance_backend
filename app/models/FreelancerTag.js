'use strict';
const {
  Model
} = require('sequelize');

const { FreelancerProfile, Tag } = require('.');

module.exports = (sequelize, DataTypes) => {
  class FreelancerTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FreelancerTag.belongsTo(models['FreelancerProfile'], { as: 'associatedFreelancerProfile' });
      FreelancerTag.belongsTo(models['Tag'], { as: 'associatedTag' });
    }
  }
  FreelancerTag.init({
    freelancerId: {
      type: DataTypes.BIGINT,
      references: {
        model: 'freelancer_profiles',
        key: 'id'
      }
    },
    tagId: {
      type: DataTypes.BIGINT,
      references: {
        model: 'tags',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'FreelancerTag',
    name: 'FreelancerTag',
    underscored: true
  });
  return FreelancerTag;
};