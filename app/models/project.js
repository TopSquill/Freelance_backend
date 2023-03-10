'use strict';
const {
  Model
} = require('sequelize');

const durationTypes = ['1_MONTH+', '2_MONTHS+', '3_MONTHS+', '6_MONTHS+']

const budgetTypes = ['FIXED', 'HOURLY', 'MONTHLY'];

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Project.belongsTo(models['User'])
      // Project.hasMany(models['ProjectCategory']);
      // Project.hasMany(models['Tag'], { through: models['ProjectTag'] });
    }
  }
  Project.init({
    headline: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    budget: DataTypes.FLOAT,
    budgetType: {
      type: DataTypes.ENUM(budgetTypes),
      validate: {
        isIn: {
          msg: `Budget type must one of these (${Object.values(budgetTypes).join(
            ", ",
          )})`,
          args: [budgetTypes]
        }
      }
    },
    attachments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    postedByUserId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'posted_by_user_id'
      }
    },
    duration: {
      allowNull: true,
      type: DataTypes.ENUM(durationTypes),
      validate: {
        isIn: {
          msg: `Duration type must one of these (${Object.values(durationTypes).join(
            ", ",
          )})`,
          args: [durationTypes]
        }
      }
    },
  }, {
    sequelize,
    name: 'Project',
    modelName: 'Project',
    underscored: true,
    timestamps: true
  });

  return Project;
};