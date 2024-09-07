const emiRepository = require('../repositories/emiRepository');
const { calculateEMI, recalculateWithPrepayment } = require('../helpers/emiCalculator');

async function calculateAndSaveEMI(data) {
  const { loan_amount, interest_rate, loan_tenure_months, prepayment_amount } = data;

  // Calculate EMI
  const emi = calculateEMI(loan_amount, interest_rate, loan_tenure_months);
  let remaining_balance = loan_amount;

  if (prepayment_amount) {
    remaining_balance = recalculateWithPrepayment({ remaining_balance }, prepayment_amount);
  }

  // Save the data to the database using the repository
  const loan = await emiRepository.saveLoan({
    loan_amount,
    interest_rate,
    loan_tenure_months,
    emi,
    prepayment_amount,
    remaining_balance,
  });

  return loan;
}

async function getAllLoans() {
  return await emiRepository.getAllLoans();
}

async function getLoanById(id) {
  return await emiRepository.getLoanById(id);
}

module.exports = { calculateAndSaveEMI, getAllLoans, getLoanById };
