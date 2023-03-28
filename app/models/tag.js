'use strict';
const {
  Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models['Category'], { as: 'category' })
      this.belongsToMany(models.Project, { through: models['ProjectTag'], as: 'TaggedProject', foreignKey: 'tag_id' });
      this.belongsToMany(models.FreelancerProfile, { through: models['FreelancerTag'], as: 'taggedFreelancerProfiles', foreignKey: 'tag_id' });
    }
  }
  Tag.init({
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
    },
    freelancersCount: {
      type: DataTypes.BIGINT
    },
    projectsCount: {
      type: DataTypes.BIGINT
    },
    searches: {
      type: DataTypes.BIGINT
    }
  }, {
    sequelize,
    modelName: 'Tag',
    name: 'Tag',
    underscored: true,
    timestamps: false,
    defaultScope: {
      attributes: ['id', 'title'],
    }
  });


  Tag.increaseFreelancerCount = (tagId) => {
    return sequelize.query('UPDATE TAGS SET freelancers_count=freelancers_count+1 where id=:tagId', { replacements: { tagId } })
  }

  Tag.increaseProjectCount = (tagId) => {
    return sequelize.query('UPDATE TAGS SET projects_count=projects_count+1 where id=:tagId', { replacements: { tagId } })
  }

  Tag.increaseSearchesCount = (tagId) => {
    return sequelize.query('UPDATE TAGS SET searches=searches+1 where id=:tagId', { replacements: { tagId } })
  }
  return Tag;
};