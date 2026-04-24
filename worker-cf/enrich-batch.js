#!/usr/bin/env node
// Batch enrich top authors with Wikipedia data
// Fetches: bio, birth/death dates, photo, occupation, birth/death place

const fs = require('fs');
const https = require('https');

const authors = JSON.parse(fs.readFileSync('/tmp/enrich-authors.json', 'utf8'));
console.log(`Enriching ${authors.length} authors`);

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'BijaksanaBot/1.0 (bijaksana.com)' }, timeout: 10000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetch(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject).on('timeout', () => reject(new Error('timeout')));
  });
}

function esc(s) { return (s || '').replace(/'/g, "''"); }

function cleanName(name) {
  // Remove "Kata-kata Bijak  dari  " prefix from JagoKata crawl
  return name.replace(/^Kata-kata Bijak\s+dari\s+/i, '').trim();
}

async function enrichAuthor(name, slug) {
  const cleanedName = cleanName(name);
  // Try Wikipedia REST API
  const searchName = encodeURIComponent(cleanedName.replace(/ /g, '_'));

  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${searchName}`);
    if (res.status !== 200) {
      // Try search
      const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(cleanedName)}&limit=1&format=json`);
      const searchData = JSON.parse(searchRes.body);
      if (searchData[1] && searchData[1][0]) {
        const title = searchData[1][0].replace(/ /g, '_');
        const retry = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
        if (retry.status !== 200) return null;
        var data = JSON.parse(retry.body);
      } else {
        return null;
      }
    } else {
      var data = JSON.parse(res.body);
    }

    const bio = (data.extract || '').substring(0, 500);
    const photo = data.thumbnail?.source || '';
    const desc = data.description || '';

    // Extract dates from description (common patterns: "1879-1955", "born 1984")
    let birthDate = '', deathDate = '', birthPlace = '', deathPlace = '';

    // Try to get from bio text
    const dateMatch = bio.match(/\((\d{1,2}\s+\w+\s+\d{4})\s*[-–]\s*(\d{1,2}\s+\w+\s+\d{4})\)/);
    const yearMatch = bio.match(/\((\d{4})\s*[-–]\s*(\d{4})\)/);
    const bornMatch = bio.match(/born\s+(\w+\s+\d{1,2},?\s+\d{4}|\d{4})/i);

    if (dateMatch) {
      birthDate = dateMatch[1];
      deathDate = dateMatch[2];
    } else if (yearMatch) {
      birthDate = yearMatch[1];
      deathDate = yearMatch[2];
    } else if (bornMatch) {
      birthDate = bornMatch[1];
    }

    // Extract birth place from bio
    const placeMatch = bio.match(/born\s+(?:in\s+)?(?:\w+\s+\d{1,2},?\s+\d{4}\s+)?(?:in\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:,\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)?)/i);
    if (placeMatch) birthPlace = placeMatch[1];

    return {
      cleanedName,
      bio, photo, desc,
      birthDate, deathDate, birthPlace, deathPlace,
    };
  } catch (e) {
    return null;
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const sql = [];
  const cleanNameSQL = [];
  let enriched = 0, failed = 0;

  for (let i = 0; i < authors.length; i++) {
    const [name, slug] = authors[i];
    const cleanedName = cleanName(name);

    // Fix dirty names from JagoKata crawl
    if (cleanedName !== name) {
      cleanNameSQL.push(`UPDATE authors SET name='${esc(cleanedName)}' WHERE slug='${slug}';`);
    }

    process.stdout.write(`[${i+1}/${authors.length}] ${cleanedName.substring(0,30)}... `);

    const data = await enrichAuthor(name, slug);
    if (!data) {
      console.log('SKIP');
      failed++;
      await sleep(200);
      continue;
    }

    const updates = [];
    if (data.bio) updates.push(`bio='${esc(data.bio)}'`);
    if (data.photo) updates.push(`photo_url='${esc(data.photo)}'`);
    if (data.desc) updates.push(`occupation='${esc(data.desc.substring(0,100))}'`);
    if (data.birthDate) updates.push(`birth_date='${esc(data.birthDate)}'`);
    if (data.deathDate) updates.push(`death_date='${esc(data.deathDate)}'`);
    if (data.birthPlace) updates.push(`birth_place='${esc(data.birthPlace)}'`);
    if (data.deathPlace) updates.push(`death_place='${esc(data.deathPlace)}'`);

    if (updates.length > 0) {
      sql.push(`UPDATE authors SET ${updates.join(', ')} WHERE slug='${slug}';`);
      enriched++;
      console.log(`OK (${data.birthDate || '?'})`);
    } else {
      console.log('NO DATA');
      failed++;
    }

    await sleep(300);
  }

  // Write SQL
  const allSQL = [...cleanNameSQL, ...sql];

  // Chunk into 200-line files
  const CHUNK = 200;
  for (let i = 0; i < allSQL.length; i += CHUNK) {
    const num = Math.floor(i / CHUNK) + 1;
    fs.writeFileSync(`/home/ucok/web/bijaksana.com/worker-cf/enrich-batch-${num}.sql`, allSQL.slice(i, i + CHUNK).join('\n'));
  }

  const chunks = Math.ceil(allSQL.length / CHUNK);
  console.log(`\nDone: ${enriched} enriched, ${failed} failed`);
  console.log(`Name fixes: ${cleanNameSQL.length}`);
  console.log(`SQL: ${chunks} chunk files (enrich-batch-*.sql)`);
}

main().catch(console.error);
