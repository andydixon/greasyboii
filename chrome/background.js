// Background service worker for Chrome extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('GreasyBoii extension installed');
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getRules') {
    chrome.storage.sync.get(['rules'], (result) => {
      sendResponse({ rules: result.rules || [] });
    });
    return true; // Keep channel open for async response
  }
  
  // Execute JavaScript via scripting API to bypass CSP
  if (request.action === 'executeScript') {
    if (!sender.tab || !sender.tab.id) {
      sendResponse({ success: false, error: 'No tab ID available' });
      return;
    }

    const tabId = sender.tab.id;
    const code = request.code;
    const ruleName = request.ruleName;

    console.log(`[GreasyBoii Background] Executing script for rule "${ruleName}" on tab ${tabId}`);

    // Use chrome.scripting.executeScript which bypasses CSP
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      world: 'MAIN', // Execute in main world (page context), not isolated world
      func: (jsCode) => {
        try {
          // Use indirect eval to execute in global scope
          (1, eval)(jsCode);
        } catch (e) {
          console.error('[GreasyBoii] Script execution error:', e);
        }
      },
      args: [code]
    }).then(() => {
      console.log(`[GreasyBoii Background] ✓ Script executed successfully`);
      sendResponse({ success: true });
    }).catch((error) => {
      console.error(`[GreasyBoii Background] ✗ Script execution failed:`, error);
      sendResponse({ success: false, error: error.message });
    });

    return true; // Keep channel open for async response
  }
});
