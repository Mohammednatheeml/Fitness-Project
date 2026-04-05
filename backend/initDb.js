const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDb() {
  try {
    // Connect without database to create it if it doesn't exist
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log('Connected to MySQL server.');

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    console.log(`Database ${process.env.DB_NAME} created or already exists.`);

    await connection.changeUser({ database: process.env.DB_NAME });

    // Table creation queries
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createProfileTable = `
      CREATE TABLE IF NOT EXISTS profile (
        user_id INT PRIMARY KEY,
        age INT,
        gender VARCHAR(20),
        height DECIMAL(5,2),
        weight DECIMAL(5,2),
        goal VARCHAR(100),
        bmi DECIMAL(5,2),
        target_calories INT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    const createFoodLogsTable = `
      CREATE TABLE IF NOT EXISTS food_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        calories INT NOT NULL,
        protein DECIMAL(5,2) DEFAULT 0,
        carbs DECIMAL(5,2) DEFAULT 0,
        fat DECIMAL(5,2) DEFAULT 0,
        log_date DATE NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    const createDietPlansTable = `
      CREATE TABLE IF NOT EXISTS diet_plans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        plan_text TEXT NOT NULL,
        date DATE NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    const createProgressTable = `
      CREATE TABLE IF NOT EXISTS progress (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        weight DECIMAL(5,2) NOT NULL,
        logged_at DATE NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    const createWaterLogsTable = `
      CREATE TABLE IF NOT EXISTS water_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        amount_ml INT NOT NULL,
        log_date DATE NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    await connection.query(createUsersTable);
    console.log('Table users configured.');
    await connection.query(createProfileTable);
    console.log('Table profile configured.');
    await connection.query(createFoodLogsTable);
    console.log('Table food_logs configured.');
    await connection.query(createDietPlansTable);
    console.log('Table diet_plans configured.');
    await connection.query(createProgressTable);
    console.log('Table progress configured.');
    await connection.query(createWaterLogsTable);
    console.log('Table water_logs configured.');

    console.log('All tables synchronized successfully.');
    await connection.end();
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
}

initDb();
