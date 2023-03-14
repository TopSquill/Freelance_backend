'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      projectId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        field: 'project_id',
        references: {
          model: 'projects',
          key: 'id'
        }
      },
      categoryId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        field: 'category_id',
        references: {
          model: 'categories',
          key: 'id'
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('project_categories');
  }
};