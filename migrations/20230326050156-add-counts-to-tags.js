'use strict';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('tags', 'freelancers_count', {
      type: Sequelize.INTEGER
    });
    await queryInterface.addColumn('tags', 'projects_count', {
      type: Sequelize.INTEGER
    });
    await queryInterface.addColumn('tags', 'searches', {
      type: Sequelize.INTEGER
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('tags', 'freelancers_count');
    await queryInterface.removeColumn('tags', 'projects_count');
    await queryInterface.removeColumn('tags', 'searches');
  }
};
