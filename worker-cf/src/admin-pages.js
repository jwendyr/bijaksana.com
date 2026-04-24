// Bijaksana Admin — Embedded HTML/CSS/JS pages
// Converted from static files to JS template strings

export const loginPage = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Login - Bijaksana Admin</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:#0a0a0b;color:#fafafa;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}
.card{text-align:center;padding:48px 40px;border:1px solid #222225;border-radius:20px;background:#111113;max-width:400px;width:100%}
.logo{font-size:48px;margin-bottom:8px}
.title{font-size:24px;font-weight:700;background:linear-gradient(135deg,#f59e0b,#f97316);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:4px}
.subtitle{color:#71717a;font-size:13px;margin-bottom:32px}
.wallets{display:flex;gap:12px;justify-content:center}
.wallet-btn{display:flex;flex-direction:column;align-items:center;gap:8px;padding:18px 28px;border:1px solid #222225;border-radius:14px;background:#0a0a0b;cursor:pointer;transition:all .2s;color:#a1a1aa;font-size:12px;font-weight:500;font-family:inherit}
.wallet-btn:hover{border-color:#f59e0b;color:#f59e0b;background:#f59e0b08}
.wallet-btn img{width:36px;height:36px;border-radius:8px}
.status{margin-top:24px;font-size:14px;padding:12px 16px;border-radius:10px;display:none}
.s-signing{color:#f59e0b;background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.2)}
.s-verifying{color:#f59e0b;background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.2)}
.s-error{color:#ef4444;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2)}
.s-success{color:#22c55e;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.2)}
.retry{color:#f59e0b;cursor:pointer;border:none;background:none;font-size:13px;margin-top:12px;text-decoration:underline;font-family:inherit;display:none}
.hint{color:#52525b;font-size:11px;margin-top:28px;line-height:1.7}
.back-link{display:inline-block;margin-top:20px;color:#71717a;text-decoration:none;font-size:13px}
.back-link:hover{color:#f59e0b}
</style>
</head>
<body>
<div class="card">
  <div class="logo">\u{1FAB7}</div>
  <div class="title">Bijaksana Admin</div>
  <p class="subtitle">Connect your Solana wallet to authenticate</p>
  <div class="wallets" id="wallets">
    <button class="wallet-btn" onclick="connectWallet('phantom')">
      <img src="https://raw.githubusercontent.com/nicnocquee/solana-wallet-logos/refs/heads/main/phantom.png" alt="Phantom" onerror="this.textContent='\\u{1F47B}'">
      Phantom
    </button>
    <button class="wallet-btn" onclick="connectWallet('solflare')">
      <img src="https://raw.githubusercontent.com/nicnocquee/solana-wallet-logos/refs/heads/main/solflare.png" alt="Solflare" onerror="this.textContent='\\u{1F506}'">
      Solflare
    </button>
  </div>
  <div id="status" class="status"></div>
  <button id="retry" class="retry" onclick="reset()">Coba lagi</button>
  <p class="hint">
    Supports Phantom, Solflare, Jupiter &amp; Ledger hardware wallets.<br>
    No SOL is spent \\u2014 the transaction is never broadcast.
  </p>
  <a href="/" class="back-link">\\u2190 Kembali ke Bijaksana</a>
</div>
<script src="https://unpkg.com/@solana/web3.js@1.98.0/lib/index.iife.min.js"></script>
<script src="https://unpkg.com/bs58@6.0.0/dist/bs58.bundle.min.js"></script>
<script>
const {Transaction, SystemProgram} = solanaWeb3;
function show(msg, type) {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.className = 'status s-' + type;
  el.style.display = 'block';
  document.getElementById('retry').style.display = type === 'error' ? 'block' : 'none';
  document.getElementById('wallets').style.display = type === 'error' || type === '' ? 'flex' : 'none';
}
function reset() {
  document.getElementById('status').style.display = 'none';
  document.getElementById('retry').style.display = 'none';
  document.getElementById('wallets').style.display = 'flex';
}
function randomBlockhash() {
  const b = new Uint8Array(32);
  crypto.getRandomValues(b);
  return bs58.encode(b);
}
async function getProvider(name) {
  if (name === 'phantom') {
    const p = window.phantom?.solana || window.solana;
    if (p?.isPhantom) return p;
    window.open('https://phantom.app/', '_blank');
    throw new Error('Phantom wallet not installed');
  }
  if (name === 'solflare') {
    if (window.solflare?.isSolflare) return window.solflare;
    window.open('https://solflare.com/', '_blank');
    throw new Error('Solflare wallet not installed');
  }
}
async function connectWallet(name) {
  try {
    const provider = await getProvider(name);
    show('Connecting wallet...', 'signing');
    const resp = await provider.connect();
    const publicKey = resp.publicKey;
    const pubStr = publicKey.toString();
    const cRes = await fetch('/admin/auth/challenge', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({wallet: pubStr}),
    });
    const {nonce} = await cRes.json();
    if (!nonce) throw new Error('Failed to get challenge');
    show('Approve the transaction in your wallet...', 'signing');
    const tx = new Transaction({
      feePayer: publicKey,
      recentBlockhash: randomBlockhash(),
    });
    tx.add(SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: publicKey,
      lamports: 0,
    }));
    const signed = await provider.signTransaction(tx);
    const sig = signed.signatures[0];
    if (!sig?.signature) throw new Error('No signature returned');
    show('Verifying signature...', 'verifying');
    const vRes = await fetch('/admin/auth/verify', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        publicKey: pubStr,
        signature: bs58.encode(sig.signature),
        nonce,
        message: bs58.encode(signed.serializeMessage()),
      }),
    });
    const result = await vRes.json();
    if (result.success) {
      show('Authenticated! Redirecting...', 'success');
      setTimeout(() => window.location.href = '/admin', 500);
    } else {
      show(result.error || 'Authentication failed', 'error');
      provider.disconnect?.();
    }
  } catch (err) {
    show(err.message || 'Authentication failed', 'error');
  }
}
</script>
</body>
</html>`;

export const dashboardPage = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin - Bijaksana</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/admin/admin.css">
</head>
<body>
  <div class="admin-layout">
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <div class="logo">\u{1FAB7}</div>
        <div class="brand">Bijaksana</div>
        <div class="sub">Admin Panel</div>
      </div>
      <nav class="sidebar-nav">
        <a class="nav-item active" data-section="dashboard" onclick="showSection('dashboard')">
          <span class="icon">\u{1F4CA}</span> Dashboard
        </a>
        <a class="nav-item" data-section="subscribers" onclick="showSection('subscribers')">
          <span class="icon">\u{1F465}</span> Subscriber
        </a>
        <a class="nav-item" data-section="quotes" onclick="showSection('quotes')">
          <span class="icon">\u{1F4DC}</span> Riwayat Quote
        </a>
        <a class="nav-item" data-section="testemail" onclick="showSection('testemail')">
          <span class="icon">\u{1F4E7}</span> Test Email
        </a>
      </nav>
      <div class="sidebar-footer">
        <a href="https://bijaksana.org" target="_blank">\u{1F517} Lihat Website</a>
        <a href="/admin/logout">\u{1F6AA} Keluar</a>
      </div>
    </aside>
    <div class="main">
      <header class="topbar">
        <div style="display:flex;align-items:center;gap:12px;">
          <button class="hamburger" onclick="document.getElementById('sidebar').classList.toggle('open')">\u2630</button>
          <span class="topbar-title" id="pageTitle">Dashboard</span>
        </div>
        <div class="topbar-right">
          <span class="topbar-user">Admin</span>
          <a href="/admin/logout" class="btn-logout">Keluar</a>
        </div>
      </header>
      <div class="content">
        <div id="sec-dashboard" class="section active">
          <div class="stats-grid" id="statsGrid">
            <div class="stat-card"><div class="stat-label">Total Subscriber</div><div class="stat-value accent" id="statTotal">-</div></div>
            <div class="stat-card"><div class="stat-label">Aktif</div><div class="stat-value green" id="statActive">-</div></div>
            <div class="stat-card"><div class="stat-label">Berhenti</div><div class="stat-value red" id="statUnsub">-</div></div>
            <div class="stat-card"><div class="stat-label">Total Quote</div><div class="stat-value" id="statQuotes">-</div></div>
            <div class="stat-card"><div class="stat-label">Email Terkirim</div><div class="stat-value accent" id="statEmails">-</div></div>
            <div class="stat-card"><div class="stat-label">Gagal Kirim</div><div class="stat-value red" id="statFailed">-</div></div>
          </div>
          <div class="charts-grid">
            <div class="chart-card"><h3>\u{1F4C8} Pertumbuhan Subscriber (30 hari)</h3><div class="chart-wrap"><canvas id="chartGrowth"></canvas></div></div>
            <div class="chart-card"><h3>\u{1F4CA} Email Delivery (30 hari)</h3><div class="chart-wrap"><canvas id="chartEmails"></canvas></div></div>
          </div>
          <div class="quote-card" id="todayQuote" style="display:none;">
            <div class="gradient-bar"></div>
            <div class="quote-body">
              <div class="quote-label">Quote Hari Ini</div>
              <blockquote id="quoteText"></blockquote>
              <div class="quote-author" id="quoteAuthor"></div>
            </div>
          </div>
          <div class="table-card">
            <div class="table-header"><h3>Subscriber Terbaru</h3></div>
            <table><thead><tr><th>Email</th><th>Tanggal</th><th>Status</th></tr></thead><tbody id="recentSubsBody"></tbody></table>
          </div>
        </div>
        <div id="sec-subscribers" class="section">
          <div class="table-card">
            <div class="table-header">
              <h3>Semua Subscriber (<span id="subCount">0</span>)</h3>
              <div class="table-actions">
                <input type="text" class="search-input" placeholder="Cari email..." id="subSearch" oninput="filterSubscribers()">
                <button class="btn btn-primary" onclick="openAddModal()">+ Tambah</button>
              </div>
            </div>
            <table><thead><tr><th>Email</th><th>Terdaftar</th><th>Status</th><th>Aksi</th></tr></thead><tbody id="subsBody"></tbody></table>
            <div id="subsEmpty" class="empty-state" style="display:none;">Tidak ada subscriber</div>
          </div>
        </div>
        <div id="sec-quotes" class="section">
          <div class="table-card">
            <div class="table-header"><h3>Riwayat Quote (<span id="quoteCount">0</span>)</h3></div>
            <table><thead><tr><th>Tanggal</th><th>Quote</th><th>Pengarang</th><th>Tema</th><th>Terkirim</th></tr></thead><tbody id="quotesBody"></tbody></table>
            <div id="quotesEmpty" class="empty-state" style="display:none;">Belum ada riwayat quote</div>
          </div>
        </div>
        <div id="sec-testemail" class="section">
          <div class="test-form">
            <h3>\u{1F4E7} Kirim Test Email</h3>
            <p style="color:var(--text-muted);font-size:13px;margin-bottom:16px;">Kirim email test dengan quote terbaru ke alamat email tertentu.</p>
            <div class="form-row">
              <input type="email" id="testEmailInput" placeholder="contoh@email.com">
              <button class="btn btn-primary" id="btnTestEmail" onclick="sendTestEmail()">Kirim</button>
            </div>
            <div id="testResult" class="result-msg"></div>
          </div>
          <div class="quote-card" id="previewQuote" style="margin-top:20px;display:none;">
            <div class="gradient-bar"></div>
            <div class="quote-body">
              <div class="quote-label">Preview Quote Terakhir</div>
              <blockquote id="previewText"></blockquote>
              <div class="quote-author" id="previewAuthor"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-overlay" id="addModal">
    <div class="modal">
      <h3>Tambah Subscriber</h3>
      <input type="email" id="addEmailInput" placeholder="email@contoh.com" onkeydown="if(event.key==='Enter')addSubscriber()">
      <div class="modal-actions">
        <button class="btn btn-danger" onclick="closeAddModal()">Batal</button>
        <button class="btn btn-primary" id="btnAdd" onclick="addSubscriber()">Tambah</button>
      </div>
    </div>
  </div>
  <div class="toast" id="toast"></div>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>
  <script src="/admin/admin.js"></script>
</body>
</html>`;

export const adminCss = `/* Bijaksana Admin Dashboard */
:root {
  --bg: #0a0a0b;
  --bg-card: #111113;
  --bg-hover: #18181b;
  --border: #222225;
  --text: #fafafa;
  --text-muted: #a1a1aa;
  --text-dim: #71717a;
  --accent: #f59e0b;
  --accent-2: #f97316;
  --green: #22c55e;
  --red: #ef4444;
  --gradient: linear-gradient(135deg, #f59e0b, #f97316, #ef4444);
  --sans: 'Inter', -apple-system, sans-serif;
  --sidebar-w: 220px;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: var(--sans); background: var(--bg); color: var(--text); }
.admin-layout { display: flex; min-height: 100vh; }
.sidebar { width: var(--sidebar-w); background: #0d0d0f; border-right: 1px solid var(--border); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; }
.sidebar-header { padding: 20px; border-bottom: 1px solid var(--border); text-align: center; }
.sidebar-header .logo { font-size: 32px; }
.sidebar-header .brand { font-size: 16px; font-weight: 700; background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.sidebar-header .sub { color: var(--text-dim); font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; }
.sidebar-nav { flex: 1; padding: 12px 0; }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 11px 20px; color: var(--text-muted); text-decoration: none; font-size: 14px; font-weight: 500; border-left: 3px solid transparent; cursor: pointer; transition: all 0.15s; }
.nav-item:hover { color: var(--text); background: rgba(255,255,255,0.03); }
.nav-item.active { color: var(--accent); border-left-color: var(--accent); background: rgba(245, 158, 11, 0.05); }
.nav-item .icon { font-size: 16px; width: 22px; text-align: center; }
.sidebar-footer { padding: 16px 20px; border-top: 1px solid var(--border); }
.sidebar-footer a { display: block; color: var(--text-dim); text-decoration: none; font-size: 13px; padding: 6px 0; }
.sidebar-footer a:hover { color: var(--accent); }
.main { flex: 1; margin-left: var(--sidebar-w); min-height: 100vh; }
.topbar { display: flex; align-items: center; justify-content: space-between; padding: 16px 32px; border-bottom: 1px solid var(--border); background: rgba(10,10,11,0.8); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 50; }
.topbar-title { font-size: 18px; font-weight: 600; }
.topbar-right { display: flex; align-items: center; gap: 16px; }
.topbar-user { color: var(--text-dim); font-size: 13px; }
.btn-logout { padding: 6px 14px; background: transparent; border: 1px solid var(--border); border-radius: 6px; color: var(--text-muted); font-size: 12px; font-family: inherit; cursor: pointer; transition: all 0.15s; text-decoration: none; }
.btn-logout:hover { border-color: var(--red); color: var(--red); }
.content { padding: 28px 32px; max-width: 1200px; }
.section { display: none; }
.section.active { display: block; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
.stat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
.stat-card .stat-label { color: var(--text-dim); font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
.stat-card .stat-value { font-size: 32px; font-weight: 700; color: var(--text); }
.stat-card .stat-value.accent { color: var(--accent); }
.stat-card .stat-value.green { color: var(--green); }
.stat-card .stat-value.red { color: var(--red); }
.charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
.chart-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
.chart-card h3 { font-size: 14px; color: var(--text-muted); margin-bottom: 16px; font-weight: 500; }
.chart-wrap { position: relative; height: 220px; }
.quote-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin-bottom: 24px; }
.quote-card .gradient-bar { height: 3px; background: var(--gradient); }
.quote-card .quote-body { padding: 24px; }
.quote-card .quote-label { color: var(--text-dim); font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
.quote-card blockquote { font-style: italic; font-size: 18px; line-height: 1.6; color: var(--text); margin-bottom: 8px; }
.quote-card .quote-author { color: var(--accent); font-size: 14px; font-weight: 500; }
.table-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
.table-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); }
.table-header h3 { font-size: 15px; font-weight: 600; }
.table-actions { display: flex; gap: 10px; align-items: center; }
table { width: 100%; border-collapse: collapse; }
th { padding: 10px 20px; text-align: left; color: var(--text-dim); font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 500; border-bottom: 1px solid var(--border); background: rgba(255,255,255,0.02); }
td { padding: 12px 20px; font-size: 14px; border-bottom: 1px solid rgba(34,34,37,0.5); color: var(--text-muted); }
tr:hover td { background: rgba(255,255,255,0.02); }
td.email { color: var(--text); font-weight: 500; }
td.quote-text { max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.badge-active { background: rgba(34,197,94,0.1); color: var(--green); }
.badge-inactive { background: rgba(239,68,68,0.1); color: var(--red); }
.btn { padding: 8px 16px; border: none; border-radius: 8px; font-size: 13px; font-weight: 500; font-family: inherit; cursor: pointer; transition: opacity 0.15s; }
.btn:hover { opacity: 0.85; }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-primary { background: linear-gradient(135deg, var(--accent), var(--accent-2)); color: white; }
.btn-danger { background: rgba(239,68,68,0.15); color: var(--red); border: 1px solid rgba(239,68,68,0.2); }
.btn-danger:hover { background: rgba(239,68,68,0.25); }
.btn-sm { padding: 5px 10px; font-size: 12px; }
.search-input { padding: 9px 14px; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-size: 13px; font-family: inherit; outline: none; width: 250px; transition: border-color 0.2s; }
.search-input:focus { border-color: var(--accent); }
.search-input::placeholder { color: var(--text-dim); }
.test-form { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 24px; max-width: 500px; }
.test-form h3 { font-size: 16px; margin-bottom: 16px; }
.test-form .form-row { display: flex; gap: 10px; margin-bottom: 16px; }
.test-form input { flex: 1; padding: 10px 14px; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-size: 14px; font-family: inherit; outline: none; }
.test-form input:focus { border-color: var(--accent); }
.result-msg { padding: 10px 14px; border-radius: 8px; font-size: 13px; display: none; }
.result-msg.success { display: block; background: rgba(34,197,94,0.1); color: var(--green); border: 1px solid rgba(34,197,94,0.2); }
.result-msg.error { display: block; background: rgba(239,68,68,0.1); color: var(--red); border: 1px solid rgba(239,68,68,0.2); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 200; display: none; }
.modal-overlay.show { display: flex; }
.modal { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 28px; width: 100%; max-width: 400px; }
.modal h3 { margin-bottom: 16px; }
.modal input { width: 100%; padding: 10px 14px; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-size: 14px; font-family: inherit; outline: none; margin-bottom: 16px; }
.modal input:focus { border-color: var(--accent); }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
.toast { position: fixed; bottom: 24px; right: 24px; padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 500; z-index: 300; animation: slideIn 0.3s ease; display: none; }
.toast.show { display: block; }
.toast.success { background: rgba(34,197,94,0.15); color: var(--green); border: 1px solid rgba(34,197,94,0.3); }
.toast.error { background: rgba(239,68,68,0.15); color: var(--red); border: 1px solid rgba(239,68,68,0.3); }
@keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.empty-state { text-align: center; padding: 40px; color: var(--text-dim); font-size: 14px; }
@media (max-width: 768px) {
  .sidebar { transform: translateX(-100%); transition: transform 0.3s; }
  .sidebar.open { transform: translateX(0); }
  .main { margin-left: 0; }
  .topbar { padding: 12px 16px; }
  .content { padding: 16px; }
  .charts-grid { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .search-input { width: 150px; }
  .hamburger { display: block; }
}
@media (min-width: 769px) { .hamburger { display: none; } }
.hamburger { background: none; border: none; color: var(--text-muted); font-size: 20px; cursor: pointer; padding: 4px; }`;

export const adminJs = `// Bijaksana Admin Dashboard - Client JS (Worker version)
let allSubscribers = [];
let allQuotes = [];
let growthChart = null;
let emailChart = null;

function showSection(section) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('sec-' + section).classList.add('active');
  document.querySelector('[data-section="' + section + '"]').classList.add('active');
  const titles = { dashboard: 'Dashboard', subscribers: 'Subscriber', quotes: 'Riwayat Quote', testemail: 'Test Email' };
  document.getElementById('pageTitle').textContent = titles[section] || 'Dashboard';
  document.getElementById('sidebar').classList.remove('open');
  if (section === 'dashboard') loadDashboard();
  if (section === 'subscribers') loadSubscribers();
  if (section === 'quotes') loadQuotes();
  if (section === 'testemail') loadTestEmailPreview();
}

async function apiFetch(url, options) {
  try {
    const res = await fetch(url, options || {});
    if (res.status === 401) { window.location.href = '/admin/login'; return null; }
    return res;
  } catch (err) { showToast('Koneksi gagal', 'error'); return null; }
}

async function loadDashboard() {
  const res = await apiFetch('/admin/api/dashboard');
  if (!res) return;
  const data = await res.json();
  document.getElementById('statTotal').textContent = data.totalSubscribers;
  document.getElementById('statActive').textContent = data.activeSubscribers;
  document.getElementById('statUnsub').textContent = data.unsubscribed;
  document.getElementById('statQuotes').textContent = data.totalQuotesSent;
  document.getElementById('statEmails').textContent = data.totalEmailsSent;
  document.getElementById('statFailed').textContent = data.totalFailed;
  if (data.todayQuote) {
    document.getElementById('todayQuote').style.display = 'block';
    document.getElementById('quoteText').textContent = '"' + data.todayQuote.quote + '"';
    document.getElementById('quoteAuthor').textContent = '\\u2014 ' + data.todayQuote.author;
  }
  const tbody = document.getElementById('recentSubsBody');
  tbody.innerHTML = data.recentSubscribers.map(function(s) {
    return '<tr><td class="email">' + esc(s.email) + '</td><td>' + formatDate(s.subscribedAt) + '</td><td>' + (s.active ? '<span class="badge badge-active">Aktif</span>' : '<span class="badge badge-inactive">Nonaktif</span>') + '</td></tr>';
  }).join('') || '<tr><td colspan="3" class="empty-state">Belum ada subscriber</td></tr>';
  loadGrowthChart();
  loadEmailChart();
}

async function loadGrowthChart() {
  const res = await apiFetch('/admin/api/stats/growth?days=30');
  if (!res) return;
  const data = await res.json();
  const labels = data.map(function(d) { return formatShortDate(d.date); });
  if (growthChart) growthChart.destroy();
  var ctx = document.getElementById('chartGrowth').getContext('2d');
  growthChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        { label: 'Total Aktif', data: data.map(function(d){return d.cumulative}), borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.08)', fill: true, tension: 0.3, pointRadius: 2 },
        { label: 'Baru', data: data.map(function(d){return d['new']}), borderColor: '#22c55e', fill: false, tension: 0.3, pointRadius: 2 },
        { label: 'Berhenti', data: data.map(function(d){return d.unsub}), borderColor: '#ef4444', fill: false, tension: 0.3, pointRadius: 2 },
      ],
    },
    options: chartOptions(),
  });
}

async function loadEmailChart() {
  const res = await apiFetch('/admin/api/stats/emails?days=30');
  if (!res) return;
  const data = await res.json();
  if (emailChart) emailChart.destroy();
  var ctx = document.getElementById('chartEmails').getContext('2d');
  emailChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(function(d){return formatShortDate(d.date)}),
      datasets: [
        { label: 'Terkirim', data: data.map(function(d){return d.sent}), backgroundColor: '#f59e0b', borderRadius: 3 },
        { label: 'Gagal', data: data.map(function(d){return d.failed}), backgroundColor: '#ef4444', borderRadius: 3 },
      ],
    },
    options: Object.assign({}, chartOptions(), { scales: Object.assign({}, chartOptions().scales, { x: Object.assign({}, chartOptions().scales.x, {stacked:true}), y: Object.assign({}, chartOptions().scales.y, {stacked:true}) }) }),
  });
}

function chartOptions() {
  return {
    responsive: true, maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: { labels: { color: '#a1a1aa', font: { family: 'Inter', size: 11 }, boxWidth: 12, padding: 12 } },
      tooltip: { backgroundColor: '#1e1e22', titleColor: '#fafafa', bodyColor: '#a1a1aa', borderColor: '#333', borderWidth: 1, cornerRadius: 8, padding: 10 },
    },
    scales: {
      x: { ticks: { color: '#71717a', font: { size: 10 }, maxRotation: 45 }, grid: { color: 'rgba(34,34,37,0.5)' } },
      y: { ticks: { color: '#71717a', font: { size: 10 } }, grid: { color: 'rgba(34,34,37,0.5)' }, beginAtZero: true },
    },
  };
}

async function loadSubscribers() {
  const res = await apiFetch('/admin/api/subscribers');
  if (!res) return;
  allSubscribers = await res.json();
  renderSubscribers(allSubscribers);
}

function renderSubscribers(list) {
  document.getElementById('subCount').textContent = list.length;
  var tbody = document.getElementById('subsBody');
  var empty = document.getElementById('subsEmpty');
  if (list.length === 0) { tbody.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  tbody.innerHTML = list.map(function(s) {
    return '<tr><td class="email">' + esc(s.email) + '</td><td>' + formatDate(s.subscribedAt) + '</td><td>' + (s.active !== false ? '<span class="badge badge-active">Aktif</span>' : '<span class="badge badge-inactive">Nonaktif</span>') + '</td><td><button class="btn btn-danger btn-sm" onclick="deleteSubscriber(\\'' + esc(s.email) + '\\')" ' + (s.active === false ? 'disabled title="Sudah nonaktif"' : '') + '>Hapus</button></td></tr>';
  }).join('');
}

function filterSubscribers() {
  var query = document.getElementById('subSearch').value.toLowerCase();
  renderSubscribers(allSubscribers.filter(function(s) { return s.email.toLowerCase().includes(query); }));
}

function openAddModal() { document.getElementById('addModal').classList.add('show'); document.getElementById('addEmailInput').value = ''; document.getElementById('addEmailInput').focus(); }
function closeAddModal() { document.getElementById('addModal').classList.remove('show'); }

async function addSubscriber() {
  var email = document.getElementById('addEmailInput').value.trim();
  if (!email) return;
  var btn = document.getElementById('btnAdd');
  btn.disabled = true; btn.textContent = 'Menambah...';
  var res = await apiFetch('/admin/api/subscribers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email }) });
  if (res) { var data = await res.json(); if (data.success) { showToast(data.message, 'success'); closeAddModal(); loadSubscribers(); } else { showToast(data.error, 'error'); } }
  btn.disabled = false; btn.textContent = 'Tambah';
}

async function deleteSubscriber(email) {
  if (!confirm('Hapus subscriber ' + email + '?')) return;
  var res = await apiFetch('/admin/api/subscribers/' + encodeURIComponent(email), { method: 'DELETE' });
  if (res) { var data = await res.json(); if (data.success) { showToast(data.message, 'success'); loadSubscribers(); } else { showToast(data.error, 'error'); } }
}

async function loadQuotes() {
  var res = await apiFetch('/admin/api/quotes');
  if (!res) return;
  allQuotes = await res.json();
  document.getElementById('quoteCount').textContent = allQuotes.length;
  var tbody = document.getElementById('quotesBody');
  var empty = document.getElementById('quotesEmpty');
  if (allQuotes.length === 0) { tbody.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  tbody.innerHTML = allQuotes.map(function(q) {
    return '<tr title="' + esc(q.quote) + '"><td>' + (q.dateFormatted || q.date) + '</td><td class="quote-text">"' + esc(q.quote) + '"</td><td>' + esc(q.author) + '</td><td>' + esc(q.theme || '-') + '</td><td>' + (q.sentTo || 0) + '</td></tr>';
  }).join('');
}

async function loadTestEmailPreview() {
  var res = await apiFetch('/admin/api/quotes');
  if (!res) return;
  var quotes = await res.json();
  if (quotes.length > 0) {
    document.getElementById('previewQuote').style.display = 'block';
    document.getElementById('previewText').textContent = '"' + quotes[0].quote + '"';
    document.getElementById('previewAuthor').textContent = '\\u2014 ' + quotes[0].author;
  }
}

async function sendTestEmail() {
  var email = document.getElementById('testEmailInput').value.trim();
  if (!email) { showToast('Masukkan alamat email', 'error'); return; }
  var btn = document.getElementById('btnTestEmail');
  var resultEl = document.getElementById('testResult');
  btn.disabled = true; btn.textContent = 'Mengirim...';
  resultEl.className = 'result-msg'; resultEl.style.display = 'none';
  var res = await apiFetch('/admin/api/test-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email }) });
  if (res) { var data = await res.json(); if (data.success) { resultEl.textContent = data.message; resultEl.className = 'result-msg success'; } else { resultEl.textContent = data.error; resultEl.className = 'result-msg error'; } }
  btn.disabled = false; btn.textContent = 'Kirim';
}

function esc(str) { if (!str) return ''; var div = document.createElement('div'); div.textContent = str; return div.innerHTML; }
function formatDate(iso) { if (!iso) return '-'; return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }); }
function formatShortDate(dateStr) { return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }); }
function showToast(message, type) { var toast = document.getElementById('toast'); toast.textContent = message; toast.className = 'toast show ' + (type || 'success'); setTimeout(function() { toast.className = 'toast'; }, 3000); }
document.addEventListener('DOMContentLoaded', function() { loadDashboard(); });`;
