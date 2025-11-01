const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/grocery-market')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.json({ message: 'Grocery Market API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
