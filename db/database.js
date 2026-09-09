const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database (creates study.db in the root directory)
const dbPath = path.resolve(__dirname, '../study.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Initialize tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL,
    name TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS lectures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER,
    date TEXT,
    topic TEXT,
    covered TEXT,
    notes TEXT,
    review TEXT,
    FOREIGN KEY(course_id) REFERENCES courses(id)
  )`);
});

module.exports = db;