'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      headline: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      budget: {
        allowNull: true,
        type: Sequelize.FLOAT
      },
      budget_type: {
        allowNull: true,
        type: Sequelize.ENUM(['FIXED', 'HOURLY', 'MONTHLY'])
      },
      attachments: {
        type: Sequelize.ARRAY(DataTypes.TEXT)
      },
      user_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('projects');
  }
};