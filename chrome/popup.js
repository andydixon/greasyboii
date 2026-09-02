// Popup script for managing rules (Chrome version)
let currentRules = [];
let editingRuleIndex = -1;
let ruleModal;
let scannedMedia = [];
let harvestedLinks = [];
let scrapedData = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  if (typeof bootstrap !== 'undefined') {
    initializeExtension();
  } else {
    setTimeout(initializeExtension, 100);
  }
});

function initializeExtension() {
  try {
    ruleModal = new bootstrap.Modal(document.getElementById('ruleModal'));
  } catch (e) {
    console.error('Error initializing modal:', e);
  }

  loadRules();
  setupEventListeners();
  setupAdvancedRuleFields();
  setupHeaderControls();
  setupToolsTab();
  restorePendingPicker();
}

function setupEventListeners() {
  const addRuleBtn = document.getElementById('addRuleBtn');
  const saveRuleBtn = document.getElementById('saveRuleBtn');
  const matchTypeSelect = document.getElementById('matchType');

  if (addRuleBtn) {
    addRuleBtn.addEventListener('click', () => openRuleModal());
  } else {
    console.error('Add Rule button not found!');
  }

  if (saveRuleBtn) {
    saveRuleBtn.addEventListener('click', saveRule);
  } else {
    console.error('Save Rule button not found!');
  }

  if (matchTypeSelect) {
    matchTypeSelect.addEventListener('change', (e) => {
      updateFieldVisibility(e.target.value);
    });
  } else {
    console.error('Match Type select not found!');
  }
}

function updateFieldVisibility(matchType) {
  const urlGroup = document.getElementById('urlPatternGroup');
  const elementGroup = document.getElementById('elementSelectorGroup');
  const urlInput = document.getElementById('urlPattern');
  const elementInput = document.getElementById('elementSelector');

  if (matchType === 'url') {
    urlGroup.style.display = 'block';
    elementGroup.style.display = 'none';
    urlInput.required = true;
    elementInput.required = false;
  } else if (matchType === 'element') {
    urlGroup.style.display = 'none';
    elementGroup.style.display = 'block';
    urlInput.required = false;
    elementInput.required = true;
  } else if (matchType === 'both') {
    urlGroup.style.display = 'block';
    elementGroup.style.display = 'block';
    urlInput.required = true;
    elementInput.required = true;
  }
}

function loadRules() {
  chrome.storage.sync.get(['rules']).then((result) => {
    currentRules = result.rules || [];
    renderRules();
  });
}

function renderRules() {
  const rulesList = document.getElementById('rulesList');
  const emptyState = document.getElementById('emptyState');

  if (currentRules.length === 0) {
    rulesList.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  rulesList.innerHTML = currentRules.map((rule, index) => {
    const matchTypeLabel = {
      'url': 'URL',
      'element': 'Element',
      'both': 'URL + Element'
    }[rule.matchType] || rule.matchType;

    const hasJS = rule.javascript && rule.javascript.trim();
    const hasCSS = rule.css && rule.css.trim();
    const hasAutoClick = rule.autoClickSelector && rule.autoClickSelector.trim();
    const hasReplacements = rule.textReplacements && rule.textReplacements.length;

    return `
      <div class="rule-card" data-rule-index="${index}">
        <div class="rule-header">
          <div class="d-flex align-items-center gap-2 flex-wrap">
            <span class="rule-name">${escapeHtml(rule.name)}</span>
            <span class="badge rule-badge bg-secondary">${matchTypeLabel}</span>
            ${hasJS ? '<span class="badge rule-badge bg-warning">JS</span>' : ''}
            ${hasCSS ? '<span class="badge rule-badge bg-info">CSS</span>' : ''}
            ${hasAutoClick ? '<span class="badge rule-badge bg-success">Click</span>' : ''}
            ${hasReplacements ? '<span class="badge rule-badge bg-primary">Replace</span>' : ''}
            ${rule.reapplyOnDomChanges ? '<span class="badge rule-badge bg-dark border">SPA</span>' : ''}
          </div>
          <div class="rule-actions">
            <div class="form-check form-switch mb-0">
              <input class="form-check-input rule-toggle" type="checkbox" ${rule.enabled ? 'checked' : ''}
                     data-index="${index}" title="Enable/Disable">
            </div>
            <button class="btn btn-sm btn-outline-light btn-edit-rule" data-index="${index}" title="Edit">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
              </svg>
            </button>
            <button class="btn btn-sm btn-outline-danger btn-delete-rule" data-index="${index}" title="Delete">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="rule-details">
          ${rule.matchType === 'url' || rule.matchType === 'both' ? `<div><strong>URL:</strong> ${escapeHtml(rule.urlPattern)}</div>` : ''}
          ${rule.matchType === 'element' || rule.matchType === 'both' ? `<div><strong>Element:</strong> ${escapeHtml(rule.elementSelector)}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');

  attachRuleEventListeners();
}

function attachRuleEventListeners() {
  const rulesList = document.getElementById('rulesList');

  rulesList.removeEventListener('click', handleRuleClick);
  rulesList.removeEventListener('change', handleRuleToggle);

  rulesList.addEventListener('click', handleRuleClick);
  rulesList.addEventListener('change', handleRuleToggle);
}

function handleRuleClick(e) {
  const editBtn = e.target.closest('.btn-edit-rule');
  const deleteBtn = e.target.closest('.btn-delete-rule');

  if (editBtn) {
    editRule(parseInt(editBtn.dataset.index));
  } else if (deleteBtn) {
    deleteRule(parseInt(deleteBtn.dataset.index));
  }
}

function handleRuleToggle(e) {
  if (e.target.classList.contains('rule-toggle')) {
    toggleRule(parseInt(e.target.dataset.index));
  }
}

function openRuleModal(ruleIndex = -1) {
  editingRuleIndex = ruleIndex;
  const modalTitle = document.getElementById('modalTitle');
  const form = document.getElementById('ruleForm');

  form.reset();
  renderReplacementRows([]);
  document.getElementById('advancedSection').open = false;

  if (ruleIndex >= 0) {
    modalTitle.textContent = 'Edit Rule';
    const rule = currentRules[ruleIndex];
    document.getElementById('ruleName').value = rule.name;
    document.getElementById('matchType').value = rule.matchType;
    document.getElementById('urlPattern').value = rule.urlPattern || '';
    document.getElementById('elementSelector').value = rule.elementSelector || '';
    document.getElementById('javascript').value = rule.javascript || '';
    document.getElementById('css').value = rule.css || '';
    document.getElementById('autoClickSelector').value = rule.autoClickSelector || '';
    document.getElementById('autoClickInterval').value = rule.autoClickIntervalSec || 0;
    document.getElementById('autoClickMax').value = rule.autoClickMax || 0;
    document.getElementById('reapplyOnDomChanges').checked = !!rule.reapplyOnDomChanges;
    document.getElementById('ruleEnabled').checked = rule.enabled;
    renderReplacementRows(rule.textReplacements || []);

    if (rule.autoClickSelector || (rule.textReplacements && rule.textReplacements.length) || rule.reapplyOnDomChanges) {
      document.getElementById('advancedSection').open = true;
    }
  } else {
    modalTitle.textContent = 'Add Rule';
    document.getElementById('ruleEnabled').checked = true;
  }

  updateFieldVisibility(document.getElementById('matchType').value);
  showRuleModal();
}

function showRuleModal() {
  if (ruleModal) {
    ruleModal.show();
  } else {
    try {
      ruleModal = new bootstrap.Modal(document.getElementById('ruleModal'));
      ruleModal.show();
    } catch (e) {
      console.error('Error showing modal:', e);
      alert('Error opening rule editor. Please reload the extension.');
    }
  }
}

function saveRule() {
  const name = document.getElementById('ruleName').value.trim();
  const matchType = document.getElementById('matchType').value;
  const urlPattern = document.getElementById('urlPattern').value.trim();
  const elementSelector = document.getElementById('elementSelector').value.trim();
  const javascript = document.getElementById('javascript').value;
  const css = document.getElementById('css').value;
  const enabled = document.getElementById('ruleEnabled').checked;
  const autoClickSelector = document.getElementById('autoClickSelector').value.trim();
  const autoClickIntervalSec = parseInt(document.getElementById('autoClickInterval').value, 10) || 0;
  const autoClickMax = parseInt(document.getElementById('autoClickMax').value, 10) || 0;
  const reapplyOnDomChanges = document.getElementById('reapplyOnDomChanges').checked;
  const textReplacements = collectReplacementRows().filter((r) => r.find.trim());

  if (!name) {
    alert('Please enter a rule name');
    return;
  }

  if (matchType === 'url' && !urlPattern) {
    alert('Please enter a URL pattern');
    return;
  }

  if (matchType === 'element' && !elementSelector) {
    alert('Please enter an element selector');
    return;
  }

  if (matchType === 'both' && (!urlPattern || !elementSelector)) {
    alert('Please enter both URL pattern and element selector');
    return;
  }

  if (!javascript && !css && !autoClickSelector && textReplacements.length === 0) {
    alert('Please enter JavaScript, CSS, an auto-click selector, or a text replacement');
    return;
  }

  const rule = {
    name, matchType, urlPattern, elementSelector, javascript, css, enabled,
    autoClickSelector, autoClickIntervalSec, autoClickMax, reapplyOnDomChanges, textReplacements
  };

  if (editingRuleIndex >= 0) {
    currentRules[editingRuleIndex] = rule;
  } else {
    currentRules.push(rule);
  }

  chrome.storage.sync.set({ rules: currentRules }).then(() => {
    loadRules();
    ruleModal.hide();
  });
}

function editRule(index) {
  openRuleModal(index);
}

function deleteRule(index) {
  if (confirm(`Delete rule "${currentRules[index].name}"?`)) {
    currentRules.splice(index, 1);
    chrome.storage.sync.set({ rules: currentRules }).then(() => {
      loadRules();
    });
  }
}

function toggleRule(index) {
  currentRules[index].enabled = !currentRules[index].enabled;
  chrome.storage.sync.set({ rules: currentRules }).then(() => {
    loadRules();
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text == null ? '' : text;
  return div.innerHTML;
}

// ---------------------------------------------------------------------
// Advanced rule fields: text replacement rows + the "pick on page" button
// ---------------------------------------------------------------------

function setupAdvancedRuleFields() {
  document.getElementById('addReplacementBtn').addEventListener('click', () => {
    const rows = collectReplacementRows();
    rows.push({ find: '', replace: '' });
    renderReplacementRows(rows);
  });

  document.getElementById('textReplacementsList').addEventListener('click', (e) => {
    const btn = e.target.closest('.remove-replacement-btn');
    if (!btn) return;
    const rows = collectReplacementRows();
    const index = parseInt(btn.closest('.replacement-row').dataset.index, 10);
    rows.splice(index, 1);
    renderReplacementRows(rows);
  });

  document.getElementById('pickElementBtn').addEventListener('click', async () => {
    const tab = await getActiveTab();
    if (!tab || !tab.id) return;

    await chrome.storage.local.set({ pickerPending: collectModalSnapshot() });

    try {
      await chrome.tabs.sendMessage(tab.id, { action: 'startPicker' });
    } catch (e) {
      alert('Could not start the element picker on this page (it may be a restricted browser page).');
      return;
    }
    // The popup closes as soon as focus moves to the page, so there's nothing more
    // to do here — the picked selector is relayed back through storage and restored
    // the next time this popup opens (see restorePendingPicker()).
  });
}

function renderReplacementRows(rows) {
  const list = document.getElementById('textReplacementsList');
  list.innerHTML = rows.map((r, i) => `
    <div class="input-group input-group-sm mb-1 replacement-row" data-index="${i}">
      <input type="text" class="form-control replacement-find" placeholder="Find" value="${escapeHtml(r.find || '')}">
      <input type="text" class="form-control replacement-replace" placeholder="Replace with" value="${escapeHtml(r.replace || '')}">
      <button class="btn btn-outline-danger remove-replacement-btn" type="button" title="Remove">✕</button>
    </div>
  `).join('');
}

function collectReplacementRows() {
  return [...document.querySelectorAll('.replacement-row')].map((row) => ({
    find: row.querySelector('.replacement-find').value,
    replace: row.querySelector('.replacement-replace').value
  }));
}

function collectModalSnapshot() {
  return {
    modalTitle: document.getElementById('modalTitle').textContent,
    editingRuleIndex,
    ruleName: document.getElementById('ruleName').value,
    matchType: document.getElementById('matchType').value,
    urlPattern: document.getElementById('urlPattern').value,
    elementSelector: document.getElementById('elementSelector').value,
    javascript: document.getElementById('javascript').value,
    css: document.getElementById('css').value,
    autoClickSelector: document.getElementById('autoClickSelector').value,
    autoClickInterval: document.getElementById('autoClickInterval').value,
    autoClickMax: document.getElementById('autoClickMax').value,
    reapplyOnDomChanges: document.getElementById('reapplyOnDomChanges').checked,
    textReplacements: collectReplacementRows(),
    ruleEnabled: document.getElementById('ruleEnabled').checked
  };
}

function restoreModalState(snapshot, pickedSelector) {
  editingRuleIndex = snapshot.editingRuleIndex;
  document.getElementById('modalTitle').textContent = snapshot.modalTitle;
  document.getElementById('ruleName').value = snapshot.ruleName;
  document.getElementById('matchType').value = snapshot.matchType;
  document.getElementById('urlPattern').value = snapshot.urlPattern;
  document.getElementById('elementSelector').value = pickedSelector || snapshot.elementSelector;
  document.getElementById('javascript').value = snapshot.javascript;
  document.getElementById('css').value = snapshot.css;
  document.getElementById('autoClickSelector').value = snapshot.autoClickSelector;
  document.getElementById('autoClickInterval').value = snapshot.autoClickInterval;
  document.getElementById('autoClickMax').value = snapshot.autoClickMax;
  document.getElementById('reapplyOnDomChanges').checked = snapshot.reapplyOnDomChanges;
  document.getElementById('ruleEnabled').checked = snapshot.ruleEnabled;
  renderReplacementRows(snapshot.textReplacements || []);
  document.getElementById('advancedSection').open = true;
  updateFieldVisibility(snapshot.matchType);
  showRuleModal();
}

function restorePendingPicker() {
  chrome.storage.local.get(['pickerPending', 'pendingPickResult']).then((result) => {
    if (!result.pickerPending) return;
    restoreModalState(result.pickerPending, result.pendingPickResult || null);
    chrome.storage.local.remove(['pickerPending', 'pendingPickResult']);
  });
}

// ---------------------------------------------------------------------
// Header controls: master toggle, dark mode quick action, import/export
// ---------------------------------------------------------------------

function setupHeaderControls() {
  const masterToggle = document.getElementById('masterToggle');
  const masterToggleLabel = document.getElementById('masterToggleLabel');

  chrome.storage.sync.get(['masterEnabled']).then((result) => {
    const enabled = result.masterEnabled !== false;
    masterToggle.checked = enabled;
    masterToggleLabel.textContent = enabled ? 'On' : 'Off';
  });

  masterToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ masterEnabled: masterToggle.checked }).then(() => {
      masterToggleLabel.textContent = masterToggle.checked ? 'On' : 'Off';
    });
  });

  document.getElementById('darkModeBtn').addEventListener('click', addDarkModeRule);
  document.getElementById('exportRulesBtn').addEventListener('click', exportRules);
  document.getElementById('importRulesBtn').addEventListener('click', () => {
    document.getElementById('importFileInput').click();
  });
  document.getElementById('importFileInput').addEventListener('change', importRules);
}

async function addDarkModeRule() {
  const tab = await getActiveTab();
  if (!tab || !tab.url) return;

  let hostname;
  try {
    hostname = new URL(tab.url).hostname;
  } catch (e) {
    alert('Cannot create a dark mode rule for this page.');
    return;
  }
  if (!hostname) {
    alert('Cannot create a dark mode rule for this page.');
    return;
  }

  const rule = {
    name: `Dark Mode: ${hostname}`,
    matchType: 'url',
    urlPattern: hostname,
    elementSelector: '',
    javascript: '',
    css: 'html { filter: invert(1) hue-rotate(180deg); }\n' +
      'img, video, picture, canvas, svg, [style*="background-image"] { filter: invert(1) hue-rotate(180deg); }',
    enabled: true,
    autoClickSelector: '',
    autoClickIntervalSec: 0,
    autoClickMax: 0,
    reapplyOnDomChanges: false,
    textReplacements: []
  };

  currentRules.push(rule);
  chrome.storage.sync.set({ rules: currentRules }).then(() => {
    loadRules();
    alert(`Added a dark mode rule for ${hostname}. Reload the page to see it — edit or disable it any time from the Rules tab.`);
  });
}

function exportRules() {
  downloadBlob(JSON.stringify(currentRules, null, 2), 'greasyboii-rules.json', 'application/json');
}

function importRules() {
  const input = document.getElementById('importFileInput');
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    let imported;
    try {
      imported = JSON.parse(reader.result);
    } catch (e) {
      alert('That file is not valid JSON.');
      return;
    }

    const looksLikeRules = Array.isArray(imported) &&
      imported.every((r) => r && typeof r.name === 'string' && typeof r.matchType === 'string');
    if (!looksLikeRules) {
      alert('That file does not look like a GreasyBoii rules export.');
      return;
    }

    if (!confirm(`Import ${imported.length} rule(s) from this file?`)) return;
    const replace = confirm('Replace all existing rules with the imported ones?\n\nOK = Replace\nCancel = Add to existing rules');
    currentRules = replace ? imported : currentRules.concat(imported);

    chrome.storage.sync.set({ rules: currentRules }).then(loadRules);
  };
  reader.readAsText(file);
  input.value = '';
}

// ---------------------------------------------------------------------
// Tools tab: bulk media downloader, link harvester, page data scraper
// ---------------------------------------------------------------------

function setupToolsTab() {
  setupMediaDownloader();
  setupLinkHarvester();
  setupDataScraper();
}

function setupMediaDownloader() {
  const mediaType = document.getElementById('mediaType');
  const mediaExtensions = document.getElementById('mediaExtensions');
  const scanMediaBtn = document.getElementById('scanMediaBtn');
  const mediaResults = document.getElementById('mediaResults');
  const downloadMediaBtn = document.getElementById('downloadMediaBtn');

  mediaType.addEventListener('change', () => {
    mediaExtensions.style.display = mediaType.value === 'custom' ? 'block' : 'none';
  });

  scanMediaBtn.addEventListener('click', async () => {
    const tab = await getActiveTab();
    if (!tab) return;

    try {
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'scanMedia',
        mediaType: mediaType.value,
        extensions: mediaExtensions.value
      });
      scannedMedia = (response && response.items) || [];
      mediaResults.textContent = `${scannedMedia.length} file(s) found.`;
      downloadMediaBtn.disabled = scannedMedia.length === 0;
      downloadMediaBtn.textContent = `Download All (${scannedMedia.length})`;
    } catch (e) {
      mediaResults.textContent = 'Could not scan this page (try reloading it first).';
    }
  });

  downloadMediaBtn.addEventListener('click', () => {
    scannedMedia.forEach((item, i) => {
      setTimeout(() => {
        chrome.downloads.download({ url: item.url, filename: item.filename, conflictAction: 'uniquify' })
          .catch((e) => console.error('[GreasyBoii] Download failed for', item.url, e));
      }, i * 150);
    });
  });
}

function setupLinkHarvester() {
  const containerSelector = document.getElementById('linkContainerSelector');
  const harvestLinksBtn = document.getElementById('harvestLinksBtn');
  const linkResults = document.getElementById('linkResults');
  const openLinksBtn = document.getElementById('openLinksBtn');
  const exportLinksBtn = document.getElementById('exportLinksBtn');

  harvestLinksBtn.addEventListener('click', async () => {
    const tab = await getActiveTab();
    if (!tab) return;

    try {
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'harvestLinks',
        containerSelector: containerSelector.value.trim()
      });
      harvestedLinks = (response && response.items) || [];
      renderLinkResults();
    } catch (e) {
      linkResults.textContent = 'Could not read links on this page (try reloading it first).';
      openLinksBtn.disabled = true;
      exportLinksBtn.disabled = true;
    }
  });

  function renderLinkResults() {
    if (harvestedLinks.length === 0) {
      linkResults.textContent = 'No links found.';
      openLinksBtn.disabled = true;
      exportLinksBtn.disabled = true;
      return;
    }

    linkResults.innerHTML = `<div class="tool-scroll">${harvestedLinks.map((link, i) => `
      <div class="form-check">
        <input class="form-check-input link-check" type="checkbox" id="link-${i}" data-index="${i}" checked>
        <label class="form-check-label text-truncate d-block" for="link-${i}" title="${escapeHtml(link.url)}">${escapeHtml(link.text || link.url)}</label>
      </div>
    `).join('')}</div><div class="text-muted mt-1">${harvestedLinks.length} link(s) found</div>`;
    openLinksBtn.disabled = false;
    exportLinksBtn.disabled = false;
  }

  function getCheckedLinks() {
    const checkedIndexes = [...document.querySelectorAll('.link-check:checked')].map((el) => parseInt(el.dataset.index, 10));
    return harvestedLinks.filter((_, i) => checkedIndexes.includes(i));
  }

  openLinksBtn.addEventListener('click', () => {
    getCheckedLinks().forEach((link) => chrome.tabs.create({ url: link.url, active: false }));
  });

  exportLinksBtn.addEventListener('click', () => {
    const text = getCheckedLinks().map((l) => l.url).join('\n');
    downloadBlob(text, 'greasyboii-links.txt', 'text/plain');
  });
}

function setupDataScraper() {
  const selector = document.getElementById('scrapeSelector');
  const attribute = document.getElementById('scrapeAttribute');
  const customAttr = document.getElementById('scrapeCustomAttr');
  const scrapeBtn = document.getElementById('scrapeBtn');
  const scrapeResults = document.getElementById('scrapeResults');
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  const exportJsonBtn = document.getElementById('exportJsonBtn');

  attribute.addEventListener('change', () => {
    customAttr.style.display = attribute.value === 'custom' ? 'block' : 'none';
  });

  scrapeBtn.addEventListener('click', async () => {
    const tab = await getActiveTab();
    if (!tab || !selector.value.trim()) return;

    const attr = attribute.value === 'custom' ? customAttr.value.trim() : attribute.value;

    try {
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'scrapeData',
        selector: selector.value.trim(),
        attribute: attr
      });
      scrapedData = (response && response.items) || [];
      scrapeResults.textContent = `${scrapedData.length} value(s) scraped.`;
      exportCsvBtn.disabled = scrapedData.length === 0;
      exportJsonBtn.disabled = scrapedData.length === 0;
    } catch (e) {
      scrapeResults.textContent = 'Could not scrape this page (try reloading it first).';
    }
  });

  exportCsvBtn.addEventListener('click', () => {
    const csv = scrapedData.map((v) => `"${String(v).replace(/"/g, '""')}"`).join('\n');
    downloadBlob(csv, 'greasyboii-scrape.csv', 'text/csv');
  });

  exportJsonBtn.addEventListener('click', () => {
    downloadBlob(JSON.stringify(scrapedData, null, 2), 'greasyboii-scrape.json', 'application/json');
  });
}

// ---------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

function downloadBlob(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
