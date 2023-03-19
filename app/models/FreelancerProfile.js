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
      this.belongsTo(models['User'], { foreignKey: 'user_id', as: 'userAccount' })
      this.belongsToMany(models['Category'], { through: 'FreelancerCategory', foreignKey: 'category_id', as: 'categories' })
      this.belongsToMany(models['Tag'], { through: 'FreelancerTag', foreignKey: 'tag_id', as: 'freelancerTags' })
    }
  }
  FreelancerProfile.init({
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'User',
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