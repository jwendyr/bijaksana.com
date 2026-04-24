#!/usr/bin/env node
// Import JagoKata full crawl data into D1
// Deduplicates against existing quotes by slug

const fs = require('fs');

const data = JSON.parse(fs.readFileSync('/home/ucok/web/bijaksana.com/scraped-data/jagokata-full.json', 'utf8'));
console.log(`Loaded ${data.length} crawled quotes`);

function slugify(t) {
  return t.toLowerCase()
    .replace(/[àáâãäå]/g,'a').replace(/[èéêë]/g,'e').replace(/[ìíîï]/g,'i')
    .replace(/[òóôõö]/g,'o').replace(/[ùúûü]/g,'u')
    .replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-')
    .replace(/^-|-$/g,'').substring(0,80);
}

function esc(s) { return (s||'').replace(/'/g,"''"); }

function cleanText(q) {
  return (q||'').replace(/\s+/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<')
    .replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").trim();
}

// Deduplicate
const seen = new Set();
const quotes = [];
let dupes = 0, short = 0;

for (const raw of data) {
  const text = cleanText(raw.quote);
  if (text.length < 15) { short++; continue; }

  const slug = slugify(text.substring(0, 60));
  if (!slug || slug.length < 5) { short++; continue; }

  const key = text.substring(0, 40).toLowerCase().replace(/[^a-z0-9]/g,'');
  if (seen.has(slug) || seen.has(key)) { dupes++; continue; }
  seen.add(slug);
  seen.add(key);

  const author = (raw.author || '').trim();
  if (!author) continue;

  const authorSlug = slugify(author);
  quotes.push({ text, author, authorSlug, slug });
}

console.log(`After dedup: ${quotes.length} unique (${dupes} dupes, ${short} short removed)`);

// Generate SQL - authors first, then quotes
const authorsSet = new Set();
const authorLines = [];
const quoteLines = [];

for (const q of quotes) {
  if (!authorsSet.has(q.author)) {
    authorsSet.add(q.author);
    authorLines.push(`INSERT OR IGNORE INTO authors (name, slug) VALUES ('${esc(q.author)}', '${q.authorSlug}');`);
  }
  const wc = q.text.split(/\s+/).length;
  quoteLines.push(`INSERT OR IGNORE INTO quotes (text, author_id, category_id, slug, word_count, source) VALUES ('${esc(q.text)}', (SELECT id FROM authors WHERE slug='${q.authorSlug}'), (SELECT id FROM categories WHERE slug='kehidupan'), '${q.slug}', ${wc}, 'jagokata-crawl');`);
}

const allSQL = [...authorLines, '', ...quoteLines, '',
  "UPDATE categories SET quote_count = (SELECT COUNT(*) FROM quotes WHERE quotes.category_id = categories.id);",
  "UPDATE authors SET quote_count = (SELECT COUNT(*) FROM quotes WHERE quotes.author_id = authors.id);"
];

// Split into chunks
const CHUNK = 500;
let chunks = 0;
for (let i = 0; i < allSQL.length; i += CHUNK) {
  const chunk = allSQL.slice(i, i + CHUNK);
  chunks++;
  fs.writeFileSync(`/home/ucok/web/bijaksana.com/worker-cf/crawl-chunk-${chunks}.sql`, chunk.join('\n'));
}

console.log(`SQL: ${authorLines.length} authors, ${quoteLines.length} quotes, ${chunks} chunk files`);
