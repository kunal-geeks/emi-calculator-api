const Loan = require('../models/Loan'); // Ensure the Loan model is imported

const emiRepository = {
  async saveLoan(loanData) {
    try {
      const loan = await Loan.create(loanData); // Ensure Loan model is used properly
      return loan;
    } catch (error) {
      console.error('Error saving loan:', error);
      throw new Error('Error saving loan');
    }
  },

  async getAllLoans() {
    try {
      return await Loan.findAll();
    } catch (error) {
      console.error('Error retrieving loans:', error);
      throw new Error('Error retrieving loans');
    }
  },

  async getLoanById(id) {
      return await Loan.findByPk(id);
  }
};

module.exports = emiRepository; // Ensure emiRepository is properly exported
