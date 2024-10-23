
var mysql = require('mysql2');
var crypto = require('crypto');

// MySQL connection settings
var dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'express',
};

// Create connection
var db = mysql.createConnection(dbConfig);

// Connect to database
db.connect(function(err) {
  if (err) {
    console.error('error connecting:', err);
    return;
  }
  console.log('connected as id ' + db.threadId);
});

// Create database schema
// Create User table
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE,
    hashed_password BLOB,
    salt BLOB
  );
`, function(err, results, fields) {
  if (err) {
    console.error('error creating users table:', err);
  }
});
// Create Todo table
db.query(`
  CREATE TABLE IF NOT EXISTS todos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    owner_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    completed TINYINT(1)
  );
`, function(err, results, fields) {
  if (err) {
    console.error('error creating todos table:', err);
  }
});

// Create an initial user (username: root, password: root)
var salt = crypto.randomBytes(16);
var hashedPassword = crypto.pbkdf2Sync('root', salt, 310000, 32, 'sha256');
db.query('INSERT IGNORE INTO users (`username`, `hashed_password`, `salt`) VALUES (?, ?, ?)',
    ['root', hashedPassword, salt],
    function(err, results, fields) {
      if (err) {
        console.error('error inserting user:', err);
      }
    });

module.exports = db;