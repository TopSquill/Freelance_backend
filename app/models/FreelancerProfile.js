'use strict';
const {
  Model, QueryTypes
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
      unique: true,
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

  // will add country later
  FreelancerProfile.getFilteredProfiles = async (search, tags=null) => {
    const data = await sequelize.query(`SELECT u.*, ARRAY_AGG(t.title) AS tags
      FROM users u
      INNER JOIN freelancer_profiles f ON f.user_id=u.id
      LEFT OUTER JOIN freelancer_tags ft ON ft.freelancer_id = f.id
      LEFT OUTER JOIN tags t ON t.id = ft.tag_id
      WHERE (

      )`, {
        replacements: {

        },
        type: QueryTypes.SELECT,
        model: FreelancerProfile,
        mapToModel: true
      });

      return data;
  }

  return FreelancerProfile;
};