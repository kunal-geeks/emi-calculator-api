const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Loan = sequelize.define('Loan', {
  loan_amount: { type: DataTypes.DECIMAL, allowNull: false },
  interest_rate: { type: DataTypes.DECIMAL, allowNull: false },
  loan_tenure_months: { type: DataTypes.INTEGER, allowNull: false },
  emi: { type: DataTypes.DECIMAL },
  prepayment_amount: { type: DataTypes.DECIMAL, allowNull: true, defaultValue: 0 },
  remaining_balance: { type: DataTypes.DECIMAL },
});

module.exports = Loan;
