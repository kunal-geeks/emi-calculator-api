const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432, // Add port number with a default value for PostgreSQL
  dialect: 'postgres',
  dialectOptions: {
    connectTimeout: 60000 // Increase the connection timeout to 60 seconds
  },
  logging: false, // Disable Sequelize logs in production
});


module.exports = sequelize;
