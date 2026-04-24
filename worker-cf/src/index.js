// Bijaksana.com — Full Cloudflare Worker
// D1-powered quote platform with Workers AI enrichment + native app UX

import {
  shell, homePage, categoryListPage, categoryPage, authorListPage, authorPage,
  singleQuotePage, notFoundPage,
  sitemapIndex, sitemapXml, sitemapPages,
  kbbiIndexPage, kbbiWordPage, kbbiSearchResults, peribahasaPage,
  storiesListPage, singleStoryPage,
  puisiListPage, singlePuisiPage, pantunListPage,
  tesaurusPage, slangPage, wordlePage, quoteOfDayPage, idiomPage, ucapanPage,
  privacyPage, termsPage, bornTodayPage, quoteImagePage, tanyaPage, aiGeneratePage,
  quoteCard, paginationHtml,
  ROBOTS_TXT, LLMS_TXT, MANIFEST
} from './html.js';

// ── Headers ────────────────────────────────────────────────────
const SEC = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Robots-Tag': 'index, follow',
};

function html(content, status = 200, cacheTime = 3600) {
  return new Response(content, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': `public, max-age=${cacheTime}`, ...SEC },
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', ...SEC },
  });
}

function text(content, ctype = 'text/plain', cacheTime = 86400) {
  return new Response(content, {
    headers: { 'Content-Type': `${ctype}; charset=utf-8`, 'Cache-Control': `public, max-age=${cacheTime}`, ...SEC },
  });
}

// ── D1 Queries ─────────────────────────────────────────────────

const Q_QUOTES_WITH_JOIN = `
  SELECT q.*, a.name AS author_name, a.slug AS author_slug, a.nationality, a.photo_url,
         c.name AS category_name, c.slug AS category_slug, c.icon AS category_icon
  FROM quotes q
  JOIN authors a ON q.author_id = a.id
  JOIN categories c ON q.category_id = c.id`;

async function getQuotes(db, { limit = 20, offset = 0, categorySlug, authorSlug, orderBy = 'q.likes DESC, q.id' } = {}) {
  let where = '';
  const params = [];
  if (categorySlug) { where = ' WHERE c.slug = ?'; params.push(categorySlug); }
  if (authorSlug) { where = ' WHERE a.slug = ?'; params.push(authorSlug); }
  params.push(limit, offset);
  const { results } = await db.prepare(`${Q_QUOTES_WITH_JOIN}${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`).bind(...params).all();
  return results;
}

async function getQuoteBySlug(db, slug) {
  const { results } = await db.prepare(`${Q_QUOTES_WITH_JOIN} WHERE q.slug = ? LIMIT 1`).bind(slug).all();
  return results[0] || null;
}

async function getRelatedQuotes(db, categoryId, excludeId, limit = 5) {
  const { results } = await db.prepare(
    `${Q_QUOTES_WITH_JOIN} WHERE q.category_id = ? AND q.id != ? ORDER BY RANDOM() LIMIT ?`
  ).bind(categoryId, excludeId, limit).all();
  return results;
}

async function getCategories(db) {
  const { results } = await db.prepare('SELECT * FROM categories ORDER BY quote_count DESC').all();
  return results;
}

async function getCategoryBySlug(db, slug) {
  const { results } = await db.prepare('SELECT * FROM categories WHERE slug = ? LIMIT 1').bind(slug).all();
  return results[0] || null;
}

async function getAuthors(db, limit = 100) {
  const { results } = await db.prepare('SELECT * FROM authors ORDER BY quote_count DESC LIMIT ?').bind(limit).all();
  return results;
}

async function getAuthorBySlug(db, slug) {
  const { results } = await db.prepare('SELECT * FROM authors WHERE slug = ? LIMIT 1').bind(slug).all();
  return results[0] || null;
}

async function searchQuotes(db, query, limit = 20) {
  const like = `%${query}%`;
  const { results } = await db.prepare(
    `${Q_QUOTES_WITH_JOIN} WHERE q.text LIKE ? OR a.name LIKE ? ORDER BY q.likes DESC LIMIT ?`
  ).bind(like, like, limit).all();
  return results;
}

async function getRandomQuote(db) {
  const { results } = await db.prepare(`${Q_QUOTES_WITH_JOIN} ORDER BY RANDOM() LIMIT 1`).all();
  return results[0] || null;
}

async function getQuoteCount(db, { categorySlug, authorSlug } = {}) {
  let where = '';
  const params = [];
  if (categorySlug) { where = ' JOIN categories c ON q.category_id = c.id WHERE c.slug = ?'; params.push(categorySlug); }
  else if (authorSlug) { where = ' JOIN authors a ON q.author_id = a.id WHERE a.slug = ?'; params.push(authorSlug); }
  const row = await db.prepare(`SELECT COUNT(*) as cnt FROM quotes q${where}`).bind(...params).first();
  return row?.cnt || 0;
}

// ── KBBI Queries ───────────────────────────────────────────────

async function searchKBBI(db, query, limit = 30) {
  const like = `${query}%`;
  const { results } = await db.prepare(
    'SELECT id, word, slug, definition, word_class FROM kbbi WHERE word LIKE ? ORDER BY word LIMIT ?'
  ).bind(like, limit).all();
  return results;
}

async function getKBBIWord(db, slug) {
  return await db.prepare('SELECT * FROM kbbi WHERE slug = ? LIMIT 1').bind(slug).first();
}

async function getKBBIByLetter(db, letter, limit = 100, offset = 0) {
  const like = `${letter}%`;
  const { results } = await db.prepare(
    'SELECT id, word, slug, definition FROM kbbi WHERE word LIKE ? ORDER BY word LIMIT ? OFFSET ?'
  ).bind(like, limit, offset).all();
  return results;
}

async function getKBBILetterCount(db, letter) {
  const like = `${letter}%`;
  const row = await db.prepare('SELECT COUNT(*) as cnt FROM kbbi WHERE word LIKE ?').bind(like).first();
  return row?.cnt || 0;
}

async function getKBBIStats(db) {
  const row = await db.prepare('SELECT COUNT(*) as cnt FROM kbbi').first();
  return row?.cnt || 0;
}

// ── Peribahasa Queries ────────────────────────────────────────

async function getPeribahasa(db, limit = 50, offset = 0) {
  const { results } = await db.prepare(
    'SELECT * FROM peribahasa ORDER BY text LIMIT ? OFFSET ?'
  ).bind(limit, offset).all();
  return results;
}

async function getPeribahasaCount(db) {
  const row = await db.prepare('SELECT COUNT(*) as cnt FROM peribahasa').first();
  return row?.cnt || 0;
}

// ── AI Enrichment ──────────────────────────────────────────────

async function enrichQuoteWithAI(env, quote) {
  if (quote.meaning && quote.reflection) return quote;

  try {
    const prompt = `Kamu adalah seorang filsuf dan penulis Indonesia yang bijaksana. Berikan analisis mendalam untuk kutipan berikut:

"${quote.text}" — ${quote.author_name}

Berikan dalam format berikut (tanpa tambahan apapun):
MAKNA: [Jelaskan makna kutipan ini dalam 2-3 kalimat mendalam, 50-80 kata]
REFLEKSI: [Berikan refleksi tentang bagaimana kutipan ini relevan dalam kehidupan sehari-hari, 3-4 kalimat, 80-120 kata]
KONTEKS: [Berikan konteks singkat tentang pengarang dan latar belakang kutipan ini, 2-3 kalimat, 40-60 kata]`;

    const result = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7,
    });

    const text = result.response || '';
    const meaningMatch = text.match(/MAKNA:\s*(.+?)(?:\n|REFLEKSI:)/s);
    const reflectionMatch = text.match(/REFLEKSI:\s*(.+?)(?:\n|KONTEKS:)/s);
    const contextMatch = text.match(/KONTEKS:\s*(.+)/s);

    const meaning = meaningMatch ? meaningMatch[1].trim() : '';
    const reflection = reflectionMatch ? reflectionMatch[1].trim() : '';
    const context = contextMatch ? contextMatch[1].trim() : '';

    if (meaning) {
      const wordCount = (quote.text + ' ' + meaning + ' ' + reflection + ' ' + context).split(/\s+/).length;
      await env.DB.prepare(
        'UPDATE quotes SET meaning = ?, reflection = ?, context = ?, word_count = ? WHERE id = ?'
      ).bind(meaning, reflection, context, wordCount, quote.id).run();

      quote.meaning = meaning;
      quote.reflection = reflection;
      quote.context = context;
      quote.word_count = wordCount;
    }
  } catch (e) {
    console.error('AI enrichment failed:', e);
  }

  return quote;
}

// ── Translation (English → Indonesian) ─────────────────────────

function isEnglishSource(source) {
  return source && source.includes(':en');
}

async function translateQuote(env, quote) {
  // Already has Indonesian translation
  if (quote.text_id && quote.text_id.length > 10) return quote;
  // Not English — original text IS Indonesian
  if (!isEnglishSource(quote.source)) return quote;

  try {
    const result = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages: [{ role: 'user', content: `Terjemahkan kutipan ini ke Bahasa Indonesia yang indah dan puitis. Hanya berikan terjemahan, tanpa penjelasan:\n\n"${quote.text}"` }],
      max_tokens: 200,
      temperature: 0.3,
    });
    const translated = (result.response || '').replace(/^[""]|[""]$/g, '').trim();
    if (translated && translated.length > 10) {
      await env.DB.prepare('UPDATE quotes SET text_id = ? WHERE id = ?').bind(translated, quote.id).run();
      quote.text_id = translated;
    }
  } catch (e) {
    console.error('Translation failed:', e);
  }
  return quote;
}

// Get display text — Indonesian if available, otherwise original
function displayText(quote) {
  if (quote.text_id && quote.text_id.length > 10) return quote.text_id;
  if (!isEnglishSource(quote.source)) return quote.text;
  return quote.text; // fallback to original if no translation yet
}

// ── Subscriber management ──────────────────────────────────────

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Main Worker ────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const db = env.DB;

    // www redirect
    if (url.hostname.startsWith('www.')) {
      return Response.redirect(`https://bijaksana.com${path}${url.search}`, 301);
    }

    // .org redirect to .com
    if (url.hostname.includes('bijaksana.org')) {
      return Response.redirect(`https://bijaksana.com${path}${url.search}`, 301);
    }

    // CORS
    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' },
      });
    }

    try {
      // ── Static SEO files ──────────────────────────────────
      if (method === 'GET') {
        switch (path) {
          case '/robots.txt': return text(ROBOTS_TXT);
          case '/llms.txt': return text(LLMS_TXT);
          case '/llms-full.txt': return text(LLMS_TXT);
          case '/manifest.json': return text(MANIFEST, 'application/manifest+json');
          case '/favicon.svg':
            return text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">\u{1FAB7}</text></svg>', 'image/svg+xml', 604800);

          case '/sitemap.xml':
            return text(sitemapIndex(), 'application/xml', 3600);
          case '/sitemap-pages.xml':
            return text(sitemapPages(), 'application/xml', 3600);
          case '/sitemap-quotes.xml': {
            const quotes = await db.prepare('SELECT slug FROM quotes LIMIT 49999').all().then(r => r.results);
            return text(sitemapXml(quotes, 'kata-bijak', '0.5'), 'application/xml', 86400);
          }
          case '/sitemap-quotes-2.xml': {
            const quotes = await db.prepare('SELECT slug FROM quotes LIMIT 49999 OFFSET 50000').all().then(r => r.results);
            return text(sitemapXml(quotes, 'kata-bijak', '0.5'), 'application/xml', 86400);
          }
          case '/sitemap-quotes-3.xml': {
            const quotes = await db.prepare('SELECT slug FROM quotes LIMIT 49999 OFFSET 100000').all().then(r => r.results);
            return text(sitemapXml(quotes, 'kata-bijak', '0.5'), 'application/xml', 86400);
          }
          case '/sitemap-kbbi-2.xml': {
            const kbbi = await db.prepare('SELECT slug FROM kbbi LIMIT 49999 OFFSET 50000').all().then(r => r.results);
            return text(sitemapXml(kbbi, 'arti-kata', '0.4'), 'application/xml', 86400);
          }
          case '/sitemap-kbbi-3.xml': {
            const kbbi = await db.prepare('SELECT slug FROM kbbi LIMIT 49999 OFFSET 100000').all().then(r => r.results);
            return text(sitemapXml(kbbi, 'arti-kata', '0.4'), 'application/xml', 86400);
          }
          case '/sitemap-authors.xml': {
            const [authors, categories] = await Promise.all([
              db.prepare('SELECT slug FROM authors WHERE quote_count > 0').all().then(r => r.results),
              db.prepare('SELECT slug FROM categories').all().then(r => r.results),
            ]);
            const items = [...categories.map(c => ({ slug: c.slug, prefix: 'kategori' })), ...authors.map(a => ({ slug: a.slug }))];
            let urls = categories.map(c => `<url><loc>https://bijaksana.com/kategori/${c.slug}</loc><priority>0.7</priority></url>`).join('\n');
            urls += '\n' + authors.map(a => `<url><loc>https://bijaksana.com/tokoh/${a.slug}</loc><priority>0.6</priority></url>`).join('\n');
            return text(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`, 'application/xml', 86400);
          }
          case '/sitemap-kbbi.xml': {
            const kbbi = await db.prepare('SELECT slug FROM kbbi LIMIT 50000').all().then(r => r.results);
            return text(sitemapXml(kbbi, 'arti-kata', '0.4'), 'application/xml', 86400);
          }
          case '/sitemap-puisi.xml': {
            const [puisi, stories] = await Promise.all([
              db.prepare('SELECT slug FROM puisi').all().then(r => r.results),
              db.prepare('SELECT slug FROM stories').all().then(r => r.results),
            ]);
            let urls = puisi.map(p => `<url><loc>https://bijaksana.com/puisi/${p.slug}</loc><priority>0.5</priority></url>`).join('\n');
            urls += '\n' + stories.map(s => `<url><loc>https://bijaksana.com/kisah/${s.slug}</loc><priority>0.5</priority></url>`).join('\n');
            return text(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`, 'application/xml', 86400);
          }
          case '/sitemap-stories.xml': {
            // Redirect to puisi sitemap (combined)
            return Response.redirect('https://bijaksana.com/sitemap-puisi.xml', 301);
          }
        }
      }

      // ── API Routes ──────────────────────────────────────────
      if (path === '/api/search' && method === 'GET') {
        const q = url.searchParams.get('q') || '';
        if (q.length < 2) return json({ results: [] });
        const results = await searchQuotes(db, q, 15);
        return json({ results: results.map(r => ({ text: r.text, author: r.author_name, slug: r.slug })) });
      }

      if (path === '/api/kbbi' && method === 'GET') {
        const q = url.searchParams.get('q') || '';
        if (q.length < 1) return json({ results: [] });
        const results = await searchKBBI(db, q, 20);
        return json({ results: results.map(r => ({ word: r.word, slug: r.slug, definition: r.definition.substring(0, 200) })) });
      }

      // Vote API
      if (path === '/api/vote' && method === 'POST') {
        const body = await request.json();
        const quoteId = body.id;
        const value = body.value === -1 ? -1 : 1;
        if (!quoteId) return json({ error: 'id required' }, 400);
        const ip = request.headers.get('cf-connecting-ip') || 'unknown';
        const ipHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip + 'bijaksana-salt')).then(b => Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2,'0')).join('').substring(0,16));
        try {
          await db.prepare('INSERT OR REPLACE INTO votes (quote_id, ip_hash, value) VALUES (?, ?, ?)').bind(quoteId, ipHash, value).run();
          await db.prepare('UPDATE quotes SET likes = (SELECT COALESCE(SUM(value),0) FROM votes WHERE quote_id = ?) WHERE id = ?').bind(quoteId, quoteId).run();
          const row = await db.prepare('SELECT likes FROM quotes WHERE id = ?').bind(quoteId).first();
          return json({ success: true, likes: row?.likes || 0 });
        } catch (e) {
          return json({ error: 'Vote failed' }, 500);
        }
      }

      // Born today API
      if (path === '/api/born-today' && method === 'GET') {
        const today = new Date();
        const md = `${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
        const results = await db.prepare('SELECT * FROM born_today WHERE month_day = ? ORDER BY birth_date').bind(md).all().then(r => r.results);
        return json({ date: md, people: results });
      }

      if (path === '/api/subscribe' && method === 'POST') {
        const body = await request.json();
        const email = (body.email || '').trim().toLowerCase();
        if (!email || !isValidEmail(email)) return json({ error: 'Email tidak valid.' }, 400);

        // Check existing
        const existing = await db.prepare('SELECT * FROM subscribers WHERE email = ?').bind(email).first();
        if (existing) {
          if (existing.active) return json({ error: 'Email sudah terdaftar.' }, 409);
          await db.prepare('UPDATE subscribers SET active = 1 WHERE id = ?').bind(existing.id).run();
          return json({ success: true, message: 'Berhasil berlangganan kembali!' });
        }

        const tokenBytes = new Uint8Array(32);
        crypto.getRandomValues(tokenBytes);
        const token = Array.from(tokenBytes).map(b => b.toString(16).padStart(2, '0')).join('');
        await db.prepare('INSERT INTO subscribers (email, token) VALUES (?, ?)').bind(email, token).run();
        return json({ success: true, message: 'Berhasil berlangganan! Terima kasih.' });
      }

      if (path === '/api/quote/random' && method === 'GET') {
        const quote = await getRandomQuote(db);
        if (!quote) return json({ error: 'No quotes' }, 404);
        return json({ text: quote.text, author: quote.author_name, category: quote.category_name, slug: quote.slug });
      }

      if (path === '/health') return json({ status: 'ok', runtime: 'cloudflare-worker', quotes: 'D1' });

      // ── AI API Routes (POST, rate-limited) ─────────────────
      if ((path === '/api/tanya' || path === '/api/generate-quote' || path === '/api/generate-story') && method === 'POST') {
        // Rate limit: 10 AI calls per IP per minute
        const ip = request.headers.get('cf-connecting-ip') || 'unknown';
        const ipHash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip)))).map(b => b.toString(16).padStart(2,'0')).join('').substring(0, 12);
        const rateKey = `rate:ai:${ipHash}`;
        try {
          const rateData = await env.BIJAKSANA_KV.get(rateKey, { type: 'json' });
          const now = Date.now();
          if (rateData && now - rateData.t < 60000 && rateData.c >= 10) {
            return json({ error: 'Terlalu banyak permintaan. Coba lagi dalam 1 menit.' }, 429);
          }
          const newRate = { t: rateData && now - rateData.t < 60000 ? rateData.t : now, c: (rateData && now - rateData.t < 60000 ? rateData.c : 0) + 1 };
          await env.BIJAKSANA_KV.put(rateKey, JSON.stringify(newRate), { expirationTtl: 120 });
        } catch {}
      }

      if (path === '/api/tanya' && method === 'POST') {
        try {
          const body = await request.json();
          const question = (body.question || '').substring(0, 500);
          if (!question) return json({ error: 'question required' }, 400);
          const relevantQuotes = await searchQuotes(db, question.split(' ').slice(0, 3).join(' '), 3);
          const context = relevantQuotes.map(q => `"${(q.text_id || q.text).substring(0, 100)}" — ${q.author_name}`).join('\n');
          const result = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
            messages: [
              { role: 'system', content: `Kamu adalah Bijaksana, asisten kebijaksanaan Indonesia. Jawab dengan bijaksana dan mendalam dalam Bahasa Indonesia. Kutipan terkait:\n${context}` },
              { role: 'user', content: question }
            ],
            max_tokens: 500, temperature: 0.7,
          });
          return json({ answer: result.response || 'Maaf, saya tidak dapat menjawab.', quotes: relevantQuotes.map(q => ({ text: (q.text_id||q.text).substring(0,80), author: q.author_name, slug: q.slug })) });
        } catch (e) { return json({ error: 'AI unavailable: ' + e.message }, 500); }
      }

      if (path === '/api/generate-quote' && method === 'POST') {
        try {
          const body = await request.json();
          const theme = (body.theme || 'kehidupan').substring(0, 50);
          const result = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
            messages: [{ role: 'user', content: `Buatkan SATU kata-kata bijak ORIGINAL dalam Bahasa Indonesia tentang "${theme}". Indah, puitis, mendalam. Hanya kutipannya, tanpa tanda kutip, tanpa penjelasan.` }],
            max_tokens: 150, temperature: 0.9,
          });
          return json({ quote: (result.response || '').replace(/^[""\u201C\u201D]|[""\u201C\u201D]$/g, '').trim(), theme });
        } catch (e) { return json({ error: 'AI unavailable: ' + e.message }, 500); }
      }

      if (path === '/api/generate-story' && method === 'POST') {
        try {
          const body = await request.json();
          const theme = (body.theme || 'kebijaksanaan').substring(0, 50);
          const style = (body.style || 'sufi').substring(0, 20);
          const guides = { sufi: 'Gaya Sufi — singkat, misterius, twist di akhir.', zen: 'Gaya Zen — sangat singkat, paradoks.', aesop: 'Gaya fabel — hewan sebagai karakter, moral di akhir.' };
          const result = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
            messages: [{ role: 'user', content: `Buatkan kisah bijaksana ORIGINAL Bahasa Indonesia tentang "${theme}". ${guides[style]||guides.sufi} 100-150 kata. Format:\nJUDUL: [judul]\nKISAH: [cerita]\nPELAJARAN: [moral 1 kalimat]` }],
            max_tokens: 400, temperature: 0.8,
          });
          const text = result.response || '';
          const t = text.match(/JUDUL:\s*(.+?)(?:\n|KISAH:)/s);
          const s = text.match(/KISAH:\s*(.+?)(?:\n|PELAJARAN:)/s);
          const m = text.match(/PELAJARAN:\s*(.+)/s);
          return json({ title: t?t[1].trim():'Kisah Bijaksana', story: s?s[1].trim():text.trim(), moral: m?m[1].trim():'', style, theme });
        } catch (e) { return json({ error: 'AI unavailable: ' + e.message }, 500); }
      }

      // ── HTML Pages ──────────────────────────────────────────

      if (method !== 'GET') return json({ error: 'Method not allowed' }, 405);

      // Home
      if (path === '/' || path === '') {
        const [quotes, categories] = await Promise.all([
          getQuotes(db, { limit: 15 }),
          getCategories(db),
        ]);
        // Enrich first 3 quotes
        for (let i = 0; i < Math.min(3, quotes.length); i++) {
          await enrichQuoteWithAI(env, quotes[i]);
        }
        return html(homePage(quotes, categories), 200, 300);
      }

      // Category list
      if (path === '/kategori' || path === '/kategori/') {
        const categories = await getCategories(db);
        return html(categoryListPage(categories));
      }

      // Category page (with pagination)
      const catMatch = path.match(/^\/kategori\/([a-z0-9_-]+)\/?$/);
      if (catMatch) {
        const cat = await getCategoryBySlug(db, catMatch[1]);
        if (!cat) return html(notFoundPage(), 404);
        const page = Math.max(1, parseInt(url.searchParams.get('hal') || '1'));
        const perPage = 20;
        const offset = (page - 1) * perPage;
        const [quotes, total] = await Promise.all([
          getQuotes(db, { categorySlug: catMatch[1], limit: perPage, offset }),
          getQuoteCount(db, { categorySlug: catMatch[1] }),
        ]);
        const totalPages = Math.ceil(total / perPage);
        return html(categoryPage(cat, quotes, { page, totalPages, total }));
      }

      // Author list with A-Z filter + pagination
      if (path === '/tokoh' || path === '/tokoh/') {
        const letter = (url.searchParams.get('huruf') || '').toLowerCase();
        const page = Math.max(1, parseInt(url.searchParams.get('hal') || '1'));
        const perPage = 40;
        const offset = (page - 1) * perPage;

        if (letter && letter.match(/^[a-z]$/)) {
          const like = `${letter}%`;
          const [authors, countRow] = await Promise.all([
            db.prepare('SELECT * FROM authors WHERE LOWER(name) LIKE ? ORDER BY quote_count DESC LIMIT ? OFFSET ?').bind(like, perPage, offset).all().then(r => r.results),
            db.prepare('SELECT COUNT(*) as c FROM authors WHERE LOWER(name) LIKE ?').bind(like).first(),
          ]);
          const total = countRow?.c || 0;
          const totalPages = Math.ceil(total / perPage);
          return html(authorListPage(authors, { letter, page, totalPages, total }));
        }

        const authors = await getAuthors(db, 60);
        const totalAuthors = (await db.prepare('SELECT COUNT(*) as c FROM authors').first())?.c || 0;
        return html(authorListPage(authors, { totalAuthors }));
      }

      // Author page (with pagination)
      const authorMatch = path.match(/^\/tokoh\/([a-z0-9_-]+)\/?$/);
      if (authorMatch) {
        const author = await getAuthorBySlug(db, authorMatch[1]);
        if (!author) return html(notFoundPage(), 404);
        const page = Math.max(1, parseInt(url.searchParams.get('hal') || '1'));
        const perPage = 20;
        const offset = (page - 1) * perPage;
        const [quotes, total] = await Promise.all([
          getQuotes(db, { authorSlug: authorMatch[1], limit: perPage, offset }),
          getQuoteCount(db, { authorSlug: authorMatch[1] }),
        ]);
        const totalPages = Math.ceil(total / perPage);
        return html(authorPage(author, quotes, { page, totalPages, total }));
      }

      // Single quote
      const quoteMatch = path.match(/^\/kata-bijak\/([a-z0-9_-]+)\/?$/);
      if (quoteMatch) {
        let quote = await getQuoteBySlug(db, quoteMatch[1]);
        if (!quote) return html(notFoundPage(), 404);

        // Only translate/enrich if already cached (instant), skip AI on first visit for speed
        if (isEnglishSource(quote.source) && quote.text_id && quote.text_id.length > 10) {
          // Already translated — use cached
        } else if (isEnglishSource(quote.source)) {
          // Not translated yet — translate in background, show English for now
          translateQuote(env, quote).catch(() => {});
        }
        // Only show enrichment if already cached
        if (!quote.meaning) {
          enrichQuoteWithAI(env, quote).catch(() => {});
        }

        const [author, related] = await Promise.all([
          getAuthorBySlug(db, quote.author_slug),
          getRelatedQuotes(db, quote.category_id, quote.id, 5),
        ]);
        const authorData = author || { name: quote.author_name, slug: quote.author_slug, nationality: quote.nationality, quote_count: 0, bio: '', photo_url: quote.photo_url };
        const category = { name: quote.category_name, slug: quote.category_slug, icon: quote.category_icon };

        // Update view count (fire-and-forget)
        env.DB.prepare('UPDATE quotes SET views = views + 1 WHERE id = ?').bind(quote.id).run();

        return html(singleQuotePage(quote, authorData, category, related));
      }

      // Random quote page
      if (path === '/acak' || path === '/acak/') {
        const quote = await getRandomQuote(db);
        if (!quote) return html(notFoundPage(), 404);
        return Response.redirect(`https://bijaksana.com/kata-bijak/${quote.slug}`, 302);
      }

      // ── Top / Popular Quotes ──────────────────────────────────
      if (path === '/populer' || path === '/populer/') {
        const page = Math.max(1, parseInt(url.searchParams.get('hal') || '1'));
        const perPage = 20;
        const offset = (page - 1) * perPage;
        const [quotes, countRow] = await Promise.all([
          getQuotes(db, { limit: perPage, offset, orderBy: 'q.likes DESC, q.views DESC, q.id' }),
          db.prepare('SELECT COUNT(*) as c FROM quotes').first(),
        ]);
        const total = countRow?.c || 0;
        const totalPages = Math.ceil(total / perPage);
        return html(shell({
          title: `Kata Bijak Populer — Halaman ${page}`,
          description: `${total.toLocaleString('id-ID')} kata bijak populer dari tokoh-tokoh terkenal.`,
          path: '/populer',
          activeTab: 'home',
          body: `<div class="breadcrumb"><a href="/">Beranda</a><span>/</span><span>Populer</span></div>
<h1 style="font-size:22px;font-weight:700;margin-bottom:16px">Kata Bijak Populer</h1>
<p style="color:var(--muted);font-size:14px;margin-bottom:20px">${total.toLocaleString('id-ID')} kata bijak dari seluruh dunia.</p>
<div class="quotes-grid">${quotes.map(q => quoteCard(q, false)).join('')}</div>
${paginationHtml({ page, totalPages, total }, '/populer')}
<footer class="footer"><p>&copy; 2026 bijaksana.com</p></footer>`
        }));
      }

      // ── Stories / Kisah Bijaksana ───────────────────────────────
      if (path === '/kisah' || path === '/kisah/') {
        const tradition = url.searchParams.get('tradisi') || '';
        const page = Math.max(1, parseInt(url.searchParams.get('hal') || '1'));
        const perPage = 15;
        const offset = (page - 1) * perPage;

        let where = '', params = [];
        if (tradition) { where = ' WHERE tradition = ?'; params.push(tradition); }

        const [items, countRow] = await Promise.all([
          db.prepare(`SELECT * FROM stories${where} ORDER BY id LIMIT ? OFFSET ?`).bind(...params, perPage, offset).all().then(r => r.results),
          db.prepare(`SELECT COUNT(*) as c FROM stories${where}`).bind(...params).first(),
        ]);
        const total = countRow?.c || 0;
        const totalPages = Math.ceil(total / perPage);

        const traditions = await db.prepare('SELECT tradition, COUNT(*) as c FROM stories GROUP BY tradition ORDER BY c DESC').all().then(r => r.results);

        return html(storiesListPage(items, traditions, { page, totalPages, total, tradition }));
      }

      // Single story
      const storyMatch = path.match(/^\/kisah\/([a-z0-9_-]+)\/?$/);
      if (storyMatch) {
        const story = await db.prepare('SELECT * FROM stories WHERE slug = ? LIMIT 1').bind(storyMatch[1]).first();
        if (!story) return html(notFoundPage(), 404);
        const related = await db.prepare('SELECT id, title, slug, tradition, word_count FROM stories WHERE tradition = ? AND id != ? ORDER BY RANDOM() LIMIT 5').bind(story.tradition, story.id).all().then(r => r.results);
        return html(singleStoryPage(story, related));
      }

      // ── KBBI Arti Kata ───────────────────────────────────────
      if (path === '/arti-kata' || path === '/arti-kata/') {
        const q = url.searchParams.get('q') || '';
        const letter = url.searchParams.get('huruf') || '';
        const page = Math.max(1, parseInt(url.searchParams.get('hal') || '1'));
        const perPage = 50;

        if (q) {
          const results = await searchKBBI(db, q, 50);
          return html(kbbiSearchResults(q, results));
        }
        if (letter) {
          const offset = (page - 1) * perPage;
          const [words, total] = await Promise.all([
            getKBBIByLetter(db, letter, perPage, offset),
            getKBBILetterCount(db, letter),
          ]);
          const totalPages = Math.ceil(total / perPage);
          return html(kbbiIndexPage(letter, words, { page, totalPages, total }));
        }
        const totalWords = await getKBBIStats(db);
        return html(kbbiIndexPage('', [], { totalWords }));
      }

      // Single KBBI word
      const kbbiMatch = path.match(/^\/arti-kata\/([a-z0-9_-]+)\/?$/);
      if (kbbiMatch) {
        const word = await getKBBIWord(db, kbbiMatch[1]);
        if (!word) return html(notFoundPage(), 404);
        return html(kbbiWordPage(word));
      }

      // ── Peribahasa ──────────────────────────────────────────
      if (path === '/peribahasa' || path === '/peribahasa/') {
        const q = url.searchParams.get('q') || '';
        const page = Math.max(1, parseInt(url.searchParams.get('hal') || '1'));
        const perPage = 30;
        const offset = (page - 1) * perPage;

        if (q) {
          const like = `%${q}%`;
          const [items, countRow] = await Promise.all([
            db.prepare('SELECT * FROM peribahasa WHERE text LIKE ? OR meaning LIKE ? ORDER BY text LIMIT ? OFFSET ?').bind(like, like, perPage, offset).all().then(r => r.results),
            db.prepare('SELECT COUNT(*) as c FROM peribahasa WHERE text LIKE ? OR meaning LIKE ?').bind(like, like).first(),
          ]);
          const total = countRow?.c || 0;
          const totalPages = Math.ceil(total / perPage);
          return html(peribahasaPage(items, { page, totalPages, total, query: q }));
        }

        const [items, total] = await Promise.all([
          getPeribahasa(db, perPage, offset),
          getPeribahasaCount(db),
        ]);
        const totalPages = Math.ceil(total / perPage);
        return html(peribahasaPage(items, { page, totalPages, total }));
      }

      // ── Puisi ──────────────────────────────────────────────
      if (path === '/puisi' || path === '/puisi/') {
        const page = Math.max(1, parseInt(url.searchParams.get('hal') || '1'));
        const q = url.searchParams.get('q') || '';
        const perPage = 15;
        const offset = (page - 1) * perPage;
        let items, total;
        if (q) {
          const like = `%${q}%`;
          [items, total] = await Promise.all([
            db.prepare('SELECT * FROM puisi WHERE title LIKE ? OR author LIKE ? OR body LIKE ? ORDER BY id LIMIT ? OFFSET ?').bind(like, like, like, perPage, offset).all().then(r => r.results),
            db.prepare('SELECT COUNT(*) as c FROM puisi WHERE title LIKE ? OR author LIKE ? OR body LIKE ?').bind(like, like, like).first().then(r => r?.c || 0),
          ]);
        } else {
          [items, total] = await Promise.all([
            db.prepare('SELECT * FROM puisi ORDER BY id LIMIT ? OFFSET ?').bind(perPage, offset).all().then(r => r.results),
            db.prepare('SELECT COUNT(*) as c FROM puisi').first().then(r => r?.c || 0),
          ]);
        }
        return html(puisiListPage(items, { page, totalPages: Math.ceil(total / perPage), total, query: q }));
      }

      const puisiMatch = path.match(/^\/puisi\/([a-z0-9_-]+)\/?$/);
      if (puisiMatch) {
        const poem = await db.prepare('SELECT * FROM puisi WHERE slug = ? LIMIT 1').bind(puisiMatch[1]).first();
        if (!poem) return html(notFoundPage(), 404);
        const related = await db.prepare('SELECT id, title, slug, author, word_count FROM puisi WHERE author = ? AND id != ? ORDER BY RANDOM() LIMIT 5').bind(poem.author || '', poem.id).all().then(r => r.results);
        return html(singlePuisiPage(poem, related));
      }

      // ── Pantun ──────────────────────────────────────────────
      if (path === '/pantun' || path === '/pantun/') {
        const cat = url.searchParams.get('kategori') || '';
        const page = Math.max(1, parseInt(url.searchParams.get('hal') || '1'));
        const perPage = 20;
        const offset = (page - 1) * perPage;
        let items, total;
        if (cat) {
          [items, total] = await Promise.all([
            db.prepare('SELECT * FROM pantun WHERE category = ? ORDER BY id LIMIT ? OFFSET ?').bind(cat, perPage, offset).all().then(r => r.results),
            db.prepare('SELECT COUNT(*) as c FROM pantun WHERE category = ?').bind(cat).first().then(r => r?.c || 0),
          ]);
        } else {
          [items, total] = await Promise.all([
            db.prepare('SELECT * FROM pantun ORDER BY id LIMIT ? OFFSET ?').bind(perPage, offset).all().then(r => r.results),
            db.prepare('SELECT COUNT(*) as c FROM pantun').first().then(r => r?.c || 0),
          ]);
        }
        const categories = await db.prepare('SELECT category, COUNT(*) as c FROM pantun GROUP BY category ORDER BY c DESC').all().then(r => r.results);
        return html(pantunListPage(items, categories, { page, totalPages: Math.ceil(total / perPage), total, category: cat }));
      }

      // ── Tesaurus (Sinonim + Antonim) ───────────────────────
      if (path === '/tesaurus' || path === '/tesaurus/') {
        const q = url.searchParams.get('q') || '';
        if (q) {
          const like = `${q}%`;
          const results = await db.prepare('SELECT * FROM tesaurus WHERE word LIKE ? ORDER BY word LIMIT 30').bind(like).all().then(r => r.results);
          return html(tesaurusPage(q, results));
        }
        return html(tesaurusPage('', []));
      }

      // ── Kamus Slang / Bahasa Gaul ──────────────────────────
      if (path === '/slang' || path === '/slang/') {
        const q = url.searchParams.get('q') || '';
        const letter = url.searchParams.get('huruf') || '';
        const page = Math.max(1, parseInt(url.searchParams.get('hal') || '1'));
        const perPage = 50;
        const offset = (page - 1) * perPage;
        let items, total;
        if (q) {
          const like = `%${q}%`;
          [items, total] = await Promise.all([
            db.prepare('SELECT * FROM slang WHERE slang_word LIKE ? OR formal_word LIKE ? ORDER BY slang_word LIMIT ? OFFSET ?').bind(like, like, perPage, offset).all().then(r => r.results),
            db.prepare('SELECT COUNT(*) as c FROM slang WHERE slang_word LIKE ? OR formal_word LIKE ?').bind(like, like).first().then(r => r?.c || 0),
          ]);
        } else if (letter) {
          const like = `${letter}%`;
          [items, total] = await Promise.all([
            db.prepare('SELECT * FROM slang WHERE slang_word LIKE ? ORDER BY slang_word LIMIT ? OFFSET ?').bind(like, perPage, offset).all().then(r => r.results),
            db.prepare('SELECT COUNT(*) as c FROM slang WHERE slang_word LIKE ?').bind(like).first().then(r => r?.c || 0),
          ]);
        } else {
          [items, total] = await Promise.all([
            db.prepare('SELECT * FROM slang ORDER BY slang_word LIMIT ? OFFSET ?').bind(perPage, offset).all().then(r => r.results),
            db.prepare('SELECT COUNT(*) as c FROM slang').first().then(r => r?.c || 0),
          ]);
        }
        return html(slangPage(items, { page, totalPages: Math.ceil(total / perPage), total, query: q, letter }));
      }

      // ── Idiom ─────────────────────────────────────────────
      if (path === '/idiom' || path === '/idiom/') {
        const q = url.searchParams.get('q') || '';
        const page = Math.max(1, parseInt(url.searchParams.get('hal') || '1'));
        const perPage = 30;
        const offset = (page - 1) * perPage;
        let items, total;
        if (q) {
          const like = `%${q}%`;
          [items, total] = await Promise.all([
            db.prepare('SELECT * FROM idiom WHERE text LIKE ? ORDER BY text LIMIT ? OFFSET ?').bind(like, perPage, offset).all().then(r => r.results),
            db.prepare('SELECT COUNT(*) as c FROM idiom WHERE text LIKE ?').bind(like).first().then(r => r?.c || 0),
          ]);
        } else {
          [items, total] = await Promise.all([
            db.prepare('SELECT * FROM idiom ORDER BY text LIMIT ? OFFSET ?').bind(perPage, offset).all().then(r => r.results),
            db.prepare('SELECT COUNT(*) as c FROM idiom').first().then(r => r?.c || 0),
          ]);
        }
        return html(idiomPage(items, { page, totalPages: Math.ceil(total / perPage), total, query: q }));
      }

      // ── Wordle (Tebak Kata) ────────────────────────────────
      if (path === '/wordle' || path === '/tebak-kata') {
        const wordRow = await db.prepare('SELECT word FROM puzzle_answers ORDER BY RANDOM() LIMIT 1').first();
        const answer = wordRow?.word || 'bijak';
        return html(wordlePage(answer));
      }

      // ── Quote of the Day ───────────────────────────────────
      if (path === '/hari-ini' || path === '/hari-ini/') {
        const today = new Date().toISOString().split('T')[0];
        let dailyQuote = await db.prepare('SELECT q.*, a.name AS author_name, a.slug AS author_slug, a.photo_url, c.name AS category_name, c.slug AS category_slug FROM daily_quotes dq JOIN quotes q ON dq.quote_id = q.id JOIN authors a ON q.author_id = a.id JOIN categories c ON q.category_id = c.id WHERE dq.date = ?').bind(today).first();
        if (!dailyQuote) {
          const random = await getRandomQuote(db);
          if (random) {
            await db.prepare('INSERT OR IGNORE INTO daily_quotes (quote_id, date) VALUES (?, ?)').bind(random.id, today).run();
            dailyQuote = random;
          }
        }
        if (dailyQuote && isEnglishSource(dailyQuote.source)) {
          await translateQuote(env, dailyQuote);
        }
        if (dailyQuote) await enrichQuoteWithAI(env, dailyQuote);
        return html(quoteOfDayPage(dailyQuote));
      }

      // ── Ucapan (Greetings/Wishes) ─────────────────────────
      if (path === '/ucapan' || path === '/ucapan/') {
        const occasion = url.searchParams.get('acara') || '';
        const page = Math.max(1, parseInt(url.searchParams.get('hal') || '1'));
        const perPage = 20;
        const offset = (page - 1) * perPage;
        let items, total;
        if (occasion) {
          [items, total] = await Promise.all([
            db.prepare('SELECT * FROM ucapan WHERE occasion = ? ORDER BY id LIMIT ? OFFSET ?').bind(occasion, perPage, offset).all().then(r => r.results),
            db.prepare('SELECT COUNT(*) as c FROM ucapan WHERE occasion = ?').bind(occasion).first().then(r => r?.c || 0),
          ]);
        } else {
          [items, total] = await Promise.all([
            db.prepare('SELECT * FROM ucapan ORDER BY id LIMIT ? OFFSET ?').bind(perPage, offset).all().then(r => r.results),
            db.prepare('SELECT COUNT(*) as c FROM ucapan').first().then(r => r?.c || 0),
          ]);
        }
        const occasions = await db.prepare('SELECT occasion, COUNT(*) as c FROM ucapan GROUP BY occasion ORDER BY c DESC').all().then(r => r.results);
        return html(ucapanPage(items, occasions, { page, totalPages: Math.ceil(total / perPage), total, occasion }));
      }

      // ── Born Today (from our tokoh) ─────────────────────
      if (path === '/lahir-hari-ini') {
        const today = new Date();
        const md = `%-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
        const born = await db.prepare('SELECT * FROM authors WHERE birth_date LIKE ? AND length(birth_date) > 5 ORDER BY quote_count DESC').bind(md).all().then(r => r.results);
        const died = await db.prepare('SELECT * FROM authors WHERE death_date LIKE ? AND length(death_date) > 5 ORDER BY quote_count DESC').bind(md).all().then(r => r.results);
        return html(bornTodayPage(born, died, today));
      }

      // ── Quote Image Generator ──────────────────────────
      if (path === '/gambar' || path === '/gambar/') {
        return html(quoteImagePage());
      }

      if (path === '/api/quote-image' && method === 'POST') {
        try {
          const body = await request.json();
          const text = (body.text || '').substring(0, 200);
          const author = (body.author || '').substring(0, 50);
          if (!text) return json({ error: 'text required' }, 400);

          // Generate image using CF Workers AI
          const prompt = `Minimalist dark wallpaper, subtle gradient background, elegant and clean. No text, no letters, no words. Abstract gentle bokeh or nature blur. Dark moody aesthetic, 4K quality.`;
          const imgResult = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {
            prompt,
            width: 1200,
            height: 630,
            num_steps: 4,
          });

          // Return the raw image
          return new Response(imgResult, {
            headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400', ...SEC },
          });
        } catch (e) {
          return json({ error: 'Image generation failed: ' + e.message }, 500);
        }
      }

      // ── AI Pages ─────────────────────────────────────────
      if (path === '/tanya' || path === '/tanya/') {
        return html(tanyaPage());
      }
      if (path === '/ai' || path === '/ai/') {
        return html(aiGeneratePage());
      }

      // ── Legal Pages ──────────────────────────────────────
      if (path === '/privasi' || path === '/privacy') {
        return html(shell({
          title: 'Kebijakan Privasi',
          path: '/privasi',
          activeTab: '',
          body: privacyPage()
        }));
      }
      if (path === '/ketentuan' || path === '/terms') {
        return html(shell({
          title: 'Syarat & Ketentuan',
          path: '/ketentuan',
          activeTab: '',
          body: termsPage()
        }));
      }

      // Unsubscribe
      if (path === '/berhenti') {
        const email = url.searchParams.get('email') || '';
        const token = url.searchParams.get('token') || '';
        if (email && token) {
          await db.prepare('UPDATE subscribers SET active = 0, unsubscribed_at = datetime(\'now\') WHERE email = ? AND token = ?').bind(email, token).run();
        }
        return html(shell({
          title: 'Berhenti Langganan',
          path: '/berhenti',
          activeTab: '',
          body: '<div style="text-align:center;padding:60px 20px"><div style="font-size:48px;margin-bottom:12px">&#x1F44B;</div><h1 style="font-size:20px;margin-bottom:8px">Berhasil Berhenti</h1><p style="color:var(--muted);font-size:14px">Anda tidak akan menerima email harian lagi.</p><p style="margin-top:16px"><a href="/" style="color:var(--accent);text-decoration:none">&larr; Kembali</a></p></div>'
        }));
      }

      // Serve static assets
      if (env.ASSETS) {
        try {
          const assetResp = await env.ASSETS.fetch(new URL(path, url.origin));
          if (assetResp && assetResp.status === 200) return assetResp;
        } catch {}
      }

      // 404
      return html(notFoundPage(), 404);

    } catch (err) {
      console.error('Worker error:', err);
      return json({ error: 'Internal server error', detail: err.message }, 500);
    }
  },
};
