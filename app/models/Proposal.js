'use strict';
const {
  Model
} = require('sequelize');
const BudgetTypes = require('../utils/constants/BudgetTypes');

module.exports = (sequelize, DataTypes) => {
  class Proposal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Proposal.belongsTo(models['User'], { as: 'proposedBy', foreignKey: 'user_id' })
      Proposal.belongsTo(models['Project'], { as: 'biddenProject', foreignKey: 'project_id' })
    }
  }
  Proposal.init({
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    projectId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id'
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    attachments: DataTypes.ARRAY(DataTypes.STRING),
    bidType: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: {
          msg: `Budget type must one of these (${Object.values(BudgetTypes).join(
            ", ",
          )})`,
          args: [BudgetTypes]
        }
      }
    },
    bidCurrency: {
      type: DataTypes.STRING
    },
    bidAmount: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Proposal',
    name: 'Proposal',
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'project_id']
      }
    ]
  });
  return Proposal;
};