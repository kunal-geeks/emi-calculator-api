const emiService = require('../services/emiService');
const { z } = require('zod');

// Zod schema for validating EMI calculation inputs
const calculateEMISchema = z.object({
  loanAmount: z.number().positive('Loan amount must be greater than 0'),
  interestRate: z.number().positive('Interest rate must be greater than 0'),
  loanTenureMonths: z.number().int().positive('Loan tenure must be a positive integer'),
  prepaymentAmount: z.number().positive().optional().nullable().default(0) // Default to 0 if not provided
});

// Zod schema for validating loan ID
const loanIdSchema = z.string().uuid('Invalid loan ID format');

/**
 * Controller for EMI calculation.
 * 
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express middleware function.
 * @returns {object} JSON response with EMI and loan details.
 */
async function calculateEMI(req, res, next) {
  try {
    // Validate input using Zod schema
    const parsedData = calculateEMISchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ 
        message: 'Invalid input data', 
        errors: parsedData.error.issues 
      });
    }

    // Call service function to handle the business logic
    const loan = await emiService.calculateAndSaveEMI(parsedData.data);
    return res.status(201).json(loan);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to fetch all loans.
 * 
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express middleware function.
 * @returns {object} JSON response with all loans.
 */
async function getAllLoans(req, res, next) {
  try {
    const loans = await emiService.getAllLoans();
    return res.status(200).json(loans);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to fetch a loan by ID.
 * 
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express middleware function.
 * @returns {object} JSON response with loan details.
 */
async function getLoanById(req, res, next) {
  try {
    // Validate loan ID using Zod schema
    const parsedId = loanIdSchema.safeParse(req.params.id);
    if (!parsedId.success) {
      return res.status(400).json({ 
        message: 'Invalid loan ID', 
        errors: parsedId.error.issues 
      });
    }

    // Fetch the loan by ID using the service
    const loan = await emiService.getLoanById(parsedId.data);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    return res.status(200).json(loan);
  } catch (err) {
    next(err);
  }
}

module.exports = { calculateEMI, getAllLoans, getLoanById };
