const express = require('express');
const bodyParser = require('body-parser');
const productsRouter = require('./routes/product');
const logger = require('./middleware/logger');
const { errorHandler } = require('./middleware/errorHandler');
const connectDB = require('./config/db');
require('dotenv').config();
// Connect to database
connectDB();



const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(logger);
app.use(bodyParser.json()); // parse JSON bodies


// Root route
app.get('/', (req, res) => {
res.send('Hello World — Express Products API');
});


// API routes
app.use('/api/products', productsRouter);


// Global error handler
app.use(errorHandler);


app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});