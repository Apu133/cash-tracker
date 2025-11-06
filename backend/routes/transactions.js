const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get balance
router.get('/balance', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const balance = transactions.reduce((total, transaction) => {
      return transaction.type === 'deposit' 
        ? total + transaction.amount 
        : total - transaction.amount;
    }, 0);
    res.json({ balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new transaction
router.post('/', async (req, res) => {
  const transaction = new Transaction({
    type: req.body.type,
    amount: req.body.amount,
    description: req.body.description
  });

  try {
    const newTransaction = await transaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;