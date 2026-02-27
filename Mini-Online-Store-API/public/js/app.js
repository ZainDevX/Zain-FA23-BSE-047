// ============================================================================
//  public/js/app.js — Frontend Application Logic
//  Mini Online Store API — Client-Side Controller
// ============================================================================

const API_BASE = ''; // same origin — no CORS needed

// ─── STATE ───────────────────────────────────────────────────────────────────
let authToken = '';

// ─── DOM REFS ────────────────────────────────────────────────────────────────
const $  = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const tokenInput      = $('#auth-token');
const tokenStatus     = $('#token-status');
const productsGrid    = $('#products-grid');
const getUserResult   = $('#get-user-result');
const createUserResult= $('#create-user-result');
const apiMethod       = $('#api-method');
const apiUrl          = $('#api-url');
const apiBodySection  = $('#api-body-section');
const apiBody         = $('#api-body');
const apiOutput       = $('#api-output');
const apiStatus       = $('#api-status');
const statProducts    = $('#stat-products');

// ─── INIT ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  bindEvents();
  loadProducts(); // auto-load on page open
});

// ─── EVENT BINDINGS ──────────────────────────────────────────────────────────
function bindEvents() {
  // Token
  $('#btn-set-token').addEventListener('click', setToken);
  $('#btn-clear-token').addEventListener('click', clearToken);
  tokenInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') setToken(); });

  // Products
  $('#btn-load-products').addEventListener('click', loadProducts);

  // Users
  $('#btn-get-user').addEventListener('click', getUser);
  $('#user-id-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') getUser(); });
  $('#btn-create-user').addEventListener('click', createUser);

  // API Tester
  $('#btn-send-api').addEventListener('click', sendApiRequest);
  apiMethod.addEventListener('change', toggleBodySection);
  apiUrl.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendApiRequest(); });

  // Nav links — active state
  $$('.nav-link[data-section]').forEach((link) => {
    link.addEventListener('click', () => {
      $$('.nav-link').forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

// ─── TOKEN MANAGEMENT ────────────────────────────────────────────────────────
function setToken() {
  const val = tokenInput.value.trim();
  if (!val) {
    toast('Please enter a token value.', 'error');
    return;
  }
  authToken = val;
  updateTokenUI(true);
  toast('Token set — /users endpoints are now accessible.', 'success');
}

function clearToken() {
  authToken = '';
  tokenInput.value = '';
  updateTokenUI(false);
  toast('Token cleared.', 'info');
}

function updateTokenUI(authenticated) {
  if (authenticated) {
    tokenStatus.classList.add('authenticated');
    tokenStatus.innerHTML = `<i data-lucide="unlock" class="token-icon"></i><span>Token Active</span>`;
  } else {
    tokenStatus.classList.remove('authenticated');
    tokenStatus.innerHTML = `<i data-lucide="lock" class="token-icon"></i><span>No Token</span>`;
  }
  lucide.createIcons();
}

// ─── PRODUCTS ────────────────────────────────────────────────────────────────
async function loadProducts() {
  // Show skeleton placeholders
  productsGrid.innerHTML = Array(5)
    .fill('<div class="skeleton skeleton-card"></div>')
    .join('');

  try {
    const res  = await apiFetch('/products');
    const data = await res.json();

    if (data.success) {
      statProducts.textContent = data.count;
      renderProducts(data.data);
      toast(`Loaded ${data.count} products successfully.`, 'success');
    } else {
      productsGrid.innerHTML = emptyState('Could not load products.');
    }
  } catch (err) {
    productsGrid.innerHTML = emptyState('Network error — is the server running?');
    toast('Failed to fetch products. Check if the server is running.', 'error');
  }
}

function renderProducts(products) {
  const categoryIcons = {
    'Electronics': 'cpu',
    'Accessories': 'cable',
    'Audio':       'headphones',
  };

  productsGrid.innerHTML = products.map((p) => {
    const icon = categoryIcons[p.category] || 'box';
    return `
      <div class="product-card">
        <div class="product-card-top">
          <div class="product-icon">
            <i data-lucide="${icon}"></i>
          </div>
          <span class="product-category">${p.category}</span>
        </div>
        <div class="product-name">${p.name}</div>
        <div class="product-id">ID: ${p.id}</div>
        <div class="product-price">$${p.price.toFixed(2)} <span>USD</span></div>
      </div>`;
  }).join('');

  lucide.createIcons();
}

// ─── USERS — GET BY ID ───────────────────────────────────────────────────────
async function getUser() {
  const id = $('#user-id-input').value.trim();
  if (!id) {
    toast('Enter a User ID first.', 'error');
    return;
  }

  if (!authToken) {
    toast('Set an authorization token first.', 'error');
    return;
  }

  try {
    const res  = await apiFetch(`/users/${id}`);
    const data = await res.json();

    getUserResult.classList.add('visible');

    if (data.success) {
      const u = data.data;
      const initials = u.name.split(' ').map(w => w[0]).join('').toUpperCase();
      getUserResult.innerHTML = `
        <div class="result-label"><i data-lucide="check-circle"></i> User Found</div>
        <div class="result-box success">
          <div class="user-display">
            <div class="user-avatar">${initials}</div>
            <div class="user-meta">
              <h4>${u.name}</h4>
              <p>${u.email}</p>
              <span class="role-tag ${u.role}">${u.role}</span>
            </div>
          </div>
        </div>`;
    } else {
      getUserResult.innerHTML = `
        <div class="result-label"><i data-lucide="alert-circle"></i> Not Found</div>
        <div class="result-box error">
          <p>${data.message}</p>
        </div>`;
    }
    lucide.createIcons();
  } catch (err) {
    showResultError(getUserResult, err);
  }
}

// ─── USERS — CREATE ──────────────────────────────────────────────────────────
async function createUser() {
  const name  = $('#new-user-name').value.trim();
  const email = $('#new-user-email').value.trim();
  const role  = $('#new-user-role').value;

  if (!name || !email) {
    toast('Name and Email are required.', 'error');
    return;
  }

  if (!authToken) {
    toast('Set an authorization token first.', 'error');
    return;
  }

  try {
    const res = await apiFetch('/users', {
      method: 'POST',
      body: JSON.stringify({ name, email, role }),
    });
    const data = await res.json();

    createUserResult.classList.add('visible');

    if (data.success) {
      const u = data.data;
      const initials = u.name.split(' ').map(w => w[0]).join('').toUpperCase();
      createUserResult.innerHTML = `
        <div class="result-label"><i data-lucide="check-circle"></i> User Created</div>
        <div class="result-box success">
          <div class="user-display">
            <div class="user-avatar">${initials}</div>
            <div class="user-meta">
              <h4>${u.name}</h4>
              <p>${u.email}</p>
              <span class="role-tag ${u.role}">${u.role}</span>
            </div>
          </div>
        </div>`;
      // Clear form
      $('#new-user-name').value  = '';
      $('#new-user-email').value = '';
      toast(data.message, 'success');
    } else {
      createUserResult.innerHTML = `
        <div class="result-label"><i data-lucide="alert-circle"></i> Error</div>
        <div class="result-box error"><p>${data.message}</p></div>`;
      toast(data.message, 'error');
    }
    lucide.createIcons();
  } catch (err) {
    showResultError(createUserResult, err);
  }
}

// ─── API TESTER ──────────────────────────────────────────────────────────────
function toggleBodySection() {
  apiBodySection.style.display = apiMethod.value === 'POST' ? 'block' : 'none';
}

async function sendApiRequest() {
  const method = apiMethod.value;
  const url    = apiUrl.value.trim();

  if (!url) {
    toast('Enter an API path (e.g. /products).', 'error');
    return;
  }

  const opts = { method };
  if (method === 'POST' && apiBody.value.trim()) {
    opts.body = apiBody.value.trim();
  }

  apiOutput.textContent = 'Loading...';
  apiStatus.textContent = '';
  apiStatus.className   = 'status-badge';

  try {
    const res  = await apiFetch(url, opts);
    const data = await res.json();

    // Status badge
    const code = res.status;
    apiStatus.textContent = `${code} ${res.statusText}`;
    if (code >= 200 && code < 300) apiStatus.classList.add('s2xx');
    else if (code >= 400 && code < 500) apiStatus.classList.add('s4xx');
    else if (code >= 500) apiStatus.classList.add('s5xx');

    apiOutput.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    apiOutput.textContent = `Error: ${err.message}`;
    apiStatus.textContent = 'ERR';
    apiStatus.classList.add('s5xx');
  }
}

// ─── FETCH WRAPPER ───────────────────────────────────────────────────────────
async function apiFetch(path, opts = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: authToken } : {}),
  };
  return fetch(`${API_BASE}${path}`, { ...opts, headers });
}

// ─── TOAST NOTIFICATIONS ─────────────────────────────────────────────────────
function toast(message, type = 'info') {
  const iconMap = {
    success: 'check-circle',
    error:   'alert-triangle',
    info:    'info',
  };

  const container = $('#toast-container');
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `<i data-lucide="${iconMap[type]}"></i><span>${message}</span>`;
  container.appendChild(el);
  lucide.createIcons();

  // Auto-dismiss
  setTimeout(() => {
    el.classList.add('removing');
    setTimeout(() => el.remove(), 300);
  }, 3500);
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function emptyState(msg) {
  return `
    <div class="empty-state">
      <i data-lucide="alert-circle"></i>
      <p>${msg}</p>
    </div>`;
}

function showResultError(container, err) {
  container.classList.add('visible');
  container.innerHTML = `
    <div class="result-label"><i data-lucide="alert-circle"></i> Error</div>
    <div class="result-box error"><p>${err.message}</p></div>`;
  lucide.createIcons();
}
