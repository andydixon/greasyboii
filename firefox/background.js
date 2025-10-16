// Background script for Firefox extension
browser.runtime.onInstalled.addListener(() => {
  console.log('GreasyBoii extension installed');
});

// Listen for messages from content script
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getRules') {
    browser.storage.sync.get(['rules']).then((result) => {
      sendResponse({ rules: result.rules || [] });
    });
    return true; // Keep channel open for async response
  }
});
