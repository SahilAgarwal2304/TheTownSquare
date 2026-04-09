// layout.js — injects sidebar + topbar into every page
// Called via: injectLayout('dashboard.html')

function injectLayout(activePage) {
  const nav = [
    { href:'dashboard.html',  icon:'⊞', label:'Dashboard' },
    { href:'bills.html',      icon:'💳', label:'Bills & Payments' },
    { href:'complaints.html', icon:'⚑',  label:'Complaints' },
    { href:'visitors.html',   icon:'🚪', label:'Visitors' },
    { href:'notices.html',    icon:'📢', label:'Notices' },
  ];
  const adminNav = [
    { href:'admin.html',     icon:'⚙',  label:'Admin Panel' },
    { href:'residents.html', icon:'👥', label:'Residents' },
  ];

  function navItem(item) {
    const isActive = item.href === activePage;
    return `<a href="${item.href}" class="nav-item${isActive?' active':''}">
      <span class="nav-icon">${item.icon}</span>${item.label}
    </a>`;
  }

  const sidebarHTML = `
  <div class="sidebar-backdrop" id="sidebarBackdrop" onclick="closeSidebar()"></div>
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-logo">
      <div class="logo-icon">TS</div>
      <span class="logo-text">TheTownSquare</span>
    </div>
    <nav class="sidebar-nav">
      <span class="nav-label">Main</span>
      ${nav.map(navItem).join('')}
      <span class="nav-label">Management</span>
      ${adminNav.map(navItem).join('')}
    </nav>
    <div class="sidebar-bottom">
      <div class="user-card">
        <div class="avatar">AR</div>
        <div>
          <div class="user-name">Arjun Rao</div>
          <div class="user-role">Co-Leader</div>
        </div>
      </div>
    </div>
  </aside>`;

  const topbarHTML = `
  <header class="topbar">
    <button class="menu-btn" onclick="toggleSidebar()">☰</button>
    <div class="search-bar">
      <span style="color:var(--text2);font-size:14px">🔍</span>
      <input type="text" placeholder="Search flats, residents, bills..." />
    </div>
    <div class="topbar-right">
      <div class="theme-toggle">
        <button class="theme-btn" data-theme="dark">Dark</button>
        <button class="theme-btn" data-theme="light">Light</button>
      </div>
      <button class="icon-btn">
        🔔 <span class="notif-dot"></span>
      </button>
      <a href="index.html" class="topbar-avatar" title="Sign out">AR</a>
    </div>
  </header>`;

  // Insert before <main> or at start of body
  const main = document.querySelector('main') || document.body;
  main.insertAdjacentHTML('beforebegin', sidebarHTML + topbarHTML);

  // Re-apply theme after injection
  const t = localStorage.getItem('sos-theme') || 'dark';
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === t);
  });
}
