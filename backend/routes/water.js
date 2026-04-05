const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  const { amount_ml, log_date } = req.body;
  
  try {
    const date = log_date || new Date().toISOString().split('T')[0];
    await pool.query(
      'INSERT INTO water_logs (user_id, amount_ml, log_date) VALUES (?, ?, ?)',
      [req.user.id, amount_ml, date]
    );
    res.status(201).json({ message: 'Water logged successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error logging water' });
  }
});

router.get('/today', authMiddleware, async (req, res) => {
    try {
      const date = new Date().toISOString().split('T')[0];
      const [rows] = await pool.query('SELECT amount_ml FROM water_logs WHERE user_id = ? AND log_date = ?', [req.user.id, date]);
      
      let total_ml = 0;
      rows.forEach(log => {
          total_ml += log.amount_ml;
      });
      
      res.json({ logs: rows, summary: { total_ml } });
    } catch (error) {
      res.status(500).json({ error: 'Server error fetching water logs' });
    }
});

module.exports = router;
