const pool = require('d:/Projects And Practice/Fitness Project/backend/config/db');

async function initWorkouts() {
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
    console.log('workout_logs table created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating table:', error);
    process.exit(1);
  }
}

initWorkouts();
