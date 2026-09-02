# Changelog

All notable changes to GreasyBoii will be documented in this file.

## [2.0.0] - 2026-09-02 (Chrome and Firefox)

### Added
- Visual element picker for the rule editor's Element Selector field
- Advanced rule actions: auto-click (once or repeating), find & replace text,
  SPA re-apply (MutationObserver-based re-checking of a rule's match condition)
- Tools tab: bulk media downloader, link harvester (bulk-open/export), page data
  scraper (CSV/JSON export)
- Rule import/export as JSON
- One-click "Dark Mode This Site" rule generator
- Master enable/disable kill-switch (`Ctrl+Shift+G`) with a toolbar badge
- New extension icon (shared design, rasterized separately per browser)

### Changed
- Both `manifest.json` files now request the `downloads` permission (used only by the
  bulk media downloader) and declare a `commands` shortcut for the kill-switch
- `package-all.sh` no longer hardcodes a version or zips inline; it now delegates to
  `package-chrome-release.sh` and `package-firefox-release.sh`, which each read their
  version from their own `manifest.json`

### Notes
- Landed Firefox-first (element picker relayed through `storage.local`+`background.js`
  since the popup closes before a page click, and JS rules injected via
  `wrappedJSObject`/script-tag). Chrome reaches full feature parity in this same
  release; its content script keeps routing JS injection through the background
  service worker's `chrome.scripting.executeScript` (MAIN world) instead, since that
  CSP-bypass mechanism was already Chrome's approach pre-2.0 — see CLAUDE.md.

## [1.0.2] - 2024-10-16

### Fixed
- **CRITICAL: CSP Violation** - Fixed Content Security Policy blocking external Bootstrap CDN
- **Modal initialization** - Now works correctly with local Bootstrap files
- Extension now fully functional in Chrome Manifest V3

### Changed
- **Renamed to GreasyBoii** - Extension renamed from "Greasemonkey" to "GreasyBoii"
- **Local Bootstrap** - Downloaded Bootstrap 5.3.2 files locally (227KB CSS + 79KB JS)
- Updated all console messages to show "GreasyBoii" branding
- Updated all UI text to reflect new name

### Added
- bootstrap.min.css (227KB) - Local Bootstrap CSS
- bootstrap.bundle.min.js (79KB) - Local Bootstrap JS with Popper

## [1.0.1] - 2024-10-16

### Fixed
- **Add Rule button not working** - Fixed Bootstrap modal initialization timing issue
- Added fallback initialization for Bootstrap Modal to handle CDN load timing
- Improved error handling and logging in popup.js
- Added null checks for DOM elements to prevent errors
- Added console logging for debugging button clicks

### Changed
- Enhanced `setupEventListeners()` with better error detection
- Improved `openRuleModal()` with fallback modal initialization
- Added `initializeExtension()` wrapper function for proper initialization order

### Added
- TROUBLESHOOTING.md - Comprehensive troubleshooting guide
- Console logging for debugging initialization issues
- Better error messages when elements are not found

## [1.0.0] - 2024-10-16

### Fixed
- **Add Rule button not working** - Fixed Bootstrap modal initialization timing issue
- Added fallback initialization for Bootstrap Modal to handle CDN load timing
- Improved error handling and logging in popup.js
- Added null checks for DOM elements to prevent errors
- Added console logging for debugging button clicks

### Changed
- Enhanced `setupEventListeners()` with better error detection
- Improved `openRuleModal()` with fallback modal initialization
- Added `initializeExtension()` wrapper function for proper initialization order

### Added
- TROUBLESHOOTING.md - Comprehensive troubleshooting guide
- Console logging for debugging initialization issues
- Better error messages when elements are not found

## [1.0.0] - 2024-10-16

### Added
- Initial release
- Chrome extension (Manifest V3)
- Firefox extension (Manifest V2)
- URL pattern matching
- CSS selector (element) matching
- Combined URL + element matching
- JavaScript execution
- CSS injection
- Bootstrap 5 dark theme UI
- Add/edit/delete rules
- Enable/disable toggles
- Persistent synced storage
- Complete documentation suite
- Example rules library
- Interactive test page
- Build instructions

### Features
- Flexible matching system (URL, Element, Both)
- Modern Bootstrap dark UI
- Full CRUD operations for rules
- Form validation
- Error handling
- Cross-browser support (Chrome, Firefox, Edge, Opera)
