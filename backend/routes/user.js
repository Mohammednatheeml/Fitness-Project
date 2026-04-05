const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // Validate user still exists in the database
    const [userCheck] = await pool.query('SELECT id FROM users WHERE id = ?', [req.user.id]);
    if (userCheck.length === 0) return res.status(401).json({ error: 'User account not found or deleted' });

    const [rows] = await pool.query('SELECT * FROM profile WHERE user_id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Profile not found' });
    
    let profile = rows[0];
    const now = new Date();
    const lastLogin = new Date(profile.last_login_at);
    
    // Reset time for date comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastDate = new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate());
    const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Logged in yesterday, increment streak
      profile.streak += 1;
      await pool.query('UPDATE profile SET streak = ?, last_login_at = CURRENT_TIMESTAMP WHERE user_id = ?', [profile.streak, req.user.id]);
    } else if (diffDays > 1) {
      // Missed a day, reset streak
      profile.streak = 1;
      await pool.query('UPDATE profile SET streak = 1, last_login_at = CURRENT_TIMESTAMP WHERE user_id = ?', [req.user.id]);
    } else if (diffDays === 0) {
        // Already logged in today, just update timestamp if needed (optional)
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching profile' });
  }
});

router.post('/profile', authMiddleware, async (req, res) => {
  const { age, gender, height, weight, goal } = req.body;
  
  // Basic Health Engine
  let bmi = weight / ((height/100) * (height/100));
  bmi = Math.round(bmi * 100) / 100; // Round to 2 decimal places

  // Baseline BMR logic
  let bmr;
  if (gender.toLowerCase() === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  let target_calories = Math.round(bmr); // Default Maintenance
  if(goal === 'lose_weight') {
      target_calories = Math.round(bmr - 500); 
  } else if(goal === 'gain_muscle') {
      target_calories = Math.round(bmr + 500);
  }

  try {
    // Upsert logic
    const [existing] = await pool.query('SELECT * FROM profile WHERE user_id = ?', [req.user.id]);
    if (existing.length > 0) {
      await pool.query(
        'UPDATE profile SET age=?, gender=?, height=?, weight=?, goal=?, bmi=?, target_calories=? WHERE user_id=?',
        [age, gender, height, weight, goal, bmi, target_calories, req.user.id]
      );
    } else {
      await pool.query(
        'INSERT INTO profile (user_id, age, gender, height, weight, goal, bmi, target_calories) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [req.user.id, age, gender, height, weight, goal, bmi, target_calories]
      );
    }
    
    // Initial metrics setup removed from here because progress tracker now relies on explicit Day index inserts in the new UI.
    
    res.json({ message: 'Profile updated', bmi, target_calories });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

module.exports = router;
