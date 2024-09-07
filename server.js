const express = require('express');
const emiRoutes = require('./routes/emiRoutes');
const sequelize = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(express.json());

// EMI Routes
app.use('/api/v1', emiRoutes);

// Error handling middleware
app.use(errorHandler);

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(3000, () => console.log('Server running on port 3000'));
}).catch(err => console.error('Unable to connect to the database:', err));
