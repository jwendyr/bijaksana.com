#!/usr/bin/env node
// Enrich authors with Wikidata: bio, birth/death dates, photo, wikipedia URL
// Uses Wikidata SPARQL endpoint (free, no API key needed)

const fs = require('fs');

// Get top authors from D1 export or hardcode the most important ones
// We'll generate SQL UPDATE statements

const AUTHORS = [
  // Indonesian
  { name: 'Soekarno', wiki: 'Sukarno' },
  { name: 'Buya Hamka', wiki: 'Hamka' },
  { name: 'Pramoedya Ananta Toer', wiki: 'Pramoedya_Ananta_Toer' },
  { name: 'Raden Adjeng Kartini', wiki: 'Kartini' },
  { name: 'Bacharuddin Jusuf Habibie', wiki: 'B._J._Habibie' },
  { name: 'Tere Liye', wiki: 'Tere_Liye_(author)' },
  { name: 'W.S. Rendra', wiki: 'W._S._Rendra' },
  { name: 'Soe Hok Gie', wiki: 'Soe_Hok_Gie' },
  { name: 'Emha Ainun Nadjib', wiki: 'Emha_Ainun_Nadjib' },
  { name: 'Tan Malaka', wiki: 'Tan_Malaka' },
  { name: 'Najwa Shihab', wiki: 'Najwa_Shihab' },
  { name: 'Joko Widodo', wiki: 'Joko_Widodo' },
  { name: 'Fiersa Besari', wiki: 'Fiersa_Besari' },
  { name: 'Raditya Dika', wiki: 'Raditya_Dika' },
  { name: 'Andrea Hirata', wiki: 'Andrea_Hirata' },
  { name: 'Sapardi Djoko Damono', wiki: 'Sapardi_Djoko_Damono' },
  { name: 'Chairul Tanjung', wiki: 'Chairul_Tanjung' },
  { name: 'Dahlan Iskan', wiki: 'Dahlan_Iskan' },
  { name: 'Gede Prama', wiki: null },
  { name: 'Boy Candra', wiki: null },
  { name: 'Merry Riana', wiki: 'Merry_Riana' },
  { name: 'Sujiwo Tejo', wiki: 'Sujiwo_Tejo' },
  { name: 'Dee Lestari', wiki: 'Dee_Lestari' },
  // International
  { name: 'Albert Einstein', wiki: 'Albert_Einstein' },
  { name: 'Mahatma Gandhi', wiki: 'Mahatma_Gandhi' },
  { name: 'Nelson Mandela', wiki: 'Nelson_Mandela' },
  { name: 'Martin Luther King Jr.', wiki: 'Martin_Luther_King_Jr.' },
  { name: 'Abraham Lincoln', wiki: 'Abraham_Lincoln' },
  { name: 'Winston Churchill', wiki: 'Winston_Churchill' },
  { name: 'Mark Twain', wiki: 'Mark_Twain' },
  { name: 'Oscar Wilde', wiki: 'Oscar_Wilde' },
  { name: 'William Shakespeare', wiki: 'William_Shakespeare' },
  { name: 'Aristoteles', wiki: 'Aristotle' },
  { name: 'Plato', wiki: 'Plato' },
  { name: 'Socrates', wiki: 'Socrates' },
  { name: 'Konfusius', wiki: 'Confucius' },
  { name: 'Lao Tzu', wiki: 'Laozi' },
  { name: 'Jalaluddin Rumi', wiki: 'Rumi' },
  { name: 'Khalil Gibran', wiki: 'Kahlil_Gibran' },
  { name: 'Marcus Aurelius', wiki: 'Marcus_Aurelius' },
  { name: 'Leonardo da Vinci', wiki: 'Leonardo_da_Vinci' },
  { name: 'Buddha', wiki: 'Gautama_Buddha' },
  { name: 'Bunda Teresa', wiki: 'Mother_Teresa' },
  { name: 'Helen Keller', wiki: 'Helen_Keller' },
  { name: 'Steve Jobs', wiki: 'Steve_Jobs' },
  { name: 'Bob Marley', wiki: 'Bob_Marley' },
  { name: 'Charlie Chaplin', wiki: 'Charlie_Chaplin' },
  { name: 'Bruce Lee', wiki: 'Bruce_Lee' },
  { name: 'Pablo Picasso', wiki: 'Pablo_Picasso' },
  { name: 'Friedrich Nietzsche', wiki: 'Friedrich_Nietzsche' },
  { name: 'Leo Tolstoy', wiki: 'Leo_Tolstoy' },
  { name: 'Victor Hugo', wiki: 'Victor_Hugo' },
  { name: 'Ali bin Abi Thalib', wiki: 'Ali' },
  { name: 'Dale Carnegie', wiki: 'Dale_Carnegie' },
  { name: 'Oprah Winfrey', wiki: 'Oprah_Winfrey' },
  { name: 'Walt Disney', wiki: 'Walt_Disney' },
  { name: 'Thomas Edison', wiki: 'Thomas_Edison' },
  { name: 'Benjamin Franklin', wiki: 'Benjamin_Franklin' },
  { name: 'Muhammad Ali', wiki: 'Muhammad_Ali' },
  { name: 'Maya Angelou', wiki: 'Maya_Angelou' },
  { name: 'Ralph Waldo Emerson', wiki: 'Ralph_Waldo_Emerson' },
  { name: 'Albert Camus', wiki: 'Albert_Camus' },
  { name: 'Voltaire', wiki: 'Voltaire' },
];

function esc(s) { return (s || '').replace(/'/g, "''"); }

async function fetchWikiData(wikiTitle) {
  // Use Wikipedia REST API for summary + image
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      bio: data.extract || '',
      photo: data.thumbnail?.source || data.originalimage?.source || '',
      description: data.description || '',
    };
  } catch (e) {
    return null;
  }
}

async function fetchWikiDates(wikiTitle) {
  // Use Wikidata SPARQL for birth/death dates
  const sparql = `
    SELECT ?birth ?death ?occupation WHERE {
      ?item wdt:P31 wd:Q5 .
      ?article schema:about ?item ;
               schema:isPartOf <https://en.wikipedia.org/> ;
               schema:name "${wikiTitle.replace(/_/g, ' ')}"@en .
      OPTIONAL { ?item wdt:P569 ?birth }
      OPTIONAL { ?item wdt:P570 ?death }
      OPTIONAL { ?item wdt:P106/rdfs:label ?occupation . FILTER(LANG(?occupation) = "en") }
    } LIMIT 1
  `;
  try {
    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': 'BijaksanaBot/1.0' } });
    if (!res.ok) return null;
    const data = await res.json();
    const result = data.results?.bindings?.[0];
    if (!result) return null;
    return {
      birth: result.birth?.value?.split('T')[0] || '',
      death: result.death?.value?.split('T')[0] || '',
      occupation: result.occupation?.value || '',
    };
  } catch (e) {
    return null;
  }
}

async function main() {
  const lines = [];
  let success = 0;
  let fail = 0;

  for (const author of AUTHORS) {
    if (!author.wiki) {
      console.log(`  SKIP: ${author.name} (no wiki)`);
      fail++;
      continue;
    }

    process.stdout.write(`  Fetching: ${author.name}... `);

    const [wikiData, wikiDates] = await Promise.all([
      fetchWikiData(author.wiki),
      fetchWikiDates(author.wiki),
    ]);

    if (!wikiData) {
      console.log('FAIL (no wiki data)');
      fail++;
      continue;
    }

    const bio = (wikiData.bio || '').substring(0, 500);
    const photo = wikiData.photo || '';
    const birth = wikiDates?.birth || '';
    const death = wikiDates?.death || '';
    const occupation = wikiDates?.occupation || wikiData.description || '';
    const wikiUrl = `https://en.wikipedia.org/wiki/${author.wiki}`;

    lines.push(`UPDATE authors SET bio='${esc(bio)}', photo_url='${esc(photo)}', birth_date='${birth}', death_date='${death}', occupation='${esc(occupation)}', wikipedia_url='${esc(wikiUrl)}' WHERE name='${esc(author.name)}';`);
    console.log(`OK (${birth || '?'} - ${death || 'alive'})`);
    success++;

    // Rate limit
    await new Promise(r => setTimeout(r, 200));
  }

  fs.writeFileSync('/home/ucok/web/bijaksana.com/worker-cf/enrich-authors.sql', lines.join('\n'));
  console.log(`\nDone: ${success} enriched, ${fail} skipped`);
  console.log(`SQL: enrich-authors.sql (${lines.length} UPDATE statements)`);
}

main().catch(console.error);
