# TheTownSquare — Housing Society Management System

A fully responsive, multi-page web application for managing housing societies.
Built with plain HTML, CSS, and JavaScript — no frameworks, no installs, no build tools.

---

## 📁 Project Structure

```
DSBDA MINI PROJECT/
│
├── index.html          → Login page (entry point)
├── dashboard.html      → Overview, stats, recent activity
├── bills.html          → Bills & payment management
├── complaints.html     → Complaint tracking system
├── visitors.html       → Visitor entry/exit log
├── notices.html        → Society announcements
├── admin.html          → Admin panel & settings
├── residents.html      → Resident directory
│
├── styles.css          → All styles (theme, layout, components)
├── script.js           → All interactivity (modals, filters, actions)
└── layout.js           → Shared sidebar + topbar (injected on every page)
```

---

## 🚀 How to Run

**No installation required.**

1. Download and unzip the project folder
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge)
3. Click **"Continue with Google"** to enter the dashboard
4. Navigate using the sidebar

> You can also right-click `index.html` → Open With → your browser.

---

## ✨ Features

### 🔐 Login Page
- Google Sign-In button (UI only — connects to dashboard)
- Dark / Light theme toggle available on login screen

### 📊 Dashboard
- Summary stats: Total Residents, Pending Bills, Open Complaints, Monthly Revenue
- Collection progress bars by bill type (Maintenance, Water, Gas, Parking)
- Recent activity feed
- Upcoming due bills quick-view table

### 💳 Bills & Payments
- Table of all bills with Flat No., Resident, Type, Amount, Due Date, Status
- Filter by Bill Type and Status (Paid / Pending / Overdue)
- **Create Bill** modal — adds new bill row to table instantly
- Remind button for overdue bills
- Receipt button for paid bills

### ⚑ Complaints
- Card-based complaint list with priority color indicator
- Filter by Status (Open / In Progress / Resolved) and Priority (High / Medium / Low)
- **New Complaint** modal — submitted complaint appears at top of list
- Priority dot colors: 🔴 High · 🟡 Medium · 🟢 Low

### 🚪 Visitor Management
- Entry log table with visitor name, flat, type, entry/exit time, status
- Filter by visitor type (Guest / Delivery / Service)
- **Approve** button → marks visitor as Inside, logs entry time
- **Exit** button → marks visitor as Exited, logs exit time
- **Add Visitor** modal — adds pending visitor to the log

### 📢 Notices & Announcements
- Feed-style notice cards with color-coded left border by priority
- **Post Notice** modal — new notice appears at top of feed instantly
- Priority levels: Normal (blue) · Important (amber) · Urgent (red)
- Audience tagging: All Residents / Block-specific / Committee Only

### ⚙ Admin Panel
- Add Resident form (Name, Email, Flat, Phone, Role)
- Society Settings form (Name, City, Maintenance amount, Due day, Late fee %)
- Role Management table — change any resident's role
- Generate Monthly Bills — auto-generate for all flats
- Send Bulk Reminder — message all pending/overdue residents

### 👥 Residents
- Directory table with Flat, Name, Phone, Role, Bill Status
- Live search — filters by name or flat number as you type
- Role badges: Resident · Elder · Co-Leader

---

## 🎨 Design System

### Themes
The app supports **Dark** and **Light** modes.
Toggle using the buttons in the top-right of any page.
Your choice is saved in `localStorage` and persists across pages.

| Token | Dark Mode | Light Mode |
|---|---|---|
| Background | `#0F172A` | `#F1F5F9` |
| Surface (cards) | `#1E293B` | `#FFFFFF` |
| Accent (blue) | `#3B82F6` | `#2563EB` |
| Text primary | `#E2E8F0` | `#0F172A` |
| Text secondary | `#94A3B8` | `#64748B` |
| Border | `#334155` | `#E2E8F0` |

### Fonts
- **Syne** — headings, titles, logo (loaded from Google Fonts)
- **DM Sans** — body text, buttons, inputs

### Responsive Breakpoints
| Screen | Behaviour |
|---|---|
| Desktop (> 768px) | Fixed sidebar visible, full layout |
| Tablet / Mobile (≤ 768px) | Sidebar hidden, hamburger menu ☰ to open |
| Small mobile (≤ 480px) | Stats grid goes 2-column, reduced padding |

---

## 🧩 How Each File Works

### `styles.css`
- CSS custom properties (variables) define the entire theme
- `.dark` class on `<html>` overrides all variables for dark mode
- All components (cards, badges, tables, modals, buttons) are defined here
- Media queries at the bottom handle all responsive behaviour

### `script.js`
- Runs on every page
- `applyTheme()` — reads `localStorage`, applies dark/light class
- `injectLayout()` — called in `layout.js`, NOT here
- `filterBills()`, `filterComplaints()`, `filterVisitors()` — live DOM filtering
- `submitBill()`, `submitComplaint()`, `submitVisitor()`, `submitNotice()` — read form values, create HTML elements, prepend to table/list
- `approveVisitor()`, `exitVisitor()` — update row status inline
- `showToast()` — creates a floating notification at bottom-right
- `openModal()`, `closeModal()` — show/hide modal overlays

### `layout.js`
- `injectLayout(activePage)` — builds the sidebar and topbar HTML as a string and injects it into the page before `<main>`
- Sets the active `.nav-item` based on the filename passed in
- Re-applies theme after injection so buttons render correctly
- Every page calls this at the bottom: `injectLayout('bills.html')`

---

## 👥 User Roles (Conceptual)

| Role | Access Level |
|---|---|
| **Leader** | Full access across all societies |
| **Co-Leader** | Full access within one society (current demo user) |
| **Elder** | View complaints, summaries, notices |
| **Resident** | Own bills, raise complaints, view notices |

> In this frontend demo, the logged-in user is **Arjun Rao (Co-Leader)**.
> Role-based restrictions are UI-only — connect a backend to enforce them server-side.

---

## 🔌 Connecting a Real Backend (Next Steps)

This is a frontend-only prototype. To make it production-ready:

### 1. Add Real Google Authentication
Use **Firebase Authentication**:
```html
<!-- Add to each HTML page <head> -->
<script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-auth-compat.js"></script>
```
```js
// Replace the login button's href with:
firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
  .then(result => {
    window.location.href = 'dashboard.html';
  });
```

### 2. Replace Mock Data with API Calls
Every `submitBill()`, `filterBills()` etc. currently works with DOM elements only.
Replace with `fetch()` calls:
```js
// Example: load bills from your backend
fetch('https://your-api.com/api/bills?societyId=001')
  .then(res => res.json())
  .then(bills => renderBillsTable(bills));
```

### 3. Backend Stack (Recommended)
```
Backend:   Node.js + Express
Database:  PostgreSQL (each table has a society_id column)
Auth:      Firebase Auth or JWT
Hosting:   Railway / Render (backend) + Netlify / Vercel (frontend)
```

### 4. Database Tables Needed
```sql
societies    (id, name, city, settings)
users        (id, society_id, name, email, role, flat_id)
flats        (id, society_id, flat_number, block)
bills        (id, society_id, flat_id, type, amount, due_date, status)
payments     (id, bill_id, paid_at, amount)
complaints   (id, society_id, user_id, title, description, priority, status)
visitors     (id, society_id, flat_id, name, type, entry_time, exit_time, status)
notices      (id, society_id, title, body, audience, priority, created_at)
```

---

## 🌐 Deployment (Frontend Only)

Since this is plain HTML/CSS/JS, you can host it for free on:

**GitHub Pages**
1. Push your folder to a GitHub repository
2. Go to Settings → Pages → Source: main branch
3. Your site is live at `https://yourusername.github.io/repo-name`

**Netlify**
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your project folder
3. Done — live URL in seconds

**Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Deploy with one click

---

## 📋 Browser Support

| Browser | Supported |
|---|---|
| Chrome 90+ | ✅ |
| Firefox 88+ | ✅ |
| Edge 90+ | ✅ |
| Safari 14+ | ✅ |
| Internet Explorer | ❌ |

---

## 📌 Known Limitations (Frontend Demo)

- Data is **not saved** between page refreshes — all additions are in-memory DOM only
- Google Sign-In is **UI only** — no real authentication
- All numbers and stats are **hardcoded** — connect a backend to make them live
- No server-side role enforcement — all role restrictions are visual only

---

## 🛠 Built With

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and content |
| CSS3 | Styling, theming, responsive layout |
| Vanilla JavaScript | Interactivity, DOM manipulation, filtering |
| Google Fonts (Syne + DM Sans) | Typography |
| CSS Custom Properties | Dark/light theme system |
| localStorage | Theme persistence across pages |

---

## 👨‍💻 Project Info

**Project Name:**TheTownSquare — Housing Society Management System  
**Type:** DSBDA Mini Project  
**Frontend:** Plain HTML / CSS / JS (no frameworks)  
**Pages:** 8  
**Total Files:** 11  

---

*To report issues or suggest improvements, open an issue in the project repository.*
