'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('proposals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        unique: 'unique_project_user'
      },
      project_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'projects',
          key: 'id'
        },
        unique: 'unique_project_user'
      },
      message: {
        type: Sequelize.TEXT
      },
      attachments: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      bid_type: {
        type: Sequelize.STRING
      },
      bid_currency: {
        type: Sequelize.STRING
      },
      bid_amount: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      uniqueKeys: {
        'unique_project_user': {
          fields: ['user_id', 'project_id']
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP TABLE proposals CASCADE');
    // await queryInterface.sequelize.query('ALTER TABLE proposals DROP CONSTRAINT projects_project_id_fkey CASCADE');
    // await queryInterface.sequelize.query('ALTER TABLE proposals DROP CONSTRAINT proposals_user_id_project_id_key');
  }
};