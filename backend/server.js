const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cash-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Routes
app.use('/api/transactions', require('./routes/transactions'));

app.get('/', (req, res) => {
  res.json({ message: 'Cash Tracker API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});