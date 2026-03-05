import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="dashboard-layout">
    <aside class="dashboard-sidebar">
      <div class="logo">
        <div class="logo-dot"></div>
        OAI
      </div>
      
      <nav class="sidebar-nav">
        <a href="#" class="sidebar-link active" data-tab="overview">Overview</a>
        <a href="#" class="sidebar-link" data-tab="my-oais">My OAIs</a>
        <a href="#" class="sidebar-link" data-tab="metrics">Metrics</a>
        <a href="#" class="sidebar-link" data-tab="settings">Settings</a>
      </nav>
      
      <div style="margin-top: auto; padding-top: var(--spacing-lg);">
        <button id="logout-btn" class="btn btn-secondary" style="width: 100%; font-size: 0.9rem; padding: 0.5rem;">Sign Out</button>
      </div>
    </aside>
    
    <main class="dashboard-main">
      <header class="dashboard-header">
        <h1 id="user-greeting">Hello, Researcher</h1>
        <div class="orcid-badge" id="user-orcid">ORCiD: Not Linked</div>
      </header>

      <!-- === OVERVIEW TAB === -->
      <section id="tab-overview" class="tab-content active-tab" style="padding-top: 0;">
        <div class="features-grid" style="margin-top: 0;">
          <div class="feature-card">
            <div style="display: flex; align-items: baseline; gap: 0.25rem; margin-bottom: 0.4rem;">
              <span id="active-oai-count" style="color: var(--color-primary); font-size: 2.5rem; font-weight: 800; letter-spacing: -0.04em; line-height: 1;">0</span>
              <span style="color: #bbb; font-size: 1.1rem; font-weight: 600;">/ 20</span>
            </div>
            <p style="margin: 0; font-weight: 600;">Active OAIs</p>
            <div style="margin-top: 0.75rem; background: #f0f0f0; border-radius: 4px; height: 8px; overflow: hidden;">
              <div id="oai-quota-bar" style="height: 100%; width: 0%; background: var(--color-primary); border-radius: 4px; transition: width 0.6s ease, background 0.4s ease;"></div>
            </div>
            <p id="oai-quota-label" style="font-size: 0.8rem; margin-top: 0.4rem; color: #888;">0 of 20 slots used</p>
          </div>
          <div class="feature-card" id="mint-card">
            <h3 style="margin-bottom: 0.5rem;">Mint New OAI</h3>
            <p style="margin: 0; font-size: 0.9rem; margin-bottom: 1rem;">Enter the target URL you want your OAI to resolve to.</p>
            <form id="mint-form" style="display: flex; gap: 0.5rem;">
                <input type="url" id="target-url-input" placeholder="https://example.com/my-paper" required style="flex: 1; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;">
                <button type="submit" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">Mint</button>
            </form>
            <div id="mint-status" style="margin-top: 0.5rem; font-size: 0.85rem;"></div>
          </div>
        </div>
        
        <div style="margin-top: 2rem;">
            <h2>Recent Identifiers</h2>
            <div id="oai-list" style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
                <p>Loading OAIs...</p>
            </div>
        </div>
      </section>

      <!-- === MY OAIs TAB === -->
      <section id="tab-my-oais" class="tab-content" style="display:none; padding-top: 0;">
        <h2 style="margin-bottom: 1.5rem;">My OAIs</h2>
        <div id="manage-oai-list" style="display: flex; flex-direction: column; gap: 1.25rem;">
            <p>Loading OAIs...</p>
        </div>
      </section>

      <!-- === METRICS TAB (placeholder) === -->
      <section id="tab-metrics" class="tab-content" style="display:none; padding-top: 0;">
        <h2>Metrics</h2>
        <p style="margin-top: 1rem; color: #888;">Traffic and click analytics coming soon.</p>
      </section>

      <!-- === SETTINGS TAB (placeholder) === -->
      <section id="tab-settings" class="tab-content" style="display:none; padding-top: 0;">
        <h2>Settings</h2>
        <p style="margin-top: 1rem; color: #888;">Account settings coming soon.</p>
      </section>
    </main>
  </div>

  <!-- === DELETE CONFIRMATION MODAL === -->
  <div id="delete-modal" style="
    display: none; position: fixed; inset: 0;
    background: rgba(0,0,0,0.5); z-index: 1000;
    align-items: center; justify-content: center;
  ">
    <div style="
      background: white; border-radius: 12px; padding: 2rem;
      max-width: 480px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    ">
      <h3 style="margin: 0 0 0.75rem; color: #c0392b;">Delete OAI</h3>
      <p style="margin: 0 0 0.5rem; font-size: 0.95rem;">This action is <strong>irreversible</strong>. The identifier will stop resolving immediately.</p>
      <p style="margin: 0 0 1rem; font-size: 0.95rem;">Type <code id="confirm-id-display" style="background:#f4f4f4; padding: 2px 6px; border-radius: 4px; font-family: monospace;"></code> to confirm:</p>
      <input id="delete-confirm-input" type="text" placeholder="Type the OAI identifier here" style="
        width: 100%; box-sizing: border-box; padding: 0.6rem; margin-bottom: 1rem;
        border: 2px solid #e74c3c; border-radius: 6px; font-size: 0.95rem;
      ">
      <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
        <button id="delete-cancel-btn" class="btn btn-secondary" style="padding: 0.5rem 1.25rem;">Cancel</button>
        <button id="delete-confirm-btn" class="btn btn-primary" style="
          padding: 0.5rem 1.25rem; background: #e74c3c; border-color: #e74c3c; opacity: 0.5; cursor: not-allowed;
        " disabled>Delete</button>
      </div>
      <div id="delete-status" style="margin-top: 0.75rem; font-size: 0.85rem; text-align: center;"></div>
    </div>
  </div>
`

// ============================
// State
// ============================
let currentUser = null;
let allOais = [];
let oaiToDelete = null;

// ============================
// Tab Navigation
// ============================
function initTabs() {
  document.querySelectorAll('.sidebar-link[data-tab]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = link.dataset.tab;

      document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      document.querySelectorAll('.tab-content').forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active-tab');
      });

      const target = document.getElementById(`tab-${tab}`);
      if (target) {
        target.style.display = 'block';
        target.classList.add('active-tab');
      }

      // Refresh My OAIs list when switching to it
      if (tab === 'my-oais') renderManageList();
    });
  });
}

// ============================
// Auth gate
// ============================
function initDashboard() {
  const userData = localStorage.getItem('oai_user');
  if (!userData) {
    window.location.href = '/';
    return;
  }

  currentUser = JSON.parse(userData);

  // Populate greeting
  document.getElementById('user-greeting').innerText = `Hello, ${currentUser.name}`;
  const displayOrcid = currentUser.orcid || '0000-0000-0000-0000';
  document.getElementById('user-orcid').innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#A6CE39"/>
        <path d="M7.70275 8.73037H5.21332V17.9304H7.70275V8.73037Z" fill="white"/>
        <path d="M10.8358 8.73037H14.1206C17.6151 8.73037 19.3496 10.7483 19.3496 13.3331C19.3496 15.9189 17.5759 17.9304 14.1206 17.9304H10.8358V8.73037ZM13.3103 16.0353C15.5458 16.0353 16.7196 14.8817 16.7196 13.3331C16.7196 11.7853 15.5458 10.6273 13.3103 10.6273H13.257V16.0353H13.3103Z" fill="white"/>
        <path d="M6.45802 7.2185C7.29177 7.2185 7.96781 6.54228 7.96781 5.70881C7.96781 4.8753 7.29177 4.19904 6.45802 4.19904C5.62423 4.19904 4.94824 4.8753 4.94824 5.70881C4.94824 6.54228 5.62423 7.2185 6.45802 7.2185Z" fill="white"/>
      </svg>
      ${displayOrcid}
    `;

  // Logout
  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('oai_user');
    window.location.href = '/';
  });

  // Tabs
  initTabs();

  // Initial data load
  fetchAndRenderOAIs();

  // Mint form
  const mintForm = document.getElementById('mint-form');
  mintForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const targetUrl = document.getElementById('target-url-input').value;
    const statusEl = document.getElementById('mint-status');

    statusEl.innerText = 'Minting...';
    statusEl.style.color = '#333';

    try {
      const res = await fetch('/api/oai/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-orcid': currentUser.orcid,
          'x-name': currentUser.name
        },
        body: JSON.stringify({ target_url: targetUrl })
      });

      if (res.ok) {
        statusEl.innerText = '✓ Successfully minted!';
        statusEl.style.color = 'green';
        document.getElementById('target-url-input').value = '';
        fetchAndRenderOAIs();
      } else {
        const errData = await res.json();
        statusEl.innerText = 'Error: ' + (errData.error || 'Failed to mint');
        statusEl.style.color = 'red';
      }
    } catch (err) {
      statusEl.innerText = 'Network Error';
      statusEl.style.color = 'red';
    }
  });

  // Delete modal setup
  initDeleteModal();
}

// ============================
// Fetch OAIs from API
// ============================
async function fetchAndRenderOAIs() {
  const listEl = document.getElementById('oai-list');
  const countEl = document.getElementById('active-oai-count');

  try {
    const res = await fetch('/api/user/oais', {
      headers: {
        'x-orcid': currentUser.orcid,
        'x-name': currentUser.name
      }
    });

    if (res.ok) {
      allOais = await res.json();
      const count = allOais.length;
      const OAI_LIMIT = 20;
      countEl.innerText = count;

      // Update quota bar
      const barEl = document.getElementById('oai-quota-bar');
      const labelEl = document.getElementById('oai-quota-label');
      if (barEl && labelEl) {
        const pct = Math.min((count / OAI_LIMIT) * 100, 100);
        barEl.style.width = pct + '%';

        // Colour: orange → yellow at 75% → red at 100%
        if (count >= OAI_LIMIT) {
          barEl.style.background = '#e74c3c';
          labelEl.style.color = '#e74c3c';
          labelEl.innerText = `${count} of ${OAI_LIMIT} slots used — limit reached`;
        } else if (count >= Math.floor(OAI_LIMIT * 0.75)) {
          barEl.style.background = 'var(--color-secondary, #FFC222)';
          labelEl.style.color = '#b8860b';
          labelEl.innerText = `${count} of ${OAI_LIMIT} slots used`;
        } else {
          barEl.style.background = 'var(--color-primary)';
          labelEl.style.color = '#888';
          labelEl.innerText = `${count} of ${OAI_LIMIT} slots used`;
        }
      }

      if (allOais.length === 0) {
        listEl.innerHTML = '<p style="color:#888;">No OAIs yet. Mint your first one above!</p>';
        return;
      }

      listEl.innerHTML = allOais.map(oai => `
                <div style="
                  background: white; padding: 1rem 1.25rem;
                  border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                  border-left: 4px solid var(--color-primary);
                  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
                ">
                  <div>
                    <a href="/${oai.full_id}" target="_blank" style="
                      font-family: monospace; font-size: 1rem; font-weight: 700;
                      color: var(--color-primary); text-decoration: none;
                    " title="Resolves to: ${oai.target_url}">OAI:${oai.full_id}</a>
                    <div style="font-size: 0.82rem; color: #888; margin-top: 2px; word-break: break-all;">
                      → <a href="${oai.target_url}" target="_blank" style="color:#888;">${oai.target_url}</a>
                    </div>
                  </div>
                  <span style="font-size: 0.78rem; color: #bbb; white-space: nowrap;">${new Date(oai.createdAt).toLocaleDateString()}</span>
                </div>
            `).join('');
    } else {
      listEl.innerHTML = '<p style="color:red;">Failed to load OAIs.</p>';
    }
  } catch (e) {
    listEl.innerHTML = '<p style="color:red;">Network error loading OAIs.</p>';
  }
}

// ============================
// My OAIs Management Tab
// ============================
async function renderManageList() {
  const listEl = document.getElementById('manage-oai-list');
  listEl.innerHTML = '<p>Loading...</p>';

  try {
    const res = await fetch('/api/user/oais', {
      headers: {
        'x-orcid': currentUser.orcid,
        'x-name': currentUser.name
      }
    });

    if (!res.ok) {
      listEl.innerHTML = '<p style="color:red;">Failed to load OAIs.</p>';
      return;
    }

    allOais = await res.json();

    if (allOais.length === 0) {
      listEl.innerHTML = '<p style="color:#888;">You have not minted any OAIs yet.</p>';
      return;
    }

    listEl.innerHTML = allOais.map((oai, idx) => `
          <div id="oai-card-${idx}" style="
            background: white; padding: 1.5rem; border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.07);
            border-left: 4px solid var(--color-primary);
          ">
            <div style="display:flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
              <div>
                <span style="font-family: monospace; font-size: 1.1rem; font-weight: 700; color: var(--color-primary);">OAI:${oai.full_id}</span>
                <span style="font-size: 0.8rem; color: #bbb; margin-left: 0.75rem;">${new Date(oai.createdAt).toLocaleDateString()}</span>
              </div>
              <button class="btn" onclick="openDeleteModal('${oai.full_id}')" style="
                padding: 0.3rem 0.8rem; font-size: 0.82rem;
                background: #fff0f0; color: #e74c3c; border: 1px solid #e74c3c; border-radius: 6px;
                cursor: pointer;
              ">Delete</button>
            </div>

            <div style="font-size: 0.9rem; margin-bottom: 1rem; word-break: break-all; color: #555;">
              <strong>Target:</strong>
              <a href="${oai.target_url}" target="_blank" style="color: var(--color-primary);">${oai.target_url}</a>
            </div>

            <form onsubmit="editOai(event, '${oai.full_id}', ${idx})" style="display: flex; gap: 0.5rem;">
              <input
                type="url"
                id="edit-input-${idx}"
                placeholder="New target URL"
                required
                style="flex:1; padding: 0.45rem 0.6rem; border: 1px solid #ddd; border-radius: 6px; font-size: 0.9rem;"
              >
              <button type="submit" class="btn btn-primary" style="padding: 0.45rem 1rem; font-size: 0.9rem;">Update</button>
            </form>
            <div id="edit-status-${idx}" style="font-size: 0.82rem; margin-top: 0.4rem;"></div>
          </div>
        `).join('');

  } catch (e) {
    listEl.innerHTML = '<p style="color:red;">Network error.</p>';
  }
}

// ============================
// Edit OAI
// ============================
window.editOai = async function (e, fullId, idx) {
  e.preventDefault();
  const newUrl = document.getElementById(`edit-input-${idx}`).value;
  const statusEl = document.getElementById(`edit-status-${idx}`);

  statusEl.innerText = 'Saving...';
  statusEl.style.color = '#333';

  try {
    const res = await fetch(`/api/oai/${encodeURIComponent(fullId)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-orcid': currentUser.orcid,
        'x-name': currentUser.name
      },
      body: JSON.stringify({ target_url: newUrl })
    });

    if (res.ok) {
      statusEl.innerText = '✓ Updated!';
      statusEl.style.color = 'green';
      document.getElementById(`edit-input-${idx}`).value = '';
      renderManageList();
      fetchAndRenderOAIs();
    } else {
      const err = await res.json();
      statusEl.innerText = 'Error: ' + (err.error || 'Update failed');
      statusEl.style.color = 'red';
    }
  } catch (err) {
    statusEl.innerText = 'Network error.';
    statusEl.style.color = 'red';
  }
};

// ============================
// Delete Modal
// ============================
function initDeleteModal() {
  const modal = document.getElementById('delete-modal');
  const input = document.getElementById('delete-confirm-input');
  const confirmBtn = document.getElementById('delete-confirm-btn');
  const cancelBtn = document.getElementById('delete-cancel-btn');

  // Enable the confirm button only when input matches the OAI identifier
  input.addEventListener('input', () => {
    const match = input.value === oaiToDelete;
    confirmBtn.disabled = !match;
    confirmBtn.style.opacity = match ? '1' : '0.5';
    confirmBtn.style.cursor = match ? 'pointer' : 'not-allowed';
  });

  cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    input.value = '';
    oaiToDelete = null;
  });

  confirmBtn.addEventListener('click', async () => {
    const statusEl = document.getElementById('delete-status');
    statusEl.innerText = 'Deleting...';
    statusEl.style.color = '#333';
    try {
      const res = await fetch(`/api/oai/${encodeURIComponent(oaiToDelete)}`, {
        method: 'DELETE',
        headers: {
          'x-orcid': currentUser.orcid,
          'x-name': currentUser.name
        }
      });

      if (res.ok) {
        modal.style.display = 'none';
        input.value = '';
        oaiToDelete = null;
        renderManageList();
        fetchAndRenderOAIs();
      } else {
        const err = await res.json();
        statusEl.innerText = 'Error: ' + (err.error || 'Delete failed');
        statusEl.style.color = 'red';
      }
    } catch (err) {
      statusEl.innerText = 'Network error.';
      statusEl.style.color = 'red';
    }
  });
}

window.openDeleteModal = function (fullId) {
  oaiToDelete = fullId;
  document.getElementById('confirm-id-display').innerText = fullId;
  document.getElementById('delete-confirm-input').value = '';
  document.getElementById('delete-status').innerText = '';
  const confirmBtn = document.getElementById('delete-confirm-btn');
  confirmBtn.disabled = true;
  confirmBtn.style.opacity = '0.5';
  confirmBtn.style.cursor = 'not-allowed';
  const modal = document.getElementById('delete-modal');
  modal.style.display = 'flex';
};

// Run
initDashboard();
