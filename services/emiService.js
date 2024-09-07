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
    const { loan_amount, interest_rate, loan_tenure_months, prepayment_amount } = data;

    // Calculate the monthly EMI
    const emi = calculateEMI(loan_amount, interest_rate, loan_tenure_months);
    let remaining_balance = loan_amount;
    const monthlyInterestRate = interest_rate / 12 / 100;
    const monthWisePayments = [];

    // Handle prepayment if provided
    let prepaymentThisMonth = 0;
    if (prepayment_amount && prepayment_amount > 0) {
      prepaymentThisMonth = prepayment_amount;
      remaining_balance = recalculateWithPrepayment({ remaining_balance }, prepaymentThisMonth);
    }

    // Generate month-wise payment breakdown
    for (let month = 1; month <= loan_tenure_months; month++) {
      const interestPaid = remaining_balance * monthlyInterestRate;
      const principalPaid = emi - interestPaid;

      if (month === 1 && prepayment_amount && prepayment_amount > 0) {
        remaining_balance = recalculateWithPrepayment({ remaining_balance }, prepayment_amount);
      }

      remaining_balance -= principalPaid;

      monthWisePayments.push({
        month,
        emiPaid: emi.toFixed(2),
        interestPaid: interestPaid.toFixed(2),
        principalPaid: principalPaid.toFixed(2),
        prepayment: month === 1 ? prepaymentThisMonth : 0,
        remainingBalance: remaining_balance > 0 ? remaining_balance.toFixed(2) : '0.00',
      });

      // Stop if the loan is fully paid
      if (remaining_balance <= 0) break;
    }

    // Save the loan details in the database
    const loan = await emiRepository.saveLoan({
      loan_amount,
      interest_rate,
      loan_tenure_months,
      emi: emi.toFixed(2),
      prepayment_amount: prepayment_amount || 0,
      remaining_balance: remaining_balance > 0 ? remaining_balance.toFixed(2) : '0.00',
    });

    return {
      loanAmount: loan_amount,
      interestRate: interest_rate,
      loanTenureMonths: loan_tenure_months,
      emi: emi.toFixed(2),
      prepayment: prepayment_amount || 0,
      monthWisePayments,
    };
  } catch (error) {
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
  try {
    const loan = await emiRepository.getLoanById(id);
    if (!loan) {
      throw new Error('Loan not found');
    }
    return loan;
  } catch (error) {
    throw new Error('Error retrieving loan by ID: ' + error.message);
  }
}

module.exports = { calculateAndSaveEMI, getAllLoans, getLoanById };
