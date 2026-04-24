-- KBBI (Arti Kata) table
CREATE TABLE IF NOT EXISTS kbbi (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  definition TEXT NOT NULL,
  word_class TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_kbbi_word ON kbbi(word);
CREATE INDEX IF NOT EXISTS idx_kbbi_slug ON kbbi(slug);

-- Peribahasa table (separate from quotes)
CREATE TABLE IF NOT EXISTS peribahasa (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  meaning TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_peribahasa_slug ON peribahasa(slug);
