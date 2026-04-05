const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Auto-initialize new strict 30-day tracker table
const initProgressTable = async () => {
  try {
    // Kept from previous step. Uses `day` and serves purely to track manual physical weight updates now.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS progress (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        day INT,
        weight FLOAT,
        calories INT,
        water FLOAT,
        logged_at DATE,
        UNIQUE KEY(user_id, day),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Progress table verified.');
  } catch (err) {
    console.error('Error initializing progress table:', err);
  }
};
initProgressTable();

// Update weight specifically for the Day
router.post('/', authMiddleware, async (req, res) => {
  const { day, weight } = req.body;
  try {
    const date = new Date().toISOString().split('T')[0];
    
    const [existing] = await pool.query('SELECT * FROM progress WHERE user_id = ? AND day = ?', [req.user.id, day]);
    
    if (existing.length > 0) {
       await pool.query(
         'UPDATE progress SET weight = ?, logged_at = ? WHERE user_id = ? AND day = ?',
         [weight, date, req.user.id, day]
       );
    } else {
       await pool.query(
         'INSERT INTO progress (user_id, day, weight, logged_at) VALUES (?, ?, ?, ?)',
         [req.user.id, day, weight, date]
       );
    }
    res.status(201).json({ message: 'Weight progress logged successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error logging progress' });
  }
});

// Omniscient Automatic Data Aggregator for the 30-Day Matrix
router.get('/', authMiddleware, async (req, res) => {
    try {
        // 1. Anchor to Account Creation Date
        const [users] = await pool.query('SELECT created_at FROM users WHERE id = ?', [req.user.id]);
        if(users.length === 0) return res.status(404).json({ error: 'User not found' });
        
        let startDate = new Date(users[0].created_at);
        startDate.setHours(0, 0, 0, 0);

        // 2. Extract Data universally
        const [weights] = await pool.query('SELECT day, weight FROM progress WHERE user_id = ?', [req.user.id]);
        const [workouts] = await pool.query('SELECT day_number, completed FROM workout_progress WHERE user_id = ?', [req.user.id]);
        const [foods] = await pool.query('SELECT log_date, calories FROM food_logs WHERE user_id = ?', [req.user.id]);
        const [waters] = await pool.query('SELECT log_date, amount_ml FROM water_logs WHERE user_id = ?', [req.user.id]);

        // Aggregate Foods by local Date
        const foodByDate = {};
        foods.forEach(f => {
           if (!f.log_date) return;
           let dStr;
           try {
               const dObj = new Date(f.log_date);
               if (isNaN(dObj.getTime())) throw new Error('Invalid date');
               dStr = dObj.toISOString().split('T')[0]; 
           } catch(err) { 
               // Fallback if Date object fails
               dStr = String(f.log_date).split(' ')[0].split('T')[0]; 
           }
           if(!foodByDate[dStr]) foodByDate[dStr] = 0;
           foodByDate[dStr] += f.calories;
        });

        // Aggregate Water by local Date
        const waterByDate = {};
        waters.forEach(w => {
           if (!w.log_date) return;
           let dStr;
           try {
               const dObj = new Date(w.log_date);
               if (isNaN(dObj.getTime())) throw new Error('Invalid date');
               dStr = dObj.toISOString().split('T')[0]; 
           } catch(err) { 
               dStr = String(w.log_date).split(' ')[0].split('T')[0];
           }
           if(!waterByDate[dStr]) waterByDate[dStr] = 0;
           waterByDate[dStr] += w.amount_ml;
        });

        // 3. Mappability Algorithm spanning 30 Days
        const matrix30Days = [];

        for (let i = 1; i <= 30; i++) {
             // Math compute physical date sequence
             const targetDate = new Date(startDate);
             targetDate.setDate(targetDate.getDate() + (i - 1));
             const dateStr = targetDate.toISOString().split('T')[0];

             // Bind native DB values
             const dayWeightObj = weights.find(w => w.day === i);
             const dayWorkoutObj = workouts.find(w => w.day_number === i);

             matrix30Days.push({
                 day: i,
                 date: dateStr,
                 weight: dayWeightObj ? dayWeightObj.weight : null,
                 calories: foodByDate[dateStr] || 0,
                 water: waterByDate[dateStr] ? parseFloat((waterByDate[dateStr] / 1000).toFixed(1)) : 0, 
                 workout_completed: dayWorkoutObj ? Boolean(dayWorkoutObj.completed) : false
             });
        }

        res.json(matrix30Days);
    } catch (error) {
      console.error('Aggregation error', error);
      res.status(500).json({ error: 'Server error compiling automatic progress logic' });
    }
});

module.exports = router;
