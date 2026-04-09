// SocietyOS Full JavaScript Module

// ---------- Helper: DOM Ready ----------
document.addEventListener('DOMContentLoaded', () => {
  initPages();
  attachGlobalEvents();
  renderDashboardData();
  renderBillsTable();
  renderComplaintsList();
  renderVisitorsTable();
  renderNoticesList();
  renderResidentsTable();
  renderAdminRoles();
  attachModalCloseHandlers();
  attachFormHandlers();
  loadThemePreference();
});

// ---------- Page rendering & routing ----------
let currentPage = 'dashboard';

function initPages() {
  // Build all page containers if not existing, but we can define initial static HTML using JS injection.
  // For safety, ensure main content has pages structure.
  const main = document.getElementById('mainContent');
  if (main && main.children.length === 0) {
    // Build page skeletons dynamically (or we could rely on prebuilt static but we'll build clean)
    const pages = ['dashboard', 'bills', 'complaints', 'visitors', 'notices', 'admin', 'residents'];
    pages.forEach(p => {
      const div = document.createElement('div');
      div.id = `page-${p}`;
      div.className = 'page';
      if (p === 'dashboard') div.classList.add('active');
      main.appendChild(div);
    });
  }
  // Ensure all page divs exist
  const pageIds = ['dashboard', 'bills', 'complaints', 'visitors', 'notices', 'admin', 'residents'];
  pageIds.forEach(id => {
    if (!document.getElementById(`page-${id}`)) {
      const newDiv = document.createElement('div');
      newDiv.id = `page-${id}`;
      newDiv.className = 'page';
      document.getElementById('mainContent').appendChild(newDiv);
    }
  });
  // Load content for each page (dynamic via functions)
  renderDashboardPage();
  renderBillsPage();
  renderComplaintsPage();
  renderVisitorsPage();
  renderNoticesPage();
  renderAdminPage();
  renderResidentsPage();
}

function showPage(pageId, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${pageId}`);
  if (target) target.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
  else {
    const matchingNav = Array.from(document.querySelectorAll('.nav-item')).find(n => n.getAttribute('data-page') === pageId);
    if (matchingNav) matchingNav.classList.add('active');
  }
  currentPage = pageId;
  if (window.innerWidth <= 768) closeSidebar();
  window.scrollTo(0, 0);
}

function attachGlobalEvents() {
  document.querySelectorAll('.nav-item').forEach(item => {
    const page = item.getAttribute('data-page');
    if (page) item.addEventListener('click', () => showPage(page, item));
  });
  document.getElementById('menuToggle')?.addEventListener('click', toggleSidebar);
  document.getElementById('darkBtn')?.addEventListener('click', () => setTheme('dark'));
  document.getElementById('lightBtn')?.addEventListener('click', () => setTheme('light'));
  document.getElementById('notifBell')?.addEventListener('click', () => showPage('notices', document.querySelector('[data-page="notices"]')));
  document.getElementById('avatarBtn')?.addEventListener('click', () => showPage('dashboard', document.querySelector('[data-page="dashboard"]')));
  const globalSearch = document.getElementById('globalSearch');
  if (globalSearch) {
    globalSearch.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      if (currentPage === 'residents') filterResidentsTable(term);
      else if (currentPage === 'bills') filterBillsTable(term);
    });
  }
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarBackdrop').classList.toggle('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarBackdrop').classList.remove('open');
}
function setTheme(t) {
  const app = document.getElementById('app');
  const modals = document.querySelectorAll('.overlay');
  if (t === 'light') {
    app.classList.add('light');
    modals.forEach(m => m.classList.add('light'));
    document.getElementById('darkBtn').classList.remove('on');
    document.getElementById('lightBtn').classList.add('on');
    localStorage.setItem('societyos-theme', 'light');
  } else {
    app.classList.remove('light');
    modals.forEach(m => m.classList.remove('light'));
    document.getElementById('darkBtn').classList.add('on');
    document.getElementById('lightBtn').classList.remove('on');
    localStorage.setItem('societyos-theme', 'dark');
  }
}
function loadThemePreference() {
  const saved = localStorage.getItem('societyos-theme');
  if (saved === 'light') setTheme('light');
  else setTheme('dark');
}

// --------------------- DASHBOARD ---------------------
function renderDashboardPage() {
  const container = document.getElementById('page-dashboard');
  if (!container) return;
  container.innerHTML = `
    <div class="page-header"><div class="header-row"><div><div class="page-title">Good morning, Arjun 👋</div><div class="page-sub">Sunrise Heights Society · Pune, Maharashtra</div></div><span class="role-pill">Co-Leader</span></div></div>
    <div class="stats-grid" id="dashStats"></div>
    <div class="grid2"><div class="card"><div class="card-title">Collection by Bill Type</div><div class="mini-bar-wrap" id="collectionBars"></div></div><div class="card"><div class="card-title">Recent Activity</div><div id="activityFeed"></div></div></div>
    <div class="table-wrap"><div class="table-head"><span class="table-title">Upcoming Due Bills</span><button class="btn btn-primary btn-sm" id="viewAllBillsBtn">View All</button></div><div class="overflow-x"><table id="dueBillsTable"><thead><tr><th>Flat</th><th>Type</th><th>Amount</th><th>Due Date</th><th>Status</th></tr></thead><tbody></tbody></table></div></div>
  `;
  document.getElementById('viewAllBillsBtn')?.addEventListener('click', () => showPage('bills', document.querySelector('[data-page="bills"]')));
  renderDashboardData();
}

function renderDashboardData() {
  const stats = [
    { label: 'Total Residents', val: '248', trend: '↑ 4 new this month', color: 'blue' },
    { label: 'Pending Bills', val: '37', trend: '₹1.4L outstanding', color: 'amber' },
    { label: 'Open Complaints', val: '12', trend: '3 high priority', color: 'red' },
    { label: 'Monthly Revenue', val: '₹3.2L', trend: '↑ 8% vs last month', color: 'green' }
  ];
  const statsHtml = stats.map(s => `<div class="stat-card"><div class="stat-label">${s.label}</div><div class="stat-val ${s.color}">${s.val}</div><div class="stat-trend">${s.trend}</div></div>`).join('');
  document.getElementById('dashStats').innerHTML = statsHtml;
  document.getElementById('collectionBars').innerHTML = `
    <div class="mini-bar-row"><span class="mini-bar-label">Maintenance</span><div class="mini-bar-track"><div class="mini-bar-fill" style="width:82%"></div></div><span class="mini-bar-val">82%</span></div>
    <div class="mini-bar-row"><span class="mini-bar-label">Water</span><div class="mini-bar-track"><div class="mini-bar-fill" style="width:67%;background:var(--success)"></div></div><span class="mini-bar-val">67%</span></div>
    <div class="mini-bar-row"><span class="mini-bar-label">Gas Pipeline</span><div class="mini-bar-track"><div class="mini-bar-fill" style="width:91%;background:var(--warn)"></div></div><span class="mini-bar-val">91%</span></div>
    <div class="mini-bar-row"><span class="mini-bar-label">Parking</span><div class="mini-bar-track"><div class="mini-bar-fill" style="width:55%;background:var(--danger)"></div></div><span class="mini-bar-val">55%</span></div>
  `;
  document.getElementById('activityFeed').innerHTML = `
    <div class="activity-item"><div class="activity-icon ai-green">💳</div><div><div class="activity-text">Flat 402 paid maintenance bill ₹3,200</div><div class="activity-time">10 min ago</div></div></div>
    <div class="activity-item"><div class="activity-icon ai-red">⚑</div><div><div class="activity-text">New complaint: Lift not working — Block B</div><div class="activity-time">35 min ago</div></div></div>
    <div class="activity-item"><div class="activity-icon ai-blue">🚪</div><div><div class="activity-text">Visitor Ramesh Kumar approved for Flat 201</div><div class="activity-time">1 hr ago</div></div></div>
    <div class="activity-item"><div class="activity-icon ai-amber">📢</div><div><div class="activity-text">Notice posted: Annual AGM on 20th April</div><div class="activity-time">2 hrs ago</div></div></div>
  `;
  const dueBills = [{ flat: 'A-101', type: 'Maintenance', amount: '₹3,200', due: '15 Apr', status: 'Pending' }, { flat: 'B-205', type: 'Water', amount: '₹850', due: '15 Apr', status: 'Pending' }, { flat: 'C-308', type: 'Gas', amount: '₹1,200', due: '10 Apr', status: 'Overdue' }, { flat: 'A-204', type: 'Maintenance', amount: '₹3,200', due: '15 Apr', status: 'Paid' }];
  const tbody = dueBills.map(b => `<tr><td><b>${b.flat}</b></td><td>${b.type}</td><td>${b.amount}</td><td>${b.due}</td><td><span class="badge ${b.status === 'Pending' ? 'b-amber' : b.status === 'Overdue' ? 'b-red' : 'b-green'}">${b.status}</span></td></tr>`).join('');
  document.querySelector('#dueBillsTable tbody').innerHTML = tbody;
}

// --------------------- BILLS PAGE ---------------------
let billsData = [
  { flat: 'A-101', resident: 'Priya Sharma', type: 'Maintenance', amount: 3200, due: '15 Apr', status: 'Pending' },
  { flat: 'A-102', resident: 'Rohan Mehta', type: 'Water', amount: 780, due: '15 Apr', status: 'Paid' },
  { flat: 'B-201', resident: 'Sunita Patel', type: 'Maintenance', amount: 3200, due: '15 Apr', status: 'Paid' },
  { flat: 'B-205', resident: 'Kiran Kumar', type: 'Gas Pipeline', amount: 1200, due: '10 Apr', status: 'Overdue' },
  { flat: 'C-308', resident: 'Amit Joshi', type: 'Water', amount: 850, due: '20 Apr', status: 'Pending' },
  { flat: 'C-401', resident: 'Deepa Nair', type: 'Maintenance', amount: 3200, due: '15 Apr', status: 'Paid' }
];
function renderBillsPage() {
  const container = document.getElementById('page-bills');
  if (!container) return;
  container.innerHTML = `<div class="page-header"><div class="header-row"><div><div class="page-title">Bills & Payments</div><div class="page-sub">Manage and track all society billing</div></div><button class="btn btn-primary" id="createBillBtn">+ Create Bill</button></div></div><div class="stats-grid" id="billStats"></div><div class="filters"><select id="billTypeFilter"><option>All Types</option><option>Maintenance</option><option>Water</option><option>Gas Pipeline</option></select><select id="billStatusFilter"><option>All Status</option><option>Paid</option><option>Pending</option><option>Overdue</option></select></div><div class="table-wrap"><div class="overflow-x"><table id="billsFullTable"><thead><tr><th>Flat No.</th><th>Resident</th><th>Bill Type</th><th>Amount</th><th>Due Date</th><th>Status</th><th>Action</th></tr></thead><tbody></tbody></table></div></div>`;
  document.getElementById('createBillBtn')?.addEventListener('click', () => openModal('addBillModal'));
  document.getElementById('billTypeFilter')?.addEventListener('change', () => renderBillsTable());
  document.getElementById('billStatusFilter')?.addEventListener('change', () => renderBillsTable());
  renderBillsTable();
}
function renderBillsTable(filterText = '') {
  const type = document.getElementById('billTypeFilter')?.value || 'All Types';
  const status = document.getElementById('billStatusFilter')?.value || 'All Status';
  let filtered = billsData.filter(b => (type === 'All Types' || b.type === type) && (status === 'All Status' || b.status === status));
  if (filterText) filtered = filtered.filter(b => b.flat.toLowerCase().includes(filterText) || b.resident.toLowerCase().includes(filterText));
  const total = filtered.length, paid = filtered.filter(b => b.status === 'Paid').length, pending = filtered.filter(b => b.status === 'Pending').length, overdue = filtered.filter(b => b.status === 'Overdue').length;
  const statsDiv = document.getElementById('billStats');
  if (statsDiv) statsDiv.innerHTML = `<div class="stat-card"><div class="stat-label">Total Bills</div><div class="stat-val">${total}</div></div><div class="stat-card"><div class="stat-label">Paid</div><div class="stat-val green">${paid}</div></div><div class="stat-card"><div class="stat-label">Pending</div><div class="stat-val amber">${pending}</div></div><div class="stat-card"><div class="stat-label">Overdue</div><div class="stat-val red">${overdue}</div></div>`;
  const tbody = filtered.map(b => `<tr><td><b>${b.flat}</b></td><td>${b.resident}</td><td>${b.type}</td><td>₹${b.amount}</td><td>${b.due}</td><td><span class="badge ${b.status === 'Paid' ? 'b-green' : b.status === 'Pending' ? 'b-amber' : 'b-red'}">${b.status}</span></td><td><button class="btn btn-outline btn-sm">View</button></td></tr>`).join('');
  const tableBody = document.querySelector('#billsFullTable tbody');
  if (tableBody) tableBody.innerHTML = tbody;
}
function filterBillsTable(term) { renderBillsTable(term); }

// --------------------- COMPLAINTS ---------------------
function renderComplaintsPage() { /* similar dynamic */ renderComplaintsList(); }
function renderComplaintsList() { const container = document.getElementById('page-complaints'); if (container) container.innerHTML = `<div class="page-header"><div class="header-row"><div><div class="page-title">Complaints</div><div class="page-sub">Track and resolve resident issues</div></div><button class="btn btn-primary" id="newComplaintBtn">+ New Complaint</button></div></div><div class="stats-grid"><div class="stat-card"><div class="stat-label">Open</div><div class="stat-val red">12</div></div><div class="stat-card"><div class="stat-label">In Progress</div><div class="stat-val amber">7</div></div><div class="stat-card"><div class="stat-label">Resolved</div><div class="stat-val green">84</div></div><div class="stat-card"><div class="stat-label">Avg. Resolution</div><div class="stat-val blue">2.4d</div></div></div><div class="filters"><select id="complaintStatusFilter"><option>All Status</option><option>Open</option><option>In Progress</option><option>Resolved</option></select><select id="complaintPriorityFilter"><option>All Priority</option><option>High</option><option>Medium</option><option>Low</option></select></div><div class="complaint-list" id="complaintListContainer"></div>`; document.getElementById('newComplaintBtn')?.addEventListener('click', () => openModal('addComplaintModal')); const listDiv = document.getElementById('complaintListContainer'); if (listDiv) listDiv.innerHTML = `<div class="complaint-card"><div class="priority-dot p-high"></div><div class="complaint-body"><div class="complaint-title">Lift not working — Block B</div><div class="complaint-desc">The elevator in Block B has been out of service since Monday.</div><div class="complaint-meta"><span class="badge b-red">High</span><span class="badge b-amber">Open</span><span style="font-size:11px">Flat B-504 · 2 hrs ago</span></div></div><button class="btn btn-outline btn-sm">Assign</button></div><div class="complaint-card"><div class="priority-dot p-med"></div><div class="complaint-body"><div class="complaint-title">Water leakage in corridor</div><div class="complaint-desc">Leakage near Flat A-203</div><div class="complaint-meta"><span class="badge b-amber">Medium</span><span class="badge b-blue">In Progress</span></div></div><button class="btn btn-outline btn-sm">Update</button></div>`; }
// --------------------- VISITORS ---------------------
function renderVisitorsPage() { const container = document.getElementById('page-visitors'); if (container) container.innerHTML = `<div class="page-header"><div class="header-row"><div><div class="page-title">Visitor Management</div><div class="page-sub">Log and approve visitor entry/exit</div></div><button class="btn btn-primary" id="addVisitorBtn">+ Add Visitor</button></div></div><div class="stats-grid"><div class="stat-card"><div class="stat-label">Today's Visitors</div><div class="stat-val blue">23</div></div><div class="stat-card"><div class="stat-label">Currently Inside</div><div class="stat-val green">7</div></div><div class="stat-card"><div class="stat-label">Pending Approval</div><div class="stat-val amber">4</div></div></div><div class="table-wrap"><div class="overflow-x"><table id="visitorsTable"><thead><tr><th>Visitor Name</th><th>Flat</th><th>Type</th><th>Entry Time</th><th>Status</th></tr></thead><tbody><tr><td>Ramesh Kumar</td><td>A-201</td><td><span class="vis-tag vt-guest">Guest</span></td><td>09:15 AM</td><td><span class="badge b-gray">Exited</span></td></tr><tr><td>Santosh Plumber</td><td>C-102</td><td><span class="vis-tag vt-service">Service</span></td><td>02:00 PM</td><td><span class="badge b-green">Inside</span></td></tr></tbody></table></div></div>`; document.getElementById('addVisitorBtn')?.addEventListener('click', () => openModal('addVisitorModal')); }
function renderNoticesPage() { const container = document.getElementById('page-notices'); if (container) container.innerHTML = `<div class="page-header"><div class="header-row"><div><div class="page-title">Notices</div></div><button class="btn btn-primary" id="postNoticeBtn">+ Post Notice</button></div></div><div class="notice-list" id="noticeListContainer"></div>`; document.getElementById('postNoticeBtn')?.addEventListener('click', () => openModal('addNoticeModal')); document.getElementById('noticeListContainer').innerHTML = `<div class="notice-card"><div class="notice-title">Annual General Meeting</div><div class="notice-body">AGM on 20th April at 6pm</div><div class="notice-meta"><span>Admin</span></div></div>`; }
function renderAdminPage() { const container = document.getElementById('page-admin'); if (container) container.innerHTML = `<div class="page-header"><div class="page-title">Admin Panel</div></div><div class="card"><div class="card-title">Add Resident</div><div class="form-row"><label class="form-label">Full Name</label><input class="form-input" id="adminName"/></div><div class="form-row"><label class="form-label">Flat</label><input class="form-input" id="adminFlat"/></div><button class="btn btn-primary" id="adminAddResidentBtn">Add</button></div>`; }
function renderResidentsPage() { const container = document.getElementById('page-residents'); if (container) container.innerHTML = `<div class="page-header"><div class="page-title">Residents</div></div><div class="stats-grid"><div class="stat-card"><div class="stat-label">Total Flats</div><div class="stat-val">120</div></div><div class="stat-card"><div class="stat-label">Occupied</div><div class="stat-val green">108</div></div></div><div class="table-wrap"><div class="overflow-x"><table id="residentsTable"><thead><tr><th>Flat</th><th>Name</th><th>Role</th></tr></thead><tbody><tr><td>A-101</td><td>Priya Sharma</td><td>Resident</td></tr><tr><td>B-201</td><td>Sunita Patel</td><td>Elder</td></tr></tbody></table></div></div>`; }
function renderAdminRoles() { /* stub */ }
function attachModalCloseHandlers() { document.querySelectorAll('.close-btn, [data-modal]').forEach(btn => { btn.addEventListener('click', (e) => { const modalId = btn.getAttribute('data-modal') || btn.closest('.overlay')?.id; if (modalId) document.getElementById(modalId)?.classList.remove('open'); }); }); document.querySelectorAll('.overlay').forEach(overlay => overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); })); }
function openModal(id) { document.getElementById(id)?.classList.add('open'); }
function attachFormHandlers() { document.getElementById('confirmBillBtn')?.addEventListener('click', () => { alert('Bill created (demo)'); closeModal('addBillModal'); }); document.getElementById('confirmComplaintBtn')?.addEventListener('click', () => alert('Complaint submitted')); document.getElementById('confirmVisitorBtn')?.addEventListener('click', () => alert('Visitor added')); document.getElementById('confirmNoticeBtn')?.addEventListener('click', () => alert('Notice posted')); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }
function filterResidentsTable(term) { console.log('filter', term); }