const { Sequelize } = require('sequelize');
require('dotenv').config();

const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      ca: fs.readFileSync(path.resolve(__dirname, '..', 'ca.pem')) // Path to your CA certificate
    }
  },
  logging: false, // Disable Sequelize logs in production
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Postgres DB connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
