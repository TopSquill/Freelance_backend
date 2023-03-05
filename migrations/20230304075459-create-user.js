'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE TYPE user_type AS ENUM ('FREELANCER', 'VENDOR', 'CLIENT');`)

    await queryInterface.sequelize.query(`CREATE TABLE USERS (
      id serial primary key,
      email VARCHAR(255) NOT NULL,
      mobile_no VARCHAR(10),
      name VARCHAR(255),
      is_email_verified boolean default false,
      is_mobile_verified boolean default false,
      created_at timestamp default current_timestamp,
      updated_at timestamp default current_timestamp,
      password VARCHAR(255),
      mobile_otp VARCHAR(20),
      email_otp VARCHAR(20),
      country VARCHAR(255),
      USER_TYPE user_type NOT NULL
    )`);
    await queryInterface.sequelize.query('ALTER TABLE USERS ADD CONSTRAINT unique_mobile_constraint UNIQUE (email);')
    await queryInterface.sequelize.query('ALTER TABLE USERS ADD CONSTRAINT unique_email_constraint UNIQUE (mobile_no);')
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
    await queryInterface.sequelize.query(`DROP TYPE user_type`);
  }
};