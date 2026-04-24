#!/usr/bin/env node
const fs = require('fs');
const https = require('https');

const authors = JSON.parse(fs.readFileSync('/tmp/enrich-authors.json', 'utf8'));
console.log(`Enriching ${authors.length} authors via Wikidata`);

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'BijaksanaBot/1.0' }, timeout: 10000 }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', reject).on('timeout', () => reject('timeout'));
  });
}

function esc(s) { return (s || '').replace(/'/g, "''"); }
function cleanName(n) { return n.replace(/^Kata-kata Bijak\s+dari\s+/i, '').trim(); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function getWikidata(name) {
  try {
    const search = JSON.parse(await fetch(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(name)}&language=en&type=item&limit=1&format=json`));
    if (!search.search?.[0]) return null;
    const id = search.search[0].id;
    const desc = search.search[0].description || '';

    const entity = JSON.parse(await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${id}&props=claims&format=json`));
    const claims = entity.entities?.[id]?.claims || {};

    const getDate = (p) => {
      const v = claims[p]?.[0]?.mainsnak?.datavalue?.value;
      return v ? v.time?.replace('+','').split('T')[0] : '';
    };

    const getPlace = async (p) => {
      const placeId = claims[p]?.[0]?.mainsnak?.datavalue?.value?.id;
      if (!placeId) return '';
      try {
        const place = JSON.parse(await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${placeId}&props=labels&languages=id,en&format=json`));
        const labels = place.entities?.[placeId]?.labels || {};
        return (labels.id || labels.en || {}).value || '';
      } catch { return ''; }
    };

    return {
      birth_date: getDate('P569'),
      death_date: getDate('P570'),
      birth_place: await getPlace('P19'),
      death_place: await getPlace('P20'),
      description: desc,
    };
  } catch { return null; }
}

async function main() {
  const sql = [];
  let ok = 0, fail = 0;

  for (let i = 0; i < authors.length; i++) {
    const [name, slug] = authors[i];
    const clean = cleanName(name);
    process.stdout.write(`[${i+1}/${authors.length}] ${clean.substring(0,30).padEnd(30)}  `);

    // Fix name if dirty
    if (clean !== name) {
      sql.push(`UPDATE authors SET name='${esc(clean)}' WHERE slug='${slug}';`);
    }

    const data = await getWikidata(clean);
    if (!data || !data.birth_date) {
      console.log('SKIP');
      fail++;
      await sleep(300);
      continue;
    }

    const parts = [];
    if (data.birth_date) parts.push(`birth_date='${data.birth_date}'`);
    if (data.death_date) parts.push(`death_date='${data.death_date}'`);
    if (data.birth_place) parts.push(`birth_place='${esc(data.birth_place)}'`);
    if (data.death_place) parts.push(`death_place='${esc(data.death_place)}'`);
    if (data.description) parts.push(`occupation='${esc(data.description.substring(0,100))}'`);

    sql.push(`UPDATE authors SET ${parts.join(', ')} WHERE slug='${slug}';`);
    ok++;
    console.log(`${data.birth_date} ${data.birth_place || ''}`);
    await sleep(400);
  }

  // Write chunked SQL
  const CHUNK = 200;
  for (let i = 0; i < sql.length; i += CHUNK) {
    const num = Math.floor(i / CHUNK) + 1;
    fs.writeFileSync(`/home/ucok/web/bijaksana.com/worker-cf/wikidata-${num}.sql`, sql.slice(i, i + CHUNK).join('\n'));
  }
  console.log(`\nDone: ${ok} enriched, ${fail} skipped, ${Math.ceil(sql.length/CHUNK)} SQL files`);
}

main().catch(console.error);
