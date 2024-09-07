const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ensure this points to your Sequelize instance

const Loan = sequelize.define('Loan', {
  loan_amount: {
    type: DataTypes.DECIMAL(15, 2), // Use DECIMAL for monetary values with precision
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  interest_rate: {
    type: DataTypes.DECIMAL(5, 2), // Use DECIMAL to store interest rates with precision
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  loan_tenure_months: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  emi: {
    type: DataTypes.DECIMAL(15, 2), // Use DECIMAL for EMI with precision
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  prepayment_amount: {
    type: DataTypes.DECIMAL(15, 2), // Use DECIMAL for prepayments
    allowNull: true,
    defaultValue: null, // Allow null by default for optional prepayment
    validate: {
      min: 0,
    },
  },
  remaining_balance: {
    type: DataTypes.DECIMAL(15, 2), // Use DECIMAL for remaining balance with precision
    allowNull: false,
    validate: {
      min: 0,
    },
  },
}, {
  tableName: 'loans',
  timestamps: true, // Automatically adds createdAt and updatedAt columns
});

module.exports = Loan;
