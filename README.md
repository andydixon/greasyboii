# Greasemonkey Browser Extension

**Author:** Andy Dixon  
**Version:** 1.0.0

A powerful browser extension that allows you to execute custom JavaScript and CSS on web pages based on flexible matching conditions.

## Features

- 🎯 **Flexible Matching**: Execute scripts when:
  - A URL contains a specific string
  - A page contains a specific element (CSS selector)
  - Both conditions are met simultaneously

- 🎨 **Bootstrap Dark UI**: Intuitive configuration interface with Bootstrap 5 dark theme
- 💾 **Persistent Storage**: All rules are saved and synced across your browser sessions
- ⚡ **Multiple Rules**: Add, edit, and manage unlimited custom rules
- 🔄 **Toggle Controls**: Easily enable/disable individual rules
- 📝 **JavaScript & CSS**: Support for both JavaScript execution and CSS injection
- 🔍 **Visual Indicators**: Clear badges showing rule type (URL/Element/Both) and code types (JS/CSS)

### 2.0 additions

- 🎯 **Visual element picker** — click "Pick on page" and select an element instead of guessing a CSS selector
- 🤖 **Auto-click** — automatically click a selector once, or repeatedly (cookie banners, "load more" buttons)
- 🔤 **Find & replace text** — swap text on the page as part of a rule
- 🔁 **SPA re-apply** — optionally re-checks a rule's condition as the page's DOM changes, for client-routed apps
- 📥 **Bulk media downloader** — scan a page for images/PDFs/videos (or custom extensions) and download them all at once
- 🔗 **Link harvester** — pull every link out of a container (or the whole page), then open selected links in new tabs or export them as a `.txt` list
- 🧮 **Page data scraper** — pull text/href/src/any attribute from every element matching a selector, export as CSV or JSON
- 💾 **Rule import/export** — back up or share your rules as a JSON file
- 🌓 **One-click dark mode** — adds a dark-mode rule for the current site in a single click
- 🔌 **Master kill-switch** — `Ctrl+Shift+G` (`Cmd+Shift+G` on Mac) instantly disables/re-enables every rule, with a toolbar badge showing the state

Available in both browsers as of v2.0.0.

## Installation

### Chrome Installation

1. Navigate to the `chrome` directory
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the `chrome` directory
6. The Greasemonkey extension is now installed!

### Firefox Installation

1. Navigate to the `firefox` directory
2. Open Firefox and go to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from the `firefox` directory
5. The Greasemonkey extension is now installed!

**Note:** For permanent Firefox installation, you'll need to sign the extension through [addons.mozilla.org](https://addons.mozilla.org).

## Usage

### Creating a Rule

1. Click the Greasemonkey icon in your browser toolbar
2. Click the "+ Add Rule" button
3. Fill in the rule details:
   - **Rule Name**: A descriptive name for your rule
   - **Match Type**: Choose how the rule should be triggered
     - *URL contains string*: Matches if URL contains the pattern
     - *Page contains element*: Matches if element selector exists
     - *Both URL and element*: Requires both conditions
   - **URL Pattern**: The string to match in the URL (e.g., `github.com`, `/search?`)
   - **Element Selector**: CSS selector to match (e.g., `#my-element`, `.my-class`, `div[data-id="123"]`)
   - **JavaScript Code**: Custom JavaScript to execute
   - **CSS Code**: Custom CSS to inject
   - **Enabled**: Toggle to enable/disable the rule
4. Click "Save Rule"

### Editing a Rule

1. Open the Greasemonkey popup
2. Click the edit button (pencil icon) on any rule card
3. Modify the rule details
4. Click "Save Rule"

### Deleting a Rule

1. Open the Greasemonkey popup
2. Click the delete button (trash icon) on any rule card
3. Confirm the deletion

### Toggling a Rule

Use the toggle switch on each rule card to quickly enable or disable rules without editing them.

### Advanced Rule Fields

Open the "Advanced" section in the rule editor for three extra actions a rule can take,
on top of JS/CSS:

- **Auto-Click Selector** — clicked once when the rule matches; set "Repeat every (sec)"
  to keep clicking on an interval (e.g. re-dismissing a recurring banner), and "Max
  clicks" to cap it.
- **Text Replacements** — a list of Find/Replace pairs applied to the page's visible text.
- **Re-check on page changes (for SPAs)** — re-evaluates the rule's match condition as the
  DOM changes, so it still fires after a client-side route change instead of only once
  on page load.

Next to the Element Selector field, click **🎯 Pick** to select an element visually
instead of writing a CSS selector by hand — hover to highlight, click to select, Esc to
cancel. Because the popup closes as soon as you click the page, the picked selector is
filled in the next time you open the popup (it re-opens the rule you were editing
automatically).

### Power Tools

The **Tools** tab has three one-off utilities that act on the current page directly,
outside the rule system:

- **Bulk Media Downloader** — pick a type (Images/PDFs/Videos/custom extensions), scan
  the page, then download everything found in one click.
- **Link Harvester** — optionally scope to a container CSS selector (e.g. `.article-list`
  or `#results`), extract every link inside it, then open the selected ones in new
  background tabs or export the list as `.txt`.
- **Page Data Scraper** — pull text, `href`, `src`, or any attribute from every element
  matching a selector, then export the results as CSV or JSON.

The header also has **⬇ Export** / **⬆ Import** for backing up or sharing your whole
rule set as JSON, and **🌓** to add a ready-made dark-mode rule for the site you're
currently on.

## Examples

### Example 1: Hide Ads on Specific Sites

**Match Type:** URL contains string  
**URL Pattern:** `example.com`  
**CSS Code:**
```css
.advertisement,
.ad-banner,
#sidebar-ads {
  display: none !important;
}
```

### Example 2: Auto-fill Forms

**Match Type:** Both URL and element  
**URL Pattern:** `form-site.com`  
**Element Selector:** `#login-form`  
**JavaScript Code:**
```javascript
document.getElementById('username').value = 'myusername';
console.log('Auto-filled username field');
```

### Example 3: Dark Mode Override

**Match Type:** URL contains string  
**URL Pattern:** `news-site.com`  
**CSS Code:**
```css
body {
  background-color: #1a1a1a !important;
  color: #e0e0e0 !important;
}

a {
  color: #4a9eff !important;
}
```

### Example 4: Add Custom Features

**Match Type:** Element exists  
**Element Selector:** `.video-player`  
**JavaScript Code:**
```javascript
console.log('Video player detected!');

// Add a custom button
const button = document.createElement('button');
button.textContent = 'Custom Action';
button.style.cssText = 'position:fixed;top:10px;right:10px;z-index:9999;';
button.onclick = () => alert('Custom button clicked!');
document.body.appendChild(button);
```

### Example 5: Conditional Styling

**Match Type:** Both URL and element  
**URL Pattern:** `dashboard`  
**Element Selector:** `.data-table`  
**CSS Code:**
```css
.data-table {
  border: 2px solid #4CAF50;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.data-table th {
  background-color: #4CAF50;
  color: white;
}
```

## Technical Details

### File Structure

```
greasemonkey/
├── chrome/                 # Chrome extension files
│   ├── manifest.json      # Chrome extension manifest (v3)
│   ├── background.js      # Background service worker
│   ├── content.js         # Content script (runs on pages)
│   ├── popup.html         # Extension popup UI
│   ├── popup.css          # Popup styling
│   ├── popup.js           # Popup functionality
│   └── icon*.png          # Extension icons
├── firefox/               # Firefox extension files
│   ├── manifest.json      # Firefox extension manifest (v2)
│   ├── background.js      # Background script
│   ├── content.js         # Content script (runs on pages)
│   ├── popup.html         # Extension popup UI
│   ├── popup.css          # Popup styling
│   ├── popup.js           # Popup functionality
│   └── icon*.png          # Extension icons
└── README.md              # This file
```

### How It Works

1. **Content Script**: Runs on every page load (`document_idle`)
2. **Rule Matching**: Checks all enabled rules against current page
3. **Condition Evaluation**: Tests URL patterns and element selectors
4. **Code Execution**: 
   - JavaScript is injected as a script element
   - CSS is injected as a style element
5. **Storage**: Rules are stored in browser's sync storage

### Storage Format

Rules are stored as JSON in browser sync storage:

```javascript
{
  "rules": [
    {
      "name": "Example Rule",
      "matchType": "url",
      "urlPattern": "example.com",
      "elementSelector": "",
      "javascript": "console.log('Hello');",
      "css": "body { background: red; }",
      "enabled": true,

      // v2.0+ advanced fields (all optional):
      "autoClickSelector": "",
      "autoClickIntervalSec": 0,
      "autoClickMax": 0,
      "reapplyOnDomChanges": false,
      "textReplacements": []
    }
  ]
}
```

Both browsers also store a top-level `masterEnabled` boolean (default `true`) — the
`Ctrl+Shift+G` kill-switch — separately from the `rules` array.

### Browser Compatibility

- **Chrome**: Requires Chrome 88+ (Manifest V3)
- **Firefox**: Requires Firefox 48+ (Manifest V2)
- **Edge**: Should work (Chromium-based, same as Chrome)
- **Opera**: Should work (Chromium-based, same as Chrome)

## Building for Distribution

Run `./package-all.sh` from the repo root to build both. It delegates to two dedicated
scripts, each of which reads its version straight out of its own `manifest.json` (no
hardcoded version strings to keep in sync), checks all required files are present, and
zips the folder's *contents* — not the folder itself — to the zip root:

```bash
./package-all.sh
# or individually:
./package-chrome-release.sh    # -> dist/greasyboii-chrome-v<version>.zip
./package-firefox-release.sh   # -> dist/greasyboii-firefox-v<version>.zip
```

- **Chrome**: upload `dist/greasyboii-chrome-v<version>.zip` to the
  [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard).
  (`chrome://extensions/` → "Pack extension" also still works if you want a `.crx` +
  `.pem` instead.)
- **Firefox**: upload `dist/greasyboii-firefox-v<version>.zip` to
  [addons.mozilla.org](https://addons.mozilla.org), or sign it yourself:
  ```bash
  cd dist && web-ext sign --api-key=YOUR_API_KEY --api-secret=YOUR_API_SECRET --source-dir=../firefox
  ```

## Security Considerations

- **User Responsibility**: Be cautious with JavaScript code execution
- **HTTPS**: Script injection works on both HTTP and HTTPS sites
- **CSP**: Some sites with strict Content Security Policy may block injected scripts
- **Permissions**: Extension requires broad permissions (`<all_urls>`) to work on all sites, plus `downloads` (used only by the Tools tab's bulk media downloader)

## Troubleshooting

### Rules Not Executing

1. **Check the browser console** for error messages (F12)
2. **Verify the rule is enabled** (toggle switch)
3. **Test the URL pattern** - ensure it matches the current page
4. **Test the element selector** - open console and run `document.querySelector('your-selector')`
5. **Reload the page** after creating/editing rules

### CSS Not Applying

- Use `!important` flag to override existing styles
- Check for syntax errors in CSS
- Verify the rule conditions are met

### JavaScript Not Running

- Check browser console for errors
- Ensure JavaScript syntax is correct
- Some sites may have strict Content Security Policies

### Storage Not Syncing

- Ensure browser sync is enabled
- Check available storage quota
- For Firefox temporary add-ons, sync storage may not persist

## Development

### Local Development

1. Make changes to files in `chrome/` or `firefox/` directories
2. Reload the extension:
   - **Chrome**: Go to `chrome://extensions/` and click reload icon
   - **Firefox**: Go to `about:debugging` and click reload
3. Test your changes

### Debugging

- **Background Script**: Check browser console in extension management page
- **Content Script**: Check page console (F12)
- **Popup**: Right-click popup and select "Inspect"

## Privacy

- No data is sent to external servers
- All rules are stored locally in browser storage
- No analytics or tracking
- No network requests made by the extension

## License

This extension is provided as-is for personal and educational use.

## Support

For issues, questions, or feature requests, please contact Andy Dixon.

## Version History

### 2.0.0 (Chrome and Firefox)
- Visual element picker for the Element Selector field
- Auto-click rule action (once or repeating)
- Find & replace text rule action
- SPA re-apply (MutationObserver-based rule re-checking)
- Bulk media downloader (Tools tab)
- Link harvester with bulk open-in-tabs / export (Tools tab)
- Page data scraper with CSV/JSON export (Tools tab)
- Rule import/export as JSON
- One-click "Dark Mode This Site" rule generator
- Master enable/disable kill-switch with `Ctrl+Shift+G` shortcut and toolbar badge
- New icon
- Shipped Firefox-only first; Chrome caught up to full feature parity in the same 2.0.0
  line (Chrome's JS injection still goes through its `chrome.scripting.executeScript`
  relay rather than Firefox's `wrappedJSObject`/script-tag approach — see CLAUDE.md)

### 1.0.0 (Initial Release)
- URL pattern matching
- Element selector matching
- Combined URL + Element matching
- JavaScript execution
- CSS injection
- Bootstrap dark theme UI
- Add/Edit/Delete rules
- Enable/Disable toggle
- Persistent storage
- Chrome and Firefox support
