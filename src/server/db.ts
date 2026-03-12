import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.join(process.cwd(), 'blog.db');
export const db = new Database(dbPath);

export function initDb() {
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT,
      cover_image TEXT,
      tags TEXT,
      status TEXT DEFAULT 'Draft',
      featured BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      about_text TEXT,
      portfolio_url TEXT,
      collaborations_url TEXT,
      projects_url TEXT
    );
  `);

  // Create default admin user if none exists
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    const defaultPassword = bcrypt.hashSync('sanniva123', 10);
    db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run('sannivachatterjee25@gmail.com', defaultPassword);
  }

  // Create default settings if none exists
  const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get() as { count: number };
  if (settingsCount.count === 0) {
    db.prepare(`
      INSERT INTO settings (about_text, portfolio_url, collaborations_url, projects_url)
      VALUES (?, ?, ?, ?)
    `).run(
      "Looking for more? Explore my portfolio, past collaborations, and side projects. Whether it's design, tech, or creative experiments, there's always something exciting to share.",
      "#",
      "#",
      "#"
    );
  }
}
