const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');
const { classifyIntent, getResponse } = require('../utils/nlpEngine');

const router = express.Router();

// Get conversation history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT role, message, created_at FROM chat_logs WHERE user_id = ? ORDER BY created_at ASC',
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching history' });
  }
});

// Clear conversation history
router.delete('/history', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM chat_logs WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'History cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Server error clearing history' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { message, context } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    // 1. Logic Processing
    const intent = classifyIntent(message);
    const reply = getResponse(intent, context);

    // 2. Persist messages immediately
    await pool.query(
      'INSERT INTO chat_logs (user_id, message, role) VALUES (?, ?, ?), (?, ?, ?)',
      [req.user.id, message, 'user', req.user.id, reply, 'assistant']
    );

    // 3. Return JSON (simulate AI thinking time slightly shorter now since we handle it in frontend)
    res.json({ reply });

  } catch (error) {
    console.error('Chat error', error);
    res.status(500).json({ error: 'Server error processing chat' });
  }
});

module.exports = router;
