const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Get dynamic recommendation based on user profile
router.get('/recommendation', authMiddleware, async (req, res) => {
    try {
        const [userRows] = await pool.query('SELECT bmi, goal FROM profile WHERE user_id = ?', [req.user.id]);
        if (userRows.length === 0) {
            return res.status(404).json({ error: 'Profile not found. Please complete your profile first.' });
        }

        const { bmi, goal } = userRows[0];
        let plan = {};

        if (goal === 'lose_weight' || bmi > 25) {
            plan = {
                type: 'Calorie Deficit / High Volume',
                meals: {
                    breakfast: 'Egg White Omelette with Spinach and 1 slice Whole Grain Toast (320 kcal)',
                    lunch: 'Large Grilled Chicken Salad with Lemon Vinaigrette (450 kcal)',
                    dinner: 'Baked White Fish with Steamed Broccoli and Cauliflower Rice (380 kcal)',
                    snack: 'Greek Yogurt with 5 Almonds (150 kcal)'
                },
                advice: 'Focus on high-fiber vegetables to stay full while maintaining a deficit.'
            };
        } else if (goal === 'gain_muscle' || bmi < 18.5) {
            plan = {
                type: 'Calorie Surplus / High Protein',
                meals: {
                    breakfast: '3 Scrambled Eggs, Avocado, and 2 slices Sourdough Bread (650 kcal)',
                    lunch: 'Beef Teriyaki with Brown Rice and Stir-fry Veggies (780 kcal)',
                    dinner: 'Grilled Salmon with Mashed Sweet Potato and Asparagus (720 kcal)',
                    snack: 'Protein Shake with Banana and Peanut Butter (450 kcal)'
                },
                advice: 'Prioritize protein intake at every meal to support muscle synthesis.'
            };
        } else {
            plan = {
                type: 'Maintenance / Balanced Macros',
                meals: {
                    breakfast: 'Overnight Oats with Chia Seeds, Berries, and Honey (450 kcal)',
                    lunch: 'Turkey and Avocado Wrap with a side of Quinoa Salad (580 kcal)',
                    dinner: 'Lean Ground Turkey Tacos with Corn Tortillas and Salsa (610 kcal)',
                    snack: 'Apple slices with a tablespoon of Almond Butter (220 kcal)'
                },
                advice: 'Maintain consistent meal timing to stabilize energy levels throughout the day.'
            };
        }

        res.json(plan);
    } catch (error) {
        res.status(500).json({ error: 'Server error generating recommendation' });
    }
});

router.post('/', authMiddleware, async (req, res) => {
  const { plan_text, date } = req.body;
  
  try {
    const logDate = date || new Date().toISOString().split('T')[0];
    const [existing] = await pool.query('SELECT id FROM diet_plans WHERE user_id = ? AND date = ?', [req.user.id, logDate]);
    
    if (existing.length > 0) {
      await pool.query('UPDATE diet_plans SET plan_text = ? WHERE id = ?', [plan_text, existing[0].id]);
    } else {
      await pool.query(
        'INSERT INTO diet_plans (user_id, plan_text, date) VALUES (?, ?, ?)',
        [req.user.id, plan_text, logDate]
      );
    }
    
    res.status(201).json({ message: 'Diet plan logged successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error saving diet plan' });
  }
});

router.get('/today', authMiddleware, async (req, res) => {
    try {
      const date = new Date().toISOString().split('T')[0];
      const [rows] = await pool.query('SELECT plan_text FROM diet_plans WHERE user_id = ? AND date = ?', [req.user.id, date]);
      
      if(rows.length > 0) {
          res.json({ plan_text: rows[0].plan_text });
      } else {
          res.json({ plan_text: "No diet plan generated for today." });
      }
    } catch (error) {
      res.status(500).json({ error: 'Server error fetching diet plan' });
    }
});

module.exports = router;
