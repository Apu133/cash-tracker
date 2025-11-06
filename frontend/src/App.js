import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'deposit',
    amount: '',
    description: ''
  });

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/transactions/balance`);
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/transactions`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/transactions`, {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setFormData({ type: 'deposit', amount: '', description: '' });
      setShowForm(false);
      fetchBalance();
      fetchTransactions();
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Cash Tracker</h1>
        <div className="balance">
          <h2>Current Balance: ${balance.toFixed(2)}</h2>
        </div>
      </header>

      <main>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Transaction'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="transaction-form">
            <h3>Add New Transaction</h3>
            <div>
              <label>Type:</label>
              <select 
                name="type" 
                value={formData.type} 
                onChange={handleInputChange}
              >
                <option value="deposit">Deposit</option>
                <option value="withdrawal">Withdrawal</option>
              </select>
            </div>
            <div>
              <label>Amount:</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
              />
            </div>
            <div>
              <label>Description:</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        )}

        <div className="transactions">
          <h3>Transaction History</h3>
          {transactions.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction._id}>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td className={transaction.type}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </td>
                    <td>{transaction.description}</td>
                    <td>${transaction.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;