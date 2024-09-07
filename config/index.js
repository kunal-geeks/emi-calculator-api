const environment = process.env.NODE_ENV || 'development';
const config = require(`./${environment}`);

module.exports = config;
