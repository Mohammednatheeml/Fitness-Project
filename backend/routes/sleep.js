const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Auto-initialize sleep_logs table
const initSleepTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sleep_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        start_time DATETIME,
        end_time DATETIME,
        duration_minutes INT,
        quality_score INT DEFAULT 70,
        status VARCHAR(50) DEFAULT 'restorative',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Sleep logs table verified.');
  } catch (err) {
    console.error('Error initializing sleep table:', err);
  }
};
initSleepTable();

// Log a completed sleep session
router.post('/', authMiddleware, async (req, res) => {
  const { start_time, end_time, duration_minutes, quality_score } = req.body;
  try {
    const status = duration_minutes >= 420 ? 'optimal' : 'inhibited'; // 7 hours threshold
    await pool.query(
      'INSERT INTO sleep_logs (user_id, start_time, end_time, duration_minutes, quality_score, status) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, start_time, end_time, duration_minutes, quality_score || 70, status]
    );
    res.status(201).json({ message: 'Sleep session logged successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error logging sleep' });
  }
});

// Get recent sleep history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM sleep_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 7',
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching sleep history' });
  }
});

// Delete a sleep log
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM sleep_logs WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Sleep log removed' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting log' });
  }
});

module.exports = router;
