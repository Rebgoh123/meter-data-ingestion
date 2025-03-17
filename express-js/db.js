const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const crypto = require("crypto");

// ✅ Define SQLite Database File Path
const dbPath = path.join(__dirname, "database.sqlite");

// ✅ Create Database Connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Error connecting to SQLite:", err.message);
    return;
  }
  console.log("✅ Connected to SQLite database.");
});

// ✅ Create Users Table
db.serialize(() => {
  db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            hashed_password BLOB NOT NULL,
            salt BLOB NOT NULL
        )
    `);

  // ✅ Create Meter Readings Table
  db.run(`
        CREATE TABLE IF NOT EXISTS meter_readings (
            id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
            nmi TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            consumption REAL NOT NULL,
            UNIQUE (nmi, timestamp)
        )
    `);

  // ✅ Insert Initial User (username: root, password: root)
  const salt = crypto.randomBytes(16);
  const hashedPassword = crypto.pbkdf2Sync("root", salt, 310000, 32, "sha256");

  db.run(
      "INSERT OR IGNORE INTO users (username, hashed_password, salt) VALUES (?, ?, ?)",
      ["root", hashedPassword, salt]
  );
});

module.exports = db;
