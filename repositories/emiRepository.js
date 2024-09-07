const { Loan } = require('../models/Loan');

/**
 * Save a new loan record in the database.
 * 
 * @param {object} data - The loan data to be saved.
 * @returns {Promise<object>} The created loan record.
 */
async function saveLoan(data) {
    try {
        return await Loan.create(data);
    } catch (error) {
        throw new Error(`Error saving loan: ${error.message}`);
    }
}

/**
 * Retrieve all loan records from the database.
 * 
 * @returns {Promise<Array>} A list of all loan records.
 */
async function getAllLoans() {
    try {
        return await Loan.findAll();
    } catch (error) {
        throw new Error(`Error retrieving all loans: ${error.message}`);
    }
}

/**
 * Retrieve a specific loan record by its ID.
 * 
 * @param {number|string} id - The ID of the loan to be retrieved.
 * @returns {Promise<object|null>} The loan record if found, otherwise null.
 */
async function getLoanById(id) {
    try {
        const loan = await Loan.findByPk(id);
        if (!loan) {
            throw new Error('Loan not found');
        }
        return loan;
    } catch (error) {
        throw new Error(`Error retrieving loan by ID: ${error.message}`);
    }
}

module.exports = { saveLoan, getAllLoans, getLoanById };

