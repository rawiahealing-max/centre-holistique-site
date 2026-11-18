const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'centre_holistique.db');
const db = new sqlite3.Database(dbPath);

function initDatabase() {
  db.serialize(() => {
    // Users table (Admin & Students)
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      role TEXT DEFAULT 'student', -- 'admin' or 'student'
      telegram_access INTEGER DEFAULT 0, -- 0 = no access, 1 = access granted
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Courses table
    db.run(`CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      duration TEXT,
      telegram_channel_link TEXT, -- Link to Telegram channel/group
      price REAL,
      image_url TEXT,
      audio_url TEXT,
      video_url TEXT,
      pdf_url TEXT,
      is_published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Appointments table
    db.run(`CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      service TEXT NOT NULL,
      mode TEXT DEFAULT 'En Ligne', -- 'En Ligne' or 'Au Cabinet'
      date TEXT NOT NULL,
      notes TEXT,
      status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Payments table
    db.run(`CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      course_id INTEGER,
      amount REAL NOT NULL,
      method TEXT DEFAULT 'whatsapp', -- 'whatsapp', 'stripe', etc.
      status TEXT DEFAULT 'pending', -- pending, completed, failed
      transaction_ref TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (course_id) REFERENCES courses(id)
    )`);

    // Seed default admin if not exists
    const bcrypt = require('bcryptjs');
    const adminPassword = bcrypt.hashSync('raouia2026', 10);
    db.get('SELECT * FROM users WHERE email = ?', ['admin@centreholistique.com'], (err, row) => {
      if (!row) {
        db.run(
          `INSERT INTO users (name, email, password, phone, role, telegram_access) VALUES (?, ?, ?, ?, ?, ?)`,
          ['Raouia Gharbal', 'admin@centreholistique.com', adminPassword, '+21626660344', 'admin', 1]
        );
      }
    });

    // Seed default courses
    db.get('SELECT COUNT(*) as count FROM courses', (err, row) => {
      if (row && row.count === 0) {
        const courses = [
          ['Initiation au Reiki Usui', 'Apprenez à canaliser l'énergie universelle pour l'autoguérison.', 'Reiki', '4h', 'https://t.me/reiki_course', 500, '', '', 'https://youtube.com/embed/dQw4w9WgXcQ', ''],
          ['Harmonisation des Chakras', 'Comprendre les 7 centres énergétiques principaux.', 'Chakras', '3h', 'https://t.me/chakras_course', 400, '', '', '', ''],
          ['Nettoyage et Protection de l\'Aura', 'Techniques avancées pour purifier son champ aurique.', 'Aura', '3h30', 'https://t.me/aura_course', 450, '', '', '', '']
        ];
        courses.forEach(c => {
          db.run(
            `INSERT INTO courses (title, description, category, duration, telegram_channel_link, price, image_url, audio_url, video_url, pdf_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            c
          );
        });
      }
    });
  });
}

module.exports = { db, initDatabase };