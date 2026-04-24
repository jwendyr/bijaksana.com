#!/usr/bin/env node
// Import GitHub datasets: English quotes (select best, for translation) + KBBI
// Outputs SQL files chunked for D1 rate limits

const fs = require('fs');
const path = require('path');
// no external deps needed

const GH = '/home/ucok/web/bijaksana.com/scraped-data/github';
const OUT = '/home/ucok/web/bijaksana.com/worker-cf';

function esc(s) { return (s || '').replace(/'/g, "''"); }
function slugify(t) {
  return t.toLowerCase()
    .replace(/[àáâãäå]/g,'a').replace(/[èéêë]/g,'e').replace(/[ìíîï]/g,'i')
    .replace(/[òóôõö]/g,'o').replace(/[ùúûü]/g,'u')
    .replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-')
    .replace(/^-|-$/g,'').substring(0,80);
}

// ── 1. Process English quotes for translation ─────────────────

console.log('=== PROCESSING ENGLISH QUOTES ===');

// Load quotable (best quality - has tags)
const quotable = JSON.parse(fs.readFileSync(path.join(GH, 'quotable-quotes.json'), 'utf8'));
console.log(`Quotable: ${quotable.length}`);

// Load dwyl
const dwyl = JSON.parse(fs.readFileSync(path.join(GH, 'dwyl-quotes.json'), 'utf8'));
console.log(`Dwyl: ${dwyl.length}`);

// Load JamesFT (encoding fix)
const jfRaw = fs.readFileSync(path.join(GH, 'jamesft-quotes.json')).toString('utf8').replace(/[\x80-\x9f]/g, '');
let jamesft = [];
try { jamesft = JSON.parse(jfRaw); } catch(e) {
  // Try fixing common JSON issues
  try { jamesft = JSON.parse(jfRaw.replace(/,\s*]/g, ']').replace(/,\s*}/g, '}')); } catch(e2) {
    console.log('JamesFT parse error, skipping');
  }
}
console.log(`JamesFT: ${jamesft.length}`);

// Load scraped international
let intl = [];
try { intl = JSON.parse(fs.readFileSync('/home/ucok/web/bijaksana.com/scraped-data/international-raw.json', 'utf8')); } catch(e) {}
console.log(`International scraped: ${intl.length}`);

// Normalize all into uniform format
const allEN = [];

for (const q of quotable) {
  if (!q.content || q.content.length < 15 || q.content.length > 300) continue;
  const tag = (q.tags || [])[0] || '';
  allEN.push({ text: q.content.trim(), author: q.author || 'Unknown', tag, source: 'quotable' });
}

for (const q of dwyl) {
  if (!q.text || q.text.length < 15 || q.text.length > 300) continue;
  allEN.push({ text: q.text.trim(), author: q.author || 'Unknown', tag: q.tag || '', source: 'dwyl' });
}

for (const q of jamesft) {
  const text = q.quoteText || q.text || '';
  if (text.length < 15 || text.length > 300) continue;
  allEN.push({ text: text.trim(), author: q.quoteAuthor || q.author || 'Unknown', tag: '', source: 'jamesft' });
}

for (const q of intl) {
  const text = q.quote || q.text || '';
  if (text.length < 15 || text.length > 300) continue;
  allEN.push({ text: text.trim(), author: q.author || 'Unknown', tag: '', source: 'wikiquote' });
}

console.log(`Total EN before dedup: ${allEN.length}`);

// Deduplicate by first 40 chars
const seen = new Set();
const uniqueEN = [];
for (const q of allEN) {
  const key = q.text.substring(0, 40).toLowerCase().replace(/[^a-z0-9]/g, '');
  if (seen.has(key)) continue;
  seen.add(key);
  uniqueEN.push(q);
}
console.log(`Unique EN quotes: ${uniqueEN.length}`);

// Map tags to our categories
const TAG_MAP = {
  'inspirational': 'motivasi', 'motivational': 'motivasi', 'inspiration': 'motivasi',
  'life': 'kehidupan', 'wisdom': 'nasihat', 'love': 'cinta',
  'happiness': 'kebahagiaan', 'friendship': 'persahabatan', 'success': 'sukses',
  'education': 'pendidikan', 'courage': 'keberanian', 'faith': 'doa',
  'hope': 'harapan', 'dreams': 'mimpi', 'family': 'keluarga',
  'patience': 'kesabaran', 'honesty': 'kejujuran', 'leadership': 'kepemimpinan',
  'change': 'kehidupan', 'nature': 'alam', 'art': 'seni',
  'science': 'pendidikan', 'truth': 'kejujuran', 'freedom': 'perjuangan',
  'peace': 'kehidupan', 'humor': 'humor', 'famous quotes': 'nasihat',
  'technology': 'pendidikan', 'business': 'sukses', 'health': 'kesehatan',
  'beauty': 'kehidupan', 'time': 'waktu', 'death': 'kehidupan',
  'power': 'kepemimpinan', 'fear': 'keberanian', 'failure': 'kegagalan',
};

function mapCategory(tag) {
  if (!tag) return 'kehidupan';
  const key = tag.toLowerCase().trim();
  return TAG_MAP[key] || 'kehidupan';
}

// Author nationality mapping
const NAT = {
  'Albert Einstein': 'Jerman', 'Mahatma Gandhi': 'India', 'Nelson Mandela': 'Afrika Selatan',
  'Martin Luther King Jr.': 'Amerika', 'Abraham Lincoln': 'Amerika', 'Winston Churchill': 'Inggris',
  'Mark Twain': 'Amerika', 'Oscar Wilde': 'Irlandia', 'William Shakespeare': 'Inggris',
  'Albert Camus': 'Perancis', 'Friedrich Nietzsche': 'Jerman', 'Aristotle': 'Yunani',
  'Plato': 'Yunani', 'Socrates': 'Yunani', 'Confucius': 'Tiongkok', 'Lao Tzu': 'Tiongkok',
  'Buddha': 'India', 'Rumi': 'Persia', 'Marcus Aurelius': 'Romawi',
  'Leonardo da Vinci': 'Italia', 'Helen Keller': 'Amerika', 'Mother Teresa': 'Albania',
  'Steve Jobs': 'Amerika', 'Oprah Winfrey': 'Amerika', 'Walt Disney': 'Amerika',
  'Thomas Edison': 'Amerika', 'Benjamin Franklin': 'Amerika', 'Pablo Picasso': 'Spanyol',
  'Leo Tolstoy': 'Rusia', 'Victor Hugo': 'Perancis', 'Voltaire': 'Perancis',
  'Ralph Waldo Emerson': 'Amerika', 'Henry David Thoreau': 'Amerika',
  'Maya Angelou': 'Amerika', 'Bob Marley': 'Jamaika', 'Bruce Lee': 'Tiongkok',
  'Muhammad Ali': 'Amerika', 'Khalil Gibran': 'Lebanon',
};

// Author name normalization for EN sources
const AUTH_NORM = {
  'aristotle': 'Aristoteles', 'confucius': 'Konfusius', 'lao tzu': 'Lao Tzu',
  'rumi': 'Jalaluddin Rumi', 'buddha': 'Buddha', 'socrates': 'Socrates',
  'plato': 'Plato', 'mother teresa': 'Bunda Teresa', 'khalil gibran': 'Khalil Gibran',
  'marcus aurelius': 'Marcus Aurelius',
};

function normAuthor(name) {
  const key = name.toLowerCase().trim();
  return AUTH_NORM[key] || name.trim();
}

// Generate SQL for quotes (English text stored directly — worker will translate on-demand)
const quotesLines = [];
const authorsSet = new Map();
const catsUsed = new Set();

for (const q of uniqueEN) {
  const author = normAuthor(q.author);
  const authorSlug = slugify(author);
  const cat = mapCategory(q.tag);
  const slug = slugify(q.text.substring(0, 60));
  if (!slug || slug.length < 5) continue;

  if (!authorsSet.has(author)) {
    authorsSet.set(author, { slug: authorSlug, nat: NAT[q.author] || NAT[author] || '' });
  }
  catsUsed.add(cat);

  quotesLines.push(`INSERT OR IGNORE INTO quotes (text, author_id, category_id, slug, word_count, source) VALUES ('${esc(q.text)}', (SELECT id FROM authors WHERE slug='${authorSlug}'), (SELECT id FROM categories WHERE slug='${cat}'), '${slug}', ${q.text.split(/\s+/).length}, '${q.source}:en');`);
}

// Build authors SQL
const authLines = [];
for (const [name, info] of authorsSet) {
  authLines.push(`INSERT OR IGNORE INTO authors (name, slug, nationality) VALUES ('${esc(name)}', '${info.slug}', '${info.nat}');`);
}

// Write quotes SQL (chunked — D1 has limits)
const CHUNK = 500;
const allSQL = [...authLines, '', ...quotesLines,
  '', "UPDATE categories SET quote_count = (SELECT COUNT(*) FROM quotes WHERE quotes.category_id = categories.id);",
  "UPDATE authors SET quote_count = (SELECT COUNT(*) FROM quotes WHERE quotes.author_id = authors.id);",
];

// Split into chunks
for (let i = 0; i < allSQL.length; i += CHUNK) {
  const chunk = allSQL.slice(i, i + CHUNK);
  const chunkNum = Math.floor(i / CHUNK) + 1;
  fs.writeFileSync(`${OUT}/import-quotes-${chunkNum}.sql`, chunk.join('\n'));
}
const totalChunks = Math.ceil(allSQL.length / CHUNK);
console.log(`\nQuotes SQL: ${quotesLines.length} inserts, ${authorsSet.size} authors, ${totalChunks} chunk files`);

// ── 2. Process KBBI ───────────────────────────────────────────

console.log('\n=== PROCESSING KBBI ===');
const kbbi = JSON.parse(fs.readFileSync(path.join(GH, 'kbbi.json'), 'utf8'));
const entries = kbbi.dictionary || kbbi;
console.log(`KBBI entries: ${entries.length}`);

// Clean HTML from definitions
function cleanDef(s) {
  return s.replace(/<[^>]+>/g, '').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
}

// Extract word class from definition
function getWordClass(def) {
  const match = def.match(/^\s*[a-z]+\s+(n|v|a|adv|num|p|pron|kl|ark)\s/i);
  return match ? match[1].toLowerCase() : '';
}

const kbbiSeen = new Set();
const kbbiSQL = [];
let kbbiCount = 0;

for (const e of entries) {
  const word = (e.word || '').trim();
  if (!word || word.length < 2) continue;

  const cleanWord = word.replace(/\s+/g, ' ').trim();
  const slug = slugify(cleanWord);
  if (!slug || slug.length < 2) continue;
  if (kbbiSeen.has(slug)) continue;
  kbbiSeen.add(slug);

  const def = cleanDef(e.arti || e.definition || '');
  if (def.length < 5) continue;

  const wc = getWordClass(def);
  kbbiSQL.push(`INSERT OR IGNORE INTO kbbi (word, slug, definition, word_class) VALUES ('${esc(cleanWord)}', '${slug}', '${esc(def)}', '${wc}');`);
  kbbiCount++;
}

console.log(`KBBI cleaned entries: ${kbbiCount}`);

// Split KBBI into chunks of 1000
const KBBI_CHUNK = 1000;
for (let i = 0; i < kbbiSQL.length; i += KBBI_CHUNK) {
  const chunk = kbbiSQL.slice(i, i + KBBI_CHUNK);
  const chunkNum = Math.floor(i / KBBI_CHUNK) + 1;
  fs.writeFileSync(`${OUT}/import-kbbi-${chunkNum}.sql`, chunk.join('\n'));
}
const kbbiChunks = Math.ceil(kbbiSQL.length / KBBI_CHUNK);
console.log(`KBBI SQL: ${kbbiChunks} chunk files`);

// ── Summary ──────────────────────────────────────────────────

console.log('\n=== SUMMARY ===');
console.log(`Quote chunks to import: ${totalChunks} files (import-quotes-*.sql)`);
console.log(`KBBI chunks to import: ${kbbiChunks} files (import-kbbi-*.sql)`);
console.log(`Total new quotes: ${quotesLines.length}`);
console.log(`Total KBBI entries: ${kbbiCount}`);
console.log(`\nRun: for f in import-quotes-*.sql import-kbbi-*.sql; do`);
console.log(`  sleep 6 && wrangler d1 execute bijaksana-db --remote --file=$f`);
console.log(`done`);
