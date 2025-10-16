# Greasemonkey Quick Start Guide

Get up and running with Greasemonkey in 5 minutes!

## Installation

### Chrome
1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (top-right toggle)
4. Click "Load unpacked"
5. Select the `chrome` folder
6. Done! 🎉

### Firefox
1. Open Firefox
2. Go to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select `firefox/manifest.json`
5. Done! 🎉

## Your First Rule

Let's create a simple rule that changes Google's background color:

1. **Click the Greasemonkey icon** in your browser toolbar
2. **Click "+ Add Rule"**
3. **Fill in the form:**
   - Rule Name: `Google Dark Background`
   - Match Type: `URL contains string`
   - URL Pattern: `google.com`
   - CSS Code:
     ```css
     body {
       background-color: #1a1a1a !important;
       color: #e0e0e0 !important;
     }
     ```
   - Leave JavaScript blank
   - Keep Enabled checked
4. **Click "Save Rule"**
5. **Visit google.com** and see the dark background!

## Testing with Test Page

A test page is included: `test-page.html`

1. Open `test-page.html` in your browser
2. Create a rule:
   - Rule Name: `Test Page Alert`
   - Match Type: `Page contains element`
   - Element Selector: `#test-element-1`
   - JavaScript Code:
     ```javascript
     alert('Greasemonkey is working!');
     ```
3. Reload the test page
4. You should see an alert!

## Common Use Cases

### Hide Annoying Elements
```css
.advertisement,
.popup-banner,
#cookie-notice {
  display: none !important;
}
```

### Change Colors
```css
body {
  background-color: #1a1a1a !important;
  color: #ffffff !important;
}
```

### Auto-Click Buttons
```javascript
const button = document.querySelector('.accept-button');
if (button) button.click();
```

### Add Custom Content
```javascript
const banner = document.createElement('div');
banner.textContent = 'Custom banner added by Greasemonkey!';
banner.style.cssText = 'position:fixed;top:0;width:100%;background:red;color:white;padding:10px;z-index:9999;';
document.body.insertBefore(banner, document.body.firstChild);
```

## Tips

- **Use `!important`** in CSS to override existing styles
- **Check the console** (F12) for error messages
- **Start simple** and test before adding complex rules
- **Toggle rules off** if they cause problems
- **Element selectors** can be found by right-clicking → Inspect Element

## Troubleshooting

**Rule not working?**
- ✓ Is the rule enabled? (check the toggle)
- ✓ Does the URL pattern match? (try a shorter string)
- ✓ Does the element exist? (test in console: `document.querySelector('selector')`)
- ✓ Did you reload the page?

**CSS not applying?**
- Add `!important` to CSS rules
- Check for syntax errors

**JavaScript not running?**
- Check browser console (F12) for errors
- Test code in console first

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- See [BUILD.md](BUILD.md) for distribution instructions
- Experiment with different selectors and code
- Share your rules with others!

## Example: Complete Rule

Here's a complete rule that works on GitHub to highlight pull requests:

- **Rule Name:** `GitHub PR Highlight`
- **Match Type:** `Both URL and element`
- **URL Pattern:** `github.com`
- **Element Selector:** `.js-issue-row`
- **CSS Code:**
  ```css
  .js-issue-row {
    border-left: 4px solid #28a745 !important;
    background-color: #f0fff4 !important;
  }
  ```
- **JavaScript Code:**
  ```javascript
  console.log('GitHub PR highlighting active');
  ```

## Help

Need help? Check:
- Browser console (F12) for errors
- README.md for full documentation
- Element inspector to find correct selectors

Happy scripting! 🐒✨
