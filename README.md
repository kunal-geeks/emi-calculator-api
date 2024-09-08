# EMI Calculator API

This is a simple REST API for calculating Equated Monthly Installments (EMI) with the option for prepayments, built using Node.js, Express, and PostgreSQL with Sequelize ORM.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/)
- [PostgreSQL](https://www.postgresql.org/)
- [Aiven for PostgreSQL](https://aiven.io/) (optional if using Aiven)
- [Git](https://git-scm.com/)

## Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/kunal-geeks/emi-calculator-api.git
cd emi-calculator-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a .env file in the root directory and add the following variables:

```bash
DB_HOST=<your_postgres_host>
DB_USER=<your_postgres_username>
DB_PASSWORD=<your_postgres_password>
DB_NAME=<your_postgres_database>
PORT=3000
NODE_ENV=production
```

If you're using Aiven for PostgreSQL, replace the host, user, and password with the credentials from Aiven.
you can set NODE_ENV as production or development.

```bash
const { Sequelize } = require('sequelize');
require('dotenv').config();

const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      ca: fs.readFileSync(path.resolve(__dirname, '..', 'ca.pem')) // Path to your CA certificate
    }
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false, // Disable Sequelize logs in production
});

// Test connection and sync models
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the postgres database has been established successfully.');
    await sequelize.sync({ force: false }); // Sync models with the database
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
```

Also in the config/db.js file, replace the host, user, and password with the credentials from Aiven.
on aiven console got to connect after starting postgres service and select node.js and then download ca.pem file.
copy ca.pem file and paste it in the root directory.

### 4. Create PostgreSQL Table
Run the SQL script provided in the sql/create_loans_table.sql file to create the necessary table in your database.

```bash
psql -h <your_host> -U <your_username> -d <your_database> -f sql/create_loans_table.sql
```
you can also use pgAdmin or any other tool to create the table.

### 5. Run the Server
Start the application by running:

```bash
npm start
```

The server will run on http://localhost:3000.

### API Endpoints

1. Calculate EMI
POST /api/v1/calculate-emi

Request Body:

```json

{
  "loan_amount": 500000,
  "interest_rate": 8.5,
  "loan_tenure_months": 60,
  "prepayment_amount": 20000
}
```

Response:

```json
{
  "loanAmount": 500000,
  "interestRate": 8.5,
  "loanTenureMonths": 60,
  "emi": 10234.65,
  "prepayment": 20000,
  "monthWisePayments": [
    {
      "month": 1,
      "emiPaid": 10234.65,
      "interestPaid": 3541.67,
      "principalPaid": 6692.98,
      "prepayment": 20000,
      "remainingBalance": 473307.02
    }
  ]
}
```
2. Fetch All EMI Records
GET /api/v1/emis

3. Fetch EMI by ID
GET /api/v1/emi/:id

### Testing
Use Postman or Insomnia to test the API by sending HTTP requests.

### License
This project is licensed under the MIT License.

### Contributing

If you'd like to contribute, please follow the [contributing guidelines](CONTRIBUTING.md)

### Acknowledgements

- [Sequelize ORM](https://sequelize.org/)
- [winston](https://github.com/winstonjs/winston)

## References

- [Equated Monthly Installment](https://en.wikipedia.org/wiki/Equated_monthly_installment)
- [Equated Monthly Installment Calculator](https://www.calculator.net/equated-monthly-installment-calculator.html)
