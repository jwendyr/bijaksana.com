// Bijaksana — HTML Templates (Pre-rendered, SEO-optimized)
// Native app feel: bottom nav, swipe categories, skeleton loading

const SITE = 'https://bijaksana.com';
const SITE_NAME = 'Bijaksana';
const SITE_DESC = 'Kata-kata bijak dan mutiara terbaik dari tokoh-tokoh terkenal dunia dan Indonesia. Inspirasi harian untuk hidup lebih bermakna.';

// ── Shared Layout Shell ────────────────────────────────────────
export function shell({ title, description, path, body, canonical, ogImage, jsonLd, activeTab }) {
  const fullTitle = title === 'Beranda' ? `${SITE_NAME} — Kata Bijak & Mutiara Harian` : `${title} — ${SITE_NAME}`;
  const desc = description || SITE_DESC;
  const can = canonical || `${SITE}${path || '/'}`;
  const og = ogImage || `${SITE}/og-image.png`;

  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${fullTitle}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${can}">
<meta property="og:title" content="${fullTitle}">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="website">
<meta property="og:url" content="${can}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:locale" content="id_ID">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${fullTitle}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${og}">
<meta name="theme-color" content="#f59e0b">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="manifest" href="/manifest.json">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="alternate" hreflang="id" href="${can}">
<link rel="alternate" hreflang="x-default" href="${can}">
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
<style>@view-transition{navigation:auto}::view-transition-old(root){animation:fade-out .2s ease}::view-transition-new(root){animation:fade-in .2s ease}@keyframes fade-out{from{opacity:1}to{opacity:0}}@keyframes fade-in{from{opacity:0}to{opacity:1}}</style>
<script type="speculationrules">{"prerender":[{"where":{"href_matches":"/*"},"eagerness":"moderate"}]}</script>
<style>${CSS}</style>
</head>
<body>
<header class="topbar" id="topbar">
  <a href="/" class="topbar-brand" aria-label="Beranda">
    <span class="topbar-icon">&#x1FAB7;</span>
    <span class="topbar-name">Bijaksana</span>
  </a>
  <nav class="desknav">
    <a href="/" class="desknav-link${activeTab === 'home' ? ' active' : ''}">Beranda</a>
    <a href="/kategori" class="desknav-link${activeTab === 'kategori' ? ' active' : ''}">Kata Bijak</a>
    <a href="/tokoh" class="desknav-link${activeTab === 'tokoh' ? ' active' : ''}">Tokoh</a>
    <a href="/arti-kata" class="desknav-link${activeTab === 'kamus' ? ' active' : ''}">Kamus</a>
    <a href="/peribahasa" class="desknav-link">Peribahasa</a>
    <a href="/puisi" class="desknav-link">Puisi</a>
    <a href="/tesaurus" class="desknav-link">Tesaurus</a>
    <div class="desknav-dropdown">
      <a href="#" class="desknav-link" onclick="event.preventDefault();this.parentElement.classList.toggle('open')">Lainnya &#x25BE;</a>
      <div class="desknav-menu">
        <div class="desknav-group-label">Kamus</div>
        <a href="/arti-kata">KBBI</a>
        <a href="/tesaurus">Sinonim & Antonim</a>
        <a href="/slang">Bahasa Gaul</a>
        <a href="/idiom">Idiom</a>
        <div class="desknav-group-label" style="margin-top:6px">Sastra</div>
        <a href="/puisi">Puisi</a>
        <a href="/pantun">Pantun</a>
        <a href="/peribahasa">Peribahasa</a>
        <a href="/kisah">Kisah Bijaksana</a>
        <a href="/ucapan">Ucapan</a>
        <div class="desknav-group-label" style="margin-top:6px">AI</div>
        <a href="/tanya">Tanya Bijaksana</a>
        <a href="/ai">AI Generator</a>
        <a href="/gambar">Buat Gambar Quote</a>
        <div class="desknav-group-label" style="margin-top:6px">Fitur</div>
        <a href="/wordle">Tebak Kata</a>
        <a href="/hari-ini">Kata Bijak Hari Ini</a>
        <a href="/lahir-hari-ini">Lahir Hari Ini</a>
        <a href="/populer">Populer</a>
        <a href="/acak">Acak</a>
      </div>
    </div>
  </nav>
  <div class="topbar-right">
    <button class="topbar-search" onclick="toggleDark()" aria-label="Mode Gelap" id="darkBtn" style="font-size:16px">&#x1F319;</button>
    <div class="desk-search-wrap">
      <svg class="desk-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      <input type="search" class="desk-search-input" id="deskSearchInput" placeholder="Cari kata bijak..." autocomplete="off">
      <div class="desk-search-dropdown" id="deskSearchDropdown"></div>
    </div>
    <button class="topbar-search" onclick="toggleSearch()" aria-label="Cari">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
    </button>
  </div>
</header>

<div class="search-overlay" id="searchOverlay">
  <div class="search-box">
    <input type="search" id="searchInput" placeholder="Cari kata bijak..." autocomplete="off" enterkeyhint="search">
    <button onclick="toggleSearch()" class="search-close" aria-label="Tutup">&times;</button>
  </div>
  <div id="searchResults" class="search-results"></div>
</div>

<main class="main" id="main">
${body}
</main>

<nav class="bottomnav" id="bottomnav">
  <a href="/" class="nav-tab${activeTab === 'home' ? ' active' : ''}" aria-label="Beranda">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    <span>Beranda</span>
  </a>
  <a href="/kategori" class="nav-tab${activeTab === 'kategori' ? ' active' : ''}" aria-label="Kategori">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
    <span>Kategori</span>
  </a>
  <a href="/arti-kata" class="nav-tab${activeTab === 'kamus' ? ' active' : ''}" aria-label="Kamus">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
    <span>Kamus</span>
  </a>
  <a href="/tokoh" class="nav-tab${activeTab === 'tokoh' ? ' active' : ''}" aria-label="Tokoh">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    <span>Tokoh</span>
  </a>
  <a href="/acak" class="nav-tab${activeTab === 'acak' ? ' active' : ''}" aria-label="Acak">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
    <span>Acak</span>
  </a>
</nav>

<script>${JS}</script>
</body>
</html>`;
}

// ── CSS ──────────────────────────────────────────────────────
const CSS = `
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#0a0a0b;--bg2:#111113;--bg3:#18181b;
  --border:#222225;--text:#fafafa;--muted:#a1a1aa;--dim:#71717a;
  --accent:#f59e0b;--accent2:#f97316;
  --grad:linear-gradient(135deg,#f59e0b,#f97316);
  --sans:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
  --serif:Georgia,'Times New Roman',serif;
  --safe-b:env(safe-area-inset-bottom,0px);
  --nav-h:64px;--top-h:52px;
}
html{height:100%;-webkit-text-size-adjust:100%;overflow-x:hidden}
body{font-family:var(--sans);background:var(--bg);color:var(--text);
  min-height:100%;display:flex;flex-direction:column;
  -webkit-font-smoothing:antialiased;overflow-x:hidden;
  padding-top:var(--top-h);padding-bottom:calc(var(--nav-h) + var(--safe-b));
  word-wrap:break-word;overflow-wrap:break-word;
}

/* Topbar */
.topbar{position:fixed;top:0;left:0;right:0;height:var(--top-h);z-index:90;
  display:flex;align-items:center;justify-content:space-between;padding:0 16px;
  background:rgba(10,10,11,.92);backdrop-filter:blur(12px);
  border-bottom:1px solid var(--border);
  transition:transform .3s ease}
.topbar.hide{transform:translateY(-100%)}
.topbar-brand{display:flex;align-items:center;gap:8px;text-decoration:none;color:var(--text)}
.topbar-icon{font-size:24px}
.topbar-name{font-size:17px;font-weight:700;
  background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.topbar-right{display:flex;align-items:center;gap:8px}
.topbar-search{background:none;border:none;color:var(--muted);cursor:pointer;padding:8px;
  border-radius:50%;transition:background .2s}
.topbar-search:active{background:var(--bg3)}

/* Desktop nav — hidden on mobile */
.desknav{display:none}
.desknav-link{color:var(--muted);text-decoration:none;font-size:14px;font-weight:500;
  padding:6px 14px;border-radius:8px;transition:all .2s;white-space:nowrap}
.desknav-link:hover{color:var(--text);background:var(--bg3)}
.desknav-link.active{color:var(--accent);background:rgba(245,158,11,.08)}

/* Desktop dropdown menu */
.desknav-dropdown{position:relative;display:none}
.desknav-menu{display:none;position:absolute;top:100%;left:0;background:var(--bg2);border:1px solid var(--border);
  border-radius:12px;padding:8px 0;min-width:180px;z-index:120;box-shadow:0 8px 30px rgba(0,0,0,.4);margin-top:8px}
.desknav-dropdown.open .desknav-menu{display:block}
.desknav-menu a{display:block;padding:10px 16px;color:var(--muted);text-decoration:none;font-size:13px;
  font-weight:500;transition:all .15s}
.desknav-menu a:hover{color:var(--accent);background:rgba(245,158,11,.05)}
.desknav-group-label{padding:6px 16px 2px;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;
  color:var(--dim);font-weight:700}

/* Desktop inline search — hidden on mobile */
.desk-search-wrap{display:none;position:relative}
.desk-search-input{padding:8px 12px 8px 34px;background:var(--bg3);
  border:1px solid var(--border);border-radius:10px;color:var(--text);
  font-size:13px;font-family:var(--sans);outline:none;width:240px;transition:all .2s}
.desk-search-input:focus{border-color:var(--accent);width:320px}
.desk-search-input::placeholder{color:var(--dim)}
.desk-search-icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);
  color:var(--dim);pointer-events:none}
.desk-search-dropdown{position:absolute;top:calc(100% + 6px);left:0;right:0;
  background:var(--bg2);border:1px solid var(--border);border-radius:12px;
  max-height:400px;overflow-y:auto;display:none;z-index:120;
  box-shadow:0 12px 40px rgba(0,0,0,.5)}
.desk-search-dropdown.open{display:block}

/* Bottom Nav — mobile only */
.bottomnav{position:fixed;bottom:0;left:0;right:0;z-index:90;
  height:calc(var(--nav-h) + var(--safe-b));
  padding-bottom:var(--safe-b);
  display:flex;align-items:stretch;
  background:rgba(10,10,11,.95);backdrop-filter:blur(12px);
  border-top:1px solid var(--border)}
.nav-tab{flex:1;display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:3px;text-decoration:none;
  color:var(--dim);font-size:10px;font-weight:500;
  transition:color .2s;-webkit-tap-highlight-color:transparent;
  min-height:48px}
.nav-tab.active{color:var(--accent)}
.nav-tab:active{color:var(--accent)}
.nav-tab svg{transition:transform .15s}
.nav-tab:active svg{transform:scale(.9)}

/* Search */
.search-overlay{position:fixed;inset:0;z-index:100;
  background:rgba(0,0,0,.85);backdrop-filter:blur(6px);
  display:none;flex-direction:column;padding:12px 16px}
.search-overlay.open{display:flex}
.search-box{display:flex;gap:8px;align-items:center}
.search-box input{flex:1;padding:14px 16px;background:var(--bg2);
  border:1px solid var(--border);border-radius:14px;color:var(--text);
  font-size:16px;font-family:var(--sans);outline:none}
.search-box input:focus{border-color:var(--accent)}
.search-close{background:none;border:none;color:var(--muted);font-size:28px;
  cursor:pointer;padding:8px;min-width:44px;min-height:44px;
  display:flex;align-items:center;justify-content:center}
.search-results{margin-top:16px;overflow-y:auto;flex:1}
.search-item{display:block;padding:14px 16px;background:var(--bg2);
  border:1px solid var(--border);border-radius:12px;margin-bottom:8px;
  text-decoration:none;color:var(--text);transition:border-color .2s}
.search-item:active{border-color:var(--accent)}
.search-item-quote{font-style:italic;font-size:14px;line-height:1.5;
  color:var(--muted);display:-webkit-box;-webkit-line-clamp:2;
  -webkit-box-orient:vertical;overflow:hidden}
.search-item-author{font-size:12px;color:var(--accent);margin-top:4px;font-weight:500}

/* Main */
.main{flex:1;padding:16px;max-width:720px;margin:0 auto;width:100%}

/* Section titles */
.section-title{font-size:14px;font-weight:600;color:var(--muted);
  text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px;
  display:flex;align-items:center;gap:8px}
.section-title .icon{font-size:16px}

/* Horizontal scroll strip with arrows */
.hscroll-wrap{position:relative}
.hscroll{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;
  -webkit-overflow-scrolling:touch;padding:2px 0 12px;
  scrollbar-width:none;-ms-overflow-style:none;scroll-behavior:smooth}
.hscroll::-webkit-scrollbar{display:none}
.hscroll-arrow{display:none;position:absolute;top:50%;transform:translateY(-50%);
  width:36px;height:36px;border-radius:50%;background:rgba(17,17,19,.9);border:1px solid var(--border);
  color:var(--muted);font-size:16px;cursor:pointer;z-index:5;
  align-items:center;justify-content:center;backdrop-filter:blur(4px)}
.hscroll-arrow:hover{color:var(--accent);border-color:var(--accent)}
.hscroll-arrow.left{left:-4px}
.hscroll-arrow.right{right:-4px}
/* On desktop: wrap A-Z chips instead of scroll */
@media(min-width:768px){
  .hscroll.wrap-desktop{flex-wrap:wrap;overflow-x:visible;scroll-snap-type:none}
  .hscroll-arrow{display:flex}
  .hscroll.wrap-desktop+.hscroll-arrow,.hscroll.wrap-desktop~.hscroll-arrow{display:none}
}

/* Category chips */
.cat-chip{flex-shrink:0;scroll-snap-align:start;
  padding:10px 18px;border-radius:24px;
  background:var(--bg2);border:1px solid var(--border);
  color:var(--muted);font-size:13px;font-weight:500;
  text-decoration:none;white-space:nowrap;
  transition:all .2s;display:flex;align-items:center;gap:6px}
.cat-chip:active,.cat-chip.active{
  background:rgba(245,158,11,.1);border-color:var(--accent);color:var(--accent)}
.cat-chip .chip-icon{font-size:15px}
.cat-chip .chip-count{font-size:11px;color:var(--dim)}

/* Quote card */
.qcard{background:var(--bg2);border:1px solid var(--border);border-radius:16px;
  padding:24px 20px;margin-bottom:14px;position:relative;overflow:hidden;
  transition:border-color .2s}
.qcard::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:var(--grad);opacity:.6}
.qcard:active{border-color:rgba(245,158,11,.3)}
.qcard-deco{font-size:36px;line-height:1;opacity:.4;
  background:var(--grad);-webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;font-family:var(--serif);
  user-select:none;margin-bottom:-4px}
.qcard-text{font-family:var(--serif);font-size:18px;font-style:italic;
  line-height:1.65;color:var(--text);margin-bottom:14px}
.qcard-text a{color:inherit;text-decoration:none}
.qcard-header{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.qcard-avatar{width:36px;height:36px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid var(--border)}
.qcard-avatar-letter{width:36px;height:36px;border-radius:50%;background:var(--bg3);
  display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;
  color:var(--accent);flex-shrink:0;border:2px solid var(--border)}
.qcard-author-name{font-size:14px;font-weight:600;line-height:1.2}
.qcard-author-name a{color:var(--text);text-decoration:none}
.qcard-cat-inline{font-size:11px;color:var(--accent);text-decoration:none}
.qcard-author{font-size:13px;color:var(--accent);font-weight:500;
  display:flex;align-items:center;gap:6px}
.qcard-author::before{content:'';width:16px;height:1.5px;background:var(--grad);display:inline-block}
.qcard-author a{color:inherit;text-decoration:none}
.qcard-cat{display:inline-block;margin-top:10px;padding:3px 10px;
  border-radius:20px;font-size:11px;font-weight:500;
  background:rgba(245,158,11,.08);color:var(--accent);
  text-decoration:none}
.qcard-actions{display:flex;gap:8px;margin-top:14px;padding-top:14px;
  border-top:1px solid var(--border)}
.qcard-btn{flex:1;padding:10px;border:1px solid var(--border);border-radius:10px;
  background:transparent;color:var(--muted);font-size:12px;font-weight:500;
  font-family:var(--sans);cursor:pointer;display:flex;align-items:center;
  justify-content:center;gap:5px;transition:all .2s;min-height:44px}
.qcard-btn:active{background:var(--bg3);border-color:var(--accent);color:var(--accent)}

/* Meaning/reflection block */
.qcard-meaning{margin-top:14px;padding-top:14px;border-top:1px solid var(--border)}
.qcard-meaning-label{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;
  color:var(--dim);margin-bottom:6px;font-weight:600}
.qcard-meaning-text{font-size:14px;color:var(--muted);line-height:1.7}

/* Author card */
.author-card{display:flex;align-items:center;gap:14px;
  padding:14px;background:var(--bg2);border:1px solid var(--border);
  border-radius:14px;text-decoration:none;color:var(--text);
  margin-bottom:10px;transition:border-color .2s}
.author-card:active{border-color:var(--accent)}
.author-avatar{width:44px;height:44px;border-radius:50%;
  background:var(--bg3);display:flex;align-items:center;justify-content:center;
  font-size:20px;font-weight:700;color:var(--accent);flex-shrink:0}
.author-photo{width:48px;height:48px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid var(--border)}
.author-hero{display:flex;align-items:center;gap:16px;margin-bottom:16px}
.author-hero-photo{width:80px;height:80px;border-radius:50%;object-fit:cover;flex-shrink:0;border:3px solid var(--border)}
.author-info{flex:1;min-width:0}
.author-name{font-size:15px;font-weight:600}
.author-meta{font-size:12px;color:var(--dim);margin-top:2px}

/* Category grid */
.cat-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
.cat-card{padding:18px 14px;background:var(--bg2);border:1px solid var(--border);
  border-radius:14px;text-decoration:none;color:var(--text);text-align:center;
  transition:all .2s}
.cat-card:active{border-color:var(--accent);background:rgba(245,158,11,.03)}
.cat-card-icon{font-size:28px;margin-bottom:6px}
.cat-card-name{font-size:14px;font-weight:600}
.cat-card-count{font-size:11px;color:var(--dim);margin-top:2px}

/* Single quote page */
.single-hero{text-align:center;padding:24px 0 8px}
.single-deco{font-size:56px;line-height:1;opacity:.5;
  background:var(--grad);-webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;font-family:var(--serif);margin-bottom:8px}
.single-text{font-family:var(--serif);font-size:22px;font-style:italic;
  line-height:1.65;color:var(--text);margin-bottom:16px}
.single-author{font-size:15px;color:var(--accent);font-weight:500}
.single-section{margin-top:24px}
.single-section h2{font-size:16px;font-weight:600;margin-bottom:10px;
  color:var(--muted);display:flex;align-items:center;gap:6px}

/* Breadcrumb */
.breadcrumb{display:flex;flex-wrap:wrap;gap:4px;font-size:12px;color:var(--dim);margin-bottom:16px}
.breadcrumb a{color:var(--dim);text-decoration:none}
.breadcrumb a:hover{color:var(--accent)}
.breadcrumb span{color:var(--dim)}

/* Share fab */
.share-fab{position:fixed;bottom:calc(var(--nav-h) + var(--safe-b) + 16px);right:16px;
  width:52px;height:52px;border-radius:50%;background:var(--grad);
  border:none;color:white;font-size:20px;cursor:pointer;
  box-shadow:0 4px 20px rgba(245,158,11,.3);z-index:50;
  display:flex;align-items:center;justify-content:center;
  transition:transform .2s}
.share-fab:active{transform:scale(.92)}

/* Toast */
.toast{position:fixed;bottom:calc(var(--nav-h) + var(--safe-b) + 16px);left:50%;
  transform:translateX(-50%) translateY(100px);
  padding:12px 24px;border-radius:12px;background:var(--bg2);
  border:1px solid var(--border);color:var(--text);font-size:13px;
  font-weight:500;z-index:200;transition:transform .3s ease;
  white-space:nowrap}
.toast.show{transform:translateX(-50%) translateY(0)}

/* Skeleton */
.skel{background:linear-gradient(90deg,var(--bg3) 25%,var(--border) 50%,var(--bg3) 75%);
  background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:8px}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
.skel-line{height:16px;margin-bottom:8px;border-radius:4px}
.skel-line.w60{width:60%}.skel-line.w80{width:80%}.skel-line.w40{width:40%}

/* Animations */
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.fade-up{animation:fadeUp .4s ease-out both}

/* Subscribe */
.sub-card{background:var(--bg2);border:1px solid var(--border);border-radius:16px;
  padding:24px 20px;text-align:center;margin-top:24px}
.sub-card h3{font-size:17px;font-weight:700;
  background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
  margin-bottom:6px}
.sub-card p{color:var(--muted);font-size:13px;line-height:1.6;margin-bottom:16px}
.sub-form{display:flex;gap:8px}
.sub-form input{flex:1;min-width:0;padding:12px 14px;background:var(--bg);
  border:1px solid var(--border);border-radius:12px;color:var(--text);
  font-size:14px;font-family:var(--sans);outline:none}
.sub-form input:focus{border-color:var(--accent)}
.sub-form button{padding:12px 20px;border:none;border-radius:12px;
  background:var(--grad);color:white;font-size:14px;font-weight:600;
  cursor:pointer;white-space:nowrap;font-family:var(--sans);min-height:48px}
.sub-msg{margin-top:8px;font-size:12px;min-height:16px}
.sub-msg.ok{color:#22c55e}.sub-msg.err{color:#ef4444}

/* Footer */
.footer{text-align:center;padding:32px 16px 16px;color:var(--dim);font-size:11px;line-height:1.8}
.footer a{color:var(--accent);text-decoration:none}

@media(min-width:640px){
  .cat-grid{grid-template-columns:repeat(3,1fr)}
  .qcard-text{font-size:20px}
  .single-text{font-size:26px}
}

/* ── DESKTOP LAYOUT (768px+) ──────────────────────── */
@media(min-width:768px){
  /* Remove mobile bottom padding, no bottom nav */
  body{padding-bottom:0}

  /* Hide bottom nav on desktop */
  .bottomnav{display:none!important}

  /* Hide mobile search button, show desktop search + nav */
  .topbar-search{display:none}
  .desknav{display:flex;align-items:center;gap:4px}
  .desknav-dropdown{display:block}
  .desk-search-wrap{display:block}

  /* Expand topbar to proper web header */
  .topbar{height:60px;padding:0 32px;justify-content:flex-start;gap:24px;
    transition:none}
  .topbar.hide{transform:none}
  .topbar-brand{flex-shrink:0}
  .topbar-icon{font-size:28px}
  .topbar-name{font-size:20px}
  .topbar-right{margin-left:auto}

  /* Wider main content */
  .main{max-width:900px;padding:32px 40px}
  .cat-grid{grid-template-columns:repeat(4,1fr)}

  /* Quote cards: hover instead of active */
  .qcard:hover{border-color:rgba(245,158,11,.3)}
  .qcard-btn:hover{background:var(--bg3);border-color:var(--accent);color:var(--accent)}
  .cat-chip:hover{background:rgba(245,158,11,.1);border-color:var(--accent);color:var(--accent)}
  .author-card:hover{border-color:var(--accent)}
  .cat-card:hover{border-color:var(--accent);background:rgba(245,158,11,.03)}
  .search-item:hover{border-color:var(--accent)}

  /* Search overlay also gets nicer desktop treatment */
  .search-overlay{padding:60px;align-items:center}
  .search-box{max-width:560px;width:100%}
  .search-results{max-width:560px;width:100%}

  /* Toast position without bottom nav */
  .toast{bottom:32px}
  .share-fab{bottom:32px}

  /* Larger quote text on desktop */
  .qcard-text{font-size:20px}
  .single-text{font-size:28px}
  .single-deco{font-size:72px}
  .single-hero{padding:40px 0 16px}

  /* Better subscribe card on desktop */
  .sub-card{max-width:480px;margin-left:auto;margin-right:auto;padding:32px}

  /* Footer wider */
  .footer{padding:40px 32px 24px}
}

/* ── WIDE DESKTOP (1100px+) ──────────────────────── */
@media(min-width:1100px){
  .main{max-width:1060px}

  /* 2-column quote grid on homepage */
  .quotes-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
  .quotes-grid .qcard{margin-bottom:0}

  .cat-grid{grid-template-columns:repeat(5,1fr)}

  /* Author cards 2 columns */
  .authors-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
  .authors-grid .author-card{margin-bottom:0}

  .desk-search-input{width:300px}
  .desk-search-input:focus{width:400px}
}
`;

// ── Client JS ──────────────────────────────────────────────────
const JS = `
// Auto-hide topbar on scroll (mobile only)
let lastY=0,topbar=document.getElementById('topbar');
const isMobile=()=>window.innerWidth<768;
window.addEventListener('scroll',()=>{
  if(!isMobile())return;
  const y=window.scrollY;
  if(y>lastY&&y>80)topbar.classList.add('hide');
  else topbar.classList.remove('hide');
  lastY=y;
},{passive:true});

// Search
function toggleSearch(){
  const o=document.getElementById('searchOverlay');
  o.classList.toggle('open');
  if(o.classList.contains('open')){
    const inp=document.getElementById('searchInput');
    inp.focus();inp.value='';
    document.getElementById('searchResults').innerHTML='';
  }
}
let searchTimer;
document.getElementById('searchInput')?.addEventListener('input',function(e){
  clearTimeout(searchTimer);
  const q=e.target.value.trim();
  if(q.length<2){document.getElementById('searchResults').innerHTML='';return}
  searchTimer=setTimeout(()=>{
    fetch('/api/search?q='+encodeURIComponent(q))
      .then(r=>r.json()).then(d=>{
        document.getElementById('searchResults').innerHTML=
          d.results.map(r=>'<a class="search-item" href="/kata-bijak/'+r.slug+'">'
            +'<div class="search-item-quote">'+esc(r.text)+'</div>'
            +'<div class="search-item-author">'+esc(r.author)+'</div></a>').join('')
          ||(q?'<div style="text-align:center;color:var(--dim);padding:32px">Tidak ditemukan</div>':'');
      });
  },300);
});
document.getElementById('searchInput')?.addEventListener('keydown',function(e){
  if(e.key==='Escape')toggleSearch();
});

// Share
function shareQuote(text,author){
  const t='"'+text+'"\\n\\u2014 '+author+'\\n\\n\\ud83e\\udeb7 bijaksana.com';
  if(navigator.share)navigator.share({text:t}).catch(()=>copyText(t));
  else copyText(t);
}
function copyText(t){
  navigator.clipboard.writeText(t).then(()=>showToast('Tersalin!')).catch(()=>{});
}
function showToast(msg){
  let el=document.getElementById('toast');
  if(!el){el=document.createElement('div');el.id='toast';el.className='toast';document.body.appendChild(el)}
  el.textContent=msg;el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'),2000);
}

// Vote
function voteQuote(id,val,btn){
  fetch('/api/vote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,value:val})})
    .then(r=>r.json()).then(d=>{if(d.success){btn.innerHTML='\\u{1F44D} '+d.likes;showToast('Terima kasih!')}});
}

// WhatsApp share
function waShare(text,author){
  const t=encodeURIComponent('"'+text+'"\\n\\u2014 '+author+'\\n\\n\\ud83e\\udeb7 bijaksana.com');
  window.open('https://wa.me/?text='+t,'_blank');
}

// Subscribe
async function handleSub(e){
  e.preventDefault();
  const inp=document.getElementById('subEmail'),btn=document.getElementById('subBtn'),
    msg=document.getElementById('subMsg'),email=inp.value.trim();
  if(!email)return;
  btn.disabled=true;btn.textContent='...';msg.textContent='';msg.className='sub-msg';
  try{
    const r=await fetch('/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})});
    const d=await r.json();
    if(r.ok){msg.textContent=d.message||'Berhasil!';msg.className='sub-msg ok';inp.value=''}
    else{msg.textContent=d.error||'Gagal';msg.className='sub-msg err'}
  }catch{msg.textContent='Gagal. Coba lagi.';msg.className='sub-msg err'}
  btn.disabled=false;btn.textContent='Langganan';
}
function esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML}

// Dark mode
function toggleDark(){
  const h=document.documentElement;
  const isDark=h.style.getPropertyValue('--bg')==='#fafafa';
  if(isDark){
    h.style.setProperty('--bg','#0a0a0b');h.style.setProperty('--bg2','#111113');h.style.setProperty('--bg3','#18181b');
    h.style.setProperty('--border','#222225');h.style.setProperty('--text','#fafafa');h.style.setProperty('--muted','#a1a1aa');h.style.setProperty('--dim','#71717a');
    localStorage.setItem('bijak-theme','dark');document.getElementById('darkBtn').textContent='\\u{1F319}';
  }else{
    h.style.setProperty('--bg','#fafafa');h.style.setProperty('--bg2','#ffffff');h.style.setProperty('--bg3','#f4f4f5');
    h.style.setProperty('--border','#e4e4e7');h.style.setProperty('--text','#18181b');h.style.setProperty('--muted','#52525b');h.style.setProperty('--dim','#a1a1aa');
    localStorage.setItem('bijak-theme','light');document.getElementById('darkBtn').textContent='\\u{2600}';
  }
}
(function(){var t=localStorage.getItem('bijak-theme');if(t==='light')toggleDark()})();

// Kindle-style word popup dictionary
(function(){
  var popup=null;
  function createPopup(){
    popup=document.createElement('div');
    popup.style.cssText='display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:300;background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:16px 18px;max-width:340px;width:90vw;box-shadow:0 12px 40px rgba(0,0,0,.6);font-size:13px;line-height:1.7;color:var(--muted)';
    popup.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><div id="dw" style="font-size:17px;font-weight:700;color:var(--text)"></div><button id="dc" style="background:none;border:none;color:var(--dim);font-size:22px;cursor:pointer;padding:0 4px;line-height:1">&times;</button></div><div id="dd" style="max-height:200px;overflow-y:auto"></div><a id="dl" href="#" style="display:block;margin-top:10px;color:var(--accent);font-size:12px;text-decoration:none;font-weight:500">Lihat selengkapnya di KBBI \\u2192</a>';
    document.body.appendChild(popup);
    document.getElementById('dc').onclick=function(){popup.style.display='none'};
    popup.addEventListener('click',function(e){e.stopPropagation()});
  }
  function lookup(word){
    word=word.toLowerCase().replace(/[^a-z]/g,'').trim();
    if(word.length<3||word.length>25)return;
    if(!popup)createPopup();
    document.getElementById('dw').textContent=word;
    document.getElementById('dd').innerHTML='<span style="color:var(--dim)">Memuat...</span>';
    document.getElementById('dl').href='/arti-kata/'+word;
    popup.style.display='block';
    fetch('/api/kbbi?q='+encodeURIComponent(word)).then(function(r){return r.json()}).then(function(d){
      if(d.results&&d.results.length>0){
        document.getElementById('dd').innerHTML=d.results[0].definition.substring(0,300);
        document.getElementById('dl').href='/arti-kata/'+d.results[0].slug;
      }else{
        document.getElementById('dd').innerHTML='Kata <b>'+word+'</b> tidak ditemukan di KBBI.';
      }
    }).catch(function(){document.getElementById('dd').textContent='Gagal memuat.'});
  }
  // Listen for text selection (works on both mobile and desktop)
  var selTimer;
  document.addEventListener('selectionchange',function(){
    clearTimeout(selTimer);
    selTimer=setTimeout(function(){
      var sel=window.getSelection().toString().trim();
      if(sel&&sel.length>=3&&sel.length<=25&&sel.indexOf(' ')<0){
        lookup(sel);
      }
    },600);
  });
  // Click outside closes popup
  document.addEventListener('click',function(e){
    if(popup&&popup.style.display==='block'&&!popup.contains(e.target)){popup.style.display='none'}
  });
  window.lookupWord=lookup;
})();

// Desktop inline search
let deskTimer;
const deskInp=document.getElementById('deskSearchInput');
const deskDrop=document.getElementById('deskSearchDropdown');
if(deskInp){
  deskInp.addEventListener('input',function(e){
    clearTimeout(deskTimer);
    const q=e.target.value.trim();
    if(q.length<2){deskDrop.classList.remove('open');deskDrop.innerHTML='';return}
    deskTimer=setTimeout(()=>{
      fetch('/api/search?q='+encodeURIComponent(q))
        .then(r=>r.json()).then(d=>{
          if(d.results.length===0){
            deskDrop.innerHTML='<div style="padding:20px;text-align:center;color:var(--dim);font-size:13px">Tidak ditemukan</div>';
          } else {
            deskDrop.innerHTML=d.results.map(r=>'<a class="search-item" href="/kata-bijak/'+r.slug+'" style="display:block;padding:12px 14px;border-bottom:1px solid var(--border);text-decoration:none;color:var(--text);transition:background .15s">'
              +'<div style="font-style:italic;font-size:13px;color:var(--muted);line-height:1.4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(r.text)+'</div>'
              +'<div style="font-size:11px;color:var(--accent);margin-top:3px;font-weight:500">'+esc(r.author)+'</div></a>').join('');
          }
          deskDrop.classList.add('open');
        });
    },300);
  });
  deskInp.addEventListener('keydown',function(e){if(e.key==='Escape'){deskDrop.classList.remove('open');deskInp.blur()}});
  document.addEventListener('click',function(e){if(!e.target.closest('.desk-search-wrap'))deskDrop.classList.remove('open')});
}
`;

// ── Page Builders ──────────────────────────────────────────────

export function homePage(quotes, categories) {
  const featuredQuote = quotes[0];
  const totalQuotes = quotes.length > 0 ? '136.000+' : '0';
  const body = `
<h1 style="font-size:20px;font-weight:700;margin-bottom:4px">Kata-Kata Bijak & Mutiara</h1>
<p style="color:var(--muted);font-size:13px;margin-bottom:16px">${totalQuotes} kata bijak, 114.000+ arti kata KBBI, 20.000+ sinonim/antonim, dan lainnya.</p>

<section class="fade-up" style="margin-bottom:20px">
  <div class="section-title"><span class="icon">&#x2728;</span> Kata Bijak Hari Ini</div>
  ${featuredQuote ? quoteCard(featuredQuote, true) : skeletonCard()}
</section>

<section style="margin-bottom:20px">
  <div class="section-title"><span class="icon">&#x1F4CC;</span> Kategori</div>
  <div class="hscroll-wrap">
    <button class="hscroll-arrow left" onclick="this.nextElementSibling.scrollBy(-200,0)">&lsaquo;</button>
    <div class="hscroll" id="catScroll">
      ${categories.map(c => `<a href="/kategori/${c.slug}" class="cat-chip">
        <span class="chip-icon">${c.icon}</span>${c.name}
        <span class="chip-count">${c.quote_count.toLocaleString ? c.quote_count.toLocaleString('id-ID') : c.quote_count}</span></a>`).join('')}
    </div>
    <button class="hscroll-arrow right" onclick="this.previousElementSibling.scrollBy(200,0)">&rsaquo;</button>
  </div>
</section>

<section>
  <div class="section-title"><span class="icon">&#x1F525;</span> Populer</div>
  <div class="quotes-grid">
  ${quotes.slice(0, 15).map((q, i) => quoteCard(q, i < 3)).join('')}
  </div>
</section>

<section style="margin-top:32px">
  <div class="section-title"><span class="icon">&#x1F4DA;</span> Jelajahi Lainnya</div>
  <div class="cat-grid" style="grid-template-columns:repeat(3,1fr);gap:8px">
    <a href="/arti-kata" class="cat-card"><div class="cat-card-icon">&#x1F4D6;</div><div class="cat-card-name">Kamus KBBI</div><div class="cat-card-count">114.000+ kata</div></a>
    <a href="/tesaurus" class="cat-card"><div class="cat-card-icon">&#x1F504;</div><div class="cat-card-name">Tesaurus</div><div class="cat-card-count">20.000+ sinonim</div></a>
    <a href="/puisi" class="cat-card"><div class="cat-card-icon">&#x1F4DC;</div><div class="cat-card-name">Puisi</div><div class="cat-card-count">5.500+ puisi</div></a>
    <a href="/peribahasa" class="cat-card"><div class="cat-card-icon">&#x1F4D3;</div><div class="cat-card-name">Peribahasa</div><div class="cat-card-count">2.100+ peribahasa</div></a>
    <a href="/pantun" class="cat-card"><div class="cat-card-icon">&#x1F3B6;</div><div class="cat-card-name">Pantun</div><div class="cat-card-count">430+ pantun</div></a>
    <a href="/kisah" class="cat-card"><div class="cat-card-icon">&#x1F30D;</div><div class="cat-card-name">Kisah Bijaksana</div><div class="cat-card-count">450+ kisah</div></a>
    <a href="/slang" class="cat-card"><div class="cat-card-icon">&#x1F60E;</div><div class="cat-card-name">Bahasa Gaul</div><div class="cat-card-count">5.000+ kata</div></a>
    <a href="/idiom" class="cat-card"><div class="cat-card-icon">&#x1F4AC;</div><div class="cat-card-name">Idiom</div><div class="cat-card-count">2.100+ idiom</div></a>
    <a href="/ucapan" class="cat-card"><div class="cat-card-icon">&#x1F389;</div><div class="cat-card-name">Ucapan</div><div class="cat-card-count">1.000+ ucapan</div></a>
    <a href="/wordle" class="cat-card"><div class="cat-card-icon">&#x1F3AE;</div><div class="cat-card-name">Tebak Kata</div><div class="cat-card-count">Wordle Indonesia</div></a>
    <a href="/gambar" class="cat-card"><div class="cat-card-icon">&#x1F5BC;</div><div class="cat-card-name">Buat Gambar</div><div class="cat-card-count">Quote wallpaper</div></a>
    <a href="/lahir-hari-ini" class="cat-card"><div class="cat-card-icon">&#x1F382;</div><div class="cat-card-name">Lahir Hari Ini</div><div class="cat-card-count">Tokoh hari ini</div></a>
  </div>
</section>

<div class="sub-card">
  <h3>Inspirasi Setiap Pagi</h3>
  <p>Terima kata bijak harian langsung di inbox Anda.</p>
  <form class="sub-form" onsubmit="handleSub(event)">
    <input type="email" id="subEmail" placeholder="Email Anda..." required>
    <button type="submit" id="subBtn">Langganan</button>
  </form>
  <div class="sub-msg" id="subMsg"></div>
</div>

<footer class="footer">
  <p>${SITE_NAME} &mdash; Kata bijak & mutiara harian dari tokoh-tokoh terkenal.</p>
  <p style="margin-bottom:6px"><strong>Kata</strong>: <a href="/kategori">Kata Bijak</a> &middot; <a href="/arti-kata">Kamus KBBI</a> &middot; <a href="/tesaurus">Tesaurus</a> &middot; <a href="/slang">Bahasa Gaul</a> &middot; <a href="/idiom">Idiom</a></p>
  <p style="margin-bottom:6px"><strong>Sastra</strong>: <a href="/puisi">Puisi</a> &middot; <a href="/pantun">Pantun</a> &middot; <a href="/peribahasa">Peribahasa</a> &middot; <a href="/kisah">Kisah</a> &middot; <a href="/ucapan">Ucapan</a></p>
  <p style="margin-bottom:6px"><strong>AI</strong>: <a href="/tanya">Tanya Bijaksana</a> &middot; <a href="/ai">AI Generator</a> &middot; <a href="/gambar">Buat Gambar</a></p>
  <p style="margin-bottom:6px"><strong>Lainnya</strong>: <a href="/tokoh">Tokoh</a> &middot; <a href="/hari-ini">Hari Ini</a> &middot; <a href="/lahir-hari-ini">Lahir Hari Ini</a> &middot; <a href="/populer">Populer</a> &middot; <a href="/wordle">Tebak Kata</a> &middot; <a href="/acak">Acak</a></p>
  <p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p>
</footer>`;

  return shell({
    title: 'Beranda',
    path: '/',
    body,
    activeTab: 'home',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE,
      description: SITE_DESC,
      inLanguage: "id",
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE}/cari?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    }
  });
}

export function categoryListPage(categories) {
  const body = `
<div class="breadcrumb"><a href="/">Beranda</a><span>/</span><span>Kategori</span></div>
<h1 style="font-size:22px;font-weight:700;margin-bottom:16px">Kategori Kata Bijak</h1>
<p style="color:var(--muted);font-size:14px;line-height:1.6;margin-bottom:20px">
  Jelajahi ${categories.reduce((s,c) => s + c.quote_count, 0)}+ kata bijak dan mutiara dari ${categories.length} kategori tema kehidupan.
</p>
<div class="cat-grid">
  ${categories.map(c => `<a href="/kategori/${c.slug}" class="cat-card">
    <div class="cat-card-icon">${c.icon}</div>
    <div class="cat-card-name">${c.name}</div>
    <div class="cat-card-count">${c.quote_count} kata bijak</div>
  </a>`).join('')}
</div>
<footer class="footer"><p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p></footer>`;

  return shell({
    title: 'Kategori Kata Bijak',
    description: `Jelajahi kata-kata bijak dari ${categories.length} kategori: ${categories.slice(0, 5).map(c => c.name).join(', ')} dan lainnya.`,
    path: '/kategori',
    body,
    activeTab: 'kategori',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Kategori Kata Bijak",
      url: `${SITE}/kategori`,
      description: `${categories.length} kategori kata bijak dan mutiara.`
    }
  });
}

export function categoryPage(cat, quotes, paging = {}) {
  const body = `
<div class="breadcrumb"><a href="/">Beranda</a><span>/</span><a href="/kategori">Kategori</a><span>/</span><span>${cat.name}</span></div>
<h1 style="font-size:22px;font-weight:700;margin-bottom:6px">${cat.icon} Kata Bijak ${cat.name}</h1>
<p style="color:var(--muted);font-size:14px;line-height:1.6;margin-bottom:20px">
  ${cat.description || `Kumpulan ${paging.total || cat.quote_count} kata-kata bijak tentang ${cat.name.toLowerCase()}.`}
</p>
<div class="quotes-grid">
${quotes.map(q => quoteCard(q, false)).join('')}
</div>
${pagination(paging, `/kategori/${cat.slug}`)}
<footer class="footer"><p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p></footer>`;

  return shell({
    title: `Kata Bijak ${cat.name} — ${cat.quote_count} Kutipan Terbaik`,
    description: cat.description || `Kumpulan kata bijak tentang ${cat.name.toLowerCase()} dari tokoh terkenal dunia dan Indonesia.`,
    path: `/kategori/${cat.slug}`,
    body,
    activeTab: 'kategori',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `Kata Bijak ${cat.name}`,
      url: `${SITE}/kategori/${cat.slug}`,
      description: cat.description,
      numberOfItems: cat.quote_count
    }
  });
}

export function authorListPage(authors, paging = {}) {
  const letter = paging.letter || '';
  const totalAuthors = paging.totalAuthors || paging.total || authors.length;
  const body = `
<div class="breadcrumb"><a href="/">Beranda</a><span>/</span><span>Tokoh</span>${letter ? `<span>/</span><span>${letter.toUpperCase()}</span>` : ''}</div>
<h1 style="font-size:22px;font-weight:700;margin-bottom:6px">Tokoh & Pengarang${letter ? ` — ${letter.toUpperCase()}` : ''}</h1>
<p style="color:var(--muted);font-size:14px;line-height:1.6;margin-bottom:16px">
  Kata-kata bijak dari ${totalAuthors.toLocaleString ? totalAuthors.toLocaleString('id-ID') : totalAuthors} tokoh terkenal dunia dan Indonesia.
</p>
<div class="hscroll wrap-desktop" style="margin-bottom:16px">
  <a href="/tokoh" class="cat-chip${!letter ? ' active' : ''}" style="min-width:48px;justify-content:center;font-weight:700">Semua</a>
  ${ALPHABET.map(l => `<a href="/tokoh?huruf=${l}" class="cat-chip${l === letter ? ' active' : ''}" style="min-width:40px;justify-content:center;font-weight:700">${l.toUpperCase()}</a>`).join('')}
</div>
<div class="authors-grid">
${authors.map(a => `<a href="/tokoh/${a.slug}" class="author-card">
  ${a.photo_url ? `<img src="${a.photo_url}" alt="${escHtml(a.name)}" class="author-photo" loading="lazy" width="48" height="48">` : `<div class="author-avatar">${a.name.charAt(0)}</div>`}
  <div class="author-info">
    <div class="author-name">${a.name}</div>
    <div class="author-meta">${a.occupation || a.nationality || ''}${a.birth_date ? ` &middot; ${a.birth_date.substring(0,4)}` : ''}${a.death_date ? '-'+a.death_date.substring(0,4) : ''} &middot; ${a.quote_count} kata bijak</div>
  </div>
</a>`).join('')}
</div>
${pagination(paging, letter ? `/tokoh?huruf=${letter}` : '/tokoh')}
<footer class="footer"><p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p></footer>`;

  return shell({
    title: letter ? `Tokoh Berawalan ${letter.toUpperCase()} — ${totalAuthors} Tokoh` : `Tokoh & Pengarang — ${totalAuthors} Tokoh Terkenal`,
    description: `Kata-kata bijak dari ${totalAuthors} tokoh terkenal: ${authors.slice(0, 5).map(a => a.name).join(', ')} dan lainnya.`,
    path: '/tokoh',
    body,
    activeTab: 'tokoh',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Tokoh & Pengarang Kata Bijak",
      url: `${SITE}/tokoh`,
      numberOfItems: totalAuthors
    }
  });
}

export function authorPage(author, quotes, paging = {}) {
  const body = `
<div class="breadcrumb"><a href="/">Beranda</a><span>/</span><a href="/tokoh">Tokoh</a><span>/</span><span>${author.name}</span></div>
<div class="author-hero">
  ${author.photo_url ? `<img src="${author.photo_url}" alt="${escHtml(author.name)}" class="author-hero-photo" loading="lazy" width="80" height="80">` : `<div class="author-avatar" style="width:80px;height:80px;font-size:32px">${author.name.charAt(0)}</div>`}
  <div>
    <h1 style="font-size:22px;font-weight:700;margin-bottom:4px">${author.name}</h1>
    ${author.occupation ? `<p style="color:var(--accent);font-size:13px;font-weight:500;margin-bottom:4px">${escHtml(author.occupation)}</p>` : ''}
    <p style="color:var(--dim);font-size:13px">${author.nationality || ''}${author.birth_date ? ` &middot; ${author.birth_date.substring(0,4)}` : ''}${author.death_date ? ' - '+author.death_date.substring(0,4) : (author.birth_date ? ' - sekarang' : '')} &middot; ${author.quote_count} kata bijak</p>
  </div>
</div>
${author.bio ? `<div style="color:var(--muted);font-size:14px;line-height:1.8;margin-bottom:20px;background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:16px">${escHtml(author.bio)}</div>` : ''}
${author.wikipedia_url ? `<a href="${author.wikipedia_url}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--dim);text-decoration:none;margin-bottom:16px">&#x1F517; Wikipedia</a>` : ''}
<div class="quotes-grid">
${quotes.map(q => quoteCard(q, false)).join('')}
</div>
${pagination(paging, `/tokoh/${author.slug}`)}
<footer class="footer"><p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p></footer>`;

  return shell({
    title: `Kata Bijak ${author.name}`,
    description: `Kumpulan ${author.quote_count} kata-kata bijak dari ${author.name}. Kutipan inspiratif dan bermakna.`,
    path: `/tokoh/${author.slug}`,
    body,
    activeTab: 'tokoh',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      mainEntity: {
        "@type": "Person",
        name: author.name,
        nationality: author.nationality || undefined
      }
    }
  });
}

export function singleQuotePage(quote, author, category, related) {
  const body = `
<div class="breadcrumb">
  <a href="/">Beranda</a><span>/</span>
  <a href="/kategori/${category.slug}">${category.name}</a><span>/</span>
  <span>Kata Bijak</span>
</div>

<article class="single-hero">
  <div class="single-deco">&ldquo;</div>
  <blockquote class="single-text">${escHtml(quote.text_id || quote.text)}</blockquote>
  ${quote.text_id && quote.text_id !== quote.text ? `<details style="margin-top:8px"><summary style="font-size:12px;color:var(--dim);cursor:pointer">Original</summary><p style="font-size:13px;color:var(--dim);font-style:italic;margin-top:4px">${escHtml(quote.text)}</p></details>` : ''}
  <p class="single-author">&mdash; <a href="/tokoh/${author.slug}">${author.name}</a></p>
</article>

<div class="qcard-actions" style="border-top:none;padding-top:0;margin-bottom:16px">
  <button class="qcard-btn" onclick="shareQuote('${escJs(quote.text_id || quote.text)}','${escJs(author.name)}')">&#x1F4CB; Salin</button>
  <button class="qcard-btn" onclick="waShare('${escJs(quote.text_id || quote.text)}','${escJs(author.name)}')">&#x1F4AC; WhatsApp</button>
  <a href="/gambar?q=${encodeURIComponent((quote.text_id || quote.text).substring(0,150))}&a=${encodeURIComponent(author.name)}" class="qcard-btn" style="text-decoration:none">&#x1F5BC; Gambar</a>
  <button class="qcard-btn" onclick="fetch('/api/tts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:'${escJs((quote.text_id || quote.text).substring(0,200))}'})}).then(r=>r.blob()).then(b=>new Audio(URL.createObjectURL(b)).play()).catch(()=>showToast('TTS gagal'))">&#x1F50A;</button>
</div>

${quote.meaning ? `<section class="single-section">
  <h2>&#x1F4A1; Makna & Refleksi</h2>
  <p style="color:var(--muted);font-size:14px;line-height:1.8">${escHtml(quote.meaning)}</p>
</section>` : ''}

${quote.reflection ? `<section class="single-section">
  <h2>&#x1F914; Refleksi Mendalam</h2>
  <p style="color:var(--muted);font-size:14px;line-height:1.8">${escHtml(quote.reflection)}</p>
</section>` : ''}

${quote.context ? `<section class="single-section">
  <h2>&#x1F4D6; Konteks</h2>
  <p style="color:var(--muted);font-size:14px;line-height:1.8">${escHtml(quote.context)}</p>
</section>` : ''}

<section class="single-section">
  <h2>&#x1F464; Tentang ${author.name}</h2>
  <a href="/tokoh/${author.slug}" class="author-card">
    ${author.photo_url ? `<img src="${author.photo_url}" alt="${escHtml(author.name)}" class="author-photo" loading="lazy" width="48" height="48">` : `<div class="author-avatar">${author.name.charAt(0)}</div>`}
    <div class="author-info">
      <div class="author-name">${author.name}</div>
      <div class="author-meta">${author.occupation || author.nationality || ''}${author.birth_date ? ` &middot; ${author.birth_date.substring(0,4)}` : ''}${author.death_date ? '-'+author.death_date.substring(0,4) : ''} &middot; ${author.quote_count} kata bijak</div>
    </div>
  </a>
  ${author.bio ? `<p style="color:var(--muted);font-size:13px;line-height:1.7;margin-top:8px">${escHtml(author.bio).substring(0, 200)}${author.bio.length > 200 ? '...' : ''}</p>` : ''}
</section>

${related.length > 0 ? `<section class="single-section">
  <h2>&#x1F517; Kata Bijak Terkait</h2>
  ${related.map(q => quoteCard(q, false)).join('')}
</section>` : ''}

<section class="single-section">
  <h2>&#x1F50D; Jelajahi Lainnya</h2>
  <div class="hscroll" style="gap:8px">
    <a href="/kategori/${category.slug}" class="cat-chip">${category.icon || ''} ${category.name}</a>
    <a href="/arti-kata" class="cat-chip">&#x1F4D6; Kamus KBBI</a>
    <a href="/tesaurus" class="cat-chip">&#x1F504; Tesaurus</a>
    <a href="/peribahasa" class="cat-chip">&#x1F4D3; Peribahasa</a>
    <a href="/puisi" class="cat-chip">&#x1F4DC; Puisi</a>
    <a href="/kisah" class="cat-chip">&#x1F30D; Kisah</a>
    <a href="/gambar?q=${encodeURIComponent((quote.text_id || quote.text).substring(0,100))}&a=${encodeURIComponent(author.name)}" class="cat-chip">&#x1F5BC; Buat Gambar</a>
    <a href="/wordle" class="cat-chip">&#x1F3AE; Tebak Kata</a>
  </div>
</section>

<div class="sub-card">
  <h3>Suka kata bijak ini?</h3>
  <p>Dapatkan inspirasi serupa setiap pagi di email Anda.</p>
  <form class="sub-form" onsubmit="handleSub(event)">
    <input type="email" id="subEmail" placeholder="Email Anda..." required>
    <button type="submit" id="subBtn">Langganan</button>
  </form>
  <div class="sub-msg" id="subMsg"></div>
</div>

<footer class="footer"><p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p></footer>`;

  const desc = `"${quote.text.substring(0, 120)}..." - ${author.name}. ${quote.meaning ? quote.meaning.substring(0, 80) + '...' : `Kata bijak tentang ${category.name.toLowerCase()}.`}`;

  return shell({
    title: `"${quote.text.substring(0, 50)}..." — ${author.name}`,
    description: desc,
    path: `/kata-bijak/${quote.slug}`,
    body,
    activeTab: '',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Quotation",
      text: quote.text,
      creator: { "@type": "Person", name: author.name },
      about: category.name,
      inLanguage: "id",
      url: `${SITE}/kata-bijak/${quote.slug}`
    }
  });
}

// ── KBBI Pages ──────────────────────────────────────────────

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

export function kbbiIndexPage(letter, words, paging = {}) {
  const body = `
<div class="breadcrumb"><a href="/">Beranda</a><span>/</span><span>Arti Kata</span></div>
<h1 style="font-size:22px;font-weight:700;margin-bottom:6px">Kamus &mdash; Arti Kata (KBBI)</h1>
<p style="color:var(--muted);font-size:14px;line-height:1.6;margin-bottom:16px">
  ${paging.totalWords ? `${paging.totalWords.toLocaleString('id-ID')} kata dan definisi dari Kamus Besar Bahasa Indonesia.` : `Daftar kata berawalan "${letter.toUpperCase()}".`}
</p>

<form action="/arti-kata" method="get" style="margin-bottom:20px">
  <div class="sub-form">
    <input type="text" name="q" placeholder="Cari arti kata..." style="flex:1;min-width:0;padding:12px 14px;background:var(--bg2);border:1px solid var(--border);border-radius:12px;color:var(--text);font-size:14px;font-family:var(--sans);outline:none">
    <button type="submit" style="padding:12px 20px;border:none;border-radius:12px;background:var(--grad);color:white;font-size:14px;font-weight:600;cursor:pointer;font-family:var(--sans);min-height:48px">Cari</button>
  </div>
</form>

<div class="hscroll wrap-desktop" style="margin-bottom:20px">
  ${ALPHABET.map(l => `<a href="/arti-kata?huruf=${l}" class="cat-chip${l === letter ? ' active' : ''}" style="min-width:40px;justify-content:center;font-weight:700">${l.toUpperCase()}</a>`).join('')}
</div>

${words.length > 0 ? `
<div style="margin-bottom:16px">
  ${words.map(w => `<a href="/arti-kata/${w.slug}" style="display:block;padding:12px 16px;background:var(--bg2);border:1px solid var(--border);border-radius:12px;margin-bottom:8px;text-decoration:none;color:var(--text);transition:border-color .2s">
    <div style="font-size:15px;font-weight:600">${escHtml(w.word)}</div>
    <div style="font-size:13px;color:var(--muted);margin-top:4px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${cleanKBBI((w.definition || '').substring(0, 150))}</div>
  </a>`).join('')}
</div>
${pagination(paging, `/arti-kata?huruf=${letter}`)}
` : (letter ? '<p style="color:var(--dim);text-align:center;padding:32px">Tidak ada kata berawalan "' + letter.toUpperCase() + '".</p>' : `
<section style="margin-bottom:24px">
  <div class="section-title">Kata Populer</div>
  <div class="hscroll" style="gap:8px">
    ${['cinta','hidup','hati','anak','ilmu','kerja','makan','air','uang','rumah','tanah','mata','tangan','nasi','mulut','ikan','angin','batu','minyak','jalan','doa','sabar','mimpi','waktu','buku'].map(w =>
      `<a href="/arti-kata/${w}" class="cat-chip" style="font-size:13px">${w}</a>`
    ).join('')}
  </div>
</section>
`)}

<footer class="footer"><p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p></footer>`;

  return shell({
    title: letter ? `Arti Kata Berawalan ${letter.toUpperCase()}` : 'Kamus Arti Kata KBBI',
    description: `Cari arti kata dalam Kamus Besar Bahasa Indonesia (KBBI). ${paging.totalWords ? paging.totalWords.toLocaleString('id-ID') + ' definisi kata.' : ''}`,
    path: '/arti-kata',
    body,
    activeTab: 'kamus',
  });
}

export function kbbiWordPage(word) {
  const body = `
<div class="breadcrumb"><a href="/">Beranda</a><span>/</span><a href="/arti-kata">Arti Kata</a><span>/</span><span>${escHtml(word.word)}</span></div>

<article style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:24px 20px;margin-bottom:20px">
  <h1 style="font-size:24px;font-weight:700;margin-bottom:4px">${escHtml(word.word)}</h1>
  ${word.word_class ? `<span style="display:inline-block;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:500;background:rgba(245,158,11,.08);color:var(--accent);margin-bottom:12px">${escHtml(word.word_class)}</span>` : ''}
  <div style="font-size:15px;color:var(--muted);line-height:1.8;margin-top:8px">${cleanKBBI(word.definition)}</div>
</article>

<div style="display:flex;gap:8px;margin-bottom:20px">
  <a href="/arti-kata?huruf=${word.word.charAt(0).toLowerCase()}" style="flex:1;padding:12px;border:1px solid var(--border);border-radius:10px;background:transparent;color:var(--muted);font-size:13px;font-weight:500;text-decoration:none;text-align:center;min-height:44px;display:flex;align-items:center;justify-content:center">Kata Lain: ${word.word.charAt(0).toUpperCase()}</a>
  <a href="/arti-kata" style="flex:1;padding:12px;border:1px solid var(--border);border-radius:10px;background:transparent;color:var(--muted);font-size:13px;font-weight:500;text-decoration:none;text-align:center;min-height:44px;display:flex;align-items:center;justify-content:center">Cari Kata Lain</a>
</div>

<footer class="footer"><p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p></footer>`;

  return shell({
    title: `Arti Kata "${word.word}" &mdash; KBBI`,
    description: `Arti kata ${word.word} menurut KBBI: ${stripHTML((word.definition || '').substring(0, 140))}...`,
    path: `/arti-kata/${word.slug}`,
    body,
    activeTab: 'kamus',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      name: word.word,
      description: word.definition,
      inDefinedTermSet: { "@type": "DefinedTermSet", name: "KBBI" }
    }
  });
}

export function kbbiSearchResults(query, results) {
  const body = `
<div class="breadcrumb"><a href="/">Beranda</a><span>/</span><a href="/arti-kata">Arti Kata</a><span>/</span><span>Cari: ${escHtml(query)}</span></div>
<h1 style="font-size:20px;font-weight:700;margin-bottom:16px">Hasil Pencarian: "${escHtml(query)}" (${results.length} kata)</h1>
${results.length > 0 ? results.map(w => `<a href="/arti-kata/${w.slug}" style="display:block;padding:12px 16px;background:var(--bg2);border:1px solid var(--border);border-radius:12px;margin-bottom:8px;text-decoration:none;color:var(--text)">
  <div style="font-size:15px;font-weight:600">${escHtml(w.word)}</div>
  <div style="font-size:13px;color:var(--muted);margin-top:4px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${cleanKBBI((w.definition || '').substring(0, 150))}</div>
</a>`).join('') : '<p style="color:var(--dim);text-align:center;padding:32px">Kata tidak ditemukan.</p>'}
<footer class="footer"><p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p></footer>`;

  return shell({
    title: `Cari Arti Kata "${query}"`,
    description: `Hasil pencarian arti kata "${query}" dalam KBBI.`,
    path: `/arti-kata?q=${encodeURIComponent(query)}`,
    body,
    activeTab: 'kamus',
  });
}

// ── Peribahasa Page ────────────────────────────────────────────

export function peribahasaPage(items, paging = {}) {
  const query = paging.query || '';
  const body = `
<div class="breadcrumb"><a href="/">Beranda</a><span>/</span><span>Peribahasa</span>${query ? `<span>/</span><span>${escHtml(query)}</span>` : ''}</div>
<h1 style="font-size:22px;font-weight:700;margin-bottom:6px">Peribahasa Indonesia${query ? ` &mdash; "${escHtml(query)}"` : ''}</h1>
<p style="color:var(--muted);font-size:14px;line-height:1.6;margin-bottom:16px">
  Kumpulan ${paging.total || 0} peribahasa Indonesia beserta artinya.
</p>
<form action="/peribahasa" method="get" style="margin-bottom:16px">
  <div class="sub-form">
    <input type="text" name="q" placeholder="Cari peribahasa..." value="${escHtml(query)}" style="flex:1;min-width:0;padding:12px 14px;background:var(--bg2);border:1px solid var(--border);border-radius:12px;color:var(--text);font-size:14px;font-family:var(--sans);outline:none">
    <button type="submit" style="padding:12px 20px;border:none;border-radius:12px;background:var(--grad);color:white;font-size:14px;font-weight:600;cursor:pointer;font-family:var(--sans);min-height:48px">Cari</button>
  </div>
</form>
<div class="section-title" style="margin-bottom:8px">Kata Populer dalam Peribahasa</div>
<div class="hscroll" style="margin-bottom:20px;gap:8px">
  ${['mulut','nasi','tangan','ikan','hidung','hitam','hujan','hidup','anak','air','api','batu','mata','hati','kepala','kaki','lidah','buah','burung','anjing','kucing','harimau','gajah','ular','ayam'].map(w =>
    `<a href="/peribahasa?q=${w}" class="cat-chip" style="font-size:13px">${w}</a>`
  ).join('')}
</div>
${items.map(p => `<div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:18px 16px;margin-bottom:10px">
  <div style="font-family:var(--serif);font-size:16px;font-style:italic;line-height:1.6;color:var(--text);margin-bottom:8px">"${escHtml(p.text)}"</div>
  ${p.meaning ? `<div style="font-size:13px;color:var(--muted);line-height:1.6"><strong style="color:var(--accent);font-size:11px;text-transform:uppercase;letter-spacing:1px">Arti:</strong> ${escHtml(p.meaning)}</div>` : ''}
</div>`).join('')}
${pagination(paging, query ? `/peribahasa?q=${encodeURIComponent(query)}` : '/peribahasa')}
<footer class="footer"><p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p></footer>`;

  return shell({
    title: query ? `Peribahasa "${query}" — ${paging.total || 0} Hasil` : `Peribahasa Indonesia — ${paging.total || 0} Peribahasa`,
    description: `Kumpulan peribahasa Indonesia beserta arti dan maknanya. Pepatah dan ungkapan bijak dari nusantara.`,
    path: '/peribahasa',
    body,
    activeTab: 'kamus',
  });
}

// ── Stories Pages ──────────────────────────────────────────────

const TRADITION_LABELS = { 'aesop': 'Fabel Aesop', 'zen': 'Cerita Zen', 'sufi': 'Kisah Sufi' };

export function storiesListPage(items, traditions, paging = {}) {
  const trad = paging.tradition || '';
  const body = `
<div class="breadcrumb"><a href="/">Beranda</a><span>/</span><span>Kisah Bijaksana</span></div>
<h1 style="font-size:22px;font-weight:700;margin-bottom:6px">Kisah Bijaksana${trad ? ' — ' + (TRADITION_LABELS[trad] || trad) : ''}</h1>
<p style="color:var(--muted);font-size:14px;line-height:1.6;margin-bottom:16px">
  ${paging.total || 0} cerita kebijaksanaan dari berbagai tradisi dunia.
</p>
<div class="hscroll" style="margin-bottom:16px">
  <a href="/kisah" class="cat-chip${!trad ? ' active' : ''}">Semua</a>
  ${traditions.map(t => `<a href="/kisah?tradisi=${t.tradition}" class="cat-chip${trad === t.tradition ? ' active' : ''}">${TRADITION_LABELS[t.tradition] || t.tradition} (${t.c})</a>`).join('')}
</div>
${items.map(s => `<a href="/kisah/${s.slug}" style="display:block;padding:16px;background:var(--bg2);border:1px solid var(--border);border-radius:14px;margin-bottom:10px;text-decoration:none;color:var(--text);transition:border-color .2s">
  <div style="font-size:16px;font-weight:600;margin-bottom:6px">${escHtml(s.title)}</div>
  <div style="font-size:13px;color:var(--muted);line-height:1.5;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">${escHtml((s.body || '').substring(0, 200))}</div>
  <div style="display:flex;gap:8px;margin-top:8px;font-size:11px;color:var(--dim)">
    <span>${TRADITION_LABELS[s.tradition] || s.tradition}</span>
    <span>${s.word_count} kata</span>
  </div>
</a>`).join('')}
${pagination(paging, trad ? `/kisah?tradisi=${trad}` : '/kisah')}
<footer class="footer"><p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p></footer>`;

  return shell({
    title: `Kisah Bijaksana${trad ? ' — ' + (TRADITION_LABELS[trad] || trad) : ''}`,
    description: `Kumpulan ${paging.total || 0} cerita bijaksana dari tradisi Aesop, Zen, dan Sufi.`,
    path: '/kisah',
    body,
    activeTab: '',
  });
}

export function singleStoryPage(story, related) {
  const tradLabel = TRADITION_LABELS[story.tradition] || story.tradition;
  const body = `
<div class="breadcrumb"><a href="/">Beranda</a><span>/</span><a href="/kisah">Kisah</a><span>/</span><a href="/kisah?tradisi=${story.tradition}">${tradLabel}</a><span>/</span><span>${escHtml(story.title)}</span></div>

<article style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:24px 20px;margin-bottom:20px;position:relative;overflow:hidden">
  <div style="position:absolute;top:0;left:0;right:0;height:2px;background:var(--grad)"></div>
  <div style="font-size:11px;color:var(--accent);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;font-weight:600">${tradLabel}</div>
  <h1 style="font-size:22px;font-weight:700;margin-bottom:16px;line-height:1.3">${escHtml(story.title)}</h1>
  <div style="font-size:15px;color:var(--text);line-height:1.9;white-space:pre-line">${escHtml(story.body)}</div>
  ${story.moral ? `<div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border)">
    <div style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:var(--accent);margin-bottom:6px;font-weight:600">Pelajaran</div>
    <div style="font-size:14px;color:var(--muted);line-height:1.7;font-style:italic">${escHtml(story.moral)}</div>
  </div>` : ''}
</article>

${story.source_author ? `<p style="font-size:12px;color:var(--dim);margin-bottom:16px">Sumber: ${escHtml(story.source_book || '')} ${story.source_author ? '— ' + escHtml(story.source_author) : ''}</p>` : ''}

${related.length > 0 ? `<section style="margin-top:24px">
  <h2 style="font-size:16px;font-weight:600;margin-bottom:12px;color:var(--muted)">Kisah Lainnya</h2>
  ${related.map(s => `<a href="/kisah/${s.slug}" style="display:block;padding:12px 14px;background:var(--bg2);border:1px solid var(--border);border-radius:12px;margin-bottom:8px;text-decoration:none;color:var(--text)">
    <span style="font-size:14px;font-weight:500">${escHtml(s.title)}</span>
    <span style="font-size:11px;color:var(--dim);margin-left:8px">${s.word_count} kata</span>
  </a>`).join('')}
</section>` : ''}

<footer class="footer"><p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p></footer>`;

  return shell({
    title: `${story.title} — ${tradLabel}`,
    description: `${(story.body || '').substring(0, 150)}...`,
    path: `/kisah/${story.slug}`,
    body,
    activeTab: '',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      name: story.title,
      articleBody: (story.body || '').substring(0, 500),
      genre: tradLabel,
    }
  });
}

// ── Puisi Pages ───────────────────────────────────────────────

export function puisiListPage(items, paging = {}) {
  const q = paging.query || '';
  const body = `
<div class="breadcrumb"><a href="/">Beranda</a><span>/</span><span>Puisi</span></div>
<h1 style="font-size:22px;font-weight:700;margin-bottom:6px">Puisi Indonesia${q ? ` &mdash; "${escHtml(q)}"` : ''}</h1>
<p style="color:var(--muted);font-size:14px;margin-bottom:16px">${paging.total || 0} puisi dari penyair Indonesia.</p>
<form action="/puisi" method="get" style="margin-bottom:16px"><div class="sub-form">
  <input type="text" name="q" placeholder="Cari puisi..." value="${escHtml(q)}" style="flex:1;min-width:0;padding:12px 14px;background:var(--bg2);border:1px solid var(--border);border-radius:12px;color:var(--text);font-size:14px;font-family:var(--sans);outline:none">
  <button type="submit" style="padding:12px 20px;border:none;border-radius:12px;background:var(--grad);color:white;font-size:14px;font-weight:600;cursor:pointer;font-family:var(--sans);min-height:48px">Cari</button>
</div></form>
${items.map(p => `<a href="/puisi/${p.slug}" style="display:block;padding:16px;background:var(--bg2);border:1px solid var(--border);border-radius:14px;margin-bottom:10px;text-decoration:none;color:var(--text)">
  <div style="font-size:16px;font-weight:600;margin-bottom:4px">${escHtml(p.title)}</div>
  <div style="font-size:12px;color:var(--accent);margin-bottom:6px">${escHtml(p.author || '')}</div>
  <div style="font-size:13px;color:var(--muted);line-height:1.5;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;white-space:pre-line">${escHtml((p.body || '').substring(0, 200))}</div>
</a>`).join('')}
${pagination(paging, q ? `/puisi?q=${encodeURIComponent(q)}` : '/puisi')}
<footer class="footer"><p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p></footer>`;
  return shell({ title: q ? `Puisi "${q}"` : 'Puisi Indonesia', description: `Kumpulan ${paging.total || 0} puisi Indonesia dari penyair ternama.`, path: '/puisi', body, activeTab: '' });
}

export function singlePuisiPage(poem, related) {
  const body = `
<div class="breadcrumb"><a href="/">Beranda</a><span>/</span><a href="/puisi">Puisi</a><span>/</span><span>${escHtml(poem.title)}</span></div>
<article style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:24px 20px;margin-bottom:20px;position:relative;overflow:hidden">
  <div style="position:absolute;top:0;left:0;right:0;height:2px;background:var(--grad)"></div>
  <h1 style="font-size:20px;font-weight:700;margin-bottom:4px">${escHtml(poem.title)}</h1>
  ${poem.author ? `<p style="color:var(--accent);font-size:13px;font-weight:500;margin-bottom:16px">${escHtml(poem.author)}</p>` : ''}
  <div style="font-family:var(--serif);font-size:15px;color:var(--text);line-height:2;white-space:pre-line">${escHtml(poem.body)}</div>
</article>
${related.length > 0 ? `<h2 style="font-size:16px;font-weight:600;margin-bottom:10px;color:var(--muted)">Puisi Lainnya</h2>
${related.map(r => `<a href="/puisi/${r.slug}" style="display:block;padding:12px 14px;background:var(--bg2);border:1px solid var(--border);border-radius:12px;margin-bottom:8px;text-decoration:none;color:var(--text)">
  <span style="font-weight:500">${escHtml(r.title)}</span> <span style="color:var(--dim);font-size:12px">${escHtml(r.author || '')}</span>
</a>`).join('')}` : ''}
<footer class="footer"><p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p></footer>`;
  return shell({ title: `${poem.title} &mdash; ${poem.author || 'Puisi'}`, description: `${(poem.body || '').substring(0, 150)}...`, path: `/puisi/${poem.slug}`, body, activeTab: '' });
}

// ── Pantun Page ───────────────────────────────────────────────

export function pantunListPage(items, categories, paging = {}) {
  const cat = paging.category || '';
  const body = `
<div class="breadcrumb"><a href="/">Beranda</a><span>/</span><span>Pantun</span></div>
<h1 style="font-size:22px;font-weight:700;margin-bottom:6px">Pantun Indonesia${cat ? ` &mdash; ${escHtml(cat)}` : ''}</h1>
<p style="color:var(--muted);font-size:14px;margin-bottom:16px">${paging.total || 0} pantun dari berbagai kategori.</p>
<div class="hscroll" style="margin-bottom:16px;gap:8px">
  <a href="/pantun" class="cat-chip${!cat ? ' active' : ''}">Semua</a>
  ${categories.map(c => `<a href="/pantun?kategori=${encodeURIComponent(c.category)}" class="cat-chip${cat === c.category ? ' active' : ''}">${escHtml(c.category)} (${c.c})</a>`).join('')}
</div>
${items.map(p => `<div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:18px 16px;margin-bottom:10px">
  <div style="font-family:var(--serif);font-size:15px;line-height:1.8;color:var(--text);white-space:pre-line">${escHtml(p.text)}</div>
  ${p.category ? `<div style="margin-top:8px"><span style="display:inline-block;padding:2px 10px;border-radius:20px;font-size:11px;background:rgba(245,158,11,.08);color:var(--accent)">${escHtml(p.category)}</span></div>` : ''}
</div>`).join('')}
${pagination(paging, cat ? `/pantun?kategori=${encodeURIComponent(cat)}` : '/pantun')}
<footer class="footer"><p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p></footer>`;
  return shell({ title: cat ? `Pantun ${cat}` : 'Pantun Indonesia', description: `Kumpulan ${paging.total || 0} pantun Indonesia dari berbagai kategori.`, path: '/pantun', body, activeTab: '' });
}

// ── Tesaurus Page ─────────────────────────────────────────────

export function tesaurusPage(query, results) {
  const body = `
<div class="breadcrumb"><a href="/">Beranda</a><span>/</span><span>Tesaurus</span></div>
<h1 style="font-size:22px;font-weight:700;margin-bottom:6px">Tesaurus Indonesia</h1>
<p style="color:var(--muted);font-size:14px;margin-bottom:16px">Cari sinonim dan antonim kata dalam Bahasa Indonesia.</p>
<form action="/tesaurus" method="get" style="margin-bottom:20px"><div class="sub-form">
  <input type="text" name="q" placeholder="Cari sinonim/antonim..." value="${escHtml(query)}" style="flex:1;min-width:0;padding:12px 14px;background:var(--bg2);border:1px solid var(--border);border-radius:12px;color:var(--text);font-size:14px;font-family:var(--sans);outline:none" autofocus>
  <button type="submit" style="padding:12px 20px;border:none;border-radius:12px;background:var(--grad);color:white;font-size:14px;font-weight:600;cursor:pointer;font-family:var(--sans);min-height:48px">Cari</button>
</div></form>
${results.length > 0 ? results.map(r => `<div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:18px 16px;margin-bottom:10px">
  <div style="font-size:18px;font-weight:700;margin-bottom:8px">${escHtml(r.word)}</div>
  ${r.sinonim ? `<div style="margin-bottom:8px"><span style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--accent);font-weight:600">Sinonim</span><div style="font-size:14px;color:var(--muted);margin-top:4px;line-height:1.6">${escHtml(r.sinonim)}</div></div>` : ''}
  ${r.antonim ? `<div><span style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#ef4444;font-weight:600">Antonim</span><div style="font-size:14px;color:var(--muted);margin-top:4px;line-height:1.6">${escHtml(r.antonim)}</div></div>` : ''}
</div>`).join('') : (query ? '<p style="color:var(--dim);text-align:center;padding:32px">Kata tidak ditemukan.</p>' : `
<div class="section-title">Kata Populer</div>
<div class="hscroll" style="gap:8px;margin-bottom:16px">
  ${['baik','besar','kecil','cantik','pintar','berani','kuat','indah','cinta','senang','marah','takut','cepat','lambat','susah','mudah','kaya','miskin','tua','muda'].map(w =>
    `<a href="/tesaurus?q=${w}" class="cat-chip">${w}</a>`
  ).join('')}
</div>`)}
<footer class="footer"><p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p></footer>`;
  return shell({ title: query ? `Sinonim & Antonim "${query}"` : 'Tesaurus Indonesia', description: 'Cari sinonim dan antonim kata dalam Bahasa Indonesia.', path: '/tesaurus', body, activeTab: '' });
}

// ── Slang / Bahasa Gaul Page ──────────────────────────────────

export function slangPage(items, paging = {}) {
  const q = paging.query || '';
  const letter = paging.letter || '';
  const body = `
<div class="breadcrumb"><a href="/">Beranda</a><span>/</span><span>Kamus Gaul</span></div>
<h1 style="font-size:22px;font-weight:700;margin-bottom:6px">Kamus Bahasa Gaul / Slang</h1>
<p style="color:var(--muted);font-size:14px;margin-bottom:16px">${paging.total || 0} kata gaul dan artinya dalam Bahasa Indonesia formal.</p>
<form action="/slang" method="get" style="margin-bottom:16px"><div class="sub-form">
  <input type="text" name="q" placeholder="Cari kata gaul..." value="${escHtml(q)}" style="flex:1;min-width:0;padding:12px 14px;background:var(--bg2);border:1px solid var(--border);border-radius:12px;color:var(--text);font-size:14px;font-family:var(--sans);outline:none">
  <button type="submit" style="padding:12px 20px;border:none;border-radius:12px;background:var(--grad);color:white;font-size:14px;font-weight:600;cursor:pointer;font-family:var(--sans);min-height:48px">Cari</button>
</div></form>
<div class="hscroll wrap-desktop" style="margin-bottom:16px">
  <a href="/slang" class="cat-chip${!letter ? ' active' : ''}" style="min-width:48px;justify-content:center;font-weight:700">Semua</a>
  ${ALPHABET.map(l => `<a href="/slang?huruf=${l}" class="cat-chip${l === letter ? ' active' : ''}" style="min-width:40px;justify-content:center;font-weight:700">${l.toUpperCase()}</a>`).join('')}
</div>
${items.length > 0 ? `<div style="display:grid;grid-template-columns:1fr;gap:6px">
  ${items.map(s => `<div style="display:flex;gap:12px;padding:10px 14px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;font-size:14px">
    <span style="font-weight:600;color:var(--accent);min-width:100px">${escHtml(s.slang_word)}</span>
    <span style="color:var(--muted)">${escHtml(s.formal_word)}</span>
  </div>`).join('')}
</div>` : '<p style="color:var(--dim);text-align:center;padding:32px">Tidak ditemukan.</p>'}
${pagination(paging, q ? `/slang?q=${encodeURIComponent(q)}` : (letter ? `/slang?huruf=${letter}` : '/slang'))}
<footer class="footer"><p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p></footer>`;
  return shell({ title: q ? `Kamus Gaul "${q}"` : 'Kamus Bahasa Gaul / Slang', description: `Kamus bahasa gaul dan slang Indonesia. ${paging.total || 0} kata gaul dan artinya.`, path: '/slang', body, activeTab: '' });
}

// ── Idiom Page ────────────────────────────────────────────────

export function idiomPage(items, paging = {}) {
  const q = paging.query || '';
  const body = `
<div class="breadcrumb"><a href="/">Beranda</a><span>/</span><span>Idiom</span></div>
<h1 style="font-size:22px;font-weight:700;margin-bottom:6px">Idiom & Ungkapan Indonesia</h1>
<p style="color:var(--muted);font-size:14px;margin-bottom:16px">${paging.total || 0} idiom dan ungkapan dalam Bahasa Indonesia.</p>
<form action="/idiom" method="get" style="margin-bottom:16px"><div class="sub-form">
  <input type="text" name="q" placeholder="Cari idiom..." value="${escHtml(q)}" style="flex:1;min-width:0;padding:12px 14px;background:var(--bg2);border:1px solid var(--border);border-radius:12px;color:var(--text);font-size:14px;font-family:var(--sans);outline:none">
  <button type="submit" style="padding:12px 20px;border:none;border-radius:12px;background:var(--grad);color:white;font-size:14px;font-weight:600;cursor:pointer;font-family:var(--sans);min-height:48px">Cari</button>
</div></form>
${items.length > 0 ? items.map(i => `<div style="padding:12px 16px;background:var(--bg2);border:1px solid var(--border);border-radius:12px;margin-bottom:8px">
  <div style="font-family:var(--serif);font-size:15px;font-style:italic;line-height:1.6;color:var(--text)">${escHtml(i.text)}</div>
  ${i.source_word ? `<div style="font-size:11px;color:var(--dim);margin-top:4px">Kata dasar: <a href="/arti-kata/${i.source_word}" style="color:var(--accent);text-decoration:none">${escHtml(i.source_word)}</a></div>` : ''}
</div>`).join('') : (q ? '<p style="color:var(--dim);text-align:center;padding:32px">Tidak ditemukan.</p>' : '')}
${pagination(paging, q ? `/idiom?q=${encodeURIComponent(q)}` : '/idiom')}
<footer class="footer"><p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p></footer>`;
  return shell({ title: q ? `Idiom "${q}"` : 'Idiom & Ungkapan Indonesia', description: `Kumpulan ${paging.total || 0} idiom dan ungkapan dalam Bahasa Indonesia.`, path: '/idiom', body, activeTab: '' });
}

// ── Ucapan Page ───────────────────────────────────────────────

const OCCASION_LABELS = {
  'ulang_tahun': 'Ulang Tahun', 'pernikahan': 'Pernikahan', 'wisuda': 'Wisuda',
  'idul_fitri': 'Idul Fitri', 'natal': 'Natal', 'tahun_baru': 'Tahun Baru',
  'pagi': 'Selamat Pagi', 'duka': 'Duka Cita', 'hari_ibu': 'Hari Ibu',
  'kemerdekaan': 'Kemerdekaan', 'anniversary': 'Anniversary', 'promosi': 'Promosi',
  'kelahiran': 'Kelahiran Bayi', 'ramadhan': 'Ramadhan', 'idul_adha': 'Idul Adha',
  'valentine': 'Valentine', 'imlek': 'Imlek', 'kartini': 'Hari Kartini',
};

export function ucapanPage(items, occasions, paging = {}) {
  const occ = paging.occasion || '';
  const label = OCCASION_LABELS[occ] || occ;
  const body = `
<div class="breadcrumb"><a href="/">Beranda</a><span>/</span><span>Ucapan</span>${occ ? `<span>/</span><span>${label}</span>` : ''}</div>
<h1 style="font-size:22px;font-weight:700;margin-bottom:6px">Ucapan Selamat${occ ? ` ${label}` : ''}</h1>
<p style="color:var(--muted);font-size:14px;margin-bottom:16px">${paging.total || 0} ucapan untuk berbagai acara dan momen spesial.</p>
<div class="hscroll" style="margin-bottom:16px;gap:8px">
  <a href="/ucapan" class="cat-chip${!occ ? ' active' : ''}">Semua</a>
  ${occasions.map(o => `<a href="/ucapan?acara=${o.occasion}" class="cat-chip${occ === o.occasion ? ' active' : ''}">${OCCASION_LABELS[o.occasion] || o.occasion} (${o.c})</a>`).join('')}
</div>
${items.map(u => `<div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:18px 16px;margin-bottom:10px">
  <div style="font-size:15px;line-height:1.7;color:var(--text)">${escHtml(u.text)}</div>
  <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
    <span style="display:inline-block;padding:2px 10px;border-radius:20px;font-size:11px;background:rgba(245,158,11,.08);color:var(--accent)">${OCCASION_LABELS[u.occasion] || u.occasion}</span>
    <button onclick="copyText('${escJs(u.text)}')" style="background:none;border:1px solid var(--border);border-radius:8px;padding:6px 12px;color:var(--muted);font-size:12px;cursor:pointer">Salin</button>
  </div>
</div>`).join('')}
${pagination(paging, occ ? `/ucapan?acara=${occ}` : '/ucapan')}
<footer class="footer"><p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p></footer>`;
  return shell({ title: occ ? `Ucapan ${label}` : 'Ucapan Selamat untuk Semua Acara', description: `Kumpulan ${paging.total || 0} ucapan selamat untuk berbagai acara: ulang tahun, pernikahan, wisuda, lebaran, dan lainnya.`, path: '/ucapan', body, activeTab: '' });
}

// ── Wordle (Tebak Kata) ───────────────────────────────────────

export function wordlePage(answer) {
  const body = `
<div class="breadcrumb"><a href="/">Beranda</a><span>/</span><span>Tebak Kata</span></div>
<h1 style="font-size:22px;font-weight:700;margin-bottom:6px;text-align:center">Tebak Kata</h1>
<p style="color:var(--muted);font-size:14px;margin-bottom:16px;text-align:center">Tebak kata 5 huruf dalam 6 percobaan!</p>
<div id="wordle-game" style="max-width:360px;margin:0 auto">
  <div id="board" style="display:grid;grid-template-rows:repeat(6,1fr);gap:6px;margin-bottom:16px"></div>
  <div id="keyboard" style="display:flex;flex-direction:column;gap:4px;align-items:center"></div>
  <div id="msg" style="text-align:center;margin-top:12px;font-size:14px;font-weight:600;min-height:24px"></div>
  <button onclick="location.reload()" style="display:block;margin:12px auto 0;padding:10px 24px;border:1px solid var(--border);border-radius:10px;background:transparent;color:var(--muted);font-size:13px;cursor:pointer;font-family:var(--sans)">Kata Baru</button>
</div>
<script>
(function(){
  const W='${answer}',N=5,MX=6;let row=0,col=0,done=false;
  const board=document.getElementById('board'),kb=document.getElementById('keyboard'),msg=document.getElementById('msg');
  const grid=[];
  for(let r=0;r<MX;r++){const tr=document.createElement('div');tr.style.cssText='display:grid;grid-template-columns:repeat(5,1fr);gap:4px';grid[r]=[];for(let c=0;c<N;c++){const td=document.createElement('div');td.style.cssText='width:100%;aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:clamp(16px,5vw,24px);font-weight:700;border:2px solid var(--border);border-radius:6px;text-transform:uppercase';grid[r][c]=td;tr.appendChild(td)}board.appendChild(tr)}
  const rows=[['q','w','e','r','t','y','u','i','o','p'],['a','s','d','f','g','h','j','k','l'],['Enter','z','x','c','v','b','n','m','Del']];
  const kmap={};
  rows.forEach(r=>{const d=document.createElement('div');d.style.cssText='display:flex;gap:3px;justify-content:center;width:100%';r.forEach(k=>{const b=document.createElement('button');b.textContent=k==='Del'?'<-':k;b.style.cssText='padding:8px 0;border:1px solid var(--border);border-radius:6px;background:var(--bg2);color:var(--text);font-size:13px;font-weight:600;cursor:pointer;font-family:var(--sans);min-height:40px;flex:1;max-width:'+(k.length>1?'52px':'32px');b.onclick=()=>press(k);kmap[k]=b;d.appendChild(b)});kb.appendChild(d)});
  function press(k){if(done)return;if(k==='Del'){if(col>0){col--;grid[row][col].textContent=''}return}if(k==='Enter'){if(col<N)return;const g=grid[row].map(c=>c.textContent.toLowerCase()).join('');const res=check(g);for(let i=0;i<N;i++){const s=res[i];grid[row][i].style.background=s==='g'?'#22c55e':s==='y'?'#f59e0b':'#333';grid[row][i].style.borderColor=grid[row][i].style.background;grid[row][i].style.color='white';const l=g[i];if(s==='g')setKey(l,'#22c55e');else if(s==='y'&&!kmap[l]?.style.background?.includes('22c55e'))setKey(l,'#f59e0b');else if(s==='x')setKey(l,'#333')}if(g===W){msg.innerHTML='Selamat! \\u{1F389} <a href="/arti-kata/'+W+'" style="color:#22c55e;text-decoration:underline">Lihat arti \\u201C'+W+'\\u201D</a>';msg.style.color='#22c55e';done=true}else{row++;if(row>=MX){msg.innerHTML='Jawaban: <a href="/arti-kata/'+W+'" style="color:#ef4444;text-decoration:underline;font-weight:700">'+W.toUpperCase()+'</a>';msg.style.color='#ef4444';done=true}}col=0;return}if(col>=N)return;grid[row][col].textContent=k;col++}
  function check(g){const r=Array(N).fill('x'),wc=[...W];for(let i=0;i<N;i++)if(g[i]===W[i]){r[i]='g';wc[i]='_'}for(let i=0;i<N;i++)if(r[i]!=='g'){const j=wc.indexOf(g[i]);if(j>=0){r[i]='y';wc[j]='_'}}return r}
  function setKey(l,c){if(kmap[l])kmap[l].style.background=c}
  document.addEventListener('keydown',e=>{if(e.key==='Backspace')press('Del');else if(e.key==='Enter')press('Enter');else if(/^[a-z]$/.test(e.key))press(e.key)});
})();
</script>
<footer class="footer"><p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p></footer>`;
  return shell({ title: 'Tebak Kata &mdash; Wordle Indonesia', description: 'Mainkan Tebak Kata (Wordle) dalam Bahasa Indonesia. Tebak kata 5 huruf dalam 6 percobaan!', path: '/wordle', body, activeTab: '' });
}

// ── Quote of the Day ──────────────────────────────────────────

export function quoteOfDayPage(quote) {
  if (!quote) return notFoundPage();
  const text = quote.text_id || quote.text;
  const body = `
<div class="breadcrumb"><a href="/">Beranda</a><span>/</span><span>Kata Bijak Hari Ini</span></div>
<div style="text-align:center;padding:24px 0">
  <div style="font-size:12px;color:var(--dim);text-transform:uppercase;letter-spacing:2px;margin-bottom:16px">${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
  <div style="font-size:56px;line-height:1;opacity:.5;background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;font-family:var(--serif);margin-bottom:8px">&ldquo;</div>
  <blockquote style="font-family:var(--serif);font-size:24px;font-style:italic;line-height:1.65;color:var(--text);margin-bottom:16px;max-width:600px;margin-left:auto;margin-right:auto">${escHtml(text)}</blockquote>
  <p style="font-size:15px;color:var(--accent);font-weight:500">&mdash; ${escHtml(quote.author_name || '')}</p>
  ${quote.photo_url ? `<img src="${quote.photo_url}" alt="${escHtml(quote.author_name)}" style="width:64px;height:64px;border-radius:50%;object-fit:cover;margin-top:12px;border:2px solid var(--border)">` : ''}
</div>
${quote.meaning ? `<div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:20px;margin-bottom:16px">
  <div style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:var(--accent);margin-bottom:6px;font-weight:600">Makna</div>
  <div style="font-size:14px;color:var(--muted);line-height:1.8">${escHtml(quote.meaning)}</div>
</div>` : ''}
${quote.reflection ? `<div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:20px;margin-bottom:16px">
  <div style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:var(--accent);margin-bottom:6px;font-weight:600">Refleksi</div>
  <div style="font-size:14px;color:var(--muted);line-height:1.8">${escHtml(quote.reflection)}</div>
</div>` : ''}
<div style="display:flex;gap:8px;max-width:400px;margin:16px auto">
  <button class="qcard-btn" onclick="shareQuote('${escJs(text)}','${escJs(quote.author_name || '')}')">&#x1F4CB; Salin</button>
  <button class="qcard-btn" onclick="waShare('${escJs(text)}','${escJs(quote.author_name || '')}')">&#x1F4AC; WhatsApp</button>
</div>
<div style="text-align:center;margin-top:16px"><a href="/kata-bijak/${quote.slug || ''}" style="color:var(--accent);text-decoration:none;font-size:13px">Lihat halaman lengkap &rarr;</a></div>
<footer class="footer"><p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p></footer>`;
  return shell({ title: 'Kata Bijak Hari Ini', description: `"${text.substring(0, 100)}..." - ${quote.author_name || ''}`, path: '/hari-ini', body, activeTab: 'home' });
}

// ── Born Today Page ───────────────────────────────────────────

export function bornTodayPage(born, died, today) {
  const dateStr = today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
  const renderPerson = (a) => `<a href="/tokoh/${a.slug}" class="author-card">
    ${a.photo_url ? `<img src="${a.photo_url}" alt="${escHtml(a.name)}" class="author-photo" loading="lazy" width="48" height="48">` : `<div class="author-avatar">${a.name.charAt(0)}</div>`}
    <div class="author-info">
      <div class="author-name">${escHtml(a.name)}</div>
      <div class="author-meta">${a.occupation || a.nationality || ''} &middot; ${a.birth_date?.substring(0,4) || '?'}${a.death_date ? '-'+a.death_date.substring(0,4) : ''} &middot; ${a.quote_count} kata bijak</div>
    </div>
  </a>`;

  const body = `
<div class="breadcrumb"><a href="/">Beranda</a><span>/</span><span>Lahir Hari Ini</span></div>
<h1 style="font-size:22px;font-weight:700;margin-bottom:6px">Tokoh Lahir Hari Ini</h1>
<p style="color:var(--muted);font-size:14px;margin-bottom:20px">${dateStr}</p>

${born.length > 0 ? `<section style="margin-bottom:24px">
  <div class="section-title">Lahir pada ${dateStr}</div>
  <div class="authors-grid">${born.map(renderPerson).join('')}</div>
</section>` : '<p style="color:var(--dim);text-align:center;padding:20px">Tidak ada tokoh yang lahir hari ini dalam database kami.</p>'}

${died.length > 0 ? `<section>
  <div class="section-title">Wafat pada ${dateStr}</div>
  <div class="authors-grid">${died.map(renderPerson).join('')}</div>
</section>` : ''}

<footer class="footer"><p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p></footer>`;
  return shell({ title: `Tokoh Lahir Hari Ini — ${dateStr}`, description: `Tokoh-tokoh terkenal yang lahir pada ${dateStr}.`, path: '/lahir-hari-ini', body, activeTab: '' });
}

// ── Quote Image Maker Page ────────────────────────────────────

export function quoteImagePage() {
  const body = `
<div class="breadcrumb"><a href="/">Beranda</a><span>/</span><span>Buat Gambar Quote</span></div>
<h1 style="font-size:22px;font-weight:700;margin-bottom:6px">Buat Gambar Kata Bijak</h1>
<p style="color:var(--muted);font-size:14px;margin-bottom:16px">Buat gambar kata bijak untuk wallpaper, Instagram, atau WhatsApp.</p>

<div style="max-width:600px;margin:0 auto">
  <div id="preview" style="position:relative;width:100%;aspect-ratio:16/9;background:linear-gradient(135deg,#1a1a2e,#16213e,#0f3460);border-radius:16px;overflow:hidden;display:flex;align-items:center;justify-content:center;padding:40px;margin-bottom:16px">
    <div style="text-align:center">
      <div id="previewText" style="font-family:Georgia,serif;font-size:20px;font-style:italic;color:white;line-height:1.6;text-shadow:0 2px 8px rgba(0,0,0,.5)">"Ketik kata bijak Anda di bawah..."</div>
      <div id="previewAuthor" style="color:rgba(255,255,255,.7);font-size:13px;margin-top:12px">— Anonim</div>
      <div style="color:rgba(255,255,255,.3);font-size:10px;margin-top:8px">bijaksana.com</div>
    </div>
  </div>

  <div style="margin-bottom:12px">
    <label style="font-size:12px;color:var(--dim);display:block;margin-bottom:4px">Kata Bijak</label>
    <textarea id="imgQuote" rows="3" placeholder="Ketik atau tempel kata bijak..." style="width:100%;padding:12px;background:var(--bg2);border:1px solid var(--border);border-radius:12px;color:var(--text);font-size:14px;font-family:var(--sans);resize:vertical;outline:none" oninput="updatePreview()"></textarea>
  </div>
  <div style="margin-bottom:12px">
    <label style="font-size:12px;color:var(--dim);display:block;margin-bottom:4px">Pengarang</label>
    <input id="imgAuthor" type="text" placeholder="Nama pengarang" style="width:100%;padding:10px 12px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:14px;outline:none" oninput="updatePreview()">
  </div>

  <div style="margin-bottom:12px">
    <label style="font-size:12px;color:var(--dim);display:block;margin-bottom:6px">Latar Belakang</label>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      ${[
        ['linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)', 'Biru Gelap'],
        ['linear-gradient(135deg,#0d0d0d,#1a1a1a,#2d2d2d)', 'Hitam'],
        ['linear-gradient(135deg,#2d1b69,#11998e)', 'Ungu Teal'],
        ['linear-gradient(135deg,#614385,#516395)', 'Ungu'],
        ['linear-gradient(135deg,#3a1c71,#d76d77,#ffaf7b)', 'Sunset'],
        ['linear-gradient(135deg,#134e5e,#71b280)', 'Hutan'],
        ['linear-gradient(135deg,#c94b4b,#4b134f)', 'Merah Ungu'],
        ['linear-gradient(135deg,#232526,#414345)', 'Abu Gelap'],
      ].map(([bg, label]) => `<button onclick="setBg('${bg}')" style="width:40px;height:40px;border-radius:10px;border:2px solid var(--border);background:${bg};cursor:pointer" title="${label}"></button>`).join('')}
    </div>
  </div>

  <div style="margin-bottom:12px">
    <label style="font-size:12px;color:var(--dim);display:block;margin-bottom:6px">Ukuran</label>
    <div style="display:flex;gap:6px">
      <button onclick="setSize('phone')" class="cat-chip active" id="sizePhone" style="font-size:12px">Phone (9:16)</button>
      <button onclick="setSize('desktop')" class="cat-chip" id="sizeDesktop" style="font-size:12px">Desktop (16:9)</button>
      <button onclick="setSize('square')" class="cat-chip" id="sizeSquare" style="font-size:12px">Instagram (1:1)</button>
    </div>
  </div>

  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <button onclick="downloadImage()" style="flex:1;min-width:120px;padding:12px;border:none;border-radius:12px;background:var(--grad);color:white;font-size:14px;font-weight:600;cursor:pointer;font-family:var(--sans);min-height:48px">Download</button>
    <button onclick="genAIWallpaper()" id="aiWallBtn" style="flex:1;min-width:120px;padding:12px;border:1px solid var(--accent);border-radius:12px;background:transparent;color:var(--accent);font-size:14px;font-weight:600;cursor:pointer;font-family:var(--sans);min-height:48px">AI Wallpaper</button>
    <button onclick="playTTS()" id="ttsBtn" style="padding:12px 16px;border:1px solid var(--border);border-radius:12px;background:transparent;color:var(--muted);font-size:18px;cursor:pointer;min-height:48px" title="Dengarkan">&#x1F50A;</button>
    <button onclick="shareImage()" style="padding:12px 16px;border:1px solid var(--border);border-radius:12px;background:transparent;color:var(--muted);font-size:14px;cursor:pointer;font-family:var(--sans);min-height:48px">Bagikan</button>
  </div>
  <div id="aiStatus" style="margin-top:8px;font-size:12px;color:var(--dim);text-align:center;min-height:16px"></div>
</div>

<script>
function updatePreview(){
  var text=document.getElementById('imgQuote').value||'Ketik kata bijak Anda...';
  var el=document.getElementById('previewText');
  el.textContent='"'+text+'"';
  // Auto-scale font size based on text length
  var len=text.length;
  if(len>200) el.style.fontSize='13px';
  else if(len>150) el.style.fontSize='14px';
  else if(len>100) el.style.fontSize='16px';
  else if(len>60) el.style.fontSize='18px';
  else el.style.fontSize='20px';
  document.getElementById('previewAuthor').textContent='\\u2014 '+(document.getElementById('imgAuthor').value||'Anonim');
}
function setBg(bg){document.getElementById('preview').style.background=bg}
function downloadImage(){
  var el=document.getElementById('preview');
  // Use canvas to render
  var c=document.createElement('canvas');c.width=1200;c.height=675;
  var ctx=c.getContext('2d');
  // Draw background gradient (simplified)
  var style=getComputedStyle(el);
  ctx.fillStyle='#1a1a2e';ctx.fillRect(0,0,1200,675);
  // Draw text
  var qt=document.getElementById('imgQuote').value||'Ketik kata bijak...';
  var au=document.getElementById('imgAuthor').value||'Anonim';
  // Auto font size based on length
  var fontSize=qt.length>200?24:qt.length>150?28:qt.length>100?32:qt.length>60?36:40;
  var lineH=fontSize*1.4;
  ctx.fillStyle='white';ctx.font='italic '+fontSize+'px Georgia,serif';ctx.textAlign='center';
  // Word wrap
  var maxW=1000;var words=qt.split(' '),line='',lines=[];
  for(var w of words){var test=line+w+' ';if(ctx.measureText(test).width>maxW){lines.push(line);line=w+' '}else{line=test}}
  lines.push(line);
  var y=338-(lines.length*lineH/2);
  for(var l of lines){ctx.fillText(l.trim(),600,y);y+=lineH}
  ctx.fillStyle='rgba(255,255,255,0.7)';ctx.font='18px sans-serif';ctx.fillText('\\u2014 '+au,600,y+30);
  ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='12px sans-serif';ctx.fillText('bijaksana.com',600,y+60);
  // Download
  var a=document.createElement('a');a.download='bijaksana-quote.png';a.href=c.toDataURL('image/png');a.click();
  showToast('Gambar diunduh!');
}
function shareImage(){
  var qt=document.getElementById('imgQuote').value;
  var au=document.getElementById('imgAuthor').value;
  if(navigator.share)navigator.share({text:'"'+qt+'" \\u2014 '+au+'\\n\\nbijaksana.com'}).catch(()=>{});
  else{copyText('"'+qt+'" \\u2014 '+au+'\\n\\nbijaksana.com')}
}

// Size switching
var currentSize='phone';
var sizeMap={phone:{w:1080,h:1920,ar:'9/16'},desktop:{w:1920,h:1080,ar:'16/9'},square:{w:1080,h:1080,ar:'1/1'}};
function setSize(s){
  currentSize=s;
  var preview=document.getElementById('preview');
  preview.style.aspectRatio=sizeMap[s].ar;
  document.querySelectorAll('[id^=size]').forEach(function(b){b.classList.remove('active')});
  document.getElementById('size'+s.charAt(0).toUpperCase()+s.slice(1)).classList.add('active');
}

// AI Wallpaper — generate background image
async function genAIWallpaper(){
  var btn=document.getElementById('aiWallBtn'),status=document.getElementById('aiStatus');
  var style=document.querySelector('[id^=size].active')?.textContent?.includes('Phone')?'dark-gradient':'nature';
  // Pick style from background buttons
  var bgs=['dark-gradient','nature','ocean','forest','stars','minimal'];
  style=bgs[Math.floor(Math.random()*bgs.length)];
  btn.disabled=true;btn.textContent='Generating...';
  status.textContent='AI sedang membuat wallpaper... (10-15 detik)';
  try{
    var r=await fetch('/api/wallpaper',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({size:currentSize,style:style})});
    if(!r.ok){var e=await r.json();status.textContent=e.error||'Gagal';btn.disabled=false;btn.textContent='AI Wallpaper';return}
    var blob=await r.blob();
    var url=URL.createObjectURL(blob);
    document.getElementById('preview').style.backgroundImage='url('+url+')';
    document.getElementById('preview').style.backgroundSize='cover';
    document.getElementById('preview').style.background='url('+url+') center/cover';
    status.textContent='Wallpaper AI siap! Klik Download.';
    // Auto-download
    var a=document.createElement('a');a.href=url;a.download='bijaksana-wallpaper.jpg';a.click();
  }catch(e){status.textContent='Gagal: '+e.message}
  btn.disabled=false;btn.textContent='AI Wallpaper';
}

// TTS — play quote audio
async function playTTS(){
  var btn=document.getElementById('ttsBtn');
  var text=document.getElementById('imgQuote').value;
  if(!text){showToast('Ketik kata bijak dulu');return}
  btn.disabled=true;btn.textContent='...';
  try{
    var r=await fetch('/api/tts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:text.substring(0,200)})});
    if(!r.ok){showToast('TTS gagal');btn.disabled=false;btn.textContent='\\u{1F50A}';return}
    var blob=await r.blob();
    var audio=new Audio(URL.createObjectURL(blob));
    audio.play();
  }catch(e){showToast('TTS error')}
  btn.disabled=false;btn.textContent='\\u{1F50A}';
}

// Init: load from URL params or fetch random quote
(function(){
  var params=new URLSearchParams(window.location.search);
  var q=params.get('q'), a=params.get('a');
  if(q){
    document.getElementById('imgQuote').value=q;
    document.getElementById('imgAuthor').value=a||'';
    updatePreview();
  } else {
    // No params = from menu, load random quote
    fetch('/api/quote/random').then(r=>r.json()).then(d=>{
      if(d.text){
        document.getElementById('imgQuote').value=d.text;
        document.getElementById('imgAuthor').value=d.author||'';
        updatePreview();
      }
    }).catch(()=>{});
  }
})();
</script>

<footer class="footer"><p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p></footer>`;
  return shell({ title: 'Buat Gambar Kata Bijak', description: 'Buat gambar kata bijak untuk wallpaper, Instagram, atau WhatsApp. Gratis dan mudah.', path: '/gambar', body, activeTab: '' });
}

// ── AI Chat "Tanya Bijaksana" ─────────────────────────────────

export function tanyaPage() {
  const body = `
<div class="breadcrumb"><a href="/">Beranda</a><span>/</span><span>Tanya Bijaksana</span></div>
<h1 style="font-size:22px;font-weight:700;margin-bottom:6px">Tanya Bijaksana</h1>
<p style="color:var(--muted);font-size:14px;margin-bottom:20px">Tanyakan apa saja tentang kehidupan, cinta, motivasi, atau kebijaksanaan. AI kami akan menjawab dengan bijak.</p>

<div style="max-width:600px;margin:0 auto">
  <div id="chatMessages" style="min-height:200px;margin-bottom:16px">
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:10px">
      <div style="font-size:13px;color:var(--accent);font-weight:600;margin-bottom:6px">Bijaksana AI</div>
      <div style="font-size:14px;color:var(--muted);line-height:1.7">Halo! Saya Bijaksana, asisten kebijaksanaan Anda. Silakan tanyakan apa saja — tentang kehidupan, cinta, kesulitan, atau apapun yang membuat Anda ingin merenung.</div>
    </div>
  </div>

  <form onsubmit="askBijaksana(event)" style="display:flex;gap:8px">
    <input type="text" id="askInput" placeholder="Tanyakan sesuatu..." style="flex:1;padding:14px 16px;background:var(--bg2);border:1px solid var(--border);border-radius:14px;color:var(--text);font-size:15px;font-family:var(--sans);outline:none" required>
    <button type="submit" id="askBtn" style="padding:14px 24px;border:none;border-radius:14px;background:var(--grad);color:white;font-size:14px;font-weight:600;cursor:pointer;font-family:var(--sans);min-height:48px;white-space:nowrap">Tanya</button>
  </form>

  <div style="margin-top:16px">
    <div style="font-size:12px;color:var(--dim);margin-bottom:8px">Coba tanyakan:</div>
    <div class="hscroll" style="gap:6px">
      ${['Bagaimana cara menghadapi kegagalan?','Apa arti cinta sejati?','Bagaimana agar hidup lebih bermakna?','Mengapa kesabaran itu penting?','Bagaimana mengatasi rasa takut?'].map(q =>
        `<button onclick="document.getElementById('askInput').value='${q}';askBijaksana(new Event('submit'))" class="cat-chip" style="font-size:12px;cursor:pointer;border:none">${q}</button>`
      ).join('')}
    </div>
  </div>
</div>

<script>
async function askBijaksana(e){
  e.preventDefault();
  var inp=document.getElementById('askInput'),btn=document.getElementById('askBtn'),msgs=document.getElementById('chatMessages');
  var q=inp.value.trim();if(!q)return;
  // Add user message
  msgs.innerHTML+='<div style="background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.2);border-radius:14px;padding:14px 16px;margin-bottom:10px;text-align:right"><div style="font-size:13px;color:var(--accent);font-weight:600;margin-bottom:4px">Anda</div><div style="font-size:14px;color:var(--text);line-height:1.6">'+esc(q)+'</div></div>';
  inp.value='';btn.disabled=true;btn.textContent='...';
  // Add loading
  var loadId='load'+Date.now();
  msgs.innerHTML+='<div id="'+loadId+'" style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:10px"><div style="font-size:13px;color:var(--accent);font-weight:600;margin-bottom:6px">Bijaksana AI</div><div class="skel skel-line w80"></div><div class="skel skel-line w60"></div></div>';
  msgs.scrollTop=msgs.scrollHeight;
  try{
    var r=await fetch('/api/tanya',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q})});
    var d=await r.json();
    var el=document.getElementById(loadId);
    if(d.answer){
      var quotesHtml=d.quotes&&d.quotes.length?'<div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border);font-size:12px;color:var(--dim)">Kutipan terkait:<br>'+d.quotes.map(function(q){return '<a href="/kata-bijak/'+q.slug+'" style="color:var(--accent);text-decoration:none;font-style:italic">"'+q.text.substring(0,60)+'..."</a>'}).join('<br>')+'</div>':'';
      el.innerHTML='<div style="font-size:13px;color:var(--accent);font-weight:600;margin-bottom:6px">Bijaksana AI</div><div style="font-size:14px;color:var(--muted);line-height:1.8;white-space:pre-line">'+esc(d.answer)+'</div>'+quotesHtml;
    }else{
      el.innerHTML='<div style="color:var(--dim)">Maaf, saya tidak dapat menjawab saat ini.</div>';
    }
  }catch(err){
    var el=document.getElementById(loadId);
    if(el)el.innerHTML='<div style="color:#ef4444">Gagal menghubungi AI. Coba lagi.</div>';
  }
  btn.disabled=false;btn.textContent='Tanya';
  msgs.scrollTop=msgs.scrollHeight;
}
</script>

<footer class="footer"><p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p></footer>`;
  return shell({ title: 'Tanya Bijaksana — AI Kebijaksanaan', description: 'Tanyakan apa saja tentang kehidupan kepada AI Bijaksana. Dapatkan jawaban bijaksana dan mendalam.', path: '/tanya', body, activeTab: '' });
}

// ── AI Generate Page (Quotes + Stories) ───────────────────────

export function aiGeneratePage() {
  const body = `
<div class="breadcrumb"><a href="/">Beranda</a><span>/</span><span>AI Generator</span></div>
<h1 style="font-size:22px;font-weight:700;margin-bottom:6px">AI Generator</h1>
<p style="color:var(--muted);font-size:14px;margin-bottom:20px">Buat kata bijak dan kisah bijaksana original dengan AI.</p>

<div style="max-width:600px;margin:0 auto">
  <!-- Quote Generator -->
  <div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:20px;margin-bottom:16px">
    <h2 style="font-size:17px;font-weight:700;margin-bottom:8px">&#x2728; Buat Kata Bijak</h2>
    <p style="color:var(--muted);font-size:13px;margin-bottom:12px">AI akan membuat kata bijak original berdasarkan tema.</p>
    <div style="display:flex;gap:8px;margin-bottom:12px">
      <select id="quoteTheme" style="flex:1;padding:10px 12px;background:var(--bg);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:14px;font-family:var(--sans)">
        <option value="kehidupan">Kehidupan</option>
        <option value="cinta">Cinta</option>
        <option value="motivasi">Motivasi</option>
        <option value="kesabaran">Kesabaran</option>
        <option value="keberanian">Keberanian</option>
        <option value="persahabatan">Persahabatan</option>
        <option value="harapan">Harapan</option>
        <option value="kebahagiaan">Kebahagiaan</option>
        <option value="pendidikan">Pendidikan</option>
        <option value="mimpi">Mimpi</option>
      </select>
      <button onclick="generateQuote()" id="genQuoteBtn" style="padding:10px 20px;border:none;border-radius:10px;background:var(--grad);color:white;font-size:14px;font-weight:600;cursor:pointer;font-family:var(--sans);min-height:44px">Buat</button>
    </div>
    <div id="genQuoteResult" style="min-height:60px">
      <div style="color:var(--dim);font-size:13px;text-align:center;padding:16px">Klik "Buat" untuk menghasilkan kata bijak baru</div>
    </div>
  </div>

  <!-- Story Generator -->
  <div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:20px;margin-bottom:16px">
    <h2 style="font-size:17px;font-weight:700;margin-bottom:8px">&#x1F4D6; Buat Kisah Bijaksana</h2>
    <p style="color:var(--muted);font-size:13px;margin-bottom:12px">AI akan membuat kisah bijaksana dalam berbagai gaya tradisi.</p>
    <div style="display:flex;gap:8px;margin-bottom:8px">
      <select id="storyTheme" style="flex:1;padding:10px 12px;background:var(--bg);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:14px;font-family:var(--sans)">
        <option value="kebijaksanaan">Kebijaksanaan</option>
        <option value="kerendahan hati">Kerendahan Hati</option>
        <option value="keserakahan">Keserakahan</option>
        <option value="persahabatan">Persahabatan</option>
        <option value="kejujuran">Kejujuran</option>
        <option value="kesabaran">Kesabaran</option>
        <option value="cinta kasih">Cinta Kasih</option>
      </select>
      <select id="storyStyle" style="width:120px;padding:10px 12px;background:var(--bg);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:14px;font-family:var(--sans)">
        <option value="sufi">Sufi</option>
        <option value="zen">Zen</option>
        <option value="aesop">Fabel</option>
      </select>
    </div>
    <button onclick="generateStory()" id="genStoryBtn" style="width:100%;padding:12px;border:none;border-radius:10px;background:var(--grad);color:white;font-size:14px;font-weight:600;cursor:pointer;font-family:var(--sans);min-height:44px;margin-bottom:12px">Buat Kisah</button>
    <div id="genStoryResult" style="min-height:60px">
      <div style="color:var(--dim);font-size:13px;text-align:center;padding:16px">Klik "Buat Kisah" untuk menghasilkan cerita baru</div>
    </div>
  </div>
</div>

<script>
async function generateQuote(){
  var btn=document.getElementById('genQuoteBtn'),res=document.getElementById('genQuoteResult');
  var theme=document.getElementById('quoteTheme').value;
  btn.disabled=true;btn.textContent='Membuat...';
  res.innerHTML='<div class="skel skel-line w80"></div><div class="skel skel-line w60"></div>';
  try{
    var r=await fetch('/api/generate-quote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({theme:theme})});
    var d=await r.json();
    if(d.quote){
      res.innerHTML='<div style="font-family:Georgia,serif;font-size:18px;font-style:italic;line-height:1.7;color:var(--text);padding:12px 0">"'+esc(d.quote)+'"</div><div style="display:flex;gap:8px;margin-top:8px"><button onclick="shareQuote(\\''+d.quote.replace(/'/g,"\\\\'")+'\\',' +'\\''+'AI Bijaksana\\''+')" class="qcard-btn">Salin</button><a href="/gambar?q='+encodeURIComponent(d.quote)+'&a=AI+Bijaksana" class="qcard-btn" style="text-decoration:none">Buat Gambar</a><button onclick="generateQuote()" class="qcard-btn">Buat Lagi</button></div>';
    }else{
      res.innerHTML='<div style="color:#ef4444">Gagal membuat. Coba lagi.</div>';
    }
  }catch(e){res.innerHTML='<div style="color:#ef4444">AI tidak tersedia.</div>'}
  btn.disabled=false;btn.textContent='Buat';
}

async function generateStory(){
  var btn=document.getElementById('genStoryBtn'),res=document.getElementById('genStoryResult');
  var theme=document.getElementById('storyTheme').value;
  var style=document.getElementById('storyStyle').value;
  btn.disabled=true;btn.textContent='Membuat kisah...';
  res.innerHTML='<div class="skel skel-line w80"></div><div class="skel skel-line w80"></div><div class="skel skel-line w60"></div><div class="skel skel-line w80"></div>';
  try{
    var r=await fetch('/api/generate-story',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({theme:theme,style:style})});
    var d=await r.json();
    if(d.story){
      res.innerHTML='<div style="font-size:16px;font-weight:700;margin-bottom:8px">'+esc(d.title)+'</div><div style="font-size:14px;color:var(--text);line-height:1.8;white-space:pre-line;margin-bottom:12px">'+esc(d.story)+'</div>'+(d.moral?'<div style="padding:10px 14px;background:rgba(245,158,11,.08);border-radius:10px;font-size:13px;color:var(--accent);font-style:italic"><strong>Pelajaran:</strong> '+esc(d.moral)+'</div>':'')+'<button onclick="generateStory()" class="qcard-btn" style="margin-top:10px;width:100%">Buat Kisah Lagi</button>';
    }else{
      res.innerHTML='<div style="color:#ef4444">Gagal membuat. Coba lagi.</div>';
    }
  }catch(e){res.innerHTML='<div style="color:#ef4444">AI tidak tersedia.</div>'}
  btn.disabled=false;btn.textContent='Buat Kisah';
}
</script>

<footer class="footer"><p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p></footer>`;
  return shell({ title: 'AI Generator — Buat Kata Bijak & Kisah', description: 'Buat kata bijak dan kisah bijaksana original dengan AI. Gratis dan instan.', path: '/ai', body, activeTab: '' });
}

// ── Legal Pages ───────────────────────────────────────────────

export function privacyPage() {
  return `
<div class="breadcrumb"><a href="/">Beranda</a><span>/</span><span>Kebijakan Privasi</span></div>
<article style="max-width:700px;margin:0 auto">
<h1 style="font-size:22px;font-weight:700;margin-bottom:16px">Kebijakan Privasi</h1>
<p style="color:var(--dim);font-size:12px;margin-bottom:20px">Terakhir diperbarui: 24 April 2026</p>
<div style="color:var(--muted);font-size:14px;line-height:1.8">
<h2 style="font-size:17px;font-weight:600;color:var(--text);margin:20px 0 8px">1. Informasi yang Kami Kumpulkan</h2>
<p>Bijaksana.com mengumpulkan informasi minimal untuk memberikan layanan terbaik:</p>
<ul style="margin:8px 0 8px 20px"><li><strong>Email</strong> — jika Anda berlangganan newsletter harian (opsional)</li><li><strong>Data analitik</strong> — halaman yang dikunjungi, perangkat, dan lokasi umum (melalui Cloudflare Analytics)</li><li><strong>Cookie</strong> — hanya untuk menyimpan preferensi tema (gelap/terang)</li></ul>
<p>Kami <strong>tidak</strong> mengumpulkan nama lengkap, alamat, nomor telepon, atau informasi pembayaran.</p>

<h2 style="font-size:17px;font-weight:600;color:var(--text);margin:20px 0 8px">2. Penggunaan Informasi</h2>
<p>Informasi yang dikumpulkan digunakan untuk:</p>
<ul style="margin:8px 0 8px 20px"><li>Mengirim kata bijak harian via email (jika berlangganan)</li><li>Menganalisis performa website untuk peningkatan layanan</li><li>Menyimpan preferensi pengguna (tema, riwayat pencarian)</li></ul>

<h2 style="font-size:17px;font-weight:600;color:var(--text);margin:20px 0 8px">3. Perlindungan Data (UU PDP Indonesia)</h2>
<p>Sesuai dengan Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP), kami menjamin:</p>
<ul style="margin:8px 0 8px 20px"><li>Data pribadi Anda diproses secara sah, adil, dan transparan</li><li>Data hanya dikumpulkan untuk tujuan yang jelas dan sah</li><li>Anda berhak mengakses, memperbaiki, dan menghapus data pribadi Anda</li><li>Anda dapat berhenti berlangganan kapan saja melalui link di setiap email</li></ul>

<h2 style="font-size:17px;font-weight:600;color:var(--text);margin:20px 0 8px">4. Kepatuhan GDPR (International)</h2>
<p>Untuk pengguna dari Uni Eropa dan wilayah yang tunduk pada GDPR:</p>
<ul style="margin:8px 0 8px 20px"><li>Dasar hukum pemrosesan data: persetujuan (consent) untuk newsletter, kepentingan sah (legitimate interest) untuk analitik</li><li>Anda berhak atas portabilitas data, pembatasan pemrosesan, dan hak untuk dilupakan</li><li>Data disimpan di jaringan Cloudflare dengan enkripsi end-to-end</li></ul>

<h2 style="font-size:17px;font-weight:600;color:var(--text);margin:20px 0 8px">5. Cookie dan Teknologi Pelacakan</h2>
<p>Kami menggunakan:</p>
<ul style="margin:8px 0 8px 20px"><li><strong>Cookie fungsional</strong> — menyimpan preferensi tema (localStorage)</li><li><strong>Cloudflare Analytics</strong> — analitik tanpa cookie yang menghormati privasi</li><li>Kami <strong>tidak</strong> menggunakan Google Analytics, Facebook Pixel, atau pelacak pihak ketiga</li></ul>

<h2 style="font-size:17px;font-weight:600;color:var(--text);margin:20px 0 8px">6. Penyimpanan dan Keamanan Data</h2>
<p>Semua data disimpan di infrastruktur Cloudflare (D1, KV) dengan keamanan tingkat enterprise. Data dienkripsi saat transit (HTTPS/TLS 1.3) dan saat disimpan. Kami tidak menjual atau membagikan data pribadi kepada pihak ketiga.</p>

<h2 style="font-size:17px;font-weight:600;color:var(--text);margin:20px 0 8px">7. Hak Pengguna</h2>
<p>Anda berhak untuk:</p>
<ul style="margin:8px 0 8px 20px"><li>Mengakses data pribadi yang kami simpan tentang Anda</li><li>Meminta penghapusan data (hak untuk dilupakan)</li><li>Berhenti berlangganan email kapan saja</li><li>Menolak pemrosesan data untuk tujuan tertentu</li></ul>
<p>Hubungi kami di <strong>privacy@bijaksana.com</strong> untuk permintaan terkait data pribadi.</p>

<h2 style="font-size:17px;font-weight:600;color:var(--text);margin:20px 0 8px">8. Perubahan Kebijakan</h2>
<p>Kebijakan ini dapat diperbarui sewaktu-waktu. Perubahan signifikan akan diberitahukan melalui website.</p>
</div>
</article>
<footer class="footer"><p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p></footer>`;
}

export function termsPage() {
  return `
<div class="breadcrumb"><a href="/">Beranda</a><span>/</span><span>Syarat & Ketentuan</span></div>
<article style="max-width:700px;margin:0 auto">
<h1 style="font-size:22px;font-weight:700;margin-bottom:16px">Syarat & Ketentuan</h1>
<p style="color:var(--dim);font-size:12px;margin-bottom:20px">Terakhir diperbarui: 24 April 2026</p>
<div style="color:var(--muted);font-size:14px;line-height:1.8">
<h2 style="font-size:17px;font-weight:600;color:var(--text);margin:20px 0 8px">1. Penerimaan Ketentuan</h2>
<p>Dengan mengakses dan menggunakan Bijaksana.com, Anda menyetujui syarat dan ketentuan ini sesuai dengan hukum yang berlaku di Republik Indonesia, termasuk Undang-Undang Nomor 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik (UU ITE) beserta perubahannya.</p>

<h2 style="font-size:17px;font-weight:600;color:var(--text);margin:20px 0 8px">2. Layanan</h2>
<p>Bijaksana.com menyediakan:</p>
<ul style="margin:8px 0 8px 20px"><li>Koleksi kata-kata bijak, mutiara, dan kutipan dari berbagai tokoh</li><li>Kamus Besar Bahasa Indonesia (KBBI) dan tesaurus</li><li>Koleksi puisi, pantun, peribahasa, dan idiom Indonesia</li><li>Kisah-kisah bijaksana dari berbagai tradisi</li><li>Permainan kata (Wordle Indonesia)</li><li>Newsletter harian (opsional)</li></ul>

<h2 style="font-size:17px;font-weight:600;color:var(--text);margin:20px 0 8px">3. Hak Kekayaan Intelektual</h2>
<p>Kutipan dan kata-kata bijak yang ditampilkan di website ini merupakan karya intelektual dari masing-masing pengarang/tokoh yang dikutip. Bijaksana.com menyajikan kutipan-kutipan tersebut untuk tujuan edukasi dan inspirasi sesuai dengan prinsip penggunaan wajar (fair use).</p>
<p>Konten yang dihasilkan oleh AI (makna, refleksi, terjemahan) merupakan milik Bijaksana.com. Desain, kode sumber, dan tampilan website dilindungi hak cipta.</p>

<h2 style="font-size:17px;font-weight:600;color:var(--text);margin:20px 0 8px">4. Penggunaan yang Diperbolehkan</h2>
<ul style="margin:8px 0 8px 20px"><li>Membaca, menyalin, dan membagikan kutipan untuk penggunaan pribadi dan non-komersial</li><li>Mengutip dengan menyertakan atribusi ke pengarang asli</li><li>Membagikan tautan ke halaman Bijaksana.com di media sosial</li></ul>

<h2 style="font-size:17px;font-weight:600;color:var(--text);margin:20px 0 8px">5. Penggunaan yang Dilarang</h2>
<ul style="margin:8px 0 8px 20px"><li>Menyalin seluruh database atau sebagian besar konten secara massal (scraping) untuk tujuan komersial</li><li>Menggunakan konten untuk menyebarkan kebencian, SARA, atau konten yang melanggar hukum</li><li>Mengakses sistem secara tidak sah atau mengganggu operasional website</li></ul>

<h2 style="font-size:17px;font-weight:600;color:var(--text);margin:20px 0 8px">6. DMCA & Pengaduan Hak Cipta</h2>
<p>Jika Anda yakin bahwa konten di Bijaksana.com melanggar hak cipta Anda, silakan hubungi kami di <strong>dmca@bijaksana.com</strong> dengan menyertakan: (1) identifikasi karya yang dilanggar, (2) URL konten yang dimaksud, (3) pernyataan itikad baik. Kami akan merespons dalam 14 hari kerja sesuai ketentuan UU Hak Cipta No. 28 Tahun 2014.</p>

<h2 style="font-size:17px;font-weight:600;color:var(--text);margin:20px 0 8px">7. Batasan Tanggung Jawab</h2>
<p>Bijaksana.com menyajikan konten "sebagaimana adanya" tanpa jaminan keakuratan. Definisi KBBI bersumber dari database publik dan mungkin tidak selalu mencerminkan edisi terbaru. Kutipan mungkin tidak terverifikasi sepenuhnya. Kami tidak bertanggung jawab atas kerugian yang timbul dari penggunaan konten website.</p>

<h2 style="font-size:17px;font-weight:600;color:var(--text);margin:20px 0 8px">8. Hukum yang Berlaku</h2>
<p>Syarat dan ketentuan ini tunduk pada hukum Republik Indonesia. Sengketa yang timbul akan diselesaikan melalui musyawarah, dan jika tidak tercapai, melalui pengadilan yang berwenang di Indonesia.</p>

<h2 style="font-size:17px;font-weight:600;color:var(--text);margin:20px 0 8px">9. Kontak</h2>
<p>Untuk pertanyaan tentang syarat dan ketentuan ini, hubungi:<br><strong>Email:</strong> hello@bijaksana.com<br><strong>Website:</strong> bijaksana.com</p>
</div>
</article>
<footer class="footer"><p>&copy; 2026 bijaksana.com &middot; <a href="/privasi">Privasi</a> &middot; <a href="/ketentuan">Ketentuan</a></p></footer>`;
}

// Export helpers for use in index.js inline templates
export { quoteCard as quoteCard };
export { pagination as paginationHtml };

export function notFoundPage() {
  const body = `
<div style="text-align:center;padding:60px 20px">
  <div style="font-size:64px;margin-bottom:16px">&#x1F50D;</div>
  <h1 style="font-size:22px;font-weight:700;margin-bottom:8px">Halaman Tidak Ditemukan</h1>
  <p style="color:var(--muted);font-size:14px;margin-bottom:24px">Maaf, halaman yang Anda cari tidak tersedia.</p>
  <a href="/" style="color:var(--accent);text-decoration:none;font-weight:500">&larr; Kembali ke Beranda</a>
</div>`;
  return shell({ title: 'Tidak Ditemukan', path: '/404', body, activeTab: '' });
}

// ── Helpers ──────────────────────────────────────────────────

function quoteCard(q, showMeaning) {
  const authorPhoto = q.photo_url || q.author_photo || '';
  const displayText = q.text_id || q.text;
  const authorName = q.author_name || q.author || '';
  const initial = authorName ? authorName.charAt(0).toUpperCase() : '?';
  return `<div class="qcard fade-up">
  <div class="qcard-header">
    <a href="/tokoh/${q.author_slug || ''}">
      ${authorPhoto ? `<img src="${authorPhoto}" alt="${escHtml(authorName)}" class="qcard-avatar" loading="lazy" width="36" height="36" onerror="this.outerHTML='<div class=qcard-avatar-letter>${initial}</div>'">` : `<div class="qcard-avatar-letter">${initial}</div>`}
    </a>
    <div>
      <div class="qcard-author-name"><a href="/tokoh/${q.author_slug || ''}">${authorName}</a></div>
      <a href="/kategori/${q.category_slug || ''}" class="qcard-cat-inline">${q.category_name || ''}</a>
    </div>
  </div>
  <div class="qcard-text"><a href="/kata-bijak/${q.slug}">${escHtml(displayText)}</a></div>
  ${showMeaning && q.meaning ? `<div class="qcard-meaning">
    <div class="qcard-meaning-label">Makna</div>
    <div class="qcard-meaning-text">${escHtml(q.meaning)}</div>
  </div>` : ''}
  <div class="qcard-actions">
    <button class="qcard-btn" onclick="voteQuote(${q.id},1,this)">&#x1F44D;${q.likes ? ' ' + q.likes : ''}</button>
    <button class="qcard-btn" onclick="shareQuote('${escJs(displayText)}','${escJs(authorName)}')">&#x1F4CB; Salin</button>
    <button class="qcard-btn" onclick="waShare('${escJs(displayText)}','${escJs(authorName)}')">&#x1F4AC; WA</button>
    <a href="/gambar?q=${encodeURIComponent(displayText.substring(0,150))}&a=${encodeURIComponent(authorName)}" class="qcard-btn" style="text-decoration:none">&#x1F5BC; Gambar</a>
  </div>
</div>`;
}

function pagination({ page, totalPages, total } = {}, basePath = '') {
  if (!totalPages || totalPages <= 1) return '';
  const sep = basePath.includes('?') ? '&' : '?';
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 2) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }
  return `<nav style="display:flex;justify-content:center;gap:6px;margin:24px 0;flex-wrap:wrap" aria-label="Pagination">
    ${page > 1 ? `<a href="${basePath}${sep}hal=${page - 1}" style="padding:10px 14px;border:1px solid var(--border);border-radius:10px;color:var(--muted);text-decoration:none;font-size:13px;min-height:44px;display:flex;align-items:center">&laquo; Prev</a>` : ''}
    ${pages.map(p => p === '...'
      ? '<span style="padding:10px 6px;color:var(--dim);font-size:13px">...</span>'
      : `<a href="${basePath}${sep}hal=${p}" style="padding:10px 14px;border:1px solid ${p === page ? 'var(--accent)' : 'var(--border)'};border-radius:10px;color:${p === page ? 'var(--accent)' : 'var(--muted)'};text-decoration:none;font-size:13px;font-weight:${p === page ? '700' : '400'};min-height:44px;display:flex;align-items:center;${p === page ? 'background:rgba(245,158,11,.08)' : ''}">${p}</a>`
    ).join('')}
    ${page < totalPages ? `<a href="${basePath}${sep}hal=${page + 1}" style="padding:10px 14px;border:1px solid var(--border);border-radius:10px;color:var(--muted);text-decoration:none;font-size:13px;min-height:44px;display:flex;align-items:center">Next &raquo;</a>` : ''}
  </nav>`;
}

function skeletonCard() {
  return `<div class="qcard"><div class="skel skel-line w80"></div><div class="skel skel-line w60"></div><div class="skel skel-line w40"></div></div>`;
}

function escHtml(s) {
  if (!s) return '';
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function cleanKBBI(s) {
  if (!s) return '';
  // Allow only safe formatting tags, strip everything else
  return s.replace(/<(?!\/?(?:b|i|sup|sub|br|em|strong)\b)[^>]+>/gi, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function stripHTML(s) {
  if (!s) return '';
  return s.replace(/<[^>]+>/g, '').replace(/&\w+;/g, ' ').replace(/\s+/g, ' ').trim();
}

function escJs(s) {
  if (!s) return '';
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

// ── SEO static files ──────────────────────────────────────────

export const ROBOTS_TXT = `User-agent: *
Allow: /
Crawl-delay: 1

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;

export const LLMS_TXT = `# Bijaksana
> Kumpulan kata-kata bijak dan mutiara terbaik dalam Bahasa Indonesia

Bijaksana.com adalah platform kata-kata bijak terbesar di Indonesia dengan 136.000+ kutipan, 114.000+ definisi KBBI, 20.000+ sinonim/antonim, 5.500+ puisi, 2.100+ peribahasa, dan konten bahasa Indonesia lainnya.

## Fitur
- 136.000+ kata bijak dari 14.700+ tokoh terkenal dunia dan Indonesia
- 114.000+ definisi kata (KBBI)
- 20.000+ sinonim dan antonim (Tesaurus)
- 5.500+ puisi Indonesia
- 2.100+ peribahasa dengan makna
- 2.100+ idiom dan ungkapan
- 5.000+ kamus bahasa gaul/slang
- 450+ kisah bijaksana (Aesop, Zen, Sufi)
- 430+ pantun
- Permainan tebak kata (Wordle Indonesia)
- AI-powered makna dan refleksi per kutipan
- Terjemahan otomatis Inggris-Indonesia
- WhatsApp sharing

## Konten Utama
- /kategori — Jelajahi berdasarkan tema
- /tokoh — Jelajahi berdasarkan pengarang
- /kata-bijak/[slug] — Halaman individual per kutipan

## Bahasa
- Indonesia (utama)

## Kontak
- Website: ${SITE}
`;

// Sitemap index — splits into multiple sitemaps for 300K+ URLs
export function sitemapIndex(counts) {
  const sitemaps = [
    'sitemap-pages.xml',
    'sitemap-quotes.xml',
    'sitemap-quotes-2.xml',
    'sitemap-quotes-3.xml',
    'sitemap-authors.xml',
    'sitemap-kbbi.xml',
    'sitemap-kbbi-2.xml',
    'sitemap-kbbi-3.xml',
    'sitemap-puisi.xml',
    'sitemap-stories.xml',
  ];
  const today = new Date().toISOString().split('T')[0];
  const entries = sitemaps.map(s => `<sitemap><loc>${SITE}/${s}</loc><lastmod>${today}</lastmod></sitemap>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>`;
}

export function sitemapXml(items, prefix, priority = '0.5') {
  const urls = items.map(i => `<url><loc>${SITE}/${prefix}/${i.slug}</loc><priority>${priority}</priority></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

export function sitemapPages() {
  const today = new Date().toISOString().split('T')[0];
  const pages = [
    { path: '/', freq: 'daily', pri: '1.0' },
    { path: '/kategori', freq: 'weekly', pri: '0.8' },
    { path: '/tokoh', freq: 'weekly', pri: '0.8' },
    { path: '/arti-kata', freq: 'weekly', pri: '0.8' },
    { path: '/peribahasa', freq: 'weekly', pri: '0.7' },
    { path: '/puisi', freq: 'weekly', pri: '0.7' },
    { path: '/pantun', freq: 'weekly', pri: '0.7' },
    { path: '/tesaurus', freq: 'weekly', pri: '0.7' },
    { path: '/slang', freq: 'weekly', pri: '0.6' },
    { path: '/idiom', freq: 'weekly', pri: '0.7' },
    { path: '/kisah', freq: 'weekly', pri: '0.7' },
    { path: '/ucapan', freq: 'weekly', pri: '0.7' },
    { path: '/wordle', freq: 'daily', pri: '0.6' },
    { path: '/hari-ini', freq: 'daily', pri: '0.8' },
    { path: '/populer', freq: 'daily', pri: '0.8' },
  ];
  const urls = pages.map(p => `<url><loc>${SITE}${p.path}</loc><lastmod>${today}</lastmod><changefreq>${p.freq}</changefreq><priority>${p.pri}</priority></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

export const MANIFEST = JSON.stringify({
  name: 'Bijaksana — Kata Bijak Harian',
  short_name: 'Bijaksana',
  description: SITE_DESC,
  start_url: '/',
  display: 'standalone',
  background_color: '#0a0a0b',
  theme_color: '#f59e0b',
  icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
});
