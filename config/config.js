const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'suvodip',
    password: process.env.DB_PASSWORD || 'suvodip',
    database: process.env.DB_NAME || 'topsqill',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      //  maximum time, in milliseconds, that pool will try to get connection before throwing error
      acquire: 30000,
      // maximum time, in milliseconds, that a connection can be idle before being released
      idle: 10000
    }
  },
  "test": {
    username: process.env.DB_USER || 'suvodip',
    password: process.env.DB_PASSWORD || 'suvodip',
    database: process.env.DB_NAME || 'topsqill',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      //  maximum time, in milliseconds, that pool will try to get connection before throwing error
      acquire: 30000,
      // maximum time, in milliseconds, that a connection can be idle before being released
      idle: 10000
    }
  },
  "production": {
    username: process.env.DB_USER || 'suvodip',
    password: process.env.DB_PASSWORD || 'suvodip',
    database: process.env.DB_NAME || 'topsqill_production',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      //  maximum time, in milliseconds, that pool will try to get connection before throwing error
      acquire: 30000,
      // maximum time, in milliseconds, that a connection can be idle before being released
      idle: 10000
    }
  }
}
