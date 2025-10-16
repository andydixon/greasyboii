// Popup script for managing rules
let currentRules = [];
let editingRuleIndex = -1;
let ruleModal;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Wait for Bootstrap to be fully loaded
  if (typeof bootstrap !== 'undefined') {
    initializeExtension();
  } else {
    // Fallback: wait a bit for Bootstrap to load
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
}

function setupEventListeners() {
  const addRuleBtn = document.getElementById('addRuleBtn');
  const saveRuleBtn = document.getElementById('saveRuleBtn');
  const matchTypeSelect = document.getElementById('matchType');
  
  if (addRuleBtn) {
    addRuleBtn.addEventListener('click', () => {
      console.log('Add Rule button clicked');
      openRuleModal();
    });
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
  chrome.storage.sync.get(['rules'], (result) => {
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

    return `
      <div class="rule-card" data-rule-index="${index}">
        <div class="rule-header">
          <div class="d-flex align-items-center gap-2">
            <span class="rule-name">${escapeHtml(rule.name)}</span>
            <span class="badge rule-badge bg-secondary">${matchTypeLabel}</span>
            ${hasJS ? '<span class="badge rule-badge bg-warning">JS</span>' : ''}
            ${hasCSS ? '<span class="badge rule-badge bg-info">CSS</span>' : ''}
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
  
  // Add event listeners using event delegation
  attachRuleEventListeners();
}

function attachRuleEventListeners() {
  const rulesList = document.getElementById('rulesList');
  
  // Remove old listeners if any
  rulesList.removeEventListener('click', handleRuleClick);
  rulesList.removeEventListener('change', handleRuleToggle);
  
  // Add new listeners
  rulesList.addEventListener('click', handleRuleClick);
  rulesList.addEventListener('change', handleRuleToggle);
}

function handleRuleClick(e) {
  const editBtn = e.target.closest('.btn-edit-rule');
  const deleteBtn = e.target.closest('.btn-delete-rule');
  
  if (editBtn) {
    const index = parseInt(editBtn.dataset.index);
    editRule(index);
  } else if (deleteBtn) {
    const index = parseInt(deleteBtn.dataset.index);
    deleteRule(index);
  }
}

function handleRuleToggle(e) {
  if (e.target.classList.contains('rule-toggle')) {
    const index = parseInt(e.target.dataset.index);
    toggleRule(index);
  }
}

function openRuleModal(ruleIndex = -1) {
  editingRuleIndex = ruleIndex;
  const modalTitle = document.getElementById('modalTitle');
  const form = document.getElementById('ruleForm');

  form.reset();

  if (ruleIndex >= 0) {
    modalTitle.textContent = 'Edit Rule';
    const rule = currentRules[ruleIndex];
    document.getElementById('ruleName').value = rule.name;
    document.getElementById('matchType').value = rule.matchType;
    document.getElementById('urlPattern').value = rule.urlPattern || '';
    document.getElementById('elementSelector').value = rule.elementSelector || '';
    document.getElementById('javascript').value = rule.javascript || '';
    document.getElementById('css').value = rule.css || '';
    document.getElementById('ruleEnabled').checked = rule.enabled;
  } else {
    modalTitle.textContent = 'Add Rule';
    document.getElementById('ruleEnabled').checked = true;
  }

  updateFieldVisibility(document.getElementById('matchType').value);
  
  // Show modal - ensure Bootstrap Modal is initialized
  if (ruleModal) {
    ruleModal.show();
  } else {
    // Fallback: try to initialize and show
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

  // Validation
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

  if (!javascript && !css) {
    alert('Please enter either JavaScript or CSS code');
    return;
  }

  const rule = {
    name,
    matchType,
    urlPattern,
    elementSelector,
    javascript,
    css,
    enabled
  };

  if (editingRuleIndex >= 0) {
    currentRules[editingRuleIndex] = rule;
  } else {
    currentRules.push(rule);
  }

  chrome.storage.sync.set({ rules: currentRules }, () => {
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
    chrome.storage.sync.set({ rules: currentRules }, () => {
      loadRules();
    });
  }
}

function toggleRule(index) {
  currentRules[index].enabled = !currentRules[index].enabled;
  chrome.storage.sync.set({ rules: currentRules }, () => {
    loadRules();
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

