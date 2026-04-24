const fs = require('fs');
const https = require('https');
const authors = JSON.parse(fs.readFileSync('/tmp/enrich-authors-2.json', 'utf8'));
console.log(`Batch 2: ${authors.length} authors`);

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'BijaksanaBot/1.0' }, timeout: 15000 }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', reject).on('timeout', () => reject('timeout'));
  });
}
function esc(s) { return (s || '').replace(/'/g, "''"); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function getWikidata(name) {
  try {
    const search = JSON.parse(await fetch(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(name)}&language=en&type=item&limit=1&format=json`));
    if (!search.search?.[0]) return null;
    const id = search.search[0].id;
    const desc = search.search[0].description || '';
    await sleep(500);
    const entity = JSON.parse(await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${id}&props=claims&format=json`));
    const claims = entity.entities?.[id]?.claims || {};
    const getDate = (p) => { const v = claims[p]?.[0]?.mainsnak?.datavalue?.value; return v ? v.time?.replace('+','').split('T')[0] : ''; };
    return { birth_date: getDate('P569'), death_date: getDate('P570'), description: desc };
  } catch { return null; }
}

async function main() {
  const sql = [];
  let ok = 0, fail = 0;
  for (let i = 0; i < authors.length; i++) {
    const [name, slug] = authors[i];
    process.stdout.write(`[${i+1}/${authors.length}] ${name.substring(0,30).padEnd(30)} `);
    const data = await getWikidata(name);
    if (!data || !data.birth_date) { console.log('SKIP'); fail++; await sleep(800); continue; }
    const parts = [`birth_date='${data.birth_date}'`];
    if (data.death_date) parts.push(`death_date='${data.death_date}'`);
    if (data.description) parts.push(`occupation='${esc(data.description.substring(0,100))}'`);
    sql.push(`UPDATE authors SET ${parts.join(', ')} WHERE slug='${slug}';`);
    ok++; console.log(data.birth_date);
    await sleep(800);
  }
  fs.writeFileSync('/home/ucok/web/bijaksana.com/worker-cf/wikidata-2.sql', sql.join('\n'));
  console.log(`\nDone: ${ok} enriched, ${fail} skipped`);
}
main().catch(console.error);
