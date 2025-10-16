// Content script that runs on all pages
(function() {
  'use strict';

  console.log('[GreasyBoii] Content script loaded on:', window.location.href);

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGreasyBoii);
  } else {
    initGreasyBoii();
  }

  function initGreasyBoii() {
    console.log('[GreasyBoii] Initializing...');
    
    // Get rules from storage and execute matching ones
    chrome.storage.sync.get(['rules'], (result) => {
      const rules = result.rules || [];
      const currentUrl = window.location.href;
      
      console.log('[GreasyBoii] Found', rules.length, 'rule(s) in storage');

      rules.forEach((rule) => {
        if (!rule.enabled) {
          console.log('[GreasyBoii] Skipping disabled rule:', rule.name);
          return;
        }

        let shouldExecute = false;

        // Check conditions
        if (rule.matchType === 'url') {
          shouldExecute = currentUrl.includes(rule.urlPattern);
          console.log(`[GreasyBoii] URL match test for "${rule.name}": ${currentUrl} includes "${rule.urlPattern}" = ${shouldExecute}`);
        } else if (rule.matchType === 'element') {
          shouldExecute = document.querySelector(rule.elementSelector) !== null;
          console.log(`[GreasyBoii] Element match test for "${rule.name}": selector "${rule.elementSelector}" found = ${shouldExecute}`);
        } else if (rule.matchType === 'both') {
          const urlMatches = currentUrl.includes(rule.urlPattern);
          const elementExists = document.querySelector(rule.elementSelector) !== null;
          shouldExecute = urlMatches && elementExists;
          console.log(`[GreasyBoii] Combined match test for "${rule.name}": URL=${urlMatches}, Element=${elementExists}, Result=${shouldExecute}`);
        }

        if (shouldExecute) {
          console.log(`[GreasyBoii] ✓ Executing rule: ${rule.name}`);
          executeRule(rule);
        } else {
          console.log(`[GreasyBoii] ✗ Rule "${rule.name}" conditions not met`);
        }
      });
    });
  }

  function executeRule(rule) {
    // Execute JavaScript using chrome.scripting API to bypass CSP
    if (rule.javascript && rule.javascript.trim()) {
      console.log(`[GreasyBoii] Sending JavaScript execution request for rule: ${rule.name}`);
      
      // Send message to background script to execute JavaScript
      chrome.runtime.sendMessage({
        action: 'executeScript',
        code: rule.javascript,
        ruleName: rule.name
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(`[GreasyBoii] Error communicating with background:`, chrome.runtime.lastError);
        } else if (response && response.success) {
          console.log(`[GreasyBoii] ✓ JavaScript executed successfully via background script`);
        } else {
          console.error(`[GreasyBoii] JavaScript execution failed:`, response?.error);
        }
      });
    }

    // Execute CSS - CSS injection doesn't have CSP issues
    if (rule.css && rule.css.trim()) {
      try {
        console.log(`[GreasyBoii] Injecting CSS for rule: ${rule.name}`);
        
        const style = document.createElement('style');
        style.textContent = rule.css;
        style.setAttribute('data-greasyboii-rule', rule.name);
        (document.head || document.documentElement).appendChild(style);
        
        console.log(`[GreasyBoii] ✓ CSS injected successfully`);
      } catch (error) {
        console.error(`[GreasyBoii] Error applying CSS for rule "${rule.name}":`, error);
      }
    }
  }
})();
