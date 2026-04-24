-- Bijaksana.com D1 Schema
-- Quotes database with full-text search

-- Categories / themes
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT '',
  quote_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Authors
CREATE TABLE IF NOT EXISTS authors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  bio TEXT,
  nationality TEXT,
  quote_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Quotes (main content)
CREATE TABLE IF NOT EXISTS quotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  author_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  meaning TEXT,
  reflection TEXT,
  context TEXT,
  tags TEXT DEFAULT '',
  word_count INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  source TEXT DEFAULT '',
  is_original INTEGER DEFAULT 0,
  is_featured INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (author_id) REFERENCES authors(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Related quotes (for internal linking)
CREATE TABLE IF NOT EXISTS related_quotes (
  quote_id INTEGER NOT NULL,
  related_id INTEGER NOT NULL,
  PRIMARY KEY (quote_id, related_id),
  FOREIGN KEY (quote_id) REFERENCES quotes(id),
  FOREIGN KEY (related_id) REFERENCES quotes(id)
);

-- Daily quote history
CREATE TABLE IF NOT EXISTS daily_quotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quote_id INTEGER NOT NULL,
  date TEXT NOT NULL UNIQUE,
  FOREIGN KEY (quote_id) REFERENCES quotes(id)
);

-- Subscribers
CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  token TEXT NOT NULL,
  active INTEGER DEFAULT 1,
  subscribed_at TEXT DEFAULT (datetime('now')),
  unsubscribed_at TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_quotes_category ON quotes(category_id);
CREATE INDEX IF NOT EXISTS idx_quotes_author ON quotes(author_id);
CREATE INDEX IF NOT EXISTS idx_quotes_slug ON quotes(slug);
CREATE INDEX IF NOT EXISTS idx_quotes_likes ON quotes(likes DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_featured ON quotes(is_featured);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_authors_slug ON authors(slug);
CREATE INDEX IF NOT EXISTS idx_daily_date ON daily_quotes(date);
