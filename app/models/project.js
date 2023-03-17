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
      Project.belongsTo(models['User'], { as: 'postedBy', foreignKey: 'posted_by_user_id' })
      Project.belongsToMany(models['Category'], { through: models['ProjectCategory'], as: 'categories', });
      Project.belongsToMany(models['Tag'], { through: models['ProjectTag'], as: 'keywords', foreignKey: 'project_id' });
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
    budgetCurrency: {
      type: DataTypes.STRING,
      validate: {
        len: 3
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
        key: 'id'
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

  Project.beforeCreate(async (user, options) => {
    user.dataValues.budgetCurrency = user.dataValues.budgetCurrency?.toUpperCase?.()
  })

  return Project;
};