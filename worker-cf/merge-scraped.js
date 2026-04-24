#!/usr/bin/env node
// Merge scraped JagoKata data into D1 seed SQL
// Deduplicates against existing seed-quotes, normalizes authors

const fs = require('fs');

const scraped = JSON.parse(fs.readFileSync('/home/ucok/web/bijaksana.com/scraped-data/jagokata-raw.json', 'utf8'));
console.log(`Loaded ${scraped.length} scraped quotes`);

// ── Author normalization ──────────────────────────
const ALIASES = {
  'buya hamka': 'Buya Hamka', 'hamka': 'Buya Hamka',
  'ali bin abi thalib': 'Ali bin Abi Thalib', 'imam ali': 'Ali bin Abi Thalib',
  'tere liye': 'Tere Liye', 'fiersa besari': 'Fiersa Besari',
  'ir. soekarno': 'Soekarno', 'bung karno': 'Soekarno', 'sukarno': 'Soekarno',
  'pramoedya ananta toer': 'Pramoedya Ananta Toer',
  'r.a. kartini': 'Raden Adjeng Kartini', 'ra kartini': 'Raden Adjeng Kartini', 'kartini': 'Raden Adjeng Kartini',
  'b.j. habibie': 'Bacharuddin Jusuf Habibie', 'bj habibie': 'Bacharuddin Jusuf Habibie', 'habibie': 'Bacharuddin Jusuf Habibie',
  'w.s. rendra': 'W.S. Rendra', 'rendra': 'W.S. Rendra',
  'jalaluddin rumi': 'Jalaluddin Rumi', 'rumi': 'Jalaluddin Rumi',
  'khalil gibran': 'Khalil Gibran', 'kahlil gibran': 'Khalil Gibran',
  'albert einstein': 'Albert Einstein', 'einstein': 'Albert Einstein',
  'mahatma gandhi': 'Mahatma Gandhi', 'gandhi': 'Mahatma Gandhi',
  'nelson mandela': 'Nelson Mandela',
  'andré gide': 'Andre Gide', 'andre gide': 'Andre Gide',
  'soe hok gie': 'Soe Hok Gie',
  'emha ainun nadjib': 'Emha Ainun Nadjib', 'cak nun': 'Emha Ainun Nadjib',
  'lao-zu': 'Lao Tzu', 'lao tzu': 'Lao Tzu', 'laozi': 'Lao Tzu',
  'najwa shihab': 'Najwa Shihab',
  'joko widodo': 'Joko Widodo', 'jokowi': 'Joko Widodo',
  'william shakespeare': 'William Shakespeare', 'shakespeare': 'William Shakespeare',
};

const NATIONALITIES = {
  'Ali bin Abi Thalib': 'Arab', 'Buya Hamka': 'Indonesia', 'Tere Liye': 'Indonesia',
  'Fiersa Besari': 'Indonesia', 'Soekarno': 'Indonesia', 'Pramoedya Ananta Toer': 'Indonesia',
  'Raden Adjeng Kartini': 'Indonesia', 'Bacharuddin Jusuf Habibie': 'Indonesia',
  'W.S. Rendra': 'Indonesia', 'Soe Hok Gie': 'Indonesia', 'Raditya Dika': 'Indonesia',
  'Boy Candra': 'Indonesia', 'Najwa Shihab': 'Indonesia', 'Merry Riana': 'Indonesia',
  'Emha Ainun Nadjib': 'Indonesia', 'Gede Prama': 'Indonesia', 'Dahlan Iskan': 'Indonesia',
  'Sujiwo Tejo': 'Indonesia', 'Joko Widodo': 'Indonesia', 'Tan Malaka': 'Indonesia',
  'Andrie Wongso': 'Indonesia', 'Andrea Hirata': 'Indonesia', 'Chairul Tanjung': 'Indonesia',
  'Tung Desem Waringin': 'Indonesia', 'Mario Teguh': 'Indonesia', 'Dee Lestari': 'Indonesia',
  'Anies Baswedan': 'Indonesia', 'Ahmad Fuadi': 'Indonesia', 'Sapardi Djoko Damono': 'Indonesia',
  'Albert Einstein': 'Jerman', 'Mahatma Gandhi': 'India', 'Jalaluddin Rumi': 'Persia',
  'Khalil Gibran': 'Lebanon', 'Nelson Mandela': 'Afrika Selatan', 'Bob Marley': 'Jamaika',
  'Charlie Chaplin': 'Inggris', 'Mark Twain': 'Amerika', 'Steve Jobs': 'Amerika',
  'Martin Luther King Jr.': 'Amerika', 'Dale Carnegie': 'Amerika', 'Zig Ziglar': 'Amerika',
  'Friedrich Nietzsche': 'Jerman', 'Aristoteles': 'Yunani', 'Lao Tzu': 'Tiongkok',
  'Robert Frost': 'Amerika', 'Dr. Seuss': 'Amerika', 'Carl Rogers': 'Amerika',
  'William Shakespeare': 'Inggris', 'Konfusius': 'Tiongkok', 'Socrates': 'Yunani',
  'Plato': 'Yunani', 'Leonardo da Vinci': 'Italia', 'Thomas Edison': 'Amerika',
  'Abraham Lincoln': 'Amerika', 'Benjamin Franklin': 'Amerika', 'Winston Churchill': 'Inggris',
  'Helen Keller': 'Amerika', 'Walt Disney': 'Amerika', 'Oprah Winfrey': 'Amerika',
  'Muhammad Ali': 'Amerika', 'Bruce Lee': 'Tiongkok', 'Pablo Picasso': 'Spanyol',
  'Leo Tolstoy': 'Rusia', 'Victor Hugo': 'Perancis',
};

// Categories that need to be added (not in original 18)
const NEW_CATEGORIES = {
  'ibu': { name: 'Ibu', icon: '👩', desc: 'Kata-kata bijak tentang ibu, kasih ibu, dan pengorbanan seorang ibu.' },
  'pernikahan': { name: 'Pernikahan', icon: '💍', desc: 'Kata-kata bijak tentang pernikahan, rumah tangga, dan kesetiaan.' },
  'doa': { name: 'Doa', icon: '🤲', desc: 'Kata-kata bijak tentang doa, spiritualitas, dan keterhubungan dengan Tuhan.' },
  'seni': { name: 'Seni', icon: '🎨', desc: 'Kata-kata bijak tentang seni, kreativitas, dan keindahan.' },
  'kegagalan': { name: 'Kegagalan', icon: '🔄', desc: 'Kata-kata bijak tentang kegagalan, bangkit kembali, dan belajar dari kesalahan.' },
};

function normalizeAuthor(name) {
  const key = name.toLowerCase().trim();
  return ALIASES[key] || name.trim();
}

function slugify(text) {
  return text.toLowerCase()
    .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

function cleanText(q) {
  return q
    .replace(/\u201c|\u201d|\u201e|\u201f/g, '"')
    .replace(/\u2018|\u2019|\u201a|\u201b/g, "'")
    .replace(/\u2026/g, '...')
    .replace(/\u2014/g, ' -- ')
    .replace(/\u2013/g, ' - ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Deduplicate ──────────────────────────────────
const seen = new Set();
// Load existing slugs from seed to dedup
const existingSQL = fs.readFileSync('/home/ucok/web/bijaksana.com/worker-cf/seed-data.sql', 'utf8');
const existingSlugs = [...existingSQL.matchAll(/'([a-z0-9-]+)', \d+, 'jagokata/g)].map(m => m[1]);
existingSlugs.forEach(s => seen.add(s));
console.log(`${existingSlugs.length} existing slugs loaded`);

const newQuotes = [];
const newAuthors = new Map();
const newCategories = new Set();

for (const raw of scraped) {
  const text = cleanText(raw.quote);
  if (text.length < 20) continue;

  const slug = slugify(text.substring(0, 60));
  if (!slug || slug.length < 5) continue;
  if (seen.has(slug)) continue;

  // Also dedup by first 40 chars
  const key40 = text.substring(0, 40).toLowerCase();
  if (seen.has(key40)) continue;
  seen.add(slug);
  seen.add(key40);

  const author = normalizeAuthor(raw.author);
  const authorSlug = slugify(author);
  const category = raw.category.toLowerCase();

  if (!newAuthors.has(author)) {
    newAuthors.set(author, { slug: authorSlug, nationality: NATIONALITIES[author] || '' });
  }
  if (NEW_CATEGORIES[category]) newCategories.add(category);

  newQuotes.push({ text, author, authorSlug, category, slug, source: 'jagokata.com', wordCount: text.split(/\s+/).length });
}

console.log(`New unique quotes to add: ${newQuotes.length}`);
console.log(`New authors: ${newAuthors.size}`);
console.log(`New categories: ${newCategories.size}`);

// ── Generate SQL ──────────────────────────────────
const lines = [];

// Insert new categories
for (const catSlug of newCategories) {
  const cat = NEW_CATEGORIES[catSlug];
  if (cat) {
    const desc = cat.desc.replace(/'/g, "''");
    lines.push(`INSERT OR IGNORE INTO categories (name, slug, description, icon) VALUES ('${cat.name}', '${catSlug}', '${desc}', '${cat.icon}');`);
  }
}

// Insert new authors
for (const [name, info] of newAuthors) {
  const safeName = name.replace(/'/g, "''");
  lines.push(`INSERT OR IGNORE INTO authors (name, slug, nationality) VALUES ('${safeName}', '${info.slug}', '${info.nationality}');`);
}
lines.push('');

// Insert new quotes
for (const q of newQuotes) {
  const safeText = q.text.replace(/'/g, "''");
  const safeAuthor = q.author.replace(/'/g, "''");
  lines.push(`INSERT OR IGNORE INTO quotes (text, author_id, category_id, slug, word_count, source) VALUES ('${safeText}', (SELECT id FROM authors WHERE name='${safeAuthor}'), (SELECT id FROM categories WHERE slug='${q.category}'), '${q.slug}', ${q.wordCount}, '${q.source}');`);
}
lines.push('');

// Update counts
lines.push("UPDATE categories SET quote_count = (SELECT COUNT(*) FROM quotes WHERE quotes.category_id = categories.id);");
lines.push("UPDATE authors SET quote_count = (SELECT COUNT(*) FROM quotes WHERE quotes.author_id = authors.id);");

const sql = lines.join('\n');
fs.writeFileSync('/home/ucok/web/bijaksana.com/worker-cf/merge-data.sql', sql);
console.log(`SQL written: ${sql.length} chars, ${lines.length} statements`);
