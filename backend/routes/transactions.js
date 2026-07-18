const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getTransactions,
  getBalance,
  createTransaction
} = require('../controllers/transactionController');

router.use(auth); // every route below requires a valid token

router.get('/', getTransactions);
router.get('/balance', getBalance);
router.post('/', createTransaction);

module.exports = router;