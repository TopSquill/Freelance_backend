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
    title: {
      type: DataTypes.CHAR
    },
    description: {
      type: DataTypes.TEXT
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
  FreelancerProfile.getFilteredProfiles = async (search='', lastFetchedUserId=0, tags=null) => {
    const data = await sequelize.query(`SELECT 
      u.id,
      u.name, 
      u.country,
      u.user_type,
      u.is_email_verified,
      u.is_mobile_verified,
      f.id as "freelancer.id",
      f.title as "freelancer.title",
      f.description as "freelancer.description",
      ARRAY_AGG(t.title) AS tags
      FROM users u
      INNER JOIN freelancer_profiles f ON f.user_id=u.id
      LEFT OUTER JOIN freelancer_tags ft ON ft.freelancer_id = f.id
      LEFT OUTER JOIN tags t ON t.id = ft.tag_id
      WHERE (
        (u.name iLike :search OR
        f.title iLike :search OR
        f.description iLike :search) AND
        :tags_filtered OR t.id IN (:tags) AND
        u.id > :last_fetched_user_id
      ) GROUP BY (u.id, f.id)
      order by u.created_at desc
      limit :limit;`, {
        replacements: {
          search: `%${search}%`,
          tags: !!tags?.length ? tags : -1,
          tags_filtered: !tags?.length,
          last_fetched_user_id: lastFetchedUserId,
          limit: 20
        },
        type: QueryTypes.SELECT,
        model: FreelancerProfile,
        mapToModel: true,
        nest: true,
        raw: true
      });

      return data;
  }

  return FreelancerProfile;
};