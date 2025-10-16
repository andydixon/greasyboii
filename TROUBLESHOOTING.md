# Greasemonkey Troubleshooting Guide

## "Add Rule" Button Not Working

### Quick Fix
1. **Reload the extension**:
   - Chrome: Go to `chrome://extensions/` and click the reload icon on Greasemonkey
   - Firefox: Go to `about:debugging` and click reload
2. **Close and reopen the popup** by clicking the extension icon again
3. **Check the browser console**:
   - Right-click on the popup window
   - Select "Inspect" or "Inspect Element"
   - Look at the Console tab for any error messages

### Common Causes

#### 1. Bootstrap Not Loaded
**Symptom:** Modal doesn't open, or console shows "bootstrap is not defined"  
**Solution:** 
- Ensure you have an internet connection (Bootstrap loads from CDN)
- If offline, the extension won't work properly without Bootstrap
- Check browser console for network errors

#### 2. Content Security Policy
**Symptom:** Console shows CSP violations  
**Solution:** Extension should work in popup, but if issues persist:
- Try reloading the extension completely
- Close all popup windows and reopen

#### 3. Extension Not Properly Loaded
**Symptom:** Nothing happens when clicking buttons  
**Solution:**
- Chrome: 
  1. Go to `chrome://extensions/`
  2. Find Greasemonkey
  3. Click the reload icon (circular arrow)
  4. Try again
- Firefox:
  1. Go to `about:debugging#/runtime/this-firefox`
  2. Find Greasemonkey
  3. Click "Reload"
  4. Try again

### Debug Steps

1. **Open the popup inspector**:
   - Right-click anywhere in the popup window
   - Select "Inspect" or "Inspect Element"
   - This opens DevTools for the popup

2. **Check the Console tab** for errors like:
   - "bootstrap is not defined" → Bootstrap didn't load
   - "Cannot read property 'show' of undefined" → Modal not initialized
   - "Element not found" → HTML structure issue

3. **Try in Console**:
   ```javascript
   // Check if Bootstrap loaded
   console.log(typeof bootstrap);  // Should show "object"
   
   // Check if elements exist
   console.log(document.getElementById('addRuleBtn'));  // Should show button element
   console.log(document.getElementById('ruleModal'));   // Should show modal element
   ```

4. **Manual test**:
   ```javascript
   // Try to open modal manually
   const modal = new bootstrap.Modal(document.getElementById('ruleModal'));
   modal.show();
   ```

### Testing After Fix

1. Reload the extension
2. Click the Greasemonkey icon
3. Click "+ Add Rule"
4. Modal should open with the rule form
5. If successful, you should see the modal with:
   - Rule Name field
   - Match Type dropdown
   - URL Pattern field (visible by default)
   - JavaScript code area
   - CSS code area
   - Enabled checkbox
   - Cancel and Save buttons

## Rules Not Executing

### Check List
1. ✓ Is the rule enabled? (toggle switch should be on)
2. ✓ Does the URL pattern match the current page URL?
3. ✓ If using element selector, does the element exist on the page?
4. ✓ Did you reload the page after creating/editing the rule?

### Debug Process
1. Open the page where the rule should run
2. Open browser console (F12)
3. Look for messages like: `[Greasemonkey] Executing rule: YourRuleName`
4. Check for error messages

### Common Issues

#### Rule Never Executes
- **URL pattern too specific**: Try a shorter, more general pattern
  - ❌ `https://www.example.com/page.html?id=123`
  - ✅ `example.com`
- **Element doesn't exist yet**: Page might load the element dynamically
- **Rule is disabled**: Check the toggle switch

#### JavaScript Not Running
- Check console for syntax errors
- Test your code in the page console first:
  ```javascript
  // Test in console before adding to rule
  console.log('Test');
  ```

#### CSS Not Applying
- Use `!important` to override existing styles:
  ```css
  body {
    background: #000 !important;
  }
  ```
- Check CSS syntax is valid
- Some sites have very specific CSS that overrides yours

## Storage Issues

### Rules Not Persisting
**Chrome:**
- Ensure sync is enabled: `chrome://settings/syncSetup`
- Storage might be full (rare)

**Firefox:**
- Temporary add-ons don't persist after restart
- Use signed version for persistence

### Can't Edit/Delete Rules
1. Check browser console for errors
2. Try exporting rules (copy from console):
   ```javascript
   chrome.storage.sync.get(['rules'], (result) => {
     console.log(JSON.stringify(result.rules, null, 2));
   });
   ```
3. Reload extension

## Performance Issues

### Popup Slow to Open
- Too many rules? Try disabling some
- Check if Bootstrap CDN is slow (network issue)

### Page Loads Slowly
- Complex JavaScript in rules can slow down pages
- Try simplifying your rules
- Use CSS instead of JavaScript when possible

## Browser-Specific Issues

### Chrome/Edge
- **Service worker inactive**: Reload extension
- **CSP errors**: Some sites block injected scripts (rare)

### Firefox
- **Temporary add-on removed**: Expected after restart, reload it
- **Storage not syncing**: Sign the extension for production use

## Getting Help

1. **Check console** (F12) for error messages
2. **Test with simple rule** first:
   - Name: Test
   - Match Type: URL
   - URL Pattern: (current page URL)
   - JavaScript: `alert('It works!');`
3. **Reload extension** after any changes
4. **Try test-page.html** to verify extension works

## Manual Reset

If all else fails, reset the extension:

### Chrome
```javascript
// In popup inspector console
chrome.storage.sync.clear(() => {
  console.log('Storage cleared');
  location.reload();
});
```

### Firefox
```javascript
// In popup inspector console
browser.storage.sync.clear().then(() => {
  console.log('Storage cleared');
  location.reload();
});
```

## Still Not Working?

1. Check if you have the latest version
2. Try in a different browser
3. Verify extension permissions are granted
4. Look for browser console errors
5. Try with a simple test rule on test-page.html

## Version Check

Current version: 1.0.0

Make sure you have all these files:
- manifest.json
- background.js
- content.js
- popup.html
- popup.css
- popup.js
- icon files (16, 48, 128)

## Contact

If issues persist after following this guide, contact Andy Dixon with:
- Browser version
- Error messages from console
- Steps to reproduce
- Screenshot if possible
