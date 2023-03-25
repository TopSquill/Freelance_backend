'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Job.belongsTo(models['Project'], { as: 'associatedProject', foreignKey: 'id' })
      Job.belongsTo(models['User'], { as: 'associatedFreelancer', foreignKey: 'id' })
    }
  }
  Job.init({
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
    amount: {
      type: DataTypes.FLOAT
    },
    amountCurrency: {
      type: DataTypes.STRING
    },
    amountType: {
      type: DataTypes.STRING
    },
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Job',
    name: 'Job',
    underscored: true,
    indexes: [{
      fields: ['status']
    }]
  });

  return Job;
};