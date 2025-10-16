# 🐒 Greasemonkey - START HERE

**Welcome to Greasemonkey!** This browser extension lets you execute custom JavaScript and CSS on any webpage.

---

## 🚀 Quick Start (Choose Your Path)

### Path 1: I Want To Use It NOW (5 minutes)
→ **Read [QUICKSTART.md](QUICKSTART.md)** - Get up and running immediately

### Path 2: I Want Example Rules
→ **Read [EXAMPLES.md](EXAMPLES.md)** - 20+ ready-to-use rules to copy/paste

### Path 3: I Want Complete Documentation
→ **Read [README.md](README.md)** - Full feature documentation and usage guide

### Path 4: I Want To Test It First
→ **Open [test-page.html](test-page.html)** in your browser - Interactive test environment

### Path 5: I Want To Distribute It
→ **Read [BUILD.md](BUILD.md)** - Building and distribution instructions

---

## 📦 Installation (Pick Your Browser)

### Google Chrome / Microsoft Edge
```
1. Open chrome://extensions/
2. Enable "Developer mode" (top-right toggle)
3. Click "Load unpacked"
4. Select the chrome/ folder
```

### Mozilla Firefox
```
1. Open about:debugging#/runtime/this-firefox
2. Click "Load Temporary Add-on"
3. Select firefox/manifest.json
```

**That's it!** The Greasemonkey icon appears in your toolbar.

---

## 📚 Documentation Map

| File | What It Contains | When To Read |
|------|------------------|--------------|
| **QUICKSTART.md** | 5-minute tutorial | First time setup |
| **EXAMPLES.md** | 20+ example rules | When you need ideas |
| **README.md** | Complete documentation | Learning all features |
| **BUILD.md** | Build instructions | Distributing the extension |
| **test-page.html** | Test environment | Testing your rules |
| **PROJECT_SUMMARY.md** | Project overview | Understanding the codebase |

---

## 🎯 What Can I Do With This?

### Popular Use Cases
- 🌙 **Add Dark Mode** to any website
- 🚫 **Block Ads** and unwanted content
- ⚡ **Automate Tasks** like form filling
- 🎨 **Customize Design** of your favorite sites
- 🔧 **Add Features** that websites are missing
- 🔐 **Enhance Privacy** by removing trackers
- ♿ **Improve Accessibility** with custom styles
- 📝 **Inject Tools** like notepads or calculators

### Example: Make Any Site Dark
1. Click Greasemonkey icon
2. Add rule: URL contains `example.com`
3. Add CSS: `body { background: #1a1a1a !important; color: #e0e0e0 !important; }`
4. Visit example.com → Dark theme!

---

## 🎓 Learning Path

**Total Time: ~30 minutes**

1. **Install** (5 min) → Follow installation steps above
2. **Quick Start** (5 min) → Read QUICKSTART.md
3. **First Rule** (5 min) → Create your first rule
4. **Test** (5 min) → Open test-page.html and experiment
5. **Examples** (10 min) → Browse EXAMPLES.md for ideas
6. **Customize** (∞) → Start customizing your favorite sites!

---

## 📋 Features Checklist

✅ URL pattern matching  
✅ CSS selector matching  
✅ Combined URL + element matching  
✅ JavaScript execution  
✅ CSS injection  
✅ Bootstrap dark theme UI  
✅ Add/edit/delete rules  
✅ Enable/disable toggles  
✅ Persistent storage  
✅ Chrome support (Manifest V3)  
✅ Firefox support (Manifest V2)  
✅ Complete documentation  
✅ Example library  
✅ Test page  

---

## 🔧 Technical Details

**Architecture:**
- Content scripts inject at page load
- Bootstrap 5 dark theme UI
- Sync storage for persistence
- No external dependencies

**Browser Support:**
- Chrome 88+ (Manifest V3)
- Firefox 48+ (Manifest V2)
- Edge, Opera (Chromium-based)

**File Count:** 
- 9 files per browser
- 7 documentation files
- 1 test page
- Total: 26 files

---

## 🆘 Common Questions

**Q: Is it safe?**  
A: Yes! No external servers, no tracking. All code runs locally. Be cautious with JavaScript you execute.

**Q: Will it slow down my browser?**  
A: No. Scripts only run when conditions match, and inject efficiently at page load.

**Q: Can I share my rules?**  
A: Yes! Copy the rule configuration and share. Rules are just text in your browser storage.

**Q: Do I need programming knowledge?**  
A: Basic knowledge helps, but you can start with examples from EXAMPLES.md and modify them.

**Q: Can I break websites?**  
A: Unlikely to cause permanent issues. Just disable the rule if something goes wrong. Refresh to reset.

**Q: Does it work on all websites?**  
A: Yes, except some with strict Content Security Policy. Works on 99% of sites.

---

## 🐛 Troubleshooting

**Rule not working?**
1. Check rule is enabled (toggle switch)
2. Verify URL pattern matches current page
3. Test element selector in console: `document.querySelector('selector')`
4. Check browser console (F12) for errors
5. Reload the page after creating/editing rules

**More help:** See troubleshooting section in [README.md](README.md)

---

## 📞 Support

- **Questions?** Check README.md troubleshooting section
- **Bugs?** Check browser console for errors
- **Ideas?** Browse EXAMPLES.md for inspiration
- **Contact:** Andy Dixon (extension author)

---

## 🎉 Ready To Start!

**Recommended first steps:**

1. ✅ Install extension in your browser (see above)
2. ✅ Read [QUICKSTART.md](QUICKSTART.md) (5 minutes)
3. ✅ Open [test-page.html](test-page.html) in browser
4. ✅ Create your first rule
5. ✅ Browse [EXAMPLES.md](EXAMPLES.md) for more ideas

---

## 📁 File Reference

```
greasemonkey/
├── START_HERE.md          ← You are here!
├── QUICKSTART.md          ← Start here for installation
├── EXAMPLES.md            ← 20+ ready-to-use rules
├── README.md              ← Complete documentation
├── BUILD.md               ← Distribution guide
├── test-page.html         ← Test environment
├── chrome/                ← Chrome extension files
└── firefox/               ← Firefox extension files
```

---

**Author:** Andy Dixon  
**Version:** 1.0.0  
**License:** Personal and educational use

---

### 🚀 Let's Go!

Pick your path above and start customizing the web! 🐒✨
