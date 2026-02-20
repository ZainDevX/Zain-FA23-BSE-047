const Database = require("better-sqlite3");
const path = require("path");

let db;

const connectSQLite = () => {
  try {
    const dbPath = path.join(__dirname, "..", "database.sqlite");
    db = new Database(dbPath);

    // Enable WAL mode for better performance
    db.pragma("journal_mode = WAL");

    // Create table if not exists
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ SQLite Connected & Table Ready");
  } catch (error) {
    console.error("❌ SQLite Connection Failed:", error.message);
  }
};

const getDB = () => db;

module.exports = { connectSQLite, getDB };
