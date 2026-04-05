const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Auto-initialize table
const initTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS workout_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        exercise_name VARCHAR(255),
        protocol_type VARCHAR(50),
        completed_at DATE,
        status VARCHAR(20),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS workout_progress (
        user_id INT,
        day_number INT,
        completed BOOLEAN DEFAULT false,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, day_number),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    console.log('Workout tables verified.');
  } catch (err) {
    console.error('Error initializing workout logs table:', err);
  }
};
initTable();

// Log a completed exercise
router.post('/complete', authMiddleware, async (req, res) => {
  const { exercise_name, protocol_type } = req.body;
  const date = new Date().toISOString().split('T')[0];
  
  try {
    // Check if already completed today to prevent duplicates
    const [existing] = await pool.query(
      'SELECT * FROM workout_logs WHERE user_id = ? AND exercise_name = ? AND completed_at = ?',
      [req.user.id, exercise_name, date]
    );

    if (existing.length > 0) {
      return res.json({ message: 'Exercise already completed today' });
    }

    await pool.query(
      'INSERT INTO workout_logs (user_id, exercise_name, protocol_type, completed_at, status) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, exercise_name, protocol_type, date, 'completed']
    );
    
    res.status(201).json({ message: 'Exercise logged successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error logging workout' });
  }
});

// Get today's completions
router.get('/today', authMiddleware, async (req, res) => {
  const date = new Date().toISOString().split('T')[0];
  try {
    const [rows] = await pool.query(
      'SELECT exercise_name FROM workout_logs WHERE user_id = ? AND completed_at = ?',
      [req.user.id, date]
    );
    res.json(rows.map(r => r.exercise_name));
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching workout logs' });
  }
});

// Get all completed functional days for unlock progression
router.get('/progress_days', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT day_number FROM workout_progress WHERE user_id = ? AND completed = true ORDER BY day_number ASC',
      [req.user.id]
    );
    res.json(rows.map(r => r.day_number));
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching workout progress' });
  }
});

// Mark a specific strictly-enforced day as complete
router.post('/complete_day', authMiddleware, async (req, res) => {
  const { day_number } = req.body;
  try {
    const [existing] = await pool.query(
      'SELECT * FROM workout_progress WHERE user_id = ? AND day_number = ?',
      [req.user.id, day_number]
    );
    
    if (existing.length === 0) {
      await pool.query(
        'INSERT INTO workout_progress (user_id, day_number, completed) VALUES (?, ?, true)',
        [req.user.id, day_number]
      );
    } else {
      await pool.query(
        'UPDATE workout_progress SET completed = true, completed_at = CURRENT_TIMESTAMP WHERE user_id = ? AND day_number = ?',
        [req.user.id, day_number]
      );
    }
    
    // Add streak integration logic into profile optionally or progress.
    const [profile] = await pool.query('SELECT streak FROM profile WHERE user_id = ?', [req.user.id]);
    if(profile.length > 0) {
        // Workout day complete could optionally boost internal variables if advanced.
    }

    res.json({ message: `Day ${day_number} successfully secured & unlocked sequence.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error locking day completion' });
  }
});

module.exports = router;
