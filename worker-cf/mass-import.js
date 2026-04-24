#!/usr/bin/env node
// Bijaksana — Mass import pipeline
// Merges all scraped batches, deduplicates, normalizes, generates SQL

const fs = require('fs');
const path = require('path');

const DATA_DIR = '/home/ucok/web/bijaksana.com/scraped-data';
const OUT_FILE = '/home/ucok/web/bijaksana.com/worker-cf/mass-import.sql';

// ── Load all JSON files ──────────────────────────────────────

function loadJSON(file) {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
    console.log(`  Loaded ${file}: ${data.length} entries`);
    return data;
  } catch (e) {
    console.log(`  Skipped ${file}: ${e.message}`);
    return [];
  }
}

console.log('Loading scraped data...');
const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
let allQuotes = [];
let allPeribahasa = [];

for (const file of files) {
  const data = loadJSON(file);
  if (file.includes('peribahasa')) {
    allPeribahasa.push(...data);
  } else {
    allQuotes.push(...data);
  }
}
console.log(`\nTotal raw quotes: ${allQuotes.length}`);
console.log(`Total raw peribahasa: ${allPeribahasa.length}`);

// ── Author normalization ──────────────────────────────────────

const ALIASES = {
  'buya hamka': 'Buya Hamka', 'hamka': 'Buya Hamka', 'prof. dr. hamka': 'Buya Hamka',
  'ali bin abi thalib': 'Ali bin Abi Thalib', 'ali bin abu thalib': 'Ali bin Abi Thalib', 'imam ali': 'Ali bin Abi Thalib',
  'tere liye': 'Tere Liye', 'fiersa besari': 'Fiersa Besari',
  'ir. soekarno': 'Soekarno', 'bung karno': 'Soekarno', 'sukarno': 'Soekarno',
  'pramoedya ananta toer': 'Pramoedya Ananta Toer', 'pram': 'Pramoedya Ananta Toer',
  'r.a. kartini': 'Raden Adjeng Kartini', 'ra kartini': 'Raden Adjeng Kartini', 'kartini': 'Raden Adjeng Kartini',
  'b.j. habibie': 'Bacharuddin Jusuf Habibie', 'bj habibie': 'Bacharuddin Jusuf Habibie', 'habibie': 'Bacharuddin Jusuf Habibie',
  'w.s. rendra': 'W.S. Rendra', 'rendra': 'W.S. Rendra',
  'jalaluddin rumi': 'Jalaluddin Rumi', 'rumi': 'Jalaluddin Rumi', 'mevlana rumi': 'Jalaluddin Rumi', 'mawlana rumi': 'Jalaluddin Rumi', 'jalal ad-din rumi': 'Jalaluddin Rumi',
  'khalil gibran': 'Khalil Gibran', 'kahlil gibran': 'Khalil Gibran',
  'albert einstein': 'Albert Einstein', 'einstein': 'Albert Einstein',
  'mahatma gandhi': 'Mahatma Gandhi', 'gandhi': 'Mahatma Gandhi', 'mohandas gandhi': 'Mahatma Gandhi',
  'nelson mandela': 'Nelson Mandela', 'mandela': 'Nelson Mandela',
  'andre gide': 'Andre Gide', 'andré gide': 'Andre Gide',
  'soe hok gie': 'Soe Hok Gie',
  'emha ainun nadjib': 'Emha Ainun Nadjib', 'cak nun': 'Emha Ainun Nadjib',
  'lao-zu': 'Lao Tzu', 'lao tzu': 'Lao Tzu', 'laozi': 'Lao Tzu', 'lao-tzu': 'Lao Tzu',
  'konfusius': 'Konfusius', 'confucius': 'Konfusius', 'kong hu cu': 'Konfusius',
  'william shakespeare': 'William Shakespeare', 'shakespeare': 'William Shakespeare',
  'mark twain': 'Mark Twain', 'samuel clemens': 'Mark Twain',
  'oscar wilde': 'Oscar Wilde',
  'marcus aurelius': 'Marcus Aurelius',
  'socrates': 'Socrates', 'sokrates': 'Socrates',
  'aristoteles': 'Aristoteles', 'aristotle': 'Aristoteles',
  'plato': 'Plato', 'platon': 'Plato',
  'leonardo da vinci': 'Leonardo da Vinci',
  'buddha': 'Buddha', 'siddhartha gautama': 'Buddha', 'gautama buddha': 'Buddha',
  'helen keller': 'Helen Keller',
  'winston churchill': 'Winston Churchill', 'churchill': 'Winston Churchill',
  'mother teresa': 'Bunda Teresa', 'ibu teresa': 'Bunda Teresa',
  'abraham lincoln': 'Abraham Lincoln', 'lincoln': 'Abraham Lincoln',
  'martin luther king jr.': 'Martin Luther King Jr.', 'martin luther king': 'Martin Luther King Jr.', 'mlk': 'Martin Luther King Jr.',
  'steve jobs': 'Steve Jobs',
  'najwa shihab': 'Najwa Shihab',
  'joko widodo': 'Joko Widodo', 'jokowi': 'Joko Widodo',
  'bob marley': 'Bob Marley',
  'charlie chaplin': 'Charlie Chaplin',
  'bruce lee': 'Bruce Lee',
  'dale carnegie': 'Dale Carnegie',
  'zig ziglar': 'Zig Ziglar',
  'raditya dika': 'Raditya Dika',
  'boy candra': 'Boy Candra',
  'merry riana': 'Merry Riana',
  'gede prama': 'Gede Prama',
  'dahlan iskan': 'Dahlan Iskan',
  'sujiwo tejo': 'Sujiwo Tejo',
  'tan malaka': 'Tan Malaka',
  'andrie wongso': 'Andrie Wongso',
  'andrea hirata': 'Andrea Hirata',
  'mario teguh': 'Mario Teguh',
  'sapardi djoko damono': 'Sapardi Djoko Damono',
  'dee lestari': 'Dee Lestari',
  'ahmad fuadi': 'Ahmad Fuadi',
  'anies baswedan': 'Anies Baswedan',
  'chairul tanjung': 'Chairul Tanjung',
  'tung desem waringin': 'Tung Desem Waringin',
  'pablo picasso': 'Pablo Picasso', 'picasso': 'Pablo Picasso',
  'oprah winfrey': 'Oprah Winfrey', 'oprah': 'Oprah Winfrey',
  'walt disney': 'Walt Disney',
  'thomas edison': 'Thomas Edison', 'thomas alva edison': 'Thomas Edison',
  'benjamin franklin': 'Benjamin Franklin',
  'friedrich nietzsche': 'Friedrich Nietzsche', 'nietzsche': 'Friedrich Nietzsche',
  'victor hugo': 'Victor Hugo',
  'leo tolstoy': 'Leo Tolstoy', 'leo tolstoi': 'Leo Tolstoy',
  'muhammad ali': 'Muhammad Ali',
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
  'Tung Desem Waringin': 'Indonesia', 'Mario Teguh': 'Indonesia',
  'Sapardi Djoko Damono': 'Indonesia', 'Dee Lestari': 'Indonesia',
  'Ahmad Fuadi': 'Indonesia', 'Anies Baswedan': 'Indonesia',
  'Albert Einstein': 'Jerman', 'Mahatma Gandhi': 'India', 'Jalaluddin Rumi': 'Persia',
  'Khalil Gibran': 'Lebanon', 'Nelson Mandela': 'Afrika Selatan', 'Bob Marley': 'Jamaika',
  'Charlie Chaplin': 'Inggris', 'Mark Twain': 'Amerika', 'Steve Jobs': 'Amerika',
  'Martin Luther King Jr.': 'Amerika', 'Dale Carnegie': 'Amerika', 'Zig Ziglar': 'Amerika',
  'Friedrich Nietzsche': 'Jerman', 'Aristoteles': 'Yunani', 'Lao Tzu': 'Tiongkok',
  'William Shakespeare': 'Inggris', 'Oscar Wilde': 'Irlandia', 'Marcus Aurelius': 'Romawi',
  'Socrates': 'Yunani', 'Plato': 'Yunani', 'Leonardo da Vinci': 'Italia',
  'Buddha': 'India', 'Helen Keller': 'Amerika', 'Winston Churchill': 'Inggris',
  'Bunda Teresa': 'Albania', 'Abraham Lincoln': 'Amerika', 'Konfusius': 'Tiongkok',
  'Pablo Picasso': 'Spanyol', 'Oprah Winfrey': 'Amerika', 'Walt Disney': 'Amerika',
  'Thomas Edison': 'Amerika', 'Benjamin Franklin': 'Amerika', 'Victor Hugo': 'Perancis',
  'Leo Tolstoy': 'Rusia', 'Muhammad Ali': 'Amerika', 'Bruce Lee': 'Tiongkok',
  'Robert Frost': 'Amerika', 'Dr. Seuss': 'Amerika', 'Carl Rogers': 'Amerika',
};

// Category mapping — normalize varied categories to our standard set
const CATEGORY_NORMALIZE = {
  'agama': 'agama', 'alam': 'alam', 'bakat': 'motivasi', 'bekerja': 'sukses',
  'belajar': 'pendidikan', 'berjuang': 'perjuangan', 'berpikir': 'pendidikan',
  'bicara': 'nasihat', 'bisnis': 'sukses', 'buku': 'pendidikan',
  'disiplin': 'motivasi', 'dunia': 'kehidupan', 'ego': 'nasihat',
  'fokus': 'motivasi', 'guru': 'pendidikan', 'hati': 'kehidupan',
  'hidup': 'kehidupan', 'hikmat': 'nasihat', 'hukum': 'keadilan',
  'humor': 'humor', 'ide': 'kreativitas', 'ilmu': 'pendidikan',
  'imajinasi': 'kreativitas', 'inovasi': 'kreativitas', 'inspirasi': 'motivasi',
  'jiwa': 'kehidupan', 'karakter': 'nasihat', 'kebaikan': 'kebaikan',
  'kebenaran': 'kejujuran', 'kebencian': 'kehidupan', 'kebiasaan': 'nasihat',
  'kebodohan': 'pendidikan', 'kecantikan': 'kehidupan', 'kecerdasan': 'pendidikan',
  'kejahatan': 'kehidupan', 'kekuasaan': 'kepemimpinan', 'kemalasan': 'motivasi',
  'kemenangan': 'sukses', 'kemerdekaan': 'perjuangan', 'kepemimpinan': 'kepemimpinan',
  'kepribadian': 'nasihat', 'kesehatan': 'kesehatan', 'kesulitan': 'kesabaran',
  'ketakutan': 'keberanian', 'kreativitas': 'kreativitas', 'kuat': 'keberanian',
  'manusia': 'kehidupan', 'masa_depan': 'harapan', 'membaca': 'pendidikan',
  'menulis': 'kreativitas', 'menunggu': 'kesabaran', 'menyerah': 'motivasi',
  'pagi': 'motivasi', 'perang': 'perjuangan', 'perempuan': 'perempuan',
  'perjuangan': 'perjuangan', 'perubahan': 'kehidupan', 'politik': 'kehidupan',
  'prinsip': 'nasihat', 'puisi': 'seni', 'sadar_diri': 'nasihat',
  'sastra': 'seni', 'senyum': 'kebahagiaan', 'setia': 'cinta',
  'sikap': 'nasihat', 'uang': 'kehidupan', 'wanita': 'perempuan',
  'karier': 'sukses', 'ekonomi': 'kehidupan', 'demokrasi': 'kehidupan',
  'revolusi': 'perjuangan', 'korupsi': 'kehidupan', 'merdeka': 'perjuangan',
  'pemerintah': 'kehidupan', 'cerita': 'seni', 'bahasa': 'pendidikan',
  'film': 'seni', 'fotografi': 'seni', 'kebijakan': 'nasihat',
  'binatang': 'alam', 'bumi': 'alam', 'dewasa': 'kehidupan',
  'emansipasi': 'perempuan', 'etos': 'motivasi', 'hak_asasi_manusia': 'keadilan',
  'informasi': 'pendidikan', 'intuisi': 'nasihat', 'kapitalisme': 'kehidupan',
  'matahari': 'alam', 'mendengar': 'nasihat', 'bermimpi': 'mimpi',
  'bermain': 'kebahagiaan', 'batasan': 'motivasi', 'antisipasi': 'nasihat',
  'kiasan': 'seni', 'kopi': 'kehidupan', 'mampu': 'motivasi',
  'marketing': 'sukses', 'miliki': 'kehidupan', 'pajak': 'kehidupan',
  'polisi': 'kehidupan', 'santai': 'kehidupan', 'sepak_bola': 'kehidupan',
  'sinis': 'humor', 'teknis': 'pendidikan', 'teori': 'pendidikan',
  'terindah': 'cinta', 'insomnia': 'kehidupan',
  // Keep existing
  'cinta': 'cinta', 'kehidupan': 'kehidupan', 'motivasi': 'motivasi',
  'kesabaran': 'kesabaran', 'keberanian': 'keberanian', 'persahabatan': 'persahabatan',
  'pendidikan': 'pendidikan', 'sukses': 'sukses', 'nasihat': 'nasihat',
  'keikhlasan': 'keikhlasan', 'rindu': 'rindu', 'kejujuran': 'kejujuran',
  'keluarga': 'keluarga', 'harapan': 'harapan', 'mimpi': 'mimpi',
  'waktu': 'waktu', 'kebahagiaan': 'kebahagiaan', 'perjuangan': 'perjuangan',
  'ibu': 'ibu', 'pernikahan': 'pernikahan', 'doa': 'doa', 'seni': 'seni',
  'kegagalan': 'kegagalan', 'general': 'kehidupan',
};

const ALL_CATEGORIES = {
  'cinta': { name: 'Cinta', icon: '❤️', desc: 'Kata-kata bijak tentang cinta, kasih sayang, dan hubungan.' },
  'kehidupan': { name: 'Kehidupan', icon: '🌱', desc: 'Kata-kata bijak tentang makna hidup dan pengalaman.' },
  'motivasi': { name: 'Motivasi', icon: '🔥', desc: 'Kata-kata motivasi untuk semangat dan inspirasi.' },
  'kesabaran': { name: 'Kesabaran', icon: '🧘', desc: 'Kata-kata bijak tentang kesabaran dan ketabahan.' },
  'keberanian': { name: 'Keberanian', icon: '⚔️', desc: 'Kata-kata bijak tentang keberanian dan tekad.' },
  'persahabatan': { name: 'Persahabatan', icon: '🤝', desc: 'Kata-kata bijak tentang persahabatan dan kesetiaan.' },
  'pendidikan': { name: 'Pendidikan', icon: '📚', desc: 'Kata-kata bijak tentang pendidikan dan ilmu.' },
  'sukses': { name: 'Sukses', icon: '🏆', desc: 'Kata-kata bijak tentang kesuksesan dan kerja keras.' },
  'nasihat': { name: 'Nasihat', icon: '💡', desc: 'Kata-kata nasihat bijak untuk hidup lebih baik.' },
  'keikhlasan': { name: 'Keikhlasan', icon: '🕊️', desc: 'Kata-kata bijak tentang keikhlasan dan memaafkan.' },
  'rindu': { name: 'Rindu', icon: '🌙', desc: 'Kata-kata bijak tentang rindu dan kerinduan.' },
  'kejujuran': { name: 'Kejujuran', icon: '⚖️', desc: 'Kata-kata bijak tentang kejujuran dan integritas.' },
  'keluarga': { name: 'Keluarga', icon: '👨‍👩‍👧‍👦', desc: 'Kata-kata bijak tentang keluarga dan kasih sayang.' },
  'harapan': { name: 'Harapan', icon: '🌅', desc: 'Kata-kata bijak tentang harapan dan optimisme.' },
  'mimpi': { name: 'Mimpi', icon: '✨', desc: 'Kata-kata bijak tentang mimpi dan cita-cita.' },
  'waktu': { name: 'Waktu', icon: '⏳', desc: 'Kata-kata bijak tentang waktu dan kesempatan.' },
  'kebahagiaan': { name: 'Kebahagiaan', icon: '😊', desc: 'Kata-kata bijak tentang kebahagiaan.' },
  'perjuangan': { name: 'Perjuangan', icon: '💪', desc: 'Kata-kata bijak tentang perjuangan.' },
  'ibu': { name: 'Ibu', icon: '👩', desc: 'Kata-kata bijak tentang ibu dan kasih ibu.' },
  'pernikahan': { name: 'Pernikahan', icon: '💍', desc: 'Kata-kata bijak tentang pernikahan.' },
  'doa': { name: 'Doa', icon: '🤲', desc: 'Kata-kata bijak tentang doa dan spiritualitas.' },
  'seni': { name: 'Seni', icon: '🎨', desc: 'Kata-kata bijak tentang seni dan kreativitas.' },
  'kegagalan': { name: 'Kegagalan', icon: '🔄', desc: 'Kata-kata bijak tentang kegagalan dan bangkit kembali.' },
  'kreativitas': { name: 'Kreativitas', icon: '💫', desc: 'Kata-kata bijak tentang kreativitas dan inovasi.' },
  'kepemimpinan': { name: 'Kepemimpinan', icon: '👑', desc: 'Kata-kata bijak tentang kepemimpinan.' },
  'kebaikan': { name: 'Kebaikan', icon: '🤍', desc: 'Kata-kata bijak tentang kebaikan dan empati.' },
  'alam': { name: 'Alam', icon: '🌿', desc: 'Kata-kata bijak tentang alam dan keindahan dunia.' },
  'humor': { name: 'Humor', icon: '😄', desc: 'Kata-kata bijak yang lucu dan menghibur.' },
  'perempuan': { name: 'Perempuan', icon: '👩‍💼', desc: 'Kata-kata bijak tentang perempuan dan emansipasi.' },
  'keadilan': { name: 'Keadilan', icon: '⚖️', desc: 'Kata-kata bijak tentang keadilan dan hukum.' },
  'kesehatan': { name: 'Kesehatan', icon: '🏥', desc: 'Kata-kata bijak tentang kesehatan.' },
  'agama': { name: 'Agama', icon: '🕌', desc: 'Kata-kata bijak tentang agama dan iman.' },
  'peribahasa': { name: 'Peribahasa', icon: '📜', desc: 'Peribahasa Indonesia dan maknanya.' },
};

// ── Helpers ───────────────────────────────────────────────────

function normalizeAuthor(name) {
  if (!name) return 'Anonim';
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
  if (!q) return '';
  return q
    .replace(/\u201c|\u201d|\u201e|\u201f/g, '"')
    .replace(/\u2018|\u2019|\u201a|\u201b/g, "'")
    .replace(/\u2026/g, '...').replace(/\u2014/g, ' -- ').replace(/\u2013/g, ' - ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function esc(s) {
  return s.replace(/'/g, "''");
}

// ── Deduplicate and clean ────────────────────────────────────

const seen = new Set();
const cleaned = [];
let dupeCount = 0;
let shortCount = 0;
let noAuthorCount = 0;

for (const raw of allQuotes) {
  const text = cleanText(raw.quote || raw.text || '');
  if (text.length < 20) { shortCount++; continue; }

  const slug = slugify(text.substring(0, 60));
  if (!slug || slug.length < 5) { shortCount++; continue; }

  // Dedupe by slug + first 40 chars
  const key40 = text.substring(0, 40).toLowerCase().replace(/[^a-z0-9]/g, '');
  if (seen.has(slug) || seen.has(key40)) { dupeCount++; continue; }
  seen.add(slug);
  seen.add(key40);

  const author = normalizeAuthor(raw.author);
  if (author === 'Anonim' || !author) { noAuthorCount++; }

  const rawCat = (raw.category || 'general').toLowerCase().replace(/\s+/g, '_');
  const category = CATEGORY_NORMALIZE[rawCat] || 'kehidupan';

  cleaned.push({
    text, author, authorSlug: slugify(author), category, slug,
    source: raw.source || 'jagokata.com',
    language: raw.language || 'id',
    wordCount: text.split(/\s+/).length,
  });
}

// Also add peribahasa
for (const p of allPeribahasa) {
  const text = cleanText(p.text || p.quote || '');
  if (text.length < 10) continue;

  const slug = slugify(text.substring(0, 60));
  const key40 = text.substring(0, 40).toLowerCase().replace(/[^a-z0-9]/g, '');
  if (seen.has(slug) || seen.has(key40)) continue;
  seen.add(slug);
  seen.add(key40);

  const meaning = cleanText(p.meaning || '');
  cleaned.push({
    text, author: 'Peribahasa Indonesia', authorSlug: 'peribahasa-indonesia',
    category: 'peribahasa', slug, source: 'jagokata.com', language: 'id',
    wordCount: text.split(/\s+/).length, meaning,
  });
}

console.log(`\nCleaning results:`);
console.log(`  Unique quotes: ${cleaned.length}`);
console.log(`  Duplicates removed: ${dupeCount}`);
console.log(`  Too short: ${shortCount}`);
console.log(`  No author: ${noAuthorCount}`);

// Separate Indonesian vs English (for translation marking)
const idQuotes = cleaned.filter(q => q.language === 'id');
const enQuotes = cleaned.filter(q => q.language === 'en');
console.log(`  Indonesian: ${idQuotes.length}`);
console.log(`  English (needs translation): ${enQuotes.length}`);

// ── Collect unique authors and categories ────────────────────

const uniqueAuthors = new Map();
const usedCategories = new Set();

for (const q of cleaned) {
  if (!uniqueAuthors.has(q.author)) {
    uniqueAuthors.set(q.author, {
      slug: q.authorSlug,
      nationality: NATIONALITIES[q.author] || '',
    });
  }
  usedCategories.add(q.category);
}

console.log(`\nUnique authors: ${uniqueAuthors.size}`);
console.log(`Categories used: ${usedCategories.size}`);

// ── Generate SQL ──────────────────────────────────────────────

const lines = [];

// Insert categories
for (const catSlug of usedCategories) {
  const cat = ALL_CATEGORIES[catSlug];
  if (cat) {
    lines.push(`INSERT OR IGNORE INTO categories (name, slug, description, icon) VALUES ('${esc(cat.name)}', '${catSlug}', '${esc(cat.desc)}', '${cat.icon}');`);
  }
}
lines.push('');

// Insert authors
for (const [name, info] of uniqueAuthors) {
  lines.push(`INSERT OR IGNORE INTO authors (name, slug, nationality) VALUES ('${esc(name)}', '${info.slug}', '${info.nationality}');`);
}
lines.push('');

// Insert quotes (skip English ones — those need translation first)
// For now, import Indonesian quotes directly, mark English ones for later processing
let importCount = 0;
for (const q of cleaned) {
  // For English quotes, we'll import them with a [EN] prefix in the source field
  // so the worker can detect and translate them on-demand
  const sourceTag = q.language === 'en' ? 'wikiquote:en' : q.source;
  const meaning = q.meaning ? `'${esc(q.meaning)}'` : 'NULL';

  lines.push(`INSERT OR IGNORE INTO quotes (text, author_id, category_id, slug, word_count, source, meaning) VALUES ('${esc(q.text)}', (SELECT id FROM authors WHERE slug='${q.authorSlug}'), (SELECT id FROM categories WHERE slug='${q.category}'), '${q.slug}', ${q.wordCount}, '${sourceTag}', ${meaning});`);
  importCount++;
}
lines.push('');

// Update counts
lines.push("UPDATE categories SET quote_count = (SELECT COUNT(*) FROM quotes WHERE quotes.category_id = categories.id);");
lines.push("UPDATE authors SET quote_count = (SELECT COUNT(*) FROM quotes WHERE quotes.author_id = authors.id);");

const sql = lines.join('\n');
fs.writeFileSync(OUT_FILE, sql);
console.log(`\nSQL generated: ${OUT_FILE}`);
console.log(`  ${importCount} INSERT statements`);
console.log(`  ${sql.length} chars total`);
