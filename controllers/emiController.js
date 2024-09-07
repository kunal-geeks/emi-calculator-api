const emiService = require('../services/emiService');
const { z } = require('zod');

// Zod schema for validating EMI calculation inputs
const calculateEMISchema = z.object({
  loanAmount: z.number().positive().nonnegative('Loan amount must be greater than or equal to 0'),
  interestRate: z.number().positive().nonnegative('Interest rate must be greater than or equal to 0'),
  loanTenureMonths: z.number().int().positive('Loan tenure must be a positive integer'),
  prepaymentAmount: z.number().positive('Prepayment amount must be greater than 0').optional().nullable().default(0) // Default to 0 if not provided
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

async function getLoanById(req, res) {
  try {
    const loanId = parseInt(req.params.id, 10);

    // Validate if loanId is a valid integer
    if (isNaN(loanId) || loanId <= 0) {
      return res.status(400).json({
        message: "Invalid loan ID",
        errors: [
          {
            validation: "integer",
            code: "invalid_integer",
            message: "Invalid loan ID format",
            path: []
          }
        ]
      });
    }

    const loan = await emiService.getLoanById(loanId);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    res.status(200).json(loan);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving loan by ID", error: error.message });
  }
}

module.exports = { calculateEMI, getAllLoans, getLoanById };
