const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'blog.db');

let db;

function getDb() {
  if (!db) {
    db = new sqlite3.Database(DB_PATH);
  }
  return db;
}

async function init() {
  return new Promise((resolve, reject) => {
    const database = getDb();
    database.run(`
      CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titre TEXT NOT NULL,
        contenu TEXT NOT NULL,
        auteur TEXT NOT NULL,
        date TEXT NOT NULL,
        categorie TEXT NOT NULL,
        tags TEXT DEFAULT '[]',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) reject(err);
      else {
        console.log('Base de données initialisée.');
        resolve();
      }
    });
  });
}

module.exports = { getDb, init };
