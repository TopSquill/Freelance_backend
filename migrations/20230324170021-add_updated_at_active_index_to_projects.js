'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('projects', 'active', { type: Sequelize.BOOLEAN });

    queryInterface.sequelize.query('CREATE INDEX created_at_idx on projects(created_at) where active')
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('projects', 'active');
  }
};
