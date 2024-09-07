const emiRepository = require('../repositories/emiRepository');
const { calculateEMI, recalculateWithPrepayment } = require('../helpers/emiCalculator');

/**
 * Service to calculate EMI, handle prepayment, and save loan data.
 * 
 * @param {object} data - Loan data including loan amount, interest rate, loan tenure, and optional prepayment amount.
 * @returns {object} Loan data including month-wise payment breakdown.
 */
async function calculateAndSaveEMI(data) {
  try {

    const loan_amount = parseFloat(data.loanAmount);
    const interest_rate = parseFloat(data.interestRate);
    const loan_tenure_months = parseInt(data.loanTenureMonths, 10);
    const prepayment_amount = parseFloat(data.prepaymentAmount) || 0;

    if (isNaN(loan_amount) || isNaN(interest_rate) || isNaN(loan_tenure_months)) {
      throw new Error('Invalid input data');
    }

    if (loan_amount <= 0 || interest_rate <= 0 || loan_tenure_months < 1) {
      throw new Error('Input data does not meet minimum requirements');
    }

    const emi = calculateEMI(loan_amount, interest_rate, loan_tenure_months);
    if (isNaN(emi)) {
      throw new Error('Error calculating EMI');
    }
    
    let remaining_balance = loan_amount;
    const monthlyInterestRate = interest_rate / 12 / 100;
    const monthWisePayments = [];
    let prepaymentThisMonth = prepayment_amount > 0 ? prepayment_amount : 0;
    let rem_balance_after_first_month = remaining_balance - prepaymentThisMonth - emi;

    const loan = await emiRepository.saveLoan({
      loan_amount: loan_amount.toFixed(2),
      interest_rate: interest_rate.toFixed(2),
      loan_tenure_months: loan_tenure_months, 
      emi: emi.toFixed(2),
      prepayment_amount: prepayment_amount > 0 ? prepayment_amount.toFixed(2) : null,
      remaining_balance: rem_balance_after_first_month > 0 ? rem_balance_after_first_month.toFixed(2) : '0.00',
    });

    let month = 1;
    while (remaining_balance > 0 && month <= loan_tenure_months) {
      const interestPaid = remaining_balance * monthlyInterestRate;
      const principalPaid = emi - interestPaid;
   
      if (isNaN(interestPaid) || isNaN(principalPaid)) {
        throw new Error('Error calculating interest or principal paid');
      }

      if (month === 1 && prepaymentThisMonth > 0) {
        remaining_balance = recalculateWithPrepayment(remaining_balance, prepaymentThisMonth);
      }

      remaining_balance -= emi;

      monthWisePayments.push({
        month,
        emiPaid: emi.toFixed(2),
        interestPaid: interestPaid.toFixed(2),
        principalPaid: principalPaid.toFixed(2),
        prepayment: month === 1 ? prepaymentThisMonth : 0,
        remainingBalance: remaining_balance > 0 ? remaining_balance.toFixed(2) : '0.00',
      });

      if (remaining_balance <= 0) break; // Stop if loan fully paid
      month++;
    }

    return {
      loan_amount: loan_amount,
      interest_rate: interest_rate,
      loan_tenure_months: month - 1, // Updated tenure
      emi: emi.toFixed(2),
      prepayment_amount: prepayment_amount || 0,
      monthWisePayments: monthWisePayments,
    };
  } catch (error) {
    console.error('Error in calculateAndSaveEMI:', error);
    throw new Error('Error calculating and saving EMI: ' + error.message);
  }
}

/**
 * Service to retrieve all loans from the database.
 * 
 * @returns {Array} List of all loans.
 */
async function getAllLoans() {
  try {
    return await emiRepository.getAllLoans();
  } catch (error) {
    throw new Error('Error retrieving loans: ' + error.message);
  }
}

/**
 * Service to retrieve a specific loan by ID.
 * 
 * @param {string} id - Loan ID.
 * @returns {object|null} Loan data if found, otherwise null.
 */
async function getLoanById(id) {
    return await emiRepository.getLoanById(id);
}

module.exports = { calculateAndSaveEMI, getAllLoans, getLoanById };
