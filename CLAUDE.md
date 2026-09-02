# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

GreasyBoii is a browser extension (a lightweight Greasemonkey/Tampermonkey-style tool) that
injects custom JavaScript and CSS into pages based on URL-substring or CSS-selector match
rules, configured through a popup UI. There is no build system, package manager, or test
suite — it's plain HTML/CSS/JS shipped straight to the browser.

## Repository layout

The extension is maintained as two **parallel, independently-edited** implementations:

- `chrome/` — Manifest V3 (service worker background script)
- `firefox/` — Manifest V2 (persistent background script, `browser.*` namespace)

Each directory is a complete, self-contained extension (manifest, background script, content
script, popup HTML/CSS/JS, vendored Bootstrap, icons). **There is no shared source** — a
change to matching/rule logic in one directory must be manually ported to the other. When
editing behavior, always check whether the same fix is needed in both `chrome/*.js` and
`firefox/*.js`; diff the two files first (`diff chrome/foo.js firefox/foo.js`) to see how they
currently diverge before deciding how to apply a change to both.

Key API differences between the two versions:
- Namespace: `chrome.*` vs. the promise-based `browser.*`. Style is otherwise mixed on the
  Chrome side rather than uniform: `chrome/background.js` keeps the original
  callback style throughout; `chrome/content.js` and `chrome/popup.js` were ported from
  the Firefox files and use the promise form instead (valid since Chrome 88+ returns a
  Promise from most `chrome.*` calls when the callback is omitted — the manifest already
  requires Chrome 88+). Don't "fix" this into one style without checking both still work;
  it's a leftover of how the port was done, not a bug.
- Chrome's `background.js` handles JS execution via `chrome.scripting.executeScript` (world:
  `MAIN`) to bypass page CSP, relayed there from `chrome/content.js`'s `injectJavaScript`;
  Firefox's `content.js` instead injects a `<script>` tag directly (with a
  `wrappedJSObject.eval` attempt first) since Firefox's MV2 background script can't reach
  the page context the same way. This is the one piece of rule-execution logic that's
  genuinely different between the two, not just a namespace swap.
- Both `background.js` files now do more than proxy `getRules`: they also relay the element
  picker's result (`pickerResult`/`pickerCancelled` → `storage.local`, since the popup closes
  before the page click lands) and handle the `toggle-greasyboii` keyboard command.

**Both browsers reached v2.0.0 feature parity together** (see CHANGELOG.md 2.0.0): advanced
rule actions (auto-click, text-replace, MutationObserver-based SPA re-apply — see
`executeRule`/`watchForChanges` in `content.js`), a visual element picker
(`startElementPicker`/`computeSelector` in `content.js`; the relay/restore dance lives in
`restorePendingPicker`/`collectModalSnapshot` in `popup.js`), on-demand page tools (bulk
media download, link harvesting, data scraping — the `runtime.onMessage` handlers under
"On-demand tools" in `content.js`), rule import/export, a one-click dark-mode rule generator,
and the master kill-switch. It shipped Firefox-first; `chrome/popup.js` is close to a
mechanical `browser.` → `chrome.` port of `firefox/popup.js` (see the API-differences bullets
above for what didn't port mechanically).

## Core architecture (both browsers)

1. **`content.js`** runs on every page (`document_idle`, all frames excluded). It reads
   `rules` from `storage.sync`, evaluates each enabled rule's match condition against the
   current page, and for matches injects the rule's JS and/or CSS.
2. **Rule matching** (`matchType`): `url` (substring match against `location.href`), `element`
   (a `document.querySelector` hit), or `both` (both must hold). See the `initGreasyBoii`
   function in `content.js` for the exact matching logic.
3. **`background.js`** brokers privileged operations content scripts can't do directly
   (reading storage, and on Chrome, executing page-world JS to bypass CSP).
4. **`popup.js`** is the rule editor CRUD UI (Bootstrap 5 dark theme, vendored locally after a
   CSP issue with the CDN version — see CHANGELOG.md 1.0.2). It reads/writes the same `rules`
   array in `storage.sync`, keyed by array index (not by id), and re-renders the list via
   `renderRules()`/`attachRuleEventListeners()` (event delegation) after every mutation.

### Storage format

A single `storage.sync` key `rules` holding an array of rule objects:
```js
{ name, matchType, urlPattern, elementSelector, javascript, css, enabled }
```
Rule objects (v2.0.0+, both browsers) also carry optional advanced fields:
`autoClickSelector`, `autoClickIntervalSec`, `autoClickMax`, `reapplyOnDomChanges`,
`textReplacements` (an array of `{find, replace}`). There's also a separate top-level
`storage.sync` key, `masterEnabled` (boolean, default `true`) — the global kill-switch, read
by `content.js` before evaluating any rule and toggled by `background.js`/the popup header
switch.

There is no schema migration mechanism — if you change this shape, both `content.js` files and
`popup.js` (both copies) need to keep reading/writing it consistently, and existing stored
rules from older versions won't be retrofitted.

## Manual testing (no automated tests exist)

- Load unpacked: Chrome → `chrome://extensions/` → enable Developer mode → "Load unpacked" →
  select `chrome/`. Firefox → `about:debugging#/runtime/this-firefox` → "Load Temporary
  Add-on" → select `firefox/manifest.json`.
- Reload after edits: Chrome extensions page reload icon; Firefox `about:debugging` → Reload.
- `test-page.html` in the repo root is a scratch page for exercising rules against.
- Debug surfaces: content script logs to the page console (F12); background script logs to
  the extension's service worker console (Chrome) or the `about:debugging` Inspect view
  (Firefox); popup logs via right-click → Inspect on the open popup.

## Packaging

`./package-all.sh` just calls `./package-chrome-release.sh` and `./package-firefox-release.sh`.
Each reads its own version out of its own `manifest.json`, validates the required-files
checklist from `PACKAGING.md`, and zips its folder's contents (not the folder itself) to
`dist/greasyboii-<browser>-v<version>.zip` with `manifest.json` at the zip root. Neither
script hardcodes a version — bump the relevant `manifest.json` and the next run picks it up.
See `PACKAGING.md` for store submission steps (Chrome Web Store, addons.mozilla.org) and
`BUILD.md` for the underlying per-browser packing mechanics.
