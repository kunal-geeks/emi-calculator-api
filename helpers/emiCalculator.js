/**
 * Calculate EMI (Equated Monthly Installment) for a loan.
 * 
 * @param {number} P - Principal loan amount.
 * @param {number} R - Annual interest rate (in percentage).
 * @param {number} N - Loan tenure in months.
 * @returns {number} The calculated EMI.
 */
function calculateEMI(P, R, N) {
  const monthlyInterestRate = R / 12 / 100;
  if (monthlyInterestRate === 0) {
      return P / N;
  }
  return (P * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, N)) / (Math.pow(1 + monthlyInterestRate, N) - 1);
}

/**
* Recalculate the remaining balance after a prepayment.
* 
* @param {number} remainingBalance - The current remaining balance of the loan.
* @param {number} prepayment - The amount paid over and above the EMI.
* @returns {number} The updated remaining balance.
*/
function recalculateWithPrepayment(remainingBalance, prepayment) {
  return remainingBalance - prepayment;
}

module.exports = { calculateEMI, recalculateWithPrepayment };
