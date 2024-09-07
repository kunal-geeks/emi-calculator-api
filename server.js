const express = require('express');
const emiRoutes = require('./routes/v1/emiRoutes');
const sequelize = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

// EMI Routes
app.use('/api/v1', emiRoutes);

// Error handling middleware
app.use(errorHandler);

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log('Server running on port ${PORT}'));
}).catch(err => console.error('Unable to connect to the database:', err));
