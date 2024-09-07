function calculateEMI(P, R, N) {
    const monthlyInterestRate = R / 12 / 100;
    return (P * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, N)) / (Math.pow(1 + monthlyInterestRate, N) - 1);
  }
  
  function recalculateWithPrepayment(loan, prepayment) {
    loan.remaining_balance -= prepayment;
    return loan.remaining_balance;
  }
  
  module.exports = { calculateEMI, recalculateWithPrepayment };
  