'use strict';

// 1. DATA STATE & CATALOG
const PLUGINS_DATA = [
  { cmd: '.play', name: 'YouTube Audio Streamer', cat: 'downloader', desc: 'Mencari lagu dan mengunduh audio YouTube via multi-provider scraper stream.', alias: ['.yta', '.song'] },
  { cmd: '.ai', name: 'Renvy Multimodal AI', cat: 'ai', desc: 'Pemrosesan percakapan cerdas dengan analisis gambar vision dan konteks memori.', alias: ['.renvy', '.gpt'] },
  { cmd: '.deploy', name: 'GitHub to Vercel Deployer', cat: 'owner', desc: 'Pipeline otomatis mengunggah zip website ke GitHub lalu mendeploy ke Vercel.', alias: ['.verc'] },
  { cmd: '.upgh', name: 'GitHub Git Database Uploader', cat: 'owner', desc: 'Membuat repositori dan mengunggah berkas massal via GitHub REST API.', alias: ['.github'] },
  { cmd: '.transcribe', name: 'Audio Speech-to-Text', cat: 'ai', desc: 'Mengonversi pesan suara VN WhatsApp menjadi teks transkripsi akurat.', alias: ['.vn2txt'] },
  { cmd: '.qris', name: 'QRIS Dynamic Payment', cat: 'tools', desc: 'Pembangkit kode QRIS dinamis untuk pembayaran otomatis dengan verifikasi atomik.', alias: ['.pay'] },
  { cmd: '.tiktok', name: 'TikTok Video Downloader', cat: 'downloader', desc: 'Mengunduh video TikTok tanpa watermark dan audio secara instan.', alias: ['.tt', '.ttdl'] },
  { cmd: '.group', name: 'Group Administration Guard', cat: 'group', desc: 'Pengelolaan anti-link, anti-spam, peringatan otomatis, dan izin grup.', alias: ['.admin'] },
  { cmd: '.sticker', name: 'Media Exif Sticker Maker', cat: 'tools', desc: 'Konversi gambar dan video pendek menjadi stiker WhatsApp animasi kualitas tinggi.', alias: ['.s', '.wm'] },
  { cmd: '.ping', name: 'High-Precision Server Profiler', cat: 'tools', desc: 'Menghitung waktu respons event loop, utilisasi RAM, dan status worker.', alias: ['.speed'] },
  { cmd: '.remwm', name: 'AI Image Watermark Remover', cat: 'ai', desc: 'Membersihkan cap air pada gambar secara cerdas menggunakan model inpainting.', alias: ['.unwm'] },
  { cmd: '.status', name: 'Bot Runtime Telemetry', cat: 'tools', desc: 'Laporan kesehatan sistem, status koneksi Baileys 515, dan uptime server.', alias: ['.botstat'] }
];

const ARCH_NODES_DATA = {
  whatsapp: {
    title: 'WhatsApp Multi-Device Gateway',
    badge: 'EXTERNAL INGRESS',
    desc: 'Menghubungkan bot ke jaringan WhatsApp via Baileys WebSocket terkompresi. Mendukung resolusi nomor telepon (PN) dan LID secara transparan.',
    file: 'node_modules/baileys, lib/simple.js',
    func: 'makeWASocket(), ev.on("messages.upsert")',
    sec: 'Dukungan pairing code 515 reconnect dan deduplikasi 1.8s.'
  },
  supervisor: {
    title: 'Process Supervisor (index.js)',
    badge: 'SYSTEM SUPERVISOR',
    desc: 'Parent process yang mengisolasi worker, memonitor error fatal, mencegah crash-loop (max 10), dan mengawasi hot-reload via Chokidar.',
    file: 'index.js, package.json',
    func: 'start(), setupMaster(), chokidar.watch("lib/")',
    sec: 'Menjalankan worker child process dengan isolasi memori mandiri.'
  },
  bridge: {
    title: 'AGY Interceptor Bridge (Owner-Only)',
    badge: 'ACP INTEGRATION',
    desc: 'Lapisan jembatan khusus yang menghubungkan perintah WhatsApp owner langsung ke Antigravity ACP runtime melalui protokol JSON-RPC stdio.',
    file: 'agy-bridge/whatsapp.js, agy-bridge/bridge.js, agy-bridge/acp.js',
    func: 'wrapHandler(), dispatchWork(), sendAttachment()',
    sec: 'Terproteksi khusus untuk nomor owner terdaftar (anti-LID spoofing).'
  },
  dispatcher: {
    title: 'Command Dispatcher & Policy',
    badge: 'MESSAGE PIPELINE',
    desc: 'Penyaring pesan masuk: mengeksekusi hooks (all -> before -> command -> after), kompilasi regex berkinerja tinggi, dan audit kuota perintah.',
    file: 'lib/handler.js, lib/command-policy.js, lib/serialize.js',
    func: 'handler(m, chatUpdate), smsg(), parseCommand()',
    sec: 'Dilengkapi RenvyGuard auto-quarantine jika plugin memicu 5 error berturut-turut.'
  },
  plugins: {
    title: 'Plugin Ecosystem (202 Modules)',
    badge: 'BUSINESS LOGIC',
    desc: 'Ekosistem modular berisi 187 perintah menu aktif dan 14 hooks yang diklasifikasikan oleh lib/categories.js.',
    file: 'plugins/*.js, lib/categories.js',
    func: 'loadAllPluginsV2(), handler.call()',
    sec: 'Setiap plugin dijalankan dengan try/catch dan parameter tersanitasi.'
  },
  ai: {
    title: 'Renvy AI Multimodal Core',
    badge: 'INTELLIGENCE ENGINE',
    desc: 'Sub-sistem AI multi-provider yang mendukung Clouvia Router, Gemini 4, DeepSeek, dan analisis gambar/video frame.',
    file: 'lib/renvy-ai/provider.js, lib/renvy-ai/navigator.js',
    func: 'ask(), selectModel(), analyzeVision()',
    sec: 'Cache respons dalam memori V8 dan failover otomatis jika model 502.'
  },
  db: {
    title: 'SQLite WAL & Atomic Ledger',
    badge: 'PERSISTENT STORAGE',
    desc: 'Basis data embedded performa tinggi menggunakan better-sqlite3 dalam mode WAL, mengamankan saldo user dan transaksi QRIS secara atomik.',
    file: 'lib/db-sqlite.js, database/database.sqlite',
    func: 'creditDepositOnce(), purchasePremiumOnce(), writeAllToSqlite()',
    sec: 'ACID compliant dengan checkpoint background berkala.'
  }
};

// 2. DOM ELEMENTS & INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initTabNavigation();
  initThemeEngine();
  initTelemetryChart();
  initArchitectureInspector();
  initTerminalRepl();
  initAiPlayground();
  initPluginDirectory();
  initGlobalSearch();
});

// 3. LIVE CLOCK (WIB)
function initClock() {
  const clockEl = document.getElementById('app-clock');
  const update = () => {
    const d = new Date();
    const str = d.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour12: false });
    if (clockEl) clockEl.textContent = `${str} WIB`;
  };
  setInterval(update, 1000);
  update();
}

// 4. TAB NAVIGATION ROUTER
function initTabNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.querySelector('.sidebar');

  function switchTab(targetId) {
    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.tab === targetId);
    });
    tabPanes.forEach(pane => {
      pane.classList.toggle('active', pane.id === `tab-${targetId}`);
    });
    window.location.hash = targetId;
    if (sidebar) sidebar.classList.remove('mobile-open');
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => switchTab(item.dataset.tab));
  });

  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });
  }

  // Restore hash on load
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(`tab-${hash}`)) {
    switchTab(hash);
  }
}

// 5. LIVE THEME ENGINE
function initThemeEngine() {
  const savedTheme = localStorage.getItem('renvy_theme') || 'neon';
  applyTheme(savedTheme);

  document.querySelectorAll('[data-set-theme]').forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.setTheme);
    });
  });

  document.querySelectorAll('.theme-card').forEach(card => {
    card.addEventListener('click', () => {
      applyTheme(card.dataset.themeId);
    });
  });

  function applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('renvy_theme', themeName);

    document.querySelectorAll('.theme-card').forEach(c => {
      c.classList.toggle('active', c.dataset.themeId === themeName);
    });
  }
}

// 6. REAL-TIME CANVAS TELEMETRY CHART
function initTelemetryChart() {
  const canvas = document.getElementById('telemetryChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let points = [35, 42, 38, 55, 62, 48, 58, 72, 65, 80, 75, 88, 92, 85, 96];
  const maxPoints = 25;

  function renderChart() {
    const w = canvas.width = canvas.parentElement.clientWidth;
    const h = canvas.height = canvas.parentElement.clientHeight;

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let y = 30; y < h; y += 45) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    if (points.length < 2) return;

    const step = w / (points.length - 1);

    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(0, 229, 255, 0.35)');
    grad.addColorStop(1, 'rgba(0, 229, 255, 0.0)');

    ctx.beginPath();
    ctx.moveTo(0, h);
    points.forEach((val, i) => {
      const x = i * step;
      const y = h - (val / 120) * h;
      if (i === 0) ctx.lineTo(x, y);
      else {
        const prevX = (i - 1) * step;
        const prevY = h - (points[i - 1] / 120) * h;
        const cpX = (prevX + x) / 2;
        ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
      }
    });
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line stroke
    ctx.beginPath();
    points.forEach((val, i) => {
      const x = i * step;
      const y = h - (val / 120) * h;
      if (i === 0) ctx.moveTo(x, y);
      else {
        const prevX = (i - 1) * step;
        const prevY = h - (points[i - 1] / 120) * h;
        const cpX = (prevX + x) / 2;
        ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
      }
    });
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Latest dot glow
    const lastX = (points.length - 1) * step;
    const lastY = h - (points[points.length - 1] / 120) * h;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#00e5ff';
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  setInterval(() => {
    const nextVal = Math.max(30, Math.min(115, points[points.length - 1] + (Math.random() * 24 - 11)));
    points.push(nextVal);
    if (points.length > maxPoints) points.shift();
    renderChart();

    // Update message counter
    const msgEl = document.getElementById('metric-messages');
    if (msgEl) {
      const cur = parseInt(msgEl.textContent.replace(/,/g, '')) || 14892;
      msgEl.textContent = (cur + Math.floor(Math.random() * 4) + 1).toLocaleString();
    }
  }, 2000);

  window.addEventListener('resize', renderChart);
  renderChart();

  const refBtn = document.getElementById('btn-refresh-telemetry');
  if (refBtn) {
    refBtn.addEventListener('click', () => {
      refBtn.textContent = 'Menyegarkan...';
      setTimeout(() => {
        refBtn.textContent = '🔄 Sinkronisasi';
        renderChart();
      }, 500);
    });
  }
}

// 7. ARCHITECTURE INTERACTIVE BLUEPRINT
function initArchitectureInspector() {
  const nodes = document.querySelectorAll('.arch-node');
  const titleEl = document.getElementById('inspector-title');
  const badgeEl = document.getElementById('inspector-badge');
  const descEl = document.getElementById('inspector-desc');
  const fileEl = document.getElementById('inspector-file');
  const funcEl = document.getElementById('inspector-func');
  const secEl = document.getElementById('inspector-sec');

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      nodes.forEach(n => n.classList.remove('active-node'));
      node.classList.add('active-node');

      const data = ARCH_NODES_DATA[node.dataset.node];
      if (data) {
        titleEl.textContent = `Modul: ${data.title}`;
        badgeEl.textContent = data.badge;
        descEl.textContent = data.desc;
        fileEl.textContent = data.file;
        funcEl.textContent = data.func;
        secEl.textContent = data.sec;
      }
    });
  });
}

// 8. INTERACTIVE WEB TERMINAL REPL
function initTerminalRepl() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  if (!input || !output) return;

  const history = [];
  let historyIdx = -1;

  function appendLine(text, className = '') {
    const line = document.createElement('div');
    line.className = `term-line ${className}`;
    line.innerHTML = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function handleCommand(cmdRaw) {
    const cmd = cmdRaw.trim();
    if (!cmd) return;

    appendLine(`<span class="term-prompt">renvy@cloud:~$</span> ${escapeHtml(cmd)}`);
    history.push(cmd);
    historyIdx = history.length;

    const parts = cmd.split(/\s+/);
    const main = parts[0].toLowerCase();
    const arg = parts[1]?.toLowerCase();

    switch (main) {
      case 'help':
        appendLine('Perintah yang tersedia:');
        appendLine('  <span class="term-cyan">status</span>     - Lihat status performa runtime');
        appendLine('  <span class="term-cyan">ping</span>       - Tes latensi loop event');
        appendLine('  <span class="term-cyan">audit</span>      - Tampilkan ringkasan audit 28 temuan');
        appendLine('  <span class="term-cyan">plugins</span>    - Lihat ringkasan modul aktif');
        appendLine('  <span class="term-cyan">deploy</span>     - Cek pipeline deploy GitHub -> Vercel');
        appendLine('  <span class="term-cyan">theme &lt;name&gt;</span> - Ganti tema: neon, enterprise, emerald, gold');
        appendLine('  <span class="term-cyan">whoami</span>     - Menampilkan identitas sesi');
        appendLine('  <span class="term-cyan">clear</span>      - Membersihkan layar konsol');
        break;

      case 'status':
        appendLine('⚡ <span class="term-green">SISTEM RUNTIME NORMAL</span>');
        appendLine('  • Uptime: 13 jam 48 menit (0 crash)');
        appendLine('  • Memori: 435.8 MB RSS / Cgroup isolasi');
        appendLine('  • Database: SQLite WAL (database.sqlite)');
        appendLine('  • WhatsApp Socket: Connected & Authenticated (LID mapping OK)');
        break;

      case 'ping':
        const latency = (Math.random() * 8 + 14).toFixed(2);
        appendLine(`🏓 Pong! Latensi event-loop: <span class="term-green">${latency} ms</span>`);
        break;

      case 'audit':
        appendLine('📋 <span class="term-hl">AUDIT SUMMARY REPORT:</span>');
        appendLine('  • Skor Keseluruhan: <span class="term-green">7.3 / 10</span>');
        appendLine('  • Total Temuan: 28 Terverifikasi (F-01 s.d. F-28)');
        appendLine('  • Unit Tests: 334 Passed / 344 Tests (97.1%)');
        appendLine('  • Berkas PDF Laporan: /home/container/output/LAPORAN_HASIL_AUDIT_BOT_RENVY.pdf');
        break;

      case 'deploy':
        appendLine('🚀 <span class="term-cyan">PIPELINE GITHUB ➔ VERCEL:</span>');
        appendLine('  • Token GitHub: <span class="term-green">VALID (Panzqq)</span>');
        appendLine('  • Token Vercel: <span class="term-green">VALID (pan-pans-projects)</span>');
        appendLine('  • CLI Requirement: <span class="term-green">ZERO-CLI (Murni REST API)</span>');
        break;

      case 'plugins':
        appendLine(`🧩 Total Plugin: <span class="term-cyan">202 plugin</span> aktif terdaftar.`);
        appendLine('Gunakan tab Katalog Plugin untuk melihat rincian.');
        break;

      case 'theme':
        if (['neon', 'enterprise', 'emerald', 'gold'].includes(arg)) {
          document.documentElement.setAttribute('data-theme', arg);
          localStorage.setItem('renvy_theme', arg);
          appendLine(`🎨 Tema berhasil diubah ke: <span class="term-hl">${arg}</span>`);
        } else {
          appendLine('Pilihan tema: neon, enterprise, emerald, gold.', 'term-err');
        }
        break;

      case 'whoami':
        appendLine('Operator: <span class="term-hl">Pan (Owner)</span> | Permission: Root / Full Admin');
        break;

      case 'clear':
        output.innerHTML = '';
        break;

      default:
        appendLine(`Perintah tidak dikenali: '${escapeHtml(cmd)}'. Ketik <span class="term-hl">help</span> untuk bantuan.`, 'term-err');
    }
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      handleCommand(val);
    } else if (e.key === 'ArrowUp') {
      if (historyIdx > 0) {
        historyIdx--;
        input.value = history[historyIdx];
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIdx < history.length - 1) {
        historyIdx++;
        input.value = history[historyIdx];
      } else {
        historyIdx = history.length;
        input.value = '';
      }
    }
  });

  // Quick command buttons
  document.querySelectorAll('.cmd-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      handleCommand(btn.dataset.cmd);
    });
  });
}

// 9. AI PROMPT STUDIO
function initAiPlayground() {
  const input = document.getElementById('ai-input');
  const btnSend = document.getElementById('btn-send-ai');
  const chatMessages = document.getElementById('chat-messages');
  const modelSelect = document.getElementById('select-model');
  const activeModelName = document.getElementById('active-model-name');
  const inputTemp = document.getElementById('input-temp');
  const valTemp = document.getElementById('val-temp');
  const btnClear = document.getElementById('btn-clear-chat');

  if (modelSelect && activeModelName) {
    modelSelect.addEventListener('change', () => {
      activeModelName.textContent = modelSelect.options[modelSelect.selectedIndex].text.split('(')[0].trim();
    });
  }

  if (inputTemp && valTemp) {
    inputTemp.addEventListener('input', () => {
      valTemp.textContent = inputTemp.value;
    });
  }

  if (btnClear && chatMessages) {
    btnClear.addEventListener('click', () => {
      chatMessages.innerHTML = '';
      appendBotBubble('Percakapan telah dibersihkan. Silakan ajukan pertanyaan baru.');
    });
  }

  function appendUserBubble(text) {
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble user';
    bubble.innerHTML = `
      <div class="msg-author">Anda</div>
      <div class="msg-content">${escapeHtml(text)}</div>
      <div class="msg-time">Baru saja</div>
    `;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function appendBotBubble(text) {
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble assistant';
    bubble.innerHTML = `
      <div class="msg-author">Renvy AI</div>
      <div class="msg-content">${text}</div>
      <div class="msg-time">Baru saja</div>
    `;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function generateSimulatedResponse(prompt) {
    const p = prompt.toLowerCase();
    if (p.includes('github') || p.includes('vercel') || p.includes('deploy')) {
      return `Alur baru kita bekerja secara <strong>Zero-CLI</strong>:<br>
      1. Berkas proyek diunggah ke <code>github.com/Panzqq/nama-repo</code> via GitHub Git Database API.<br>
      2. Repositori dihubungkan ke Vercel via REST API (<code>POST /v10/projects</code>).<br>
      3. Vercel Cloud Build langsung terpicu otomatis. Paket <code>vercel</code> 369 MB tidak lagi dibutuhkan di server!`;
    }
    if (p.includes('pollution') || p.includes('pushmessage') || p.includes('f-01')) {
      return `Celah <strong>F-01 (Prototype Pollution)</strong> terjadi karena objek <code>conn.chats</code> di <code>lib/simple.js</code> dibuat tanpa <code>Object.create(null)</code>.<br>
      Jika ada pesan kutipan dengan participant bernilai <code>"__proto__"</code>, properti global Node.js dapat termutasi dan memungkinkan pemalsuan kutipan pesan lintas chat.`;
    }
    if (p.includes('sqlite') || p.includes('wal') || p.includes('database')) {
      return `Database Renvy menggunakan <strong>better-sqlite3</strong> dalam mode <em>Write-Ahead Logging</em> (WAL).<br>
      Kelebihan utamanya adalah transaksi deposit QRIS yang atomik. Rekomendasi optimasi adalah mengganti loop 12x full-scan dengan pencatatan entri yang termutasi saja (<em>dirty-tracking</em>).`;
    }
    return `Pertanyaan Anda telah diproses dengan model <strong>${activeModelName?.textContent || 'Gemini'}</strong>.<br>
    Sistem Renvy siap menjalankan tugas otomatisasi, pemindaian kode sumber, dan operasi cloud sesuai instruksi.`;
  }

  function sendMessage() {
    const text = input?.value.trim();
    if (!text) return;
    input.value = '';

    appendUserBubble(text);

    // Typing simulation
    setTimeout(() => {
      const resp = generateSimulatedResponse(text);
      appendBotBubble(resp);
    }, 600);
  }

  if (btnSend) btnSend.addEventListener('click', sendMessage);
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // Quick prompt buttons
  document.querySelectorAll('.quick-prompt').forEach(btn => {
    btn.addEventListener('click', () => {
      if (input) {
        input.value = btn.dataset.p;
        sendMessage();
      }
    });
  });
}

// 10. PLUGIN DIRECTORY & FILTERING
function initPluginDirectory() {
  const container = document.getElementById('plugins-container');
  const countEl = document.getElementById('plugin-count-display');
  const filterBtns = document.querySelectorAll('.filter-chip');
  if (!container) return;

  function render(items) {
    container.innerHTML = '';
    if (countEl) countEl.textContent = items.length;

    items.forEach(p => {
      const card = document.createElement('div');
      card.className = 'plugin-card';
      card.innerHTML = `
        <div>
          <div class="plugin-card-header">
            <span class="plugin-cmd">${p.cmd}</span>
            <span class="plugin-cat-tag">${p.cat}</span>
          </div>
          <div class="plugin-desc">${p.desc}</div>
        </div>
        <div class="plugin-footer">
          <span class="plugin-aliases">Alias: ${p.alias.join(', ')}</span>
          <button class="btn btn-sm btn-ghost" onclick="alert('Plugin: ${p.cmd} - ${p.name}')">Info</button>
        </div>
      `;
      container.appendChild(card);
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.filter;
      if (cat === 'all') render(PLUGINS_DATA);
      else render(PLUGINS_DATA.filter(x => x.cat === cat));
    });
  });

  render(PLUGINS_DATA);
}

// 11. GLOBAL SEARCH
function initGlobalSearch() {
  const searchInput = document.getElementById('global-search');
  if (!searchInput) return;

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
  });

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    if (!q) return;

    // Switch to plugins tab if searching
    const pluginTab = document.querySelector('.nav-item[data-tab="plugins"]');
    if (pluginTab) pluginTab.click();

    const filtered = PLUGINS_DATA.filter(p => 
      p.cmd.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.cat.toLowerCase().includes(q)
    );

    const container = document.getElementById('plugins-container');
    const countEl = document.getElementById('plugin-count-display');
    if (container) {
      container.innerHTML = '';
      if (countEl) countEl.textContent = filtered.length;
      filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'plugin-card';
        card.innerHTML = `
          <div>
            <div class="plugin-card-header">
              <span class="plugin-cmd">${p.cmd}</span>
              <span class="plugin-cat-tag">${p.cat}</span>
            </div>
            <div class="plugin-desc">${p.desc}</div>
          </div>
          <div class="plugin-footer">
            <span class="plugin-aliases">Alias: ${p.alias.join(', ')}</span>
            <button class="btn btn-sm btn-ghost">Info</button>
          </div>
        `;
        container.appendChild(card);
      });
    }
  });
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
