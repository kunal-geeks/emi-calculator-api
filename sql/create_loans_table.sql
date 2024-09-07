CREATE TABLE IF NOT EXISTS loans (
    id SERIAL PRIMARY KEY,
    loan_amount DECIMAL(15, 2) NOT NULL CHECK (loan_amount >= 0), -- Use DECIMAL for precision
    interest_rate DECIMAL(5, 2) NOT NULL CHECK (interest_rate >= 0), -- Store interest rate precisely
    loan_tenure_months INTEGER NOT NULL CHECK (loan_tenure_months >= 1),
    emi DECIMAL(15, 2) NOT NULL CHECK (emi >= 0), -- EMI as DECIMAL for precise calculations
    prepayment_amount DECIMAL(15, 2) DEFAULT NULL CHECK (prepayment_amount >= 0), -- Optional prepayment
    remaining_balance DECIMAL(15, 2) NOT NULL CHECK (remaining_balance >= 0), -- Remaining balance as DECIMAL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger function to auto-update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for the loans table to update updated_at before updating the row
CREATE TRIGGER update_loans_updated_at
BEFORE UPDATE ON loans
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

