/**
 * popup.js — PSINT Job Tracker Extension Popup
 *
 * Responsibilities:
 *  - Show job entry form immediately (no scraping)
 *  - Save job to backend via api.js
 *  - Tab switching (Add Job ↔ Settings)
 *  - Settings: save/load JWT + API URL, test connection, show extension origin
 */

import { saveJob, testConnection } from '../utils/api.js';
import { getToken, setToken, getApiUrl, setApiUrl } from '../utils/storage.js';

// ─────────────────────────────────────────────────────────
// DOM refs
// ─────────────────────────────────────────────────────────

const $ = (id) => document.getElementById(id);

const tabSave       = $('tab-save');
const tabSettings   = $('tab-settings');
const panelSave     = $('panel-save');
const panelSettings = $('panel-settings');

const jobForm        = $('job-form');
const formFeedback   = $('form-feedback');

const fieldTitle    = $('field-title');
const fieldCompany  = $('field-company');
const fieldLocation = $('field-location');
const fieldJobType  = $('field-job-type');
const fieldSalary   = $('field-salary');
const fieldSource   = $('field-source');
const fieldUrl      = $('field-url');
const fieldNotes    = $('field-notes');

const btnSave        = $('btn-save');
const btnSaveText    = $('btn-save-text');
const btnSaveSpinner = $('btn-save-spinner');
const btnClear       = $('btn-clear');

const fieldToken     = $('field-token');
const btnToggleToken = $('btn-toggle-token');
const btnSaveToken   = $('btn-save-token');
const btnTestConn    = $('btn-test-connection');
const tokenFeedback  = $('token-feedback');

const fieldApiUrl  = $('field-api-url');
const btnSaveUrl   = $('btn-save-url');
const urlFeedback  = $('url-feedback');

const fieldExtId   = $('field-ext-id');
const btnCopyExtId = $('btn-copy-ext-id');

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }

function showFeedback(el, type, msg) {
  el.className = `feedback feedback--${type}`;
  el.textContent = msg;
  show(el);
}

function hideFeedback(el) {
  hide(el);
  el.textContent = '';
  el.className = 'feedback hidden';
}

// ─────────────────────────────────────────────────────────
// Tab switching
// ─────────────────────────────────────────────────────────

function switchTab(target) {
  const isSettings = target === 'settings';

  tabSave.classList.toggle('tab--active', !isSettings);
  tabSettings.classList.toggle('tab--active', isSettings);
  tabSave.setAttribute('aria-selected', String(!isSettings));
  tabSettings.setAttribute('aria-selected', String(isSettings));

  panelSave.classList.toggle('hidden', isSettings);
  panelSettings.classList.toggle('hidden', !isSettings);
}

tabSave.addEventListener('click', () => switchTab('save'));
tabSettings.addEventListener('click', () => switchTab('settings'));

// ─────────────────────────────────────────────────────────
// Save job
// ─────────────────────────────────────────────────────────

jobForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideFeedback(formFeedback);

  const title   = fieldTitle.value.trim();
  const company = fieldCompany.value.trim();

  if (!title) {
    fieldTitle.focus();
    showFeedback(formFeedback, 'error', 'Job title is required.');
    return;
  }
  if (!company) {
    fieldCompany.focus();
    showFeedback(formFeedback, 'error', 'Company is required.');
    return;
  }

  // Build payload — omit empty optional fields
  const payload = { title, company };

  const optionals = {
    location:        fieldLocation.value.trim(),
    job_type:        fieldJobType.value.trim(),
    salary_range:    fieldSalary.value.trim(),
    source_site:     fieldSource.value || 'manual',
    description_url: fieldUrl.value.trim(),
    notes:           fieldNotes.value.trim(),
  };
  for (const [k, v] of Object.entries(optionals)) {
    if (v) payload[k] = v;
  }

  // Disable button, show spinner
  btnSave.disabled = true;
  hide(btnSaveText);
  show(btnSaveSpinner);
  btnSave.setAttribute('aria-busy', 'true');

  const result = await saveJob(payload);

  // Restore button
  btnSave.disabled = false;
  show(btnSaveText);
  hide(btnSaveSpinner);
  btnSave.removeAttribute('aria-busy');

  if (result.success) {
    showFeedback(formFeedback, 'success', '✓ Saved! View it in your Job Tracker dashboard.');
    jobForm.reset();
  } else {
    showFeedback(formFeedback, 'error', result.error ?? 'Something went wrong. Please try again.');

    // Auth error → nudge to Settings
    if (result.status === 401 || result.error?.includes('token')) {
      switchTab('settings');
      fieldToken.focus();
    }
  }
});

// Clear button
btnClear.addEventListener('click', () => {
  jobForm.reset();
  hideFeedback(formFeedback);
  fieldTitle.focus();
});

// ─────────────────────────────────────────────────────────
// Settings — Token
// ─────────────────────────────────────────────────────────

btnToggleToken.addEventListener('click', () => {
  const isPassword = fieldToken.type === 'password';
  fieldToken.type = isPassword ? 'text' : 'password';
  btnToggleToken.setAttribute('aria-label', isPassword ? 'Hide token' : 'Show token');
});

btnSaveToken.addEventListener('click', async () => {
  const token = fieldToken.value.trim();
  if (!token) {
    showFeedback(tokenFeedback, 'error', 'Please paste a token first.');
    return;
  }
  await setToken(token);
  showFeedback(tokenFeedback, 'success', 'Token saved.');
  setTimeout(() => hideFeedback(tokenFeedback), 3000);
});

btnTestConn.addEventListener('click', async () => {
  btnTestConn.disabled = true;
  btnTestConn.textContent = 'Testing…';
  hideFeedback(tokenFeedback);

  const result = await testConnection();

  btnTestConn.disabled = false;
  btnTestConn.textContent = 'Test Connection';

  if (result.success) {
    const name = result.user?.name ?? result.user?.email ?? 'authenticated';
    showFeedback(tokenFeedback, 'success', `✓ Connected as ${name}.`);
  } else {
    showFeedback(tokenFeedback, 'error', result.error ?? 'Connection failed.');
  }
});

// ─────────────────────────────────────────────────────────
// Settings — API URL
// ─────────────────────────────────────────────────────────

btnSaveUrl.addEventListener('click', async () => {
  const url = fieldApiUrl.value.trim();
  if (!url) {
    showFeedback(urlFeedback, 'error', 'Please enter a URL.');
    return;
  }
  try {
    new URL(url);
  } catch {
    showFeedback(urlFeedback, 'error', 'Invalid URL format.');
    return;
  }
  await setApiUrl(url);
  showFeedback(urlFeedback, 'success', 'API URL saved.');
  setTimeout(() => hideFeedback(urlFeedback), 3000);
});

// ─────────────────────────────────────────────────────────
// Settings — Extension origin
// ─────────────────────────────────────────────────────────

btnCopyExtId.addEventListener('click', () => {
  navigator.clipboard.writeText(fieldExtId.value).then(() => {
    btnCopyExtId.setAttribute('aria-label', 'Copied!');
    setTimeout(() => btnCopyExtId.setAttribute('aria-label', 'Copy extension origin'), 2000);
  });
});

// ─────────────────────────────────────────────────────────
// Init
// ─────────────────────────────────────────────────────────

async function init() {
  const [token, apiUrl] = await Promise.all([getToken(), getApiUrl()]);

  if (token) fieldToken.value = token;
  fieldApiUrl.value = apiUrl;
  fieldExtId.value = `chrome-extension://${chrome.runtime.id}`;

  // If no token yet, open directly on Settings so the user knows what to do
  if (!token) {
    switchTab('settings');
    fieldToken.focus();
  } else {
    fieldTitle.focus();
  }
}

init();
