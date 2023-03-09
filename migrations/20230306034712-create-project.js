'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE TYPE enum_projects_duration AS ENUM ('1_MONTH+', '2_MONTHS+', '3_MONTHS+', '6_MONTHS+');`)
    await queryInterface.createTable('projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
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
      duration: {
        allowNull: true,
        type: Sequelize.ENUM(['1_MONTH+', '2_MONTHS+', '3_MONTHS+', '6_MONTHS+'])
      },
      attachments: {
        type: Sequelize.ARRAY(DataTypes.TEXT)
      },
      posted_by_user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
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
    await queryInterface.sequelize.query('drop type enum_projects_duration');
  }
};