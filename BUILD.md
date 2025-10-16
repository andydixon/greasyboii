# Build Instructions

This document contains detailed instructions for building and distributing the Greasemonkey browser extension.

## Prerequisites

- Web browser (Chrome or Firefox)
- Text editor (for development)
- Node.js and npm (optional, for Firefox automated builds)

## Quick Start

### Testing Locally

#### Chrome
```bash
1. Open Chrome
2. Navigate to chrome://extensions/
3. Enable "Developer mode" (top-right toggle)
4. Click "Load unpacked"
5. Select the greasemonkey/chrome directory
```

#### Firefox
```bash
1. Open Firefox
2. Navigate to about:debugging#/runtime/this-firefox
3. Click "Load Temporary Add-on"
4. Select greasemonkey/firefox/manifest.json
```

## Development Workflow

### 1. Making Changes

Edit files in the appropriate directory (`chrome/` or `firefox/`).

**Key files:**
- `manifest.json` - Extension configuration
- `popup.html` - UI structure
- `popup.css` - UI styling
- `popup.js` - UI functionality
- `content.js` - Code that runs on web pages
- `background.js` - Background service/script

### 2. Testing Changes

After making changes:

**Chrome:**
1. Go to `chrome://extensions/`
2. Click the reload icon on the Greasemonkey extension card
3. Test your changes

**Firefox:**
1. Go to `about:debugging#/runtime/this-firefox`
2. Click "Reload" on the Greasemonkey extension
3. Test your changes

### 3. Debugging

**Chrome:**
- Background script logs: `chrome://extensions/` → "service worker" link
- Content script logs: Browser console on any page (F12)
- Popup logs: Right-click popup → "Inspect"

**Firefox:**
- Background script logs: `about:debugging` → "Inspect" on extension
- Content script logs: Browser console on any page (F12)
- Popup logs: Right-click popup → "Inspect Element"

## Building for Distribution

### Chrome/Edge Build

#### Method 1: Manual Packaging (Recommended for Testing)

1. Open Chrome
2. Go to `chrome://extensions/`
3. Ensure "Developer mode" is enabled
4. Click "Pack extension"
5. For "Extension root directory", select the `chrome` folder
6. Leave "Private key file" empty for first build
7. Click "Pack Extension"
8. Chrome generates two files:
   - `chrome.crx` - The packaged extension
   - `chrome.pem` - Private key (keep this secure for updates!)

#### Method 2: Chrome Web Store Distribution

1. Create a developer account at [Chrome Web Store](https://chrome.google.com/webstore/developer/dashboard)
2. Pay one-time $5 registration fee
3. Create a ZIP file of the `chrome` directory:
   ```bash
   cd chrome
   zip -r ../greasemonkey-chrome.zip *
   ```
4. Upload to Chrome Web Store dashboard
5. Fill in store listing details
6. Submit for review

**Note:** Keep your `.pem` private key file secure. You'll need it for future updates.

### Firefox Build

#### Method 1: Temporary Installation (Development)

Already covered in Quick Start - good for testing only. Temporary add-ons are removed when Firefox restarts.

#### Method 2: Self-Distribution (Unverified)

1. Create a ZIP file:
   ```bash
   cd firefox
   zip -r ../greasemonkey-firefox.zip *
   ```
2. Rename to `.xpi`:
   ```bash
   mv greasemonkey-firefox.zip greasemonkey-firefox.xpi
   ```
3. Users can install by dragging `.xpi` file to Firefox
4. Firefox will show "unverified" warning

#### Method 3: Official Distribution (Recommended)

1. Install web-ext tool:
   ```bash
   npm install -g web-ext
   ```

2. Build the extension:
   ```bash
   cd firefox
   web-ext build
   ```
   This creates a ZIP file in `web-ext-artifacts/` directory

3. Sign with Mozilla:
   - Create account at [addons.mozilla.org](https://addons.mozilla.org/developers/)
   - Get API keys from [Developer Hub](https://addons.mozilla.org/developers/addon/api/key/)
   - Sign the extension:
     ```bash
     web-ext sign \
       --api-key=YOUR_API_KEY \
       --api-secret=YOUR_API_SECRET
     ```
   - Or upload manually to addons.mozilla.org

4. Distribution options:
   - **Listed**: Public on addons.mozilla.org (requires review)
   - **Unlisted**: Self-distribute signed XPI (automatic signing)

## Directory Structure

```
greasemonkey/
├── chrome/                 # Chrome extension
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   ├── popup.html
│   ├── popup.css
│   ├── popup.js
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── firefox/               # Firefox extension
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   ├── popup.html
│   ├── popup.css
│   ├── popup.js
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── README.md
└── BUILD.md              # This file
```

## Version Updates

When releasing a new version:

1. Update version number in both `manifest.json` files:
   ```json
   "version": "1.1.0"
   ```

2. Update README.md version history

3. Test thoroughly in both browsers

4. Build new packages:
   - Chrome: Re-pack with same `.pem` key
   - Firefox: Build and sign new version

5. Upload to respective stores/distribution channels

## Quality Checklist

Before building for distribution:

- [ ] Test all features in Chrome
- [ ] Test all features in Firefox
- [ ] Verify icons display correctly
- [ ] Check manifest.json versions match
- [ ] Test storage sync functionality
- [ ] Verify permissions are appropriate
- [ ] Test on various websites
- [ ] Check browser console for errors
- [ ] Test add/edit/delete rule functionality
- [ ] Verify enable/disable toggles work
- [ ] Test all match types (URL, Element, Both)
- [ ] Review code for security issues
- [ ] Update version numbers
- [ ] Update documentation

## File Size Optimization

To reduce extension size:

1. Minify JavaScript (optional):
   ```bash
   npm install -g terser
   terser popup.js -c -m -o popup.min.js
   ```

2. Optimize PNG icons:
   ```bash
   # If you have optipng installed
   optipng icon*.png
   ```

3. Remove development files:
   - Source maps
   - Test files
   - Documentation (keep only in repo)

## Automated Build Script

You can create a build script for automation:

```bash
#!/bin/bash
# build.sh

VERSION="1.0.0"

echo "Building Greasemonkey v${VERSION}..."

# Chrome build
echo "Building Chrome extension..."
cd chrome
zip -r "../dist/greasemonkey-chrome-${VERSION}.zip" * -x "*.DS_Store"
cd ..

# Firefox build
echo "Building Firefox extension..."
cd firefox
zip -r "../dist/greasemonkey-firefox-${VERSION}.zip" * -x "*.DS_Store"
cd ..

echo "Build complete! Files in dist/ directory"
```

Make it executable:
```bash
chmod +x build.sh
mkdir -p dist
./build.sh
```

## Common Issues

### Chrome Extension Doesn't Load
- Check manifest.json syntax (use JSON validator)
- Ensure all referenced files exist
- Check browser console for errors

### Firefox Temporary Add-on Removed
- This is expected behavior
- Use web-ext for persistent testing:
  ```bash
  cd firefox
  web-ext run
  ```

### Icons Not Showing
- Verify icon files exist
- Check file paths in manifest.json
- Ensure icon sizes are correct (16x16, 48x48, 128x128)

### Storage Not Persisting
- Chrome: Check sync is enabled in browser
- Firefox: Temporary add-ons don't persist storage
- Use proper signed/installed extension for testing

## Distribution Platforms

### Official Stores
- [Chrome Web Store](https://chrome.google.com/webstore/developer/dashboard)
- [Firefox Add-ons](https://addons.mozilla.org/developers/)
- [Microsoft Edge Add-ons](https://partner.microsoft.com/dashboard/microsoftedge/overview)

### Self-Distribution
- GitHub Releases
- Personal website
- Direct XPI/CRX files

## Security Notes

- Never commit your Chrome `.pem` private key
- Keep Firefox API keys secure
- Don't bundle sensitive data in extension
- Review all code before distribution
- Test on malicious sites carefully

## Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Firefox Extension Documentation](https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions)
- [web-ext Documentation](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/5.3/)

## Support

For build issues or questions, contact Andy Dixon.
