# How to Package GreasyBoii Extension

This guide shows you how to package GreasyBoii for distribution.

## Quick Start

### Chrome/Edge (Easy Method)
1. Open `chrome://extensions/`
2. Enable "Developer mode" (top-right toggle)
3. Click "Pack extension"
4. For "Extension root directory" → Select the `chrome` folder
5. Leave "Private key file" empty (first time)
6. Click "Pack Extension"
7. ✅ Done! You get 2 files:
   - `chrome.crx` - The packaged extension
   - `chrome.pem` - Private key (KEEP THIS SECURE!)

### Firefox (Command Line)
```bash
cd firefox
zip -r ../greasyboii-firefox-v1.0.4.zip *
```
Done! You get `greasyboii-firefox-v1.0.4.zip`

---

## Detailed Instructions

## Chrome Extension Packaging

### Method 1: Chrome Built-in Packer (Recommended)

**Step 1: Open Extensions Page**
```
chrome://extensions/
```

**Step 2: Enable Developer Mode**
- Toggle the "Developer mode" switch in the top-right corner

**Step 3: Pack Extension**
1. Click "Pack extension" button
2. In the dialog:
   - **Extension root directory**: Browse and select `/path/to/greasemonkey/chrome`
   - **Private key file**: Leave empty (first time) or select your `.pem` file
3. Click "Pack Extension"

**Step 4: Files Created**
You'll get two files in the parent directory:
- `chrome.crx` - The packed extension (ready to distribute)
- `chrome.pem` - Your private key (KEEP THIS SECRET!)

**Important Notes:**
- ⚠️ **Keep the `.pem` file secure** - You need it to update your extension
- ⚠️ **Never share your `.pem` file** - Anyone with it can impersonate your extension
- ✅ The `.crx` file is what you distribute to users

### Method 2: Command Line (Using Chrome)

```bash
# Navigate to Chrome binary location
# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --pack-extension=/path/to/greasemonkey/chrome

# Windows
"C:\Program Files\Google\Chrome\Application\chrome.exe" --pack-extension=C:\path\to\greasemonkey\chrome

# Linux
google-chrome --pack-extension=/path/to/greasemonkey/chrome
```

### Method 3: Create ZIP for Chrome Web Store

If you want to publish on Chrome Web Store:

```bash
cd chrome
zip -r ../greasyboii-chrome-v1.0.4.zip *
```

Then upload the ZIP to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard)

---

## Firefox Extension Packaging

### Method 1: Simple ZIP (Recommended for Testing)

**Create ZIP:**
```bash
cd firefox
zip -r ../greasyboii-firefox-v1.0.4.zip *
```

**Rename to XPI (optional):**
```bash
mv greasyboii-firefox-v1.0.4.zip greasyboii-firefox-v1.0.4.xpi
```

**Install:**
- Drag the `.xpi` file into Firefox
- Or: `about:addons` → gear icon → "Install Add-on From File"

**Note:** Unsigned extensions show a warning. For permanent use, you need to sign it.

### Method 2: Using web-ext (Recommended for Distribution)

**Install web-ext:**
```bash
npm install -g web-ext
```

**Build:**
```bash
cd firefox
web-ext build
```

This creates a signed ZIP in `web-ext-artifacts/` folder.

**Sign (requires Mozilla account):**
```bash
# Get API keys from https://addons.mozilla.org/developers/addon/api/key/
web-ext sign \
  --api-key=YOUR_API_KEY \
  --api-secret=YOUR_API_SECRET
```

**Note:** As of November 2025, AMO requires every submission to declare
`browser_specific_settings.gecko.data_collection_permissions` in `manifest.json` —
signing fails with "The data_collection_permissions property is missing" otherwise.
GreasyBoii collects no data, so `firefox/manifest.json` already declares
`"required": ["none"]`; if you ever add analytics, telemetry, or any network call,
update that field to match (see the
[MDN docs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings)
for the full list of data categories).

**Run for testing:**
```bash
web-ext run
```

This opens Firefox with your extension loaded.

---

## Distribution Options

### Option 1: Direct Distribution (Self-Hosted)

**Chrome (.crx file):**
1. Pack the extension (see above)
2. Host the `.crx` file on your website
3. Users download and drag it to `chrome://extensions/`
4. ⚠️ Chrome will show "unverified" warning

**Firefox (.xpi file):**
1. Create and sign the extension
2. Host the `.xpi` file on your website
3. Users click to install
4. ⚠️ Unsigned extensions need special Firefox config

### Option 2: Official Store Distribution

**Chrome Web Store:**
1. Create developer account ($5 one-time fee)
2. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard)
3. Click "New Item"
4. Upload your ZIP file
5. Fill in listing details
6. Submit for review
7. ✅ Published after approval (usually 1-3 days)

**Firefox Add-ons:**
1. Create account at [addons.mozilla.org](https://addons.mozilla.org/developers/)
2. Submit new add-on
3. Upload your ZIP/XPI
4. Choose:
   - **Listed**: Public on addons.mozilla.org (requires review)
   - **Unlisted**: Self-distribute signed version (automatic)
5. ✅ Get signed version immediately (unlisted) or after review (listed)

---

## Automation Scripts

I've created helper scripts for you:

### package-chrome.sh
```bash
#!/bin/bash
cd chrome
zip -r ../dist/greasyboii-chrome-v1.0.4.zip * -x "*.DS_Store"
echo "✅ Chrome package created: dist/greasyboii-chrome-v1.0.4.zip"
```

### package-firefox.sh
```bash
#!/bin/bash
cd firefox
zip -r ../dist/greasyboii-firefox-v1.0.4.zip * -x "*.DS_Store"
echo "✅ Firefox package created: dist/greasyboii-firefox-v1.0.4.zip"
```

### package-all.sh
```bash
#!/bin/bash
mkdir -p dist

echo "📦 Packaging Chrome extension..."
cd chrome
zip -r ../dist/greasyboii-chrome-v1.0.4.zip * -x "*.DS_Store"
cd ..

echo "📦 Packaging Firefox extension..."
cd firefox
zip -r ../dist/greasyboii-firefox-v1.0.4.zip * -x "*.DS_Store"
cd ..

echo "✅ All packages created in dist/ folder!"
ls -lh dist/
```

---

## File Checklist

Before packaging, ensure these files exist:

### Chrome folder must have:
- ✅ manifest.json
- ✅ background.js
- ✅ content.js
- ✅ popup.html
- ✅ popup.css
- ✅ popup.js
- ✅ bootstrap.min.css
- ✅ bootstrap.bundle.min.js
- ✅ icon16.png
- ✅ icon48.png
- ✅ icon128.png

### Firefox folder must have:
- ✅ manifest.json
- ✅ background.js
- ✅ content.js
- ✅ popup.html
- ✅ popup.css
- ✅ popup.js
- ✅ bootstrap.min.css
- ✅ bootstrap.bundle.min.js
- ✅ icon16.png
- ✅ icon48.png
- ✅ icon128.png

---

## Testing Packaged Extension

### Chrome:
1. Go to `chrome://extensions/`
2. Drag the `.crx` file into the window
3. Click "Add extension"
4. Test all features

### Firefox:
1. Go to `about:addons`
2. Click gear icon → "Install Add-on From File"
3. Select your `.xpi` or `.zip` file
4. Click "Add"
5. Test all features

---

## Version Updates

When releasing a new version:

1. **Update version in manifests:**
   ```json
   "version": "1.0.5"
   ```

2. **For Chrome:**
   - Use the SAME `.pem` file when packing
   - This ensures it's recognized as an update

3. **For Firefox:**
   - Increment version number
   - Re-sign with same API keys
   - Upload to addons.mozilla.org

4. **Update documentation:**
   - README.md
   - CHANGELOG.md
   - Any version references

---

## Common Issues

### Chrome: "Package is invalid: CRX_REQUIRED_PROOF_MISSING"
- **Solution**: Users must enable "Developer mode" to install unsigned extensions
- **Better solution**: Publish on Chrome Web Store

### Firefox: "This add-on could not be installed because it appears to be corrupt"
- **Solution**: Check ZIP file structure - files should be at root, not in a subfolder
- **Fix**: Re-create ZIP from inside the firefox folder

### Chrome: "Extension update failed"
- **Solution**: Use the same `.pem` file for updates
- **Lost .pem?**: You'll need to create a new extension (new ID)

### Firefox: "This add-on is not signed"
- **Solution**: Sign it with Mozilla or enable unsigned extensions
- **Enable unsigned**: `about:config` → `xpinstall.signatures.required` → false (Firefox Developer Edition only)

---

## Security Notes

- ⚠️ **Never commit `.pem` files to version control**
- ⚠️ **Keep your API keys secret**
- ⚠️ **Don't bundle unnecessary files** (documentation, source maps, etc.)
- ✅ **Only include required files** in the package
- ✅ **Test packaged version** before distributing

---

## Quick Commands Reference

```bash
# Create distribution folder
mkdir -p dist

# Package Chrome (ZIP for Web Store)
cd chrome && zip -r ../dist/greasyboii-chrome.zip * && cd ..

# Package Firefox (ZIP)
cd firefox && zip -r ../dist/greasyboii-firefox.zip * && cd ..

# Package Firefox (XPI)
cd firefox && zip -r ../dist/greasyboii-firefox.xpi * && cd ..

# Install web-ext (Firefox tool)
npm install -g web-ext

# Build with web-ext
cd firefox && web-ext build

# Run Firefox with extension
cd firefox && web-ext run

# Sign Firefox extension
cd firefox && web-ext sign --api-key=KEY --api-secret=SECRET
```

---

## Next Steps

1. **Test locally first** - Make sure everything works
2. **Create packages** - Use scripts above
3. **Test packages** - Install and verify
4. **Decide distribution method**:
   - Self-host for personal use
   - Chrome Web Store for public Chrome users
   - Firefox Add-ons for public Firefox users
5. **Update version numbers** for future releases

---

**Current Version:** 1.0.4  
**Ready to Package:** ✅ Yes  
**All Files Present:** ✅ Yes

Happy packaging! 🐒✨
