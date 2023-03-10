'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FreelancerProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models['User'])
    }
  }
  FreelancerProfile.init({
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    projects: DataTypes.ARRAY(DataTypes.JSON),
    links: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    sequelize,
    modelName: 'FreelancerProfile',
    name: 'FreelancerProfile',
    underscored: true,
  });
  return FreelancerProfile;
};