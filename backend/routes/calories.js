const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  const { name, calories, protein, carbs, fat, log_date } = req.body;
  
  try {
    const date = log_date || new Date().toISOString().split('T')[0];
    await pool.query(
      'INSERT INTO food_logs (user_id, name, calories, protein, carbs, fat, log_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, name, calories, protein, carbs, fat, date]
    );
    res.status(201).json({ message: 'Food logged successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error logging food' });
  }
});

router.get('/today', authMiddleware, async (req, res) => {
    try {
      const date = new Date().toISOString().split('T')[0];
      const [rows] = await pool.query('SELECT * FROM food_logs WHERE user_id = ? AND log_date = ?', [req.user.id, date]);
      
      let total_calories = 0, total_protein = 0, total_carbs = 0, total_fat = 0;
      rows.forEach(log => {
          total_calories += log.calories;
          total_protein += parseFloat(log.protein);
          total_carbs += parseFloat(log.carbs);
          total_fat += parseFloat(log.fat);
      });
      
      const [profileRows] = await pool.query('SELECT target_calories FROM profile WHERE user_id = ?', [req.user.id]);
      const target_calories = profileRows.length > 0 ? profileRows[0].target_calories : 2000;
      
      res.json({ logs: rows, summary: { total_calories, total_protein, total_carbs, total_fat, target_calories } });
    } catch (error) {
      res.status(500).json({ error: 'Server error fetching calories' });
    }
});

module.exports = router;
