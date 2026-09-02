// Background script for Firefox extension
browser.runtime.onInstalled.addListener(() => {
  console.log('GreasyBoii extension installed');
  refreshBadge();
});

// Listen for messages from content script
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getRules') {
    browser.storage.sync.get(['rules']).then((result) => {
      sendResponse({ rules: result.rules || [] });
    });
    return true; // Keep channel open for async response
  }

  // The popup closes the instant the user clicks the page to pick an element, so the
  // content script can't hand the selector straight back to it — relay it through
  // storage instead; the popup picks it up next time it opens (see popup.js).
  if (request.action === 'pickerResult') {
    browser.storage.local.set({ pendingPickResult: request.selector });
  } else if (request.action === 'pickerCancelled') {
    browser.storage.local.remove(['pickerPending', 'pendingPickResult']);
  }
});

// Master enable/disable keyboard shortcut (see manifest.json "commands")
browser.commands.onCommand.addListener((command) => {
  if (command === 'toggle-greasyboii') {
    browser.storage.sync.get(['masterEnabled']).then((result) => {
      const enabled = result.masterEnabled !== false;
      browser.storage.sync.set({ masterEnabled: !enabled });
      // badge refresh happens via the storage.onChanged listener below
    });
  }
});

// Keep the toolbar badge in sync whenever masterEnabled changes, from any source
// (the shortcut above, the popup's toggle switch, or a rules import)
browser.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.masterEnabled) {
    refreshBadge();
  }
});

function refreshBadge() {
  browser.storage.sync.get(['masterEnabled']).then((result) => {
    const enabled = result.masterEnabled !== false;
    browser.browserAction.setBadgeText({ text: enabled ? '' : 'OFF' });
    browser.browserAction.setBadgeBackgroundColor({ color: '#dc3545' });
  });
}
