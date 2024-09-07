const express = require('express');
const emiController = require('../controllers/emiController');
const router = express.Router();

router.post('/calculate-emi', emiController.calculateEMI);
router.get('/emis', emiController.getAllLoans);
router.get('/emi/:id', emiController.getLoanById);

module.exports = router;
