'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('freelancer_profiles', 'title', {
      type: Sequelize.CHAR(100)
    });
    await queryInterface.addColumn('freelancer_profiles', 'description', {
      type: Sequelize.TEXT
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('freelancer_profiles', 'title');
    await queryInterface.removeColumn('freelancer_profiles', 'description')
  }
};
