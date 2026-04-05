const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateDb() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const alterProfileQuery = `
      ALTER TABLE profile 
      ADD COLUMN streak INT DEFAULT 1,
      ADD COLUMN last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `;
    await connection.query(alterProfileQuery);
    console.log('Profile table updated with streak and last_login_at.');
  } catch (err) {
    if (err.code === 'ER_DUP_COLUMN') {
      console.log('Columns already exist.');
    } else {
      console.error('Error updating profile table:', err);
    }
  } finally {
    await connection.end();
  }
}

updateDb();
