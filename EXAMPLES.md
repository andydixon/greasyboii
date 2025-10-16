# Greasemonkey Example Rules

This document contains useful example rules you can use with Greasemonkey. Copy and paste these into your extension to get started quickly.

## Table of Contents
1. [Page Styling](#page-styling)
2. [Element Manipulation](#element-manipulation)
3. [Content Blocking](#content-blocking)
4. [Automation](#automation)
5. [Custom Features](#custom-features)

---

## Page Styling

### Dark Mode for Any Site
**Match Type:** URL contains string  
**URL Pattern:** `example.com` (replace with your target site)  
**CSS Code:**
```css
body {
  background-color: #1a1a1a !important;
  color: #e0e0e0 !important;
}

a {
  color: #4a9eff !important;
}

div, p, span, article {
  background-color: #1a1a1a !important;
  color: #e0e0e0 !important;
}
```

### Increase Font Size
**Match Type:** URL contains string  
**URL Pattern:** `news-site.com`  
**CSS Code:**
```css
body {
  font-size: 18px !important;
  line-height: 1.6 !important;
}

p {
  font-size: 18px !important;
}
```

### Remove Animations
**Match Type:** URL contains string  
**URL Pattern:** (any site with annoying animations)  
**CSS Code:**
```css
* {
  animation: none !important;
  transition: none !important;
}
```

### Custom Color Scheme
**Match Type:** URL contains string  
**URL Pattern:** `docs.` (targets documentation sites)  
**CSS Code:**
```css
:root {
  --bg-color: #282c34;
  --text-color: #abb2bf;
  --accent-color: #61afef;
}

body {
  background-color: var(--bg-color) !important;
  color: var(--text-color) !important;
}

a {
  color: var(--accent-color) !important;
}
```

---

## Element Manipulation

### Highlight Search Results
**Match Type:** Page contains element  
**Element Selector:** `.search-result`  
**CSS Code:**
```css
.search-result:hover {
  background-color: #fff3cd !important;
  border-left: 4px solid #ffc107 !important;
  transition: all 0.2s ease !important;
}
```

### Auto-Expand Collapsed Content
**Match Type:** Page contains element  
**Element Selector:** `.collapsed`  
**JavaScript Code:**
```javascript
document.querySelectorAll('.collapsed').forEach(elem => {
  elem.classList.remove('collapsed');
  elem.style.display = 'block';
});
```

### Add Copy Buttons to Code Blocks
**Match Type:** Page contains element  
**Element Selector:** `pre code`  
**JavaScript Code:**
```javascript
document.querySelectorAll('pre code').forEach(block => {
  const button = document.createElement('button');
  button.textContent = 'Copy';
  button.style.cssText = 'position:absolute;top:5px;right:5px;padding:5px 10px;cursor:pointer;';
  button.onclick = () => {
    navigator.clipboard.writeText(block.textContent);
    button.textContent = 'Copied!';
    setTimeout(() => button.textContent = 'Copy', 2000);
  };
  block.parentElement.style.position = 'relative';
  block.parentElement.appendChild(button);
});
```

### Enhance Tables
**Match Type:** Page contains element  
**Element Selector:** `table`  
**CSS Code:**
```css
table {
  border-collapse: collapse !important;
  width: 100% !important;
  margin: 20px 0 !important;
}

table th {
  background-color: #4CAF50 !important;
  color: white !important;
  padding: 12px !important;
  text-align: left !important;
}

table td {
  padding: 10px !important;
  border-bottom: 1px solid #ddd !important;
}

table tr:hover {
  background-color: #f5f5f5 !important;
}
```

---

## Content Blocking

### Hide Advertisements
**Match Type:** URL contains string  
**URL Pattern:** (target site)  
**CSS Code:**
```css
.ad,
.ads,
.advertisement,
[class*="ad-"],
[id*="ad-"],
.sponsored,
.promotion {
  display: none !important;
}
```

### Remove Cookie Notices
**Match Type:** URL contains string  
**URL Pattern:** (any site)  
**CSS Code:**
```css
[class*="cookie"],
[id*="cookie"],
[class*="consent"],
[id*="gdpr"],
.privacy-banner {
  display: none !important;
}
```

### Hide Social Media Widgets
**Match Type:** URL contains string  
**URL Pattern:** (target site)  
**CSS Code:**
```css
.social-share,
.share-buttons,
[class*="social-"],
iframe[src*="facebook"],
iframe[src*="twitter"] {
  display: none !important;
}
```

### Remove Popups
**Match Type:** URL contains string  
**URL Pattern:** (target site)  
**JavaScript Code:**
```javascript
// Remove overlay popups
document.querySelectorAll('.popup, .modal, .overlay').forEach(el => {
  el.remove();
});

// Re-enable scrolling
document.body.style.overflow = 'auto';
document.documentElement.style.overflow = 'auto';
```

---

## Automation

### Auto-Close Annoying Popups
**Match Type:** Page contains element  
**Element Selector:** `.modal`  
**JavaScript Code:**
```javascript
setTimeout(() => {
  const closeButton = document.querySelector('.modal .close, .modal [aria-label="Close"]');
  if (closeButton) {
    closeButton.click();
    console.log('Popup auto-closed');
  }
}, 2000);
```

### Auto-Accept Cookies
**Match Type:** Page contains element  
**Element Selector:** `[class*="cookie"]`  
**JavaScript Code:**
```javascript
const acceptButton = document.querySelector(
  'button[id*="accept"], button[class*="accept"], .cookie-accept, #acceptCookies'
);
if (acceptButton) {
  acceptButton.click();
  console.log('Cookies auto-accepted');
}
```

### Auto-Fill Test Form
**Match Type:** Both URL and element  
**URL Pattern:** `test-form.html`  
**Element Selector:** `#myForm`  
**JavaScript Code:**
```javascript
document.getElementById('username').value = 'testuser';
document.getElementById('email').value = 'test@example.com';
console.log('Form auto-filled');
```

### Skip Video Ads
**Match Type:** Page contains element  
**Element Selector:** `.video-player`  
**JavaScript Code:**
```javascript
setInterval(() => {
  const skipButton = document.querySelector('.skip-ad, .ytp-ad-skip-button');
  if (skipButton && skipButton.offsetParent !== null) {
    skipButton.click();
    console.log('Ad skipped');
  }
}, 1000);
```

---

## Custom Features

### Add Floating Note Pad
**Match Type:** URL contains string  
**URL Pattern:** (any site where you want notes)  
**JavaScript Code:**
```javascript
const notepad = document.createElement('div');
notepad.innerHTML = `
  <div style="position:fixed;top:10px;right:10px;width:300px;z-index:10000;background:white;border:2px solid #333;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.3);">
    <div style="background:#333;color:white;padding:10px;cursor:move;border-radius:6px 6px 0 0;">
      Quick Notes
    </div>
    <textarea id="greasemonkey-notes" style="width:100%;height:200px;padding:10px;border:none;font-family:monospace;"></textarea>
  </div>
`;
document.body.appendChild(notepad);

// Load saved notes
const notes = localStorage.getItem('greasemonkey-notes') || '';
document.getElementById('greasemonkey-notes').value = notes;

// Save notes on change
document.getElementById('greasemonkey-notes').addEventListener('input', (e) => {
  localStorage.setItem('greasemonkey-notes', e.target.value);
});
```

### Add Page Stats Widget
**Match Type:** URL contains string  
**URL Pattern:** (any site)  
**JavaScript Code:**
```javascript
const stats = document.createElement('div');
stats.style.cssText = 'position:fixed;bottom:10px;right:10px;background:#333;color:white;padding:10px;border-radius:8px;font-size:12px;z-index:10000;';

const updateStats = () => {
  const wordCount = document.body.innerText.split(/\s+/).length;
  const linkCount = document.querySelectorAll('a').length;
  const imageCount = document.querySelectorAll('img').length;
  
  stats.innerHTML = `
    <strong>Page Stats</strong><br>
    Words: ${wordCount}<br>
    Links: ${linkCount}<br>
    Images: ${imageCount}
  `;
};

document.body.appendChild(stats);
updateStats();
```

### Reading Mode
**Match Type:** URL contains string  
**URL Pattern:** `article` or `blog`  
**CSS Code:**
```css
body * {
  display: none !important;
}

article,
article *,
.article-content,
.article-content *,
.post-content,
.post-content * {
  display: block !important;
}

body {
  max-width: 800px !important;
  margin: 0 auto !important;
  padding: 40px 20px !important;
  background: #f5f5f5 !important;
}

article {
  background: white !important;
  padding: 40px !important;
  line-height: 1.8 !important;
  font-size: 18px !important;
}
```

### Add Custom Keyboard Shortcuts
**Match Type:** URL contains string  
**URL Pattern:** (target site)  
**JavaScript Code:**
```javascript
document.addEventListener('keydown', (e) => {
  // Ctrl+Shift+D - Toggle dark mode
  if (e.ctrlKey && e.shiftKey && e.key === 'D') {
    document.body.style.filter = 
      document.body.style.filter === 'invert(1)' ? '' : 'invert(1)';
  }
  
  // Ctrl+Shift+H - Hide images
  if (e.ctrlKey && e.shiftKey && e.key === 'H') {
    document.querySelectorAll('img').forEach(img => {
      img.style.display = img.style.display === 'none' ? '' : 'none';
    });
  }
});
```

### Custom Scroll Progress Bar
**Match Type:** URL contains string  
**URL Pattern:** (any site with long content)  
**JavaScript Code:**
```javascript
const progressBar = document.createElement('div');
progressBar.style.cssText = 'position:fixed;top:0;left:0;width:0%;height:4px;background:linear-gradient(90deg,#667eea,#764ba2);z-index:10000;transition:width 0.3s;';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const winScroll = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  progressBar.style.width = scrolled + '%';
});
```

---

## Tips for Creating Your Own Rules

1. **Test in Console First**: Try your JavaScript in the browser console (F12) before adding to a rule
2. **Use !important**: CSS often needs `!important` to override existing styles
3. **Check Element Selectors**: Right-click → Inspect to find correct selectors
4. **Start Simple**: Begin with basic rules and add complexity
5. **Use Console Logging**: Add `console.log()` to debug your JavaScript
6. **Test Match Conditions**: Verify URL patterns and selectors match correctly

## Combining Rules

You can combine multiple techniques in one rule:

**Match Type:** Both URL and element  
**URL Pattern:** `github.com`  
**Element Selector:** `.repository-content`  
**CSS Code:**
```css
.repository-content {
  max-width: 1400px !important;
  margin: 0 auto !important;
}
```
**JavaScript Code:**
```javascript
console.log('GitHub enhancer loaded');
document.querySelectorAll('.markdown-body').forEach(md => {
  md.style.fontSize = '16px';
  md.style.lineHeight = '1.8';
});
```

---

## Advanced Patterns

### Waiting for Elements (Mutation Observer)
```javascript
const observer = new MutationObserver((mutations) => {
  const targetElement = document.querySelector('.dynamic-element');
  if (targetElement) {
    targetElement.style.background = 'yellow';
    observer.disconnect();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
```

### Periodic Checks
```javascript
setInterval(() => {
  const ads = document.querySelectorAll('.ad');
  ads.forEach(ad => ad.remove());
}, 1000);
```

### Event Delegation
```javascript
document.addEventListener('click', (e) => {
  if (e.target.matches('.my-button')) {
    console.log('Button clicked!');
    e.preventDefault();
  }
}, true);
```

---

Happy scripting! Create your own custom rules and enhance your browsing experience. 🚀
