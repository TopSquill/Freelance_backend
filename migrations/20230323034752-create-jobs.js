'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jobs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.BIGINT
      },
      project_id: {
        type: Sequelize.BIGINT
      },
      status: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.FLOAT
      },
      amount_currency: {
        type: Sequelize.STRING
      },
      amount_type: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
    await queryInterface.sequelize.query('CREATE INDEX STATUS_IDX ON jobs (status);')
    await queryInterface.sequelize.query('CREATE UNIQUE INDEX idx_project_id_user_id ON jobs (project_id, user_id) where status!=\'REASSIGNED\';')
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('jobs');
    // await queryInterface.sequelize.query('DROP INDEX STATUS_IDX;');
    // await queryInterface.sequelize.query('DROP INDEX idx_project_id;')
  }
};
