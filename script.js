// script.js — shared across all pages

// ── THEME ────────────────────────────────────────────────────────────────────
const savedTheme = localStorage.getItem('sos-theme') || 'dark';
applyTheme(savedTheme);

function applyTheme(t) {
  document.documentElement.classList.toggle('dark', t === 'dark');
  localStorage.setItem('sos-theme', t);
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === t);
  });
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('theme-btn')) {
    applyTheme(e.target.dataset.theme);
  }
});

// ── SIDEBAR (mobile) ─────────────────────────────────────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarBackdrop').classList.toggle('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarBackdrop').classList.remove('open');
}

// ── MODALS ───────────────────────────────────────────────────────────────────
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// Close modal when clicking the backdrop
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

// ── ACTIVE NAV HIGHLIGHT ─────────────────────────────────────────────────────
(function highlightNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    if (item.dataset.page === page) item.classList.add('active');
  });
})();

// ── TOAST NOTIFICATION ───────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const existing = document.getElementById('sos-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'sos-toast';
  const colors = { success: 'var(--success)', danger: 'var(--danger)', amber: 'var(--warn)' };
  toast.style.cssText = `
    position:fixed; bottom:24px; right:24px; z-index:999;
    background:var(--surface); border:1px solid var(--border);
    border-left:3px solid ${colors[type] || colors.success};
    border-radius:10px; padding:12px 18px;
    font-size:13px; color:var(--text); font-family:'DM Sans',sans-serif;
    box-shadow:0 4px 24px rgba(0,0,0,.15);
    animation:slideIn .2s ease;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ── BILLS FILTER ─────────────────────────────────────────────────────────────
function filterBills() {
  const type   = document.getElementById('billTypeFilter')?.value   || 'all';
  const status = document.getElementById('billStatusFilter')?.value || 'all';
  document.querySelectorAll('#billsTable tbody tr').forEach(row => {
    const rowType   = row.dataset.type   || '';
    const rowStatus = row.dataset.status || '';
    const show =
      (type   === 'all' || rowType   === type) &&
      (status === 'all' || rowStatus === status);
    row.style.display = show ? '' : 'none';
  });
}

// ── COMPLAINTS FILTER ────────────────────────────────────────────────────────
function filterComplaints() {
  const status   = document.getElementById('complaintStatusFilter')?.value   || 'all';
  const priority = document.getElementById('complaintPriorityFilter')?.value || 'all';
  document.querySelectorAll('.complaint-card[data-status]').forEach(card => {
    const show =
      (status   === 'all' || card.dataset.status   === status) &&
      (priority === 'all' || card.dataset.priority === priority);
    card.style.display = show ? 'flex' : 'none';
  });
}

// ── VISITOR FILTER ────────────────────────────────────────────────────────────
function filterVisitors() {
  const type = document.getElementById('visitorTypeFilter')?.value || 'all';
  document.querySelectorAll('#visitorsTable tbody tr').forEach(row => {
    const rowType = row.dataset.type || '';
    row.style.display = (type === 'all' || rowType === type) ? '' : 'none';
  });
}

// ── RESIDENT SEARCH ──────────────────────────────────────────────────────────
function searchResidents() {
  const q = document.getElementById('residentSearch')?.value.toLowerCase() || '';
  document.querySelectorAll('#residentsTable tbody tr').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

// ── ADD BILL (dynamic row) ────────────────────────────────────────────────────
function submitBill() {
  const flat   = document.getElementById('newFlat')?.value.trim();
  const type   = document.getElementById('newType')?.value;
  const amount = document.getElementById('newAmount')?.value;
  const due    = document.getElementById('newDue')?.value;
  if (!flat || !amount) { showToast('Please fill in all required fields.', 'danger'); return; }

  const tbody = document.querySelector('#billsTable tbody');
  if (tbody) {
    const tr = document.createElement('tr');
    tr.dataset.type   = type.toLowerCase().replace(' ','_');
    tr.dataset.status = 'pending';
    const dueFmt = due ? new Date(due).toLocaleDateString('en-IN',{day:'numeric',month:'short'}) : '—';
    tr.innerHTML = `
      <td><strong>${flat}</strong></td>
      <td>—</td><td>${type}</td>
      <td>₹${Number(amount).toLocaleString()}</td>
      <td>${dueFmt}</td>
      <td><span class="badge b-amber">Pending</span></td>
      <td><button class="btn btn-outline btn-sm">View</button></td>
    `;
    tbody.prepend(tr);
  }
  closeModal('addBillModal');
  showToast('Bill created successfully!');
  document.getElementById('billForm')?.reset();
}

// ── ADD COMPLAINT ────────────────────────────────────────────────────────────
function submitComplaint() {
  const title = document.getElementById('newComplaintTitle')?.value.trim();
  const desc  = document.getElementById('newComplaintDesc')?.value.trim();
  const prio  = document.getElementById('newComplaintPriority')?.value || 'medium';
  const flat  = document.getElementById('newComplaintFlat')?.value.trim();
  if (!title) { showToast('Please enter a complaint title.', 'danger'); return; }

  const dotClass  = { high:'p-high', medium:'p-medium', low:'p-low' }[prio] || 'p-medium';
  const badgeClass= { high:'b-red',  medium:'b-amber',  low:'b-gray' }[prio]  || 'b-amber';
  const list = document.getElementById('complaintList');
  if (list) {
    const card = document.createElement('div');
    card.className = 'complaint-card';
    card.dataset.status   = 'open';
    card.dataset.priority = prio;
    card.innerHTML = `
      <div class="priority-dot ${dotClass}"></div>
      <div class="complaint-body">
        <div class="complaint-title">${title}</div>
        <div class="complaint-desc">${desc || 'No description provided.'}</div>
        <div class="complaint-meta">
          <span class="badge ${badgeClass}">${prio}</span>
          <span class="badge b-amber">Open</span>
          <span style="font-size:11px;color:var(--text2)">Flat ${flat || '—'} · Just now</span>
        </div>
      </div>
      <button class="btn btn-outline btn-sm">Assign</button>
    `;
    list.prepend(card);
  }
  closeModal('addComplaintModal');
  showToast('Complaint submitted!');
  document.getElementById('complaintForm')?.reset();
}

// ── ADD VISITOR ───────────────────────────────────────────────────────────────
function submitVisitor() {
  const name = document.getElementById('newVisitorName')?.value.trim();
  const flat = document.getElementById('newVisitorFlat')?.value.trim();
  const type = document.getElementById('newVisitorType')?.value || 'guest';
  if (!name || !flat) { showToast('Please fill in visitor name and flat.', 'danger'); return; }

  const tbody = document.querySelector('#visitorsTable tbody');
  const tagClass = { delivery:'vt-delivery', guest:'vt-guest', service:'vt-service' }[type] || 'vt-guest';
  if (tbody) {
    const tr = document.createElement('tr');
    tr.dataset.type = type;
    tr.innerHTML = `
      <td>${name}</td><td>${flat}</td>
      <td><span class="${tagClass}">${type.charAt(0).toUpperCase()+type.slice(1)}</span></td>
      <td>—</td><td class="hide-mobile">—</td>
      <td><span class="badge b-amber">Pending</span></td>
      <td><button class="btn btn-primary btn-sm" onclick="approveVisitor(this)">Approve</button></td>
    `;
    tbody.prepend(tr);
  }
  closeModal('addVisitorModal');
  showToast('Visitor added!');
  document.getElementById('visitorForm')?.reset();
}

function approveVisitor(btn) {
  const tr = btn.closest('tr');
  const now = new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
  tr.cells[3].textContent = now;
  tr.cells[5].innerHTML = '<span class="badge b-green">Inside</span>';
  btn.textContent = 'Exit';
  btn.onclick = () => exitVisitor(btn);
  showToast('Visitor approved and entry logged.');
}

function exitVisitor(btn) {
  const tr = btn.closest('tr');
  const now = new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
  tr.cells[4] && (tr.cells[4].textContent = now);
  tr.cells[5].innerHTML = '<span class="badge b-gray">Exited</span>';
  btn.textContent = 'Log';
  btn.className = 'btn btn-outline btn-sm';
  btn.onclick = null;
  showToast('Exit logged.');
}

// ── ADD NOTICE ────────────────────────────────────────────────────────────────
function submitNotice() {
  const title    = document.getElementById('newNoticeTitle')?.value.trim();
  const body     = document.getElementById('newNoticeBody')?.value.trim();
  const audience = document.getElementById('newNoticeAudience')?.value || 'All Residents';
  const priority = document.getElementById('newNoticePriority')?.value || 'normal';
  if (!title || !body) { showToast('Please fill in title and content.', 'danger'); return; }

  const accentMap = { normal:'var(--accent)', important:'var(--warn)', urgent:'var(--danger)' };
  const badgeMap  = { normal:'b-blue', important:'b-amber', urgent:'b-red' };
  const list = document.getElementById('noticeList');
  if (list) {
    const card = document.createElement('div');
    card.className = 'notice-card';
    card.style.borderLeftColor = accentMap[priority];
    const now = new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
    card.innerHTML = `
      <div class="notice-title">${title}</div>
      <div class="notice-body">${body}</div>
      <div class="notice-meta">
        <span>📌 By Admin · You</span>
        <span>${now}</span>
        <span class="badge ${badgeMap[priority]}">${audience}</span>
      </div>
    `;
    list.prepend(card);
  }
  closeModal('addNoticeModal');
  showToast('Notice posted!');
  document.getElementById('noticeForm')?.reset();
}

// ── ADMIN SAVE ────────────────────────────────────────────────────────────────
function saveSettings() {
  showToast('Settings saved successfully!');
}

// CSS animation for toast
const style = document.createElement('style');
style.textContent = `@keyframes slideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`;
document.head.appendChild(style);
