const Transaction = require('../models/Transaction');

// Get all transactions (only this user's)
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get balance (only this user's)
exports.getBalance = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    const balance = transactions.reduce((total, transaction) => {
      return transaction.type === 'deposit'
        ? total + transaction.amount
        : total - transaction.amount;
    }, 0);
    res.json({ balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new transaction (tied to this user)
exports.createTransaction = async (req, res) => {
  const transaction = new Transaction({
    user: req.user.id,
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
};