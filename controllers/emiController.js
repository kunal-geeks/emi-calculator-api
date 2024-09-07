const emiService = require('../services/emiService');

async function calculateEMI(req, res, next) {
  try {
    const loan = await emiService.calculateAndSaveEMI(req.body);
    res.json(loan);
  } catch (err) {
    next(err);
  }
}

async function getAllLoans(req, res, next) {
  try {
    const loans = await emiService.getAllLoans();
    res.json(loans);
  } catch (err) {
    next(err);
  }
}

async function getLoanById(req, res, next) {
  try {
    const loan = await emiService.getLoanById(req.params.id);
    res.json(loan);
  } catch (err) {
    next(err);
  }
}

module.exports = { calculateEMI, getAllLoans, getLoanById };
