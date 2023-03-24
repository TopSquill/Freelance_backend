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
      FreelancerTag.belongsTo(models['FreelancerProfile'], { model: FreelancerProfile, as: 'associatedFreelancer', foreignKey: 'freelancer_id' });
      FreelancerTag.belongsTo(models['Tag'], { model: Tag, as: 'associatedTag', foreignKey: 'id' });
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
    underscored: true,
    timestamps: false
  });

  FreelancerTag.bulkCreateRaw = async (freelancerId, tagIds, options) => {
    let values = '';
    tagIds?.forEach((tagId, idx) => { 
      values += `(${freelancerId}, ${tagId})`;
      values += `${tagIds.length - 1 == idx ? '' : ', '}`
    });

    await sequelize.query(`INSERT INTO freelancer_tags (freelancer_id, tag_id) values ${values} `, options)
  }

  return FreelancerTag;
};