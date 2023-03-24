'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('freelancer_tags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      freelancer_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'freelancer_profiles',
          key: 'id'
        }
      },
      tag_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'tags',
          key: 'id'
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('freelancer_tags');
  }
};