const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const dietRoutes = require('./routes/diet');
const calorieRoutes = require('./routes/calories');
const progressRoutes = require('./routes/progress');
const chatRoutes = require('./routes/chat');
const waterRoutes = require('./routes/water');
const workoutRoutes = require('./routes/workouts');
const sleepRoutes = require('./routes/sleep');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/diet', dietRoutes);
app.use('/calories', calorieRoutes);
app.use('/progress', progressRoutes);
app.use('/chat', chatRoutes);
app.use('/water', waterRoutes);
app.use('/workouts', workoutRoutes);
app.use('/sleep', sleepRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
