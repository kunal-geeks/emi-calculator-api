const Loan = require('../models/Loan');

async function saveLoan(data) {
  return await Loan.create(data);
}

async function getAllLoans() {
  return await Loan.findAll();
}

async function getLoanById(id) {
  return await Loan.findByPk(id);
}

module.exports = { saveLoan, getAllLoans, getLoanById };
