const mysql = require("mysql2/promise");
require("dotenv").config();

let pool;

const connectMySQL = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || "localhost",
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE || "multi_db_crud",
      waitForConnections: true,
      connectionLimit: 10,
    });

    // Create table if not exists
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await pool.execute(createTableQuery);
    console.log("✅ MySQL Connected & Table Ready");
  } catch (error) {
    console.error("❌ MySQL Connection Failed:", error.message);
  }
};

const getPool = () => pool;

module.exports = { connectMySQL, getPool };
