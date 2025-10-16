# Installing GreasyBoii (Packaged Version)

Your extensions are now packaged and ready to install!

## Files Created

✅ `dist/greasyboii-chrome-v1.0.4.zip` (62 KB)  
✅ `dist/greasyboii-firefox-v1.0.4.zip` (62 KB)

---

## Chrome Installation

### Method 1: Load Unpacked (Development)
1. Open `chrome://extensions/`
2. Enable "Developer mode" (top-right toggle)
3. Click "Load unpacked"
4. Select the `chrome` folder
5. ✅ Done!

### Method 2: Install ZIP (Distribution)
1. Unzip `greasyboii-chrome-v1.0.4.zip` to a folder
2. Open `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the unzipped folder
6. ✅ Done!

### Method 3: Pack to CRX (Best for Sharing)
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Pack extension"
4. For "Extension root directory" → Select the `chrome` folder
5. Leave "Private key file" empty
6. Click "Pack Extension"
7. You get `chrome.crx` file (the actual extension)
8. Share this `.crx` file with others
9. Users drag it to `chrome://extensions/` to install

**Note:** Chrome will show "This extension is not from the Chrome Web Store" warning for unpublished extensions.

---

## Firefox Installation

### Method 1: Load Temporary (Development)
1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select any file from the `firefox` folder (e.g., `manifest.json`)
4. ✅ Done! (Removed when Firefox restarts)

### Method 2: Install ZIP (Distribution)
1. Rename `greasyboii-firefox-v1.0.4.zip` to `greasyboii-firefox-v1.0.4.xpi`
2. Drag the `.xpi` file into Firefox
3. Click "Add" when prompted
4. ✅ Done!

**Note:** Unsigned extensions will show a warning. For production use, sign it through addons.mozilla.org.

### Method 3: Permanent Install (Signed)
For permanent installation without warnings:
1. Create account at [addons.mozilla.org](https://addons.mozilla.org/developers/)
2. Submit the ZIP file
3. Choose "Unlisted" for self-distribution
4. Mozilla automatically signs it
5. Download the signed XPI
6. Install the signed version

---

## Edge Installation

Edge uses Chrome extensions:
1. Open `edge://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `chrome` folder
5. ✅ Done!

---

## Opera Installation

Opera also uses Chrome extensions:
1. Open `opera://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `chrome` folder
5. ✅ Done!

---

## Verifying Installation

After installing, you should see:
- ✅ GreasyBoii icon in the browser toolbar
- ✅ Extension name: "GreasyBoii"
- ✅ Version: 1.0.4
- ✅ Author: Andy Dixon

Click the icon to open the popup and test:
1. Click "+ Add Rule"
2. Modal should open
3. Create a test rule
4. Visit a matching page
5. Script should execute!

---

## Testing the Package

Before sharing, test the packaged version:

1. **Uninstall the development version** (if loaded)
2. **Install from the package** (follow steps above)
3. **Test all features:**
   - ✅ Add rule
   - ✅ Edit rule
   - ✅ Delete rule
   - ✅ Toggle rule
   - ✅ Visit target page
   - ✅ Verify script executes
   - ✅ Check console logs

---

## Sharing Your Extension

### For Chrome Users:
Send them:
1. The `.crx` file (after packing)
2. Installation instructions:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Drag the `.crx` file into the window
   - Click "Add extension"

### For Firefox Users:
Send them:
1. The `.xpi` file (renamed `.zip`)
2. Installation instructions:
   - Drag the `.xpi` file into Firefox
   - Click "Add"

### For All Users (Best):
1. Publish on Chrome Web Store ($5 one-time fee)
2. Publish on Firefox Add-ons (free)
3. Users can install with one click

---

## Updating the Extension

When you release a new version:

### Chrome:
1. Update version in `chrome/manifest.json`
2. Re-package the extension
3. If you packed to `.crx`, use the SAME `.pem` file
4. Users get automatic updates if installed from Chrome Web Store

### Firefox:
1. Update version in `firefox/manifest.json`
2. Re-package the extension
3. Re-sign with Mozilla (if signed)
4. Users get automatic updates if installed from Firefox Add-ons

---

## Troubleshooting

### Chrome: "CRX_REQUIRED_PROOF_MISSING"
- **Issue:** Chrome blocks unsigned extensions by default
- **Solution:** Users must enable "Developer mode" to install
- **Better:** Publish on Chrome Web Store

### Firefox: "Add-on appears corrupt"
- **Issue:** ZIP structure is incorrect
- **Solution:** Files must be at ZIP root, not in a subfolder
- **Fix:** Re-create ZIP from inside the firefox folder

### Extension doesn't work after packaging
- **Check:** All files are included
- **Check:** manifest.json is valid (use JSON validator)
- **Check:** Version number is correct
- **Test:** Install on a fresh browser profile

### Chrome: Updates not working
- **Issue:** Different `.pem` file used
- **Solution:** Always use the same `.pem` file for updates
- **Lost .pem?** You'll need to create a new extension (new ID)

---

## File Sizes

Your packaged extensions are:
- **Chrome:** 62 KB (zipped)
- **Firefox:** 62 KB (zipped)

Both include:
- Extension code
- Bootstrap 5.3.2 (CSS + JS)
- Icons
- Manifest files

---

## Publishing to Official Stores

### Chrome Web Store:
1. Cost: $5 one-time developer fee
2. URL: https://chrome.google.com/webstore/developer/dashboard
3. Upload: The ZIP file (not CRX)
4. Review: Usually 1-3 days
5. Benefits: Automatic updates, no warnings, discoverable

### Firefox Add-ons:
1. Cost: Free
2. URL: https://addons.mozilla.org/developers/
3. Upload: The ZIP file
4. Options:
   - **Listed:** Public on addons.mozilla.org (reviewed)
   - **Unlisted:** Self-distribute signed version (instant)
5. Benefits: Automatic signing, automatic updates

---

## Quick Commands

```bash
# Package both browsers
./package-all.sh

# Package Chrome only
cd chrome && zip -r ../dist/greasyboii-chrome.zip *

# Package Firefox only
cd firefox && zip -r ../dist/greasyboii-firefox.zip *

# Rename Firefox ZIP to XPI
mv dist/greasyboii-firefox-v1.0.4.zip dist/greasyboii-firefox-v1.0.4.xpi

# Check package contents
unzip -l dist/greasyboii-chrome-v1.0.4.zip
```

---

## Distribution Checklist

Before distributing:
- ✅ Test packaged version thoroughly
- ✅ Verify all features work
- ✅ Check version numbers are correct
- ✅ Include installation instructions
- ✅ Mention browser compatibility
- ✅ Provide support contact
- ✅ Consider publishing to official stores

---

**Current Version:** 1.0.4  
**Package Size:** 62 KB  
**Ready to Distribute:** ✅ Yes

Enjoy sharing GreasyBoii! 🐒✨
