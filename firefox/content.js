// Content script that runs on all pages
(function () {
  'use strict';

  console.log('[GreasyBoii] Content script loaded on:', window.location.href);

  const ruleMatchState = new Map(); // rule name -> last known match state (edge-triggers re-apply)
  const autoClickTimers = new Map(); // rule name -> setInterval id
  const injectedStyles = new Map(); // rule name -> <style> element currently on the page

  if (document.readyState === 'complete') {
    boot();
  } else {
    window.addEventListener('load', boot, { once: true });
  }

  function boot() {
    browser.storage.sync.get(['masterEnabled']).then((result) => {
      if (result.masterEnabled === false) {
        console.log('[GreasyBoii] Disabled via master toggle, skipping.');
        return;
      }
      initGreasyBoii();
    });
  }

  function initGreasyBoii() {
    console.log('[GreasyBoii] Initializing...');

    browser.storage.sync.get(['rules']).then((result) => {
      const rules = result.rules || [];
      console.log('[GreasyBoii] Found', rules.length, 'rule(s) in storage');

      rules.forEach(evaluateRule);

      if (rules.some((r) => r.enabled && r.reapplyOnDomChanges)) {
        watchForChanges(rules.filter((r) => r.enabled && r.reapplyOnDomChanges));
      }
    });
  }

  function ruleMatches(rule) {
    const currentUrl = window.location.href;
    if (rule.matchType === 'all') {
      return { matched: true, elementCount: null };
    }

    if (rule.matchType === 'url') {
      return { matched: currentUrl.includes(rule.urlPattern), elementCount: null };
    }

    if (rule.matchType !== 'element' && rule.matchType !== 'both') {
      return { matched: false, elementCount: null };
    }
    if (rule.matchType === 'both' && !currentUrl.includes(rule.urlPattern)) {
      return { matched: false, elementCount: null };
    }

    const elementCount = document.querySelectorAll(rule.elementSelector).length;
    return { matched: elementCount > 0, elementCount };
  }

  function evaluateRule(rule) {
    if (!rule.enabled) return;

    const { matched, elementCount } = ruleMatches(rule);
    const wasMatched = ruleMatchState.get(rule.name) === true;
    ruleMatchState.set(rule.name, matched);

    if (matched && !wasMatched) {
      const elementLog = elementCount === null
        ? ''
        : ` (${elementCount} element${elementCount === 1 ? '' : 's'} found for "${rule.elementSelector}")`;
      console.log(`[GreasyBoii] Rule triggered: ${rule.name}${elementLog}`);
      executeRule(rule);
    }
  }

  // ponytail: fixed 400ms debounce, not adaptive to mutation volume — fine for the
  // "route just changed in an SPA" case this exists for; a hot mutation stream would
  // want per-rule throttling instead.
  function watchForChanges(watchedRules) {
    let debounceTimer = null;
    const observer = new MutationObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => watchedRules.forEach(evaluateRule), 400);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function executeRule(rule) {
    if (rule.javascript && rule.javascript.trim()) {
      injectJavaScript(rule);
    }
    if (rule.css && rule.css.trim()) {
      injectCss(rule);
    }
    if (rule.autoClickSelector && rule.autoClickSelector.trim()) {
      runAutoClick(rule);
    }
    if (rule.textReplacements && rule.textReplacements.length) {
      runTextReplacements(rule);
    }
  }

  function injectJavaScript(rule) {
    console.log(`[GreasyBoii] Injecting JavaScript for rule: ${rule.name}`);
    try {
      // Method 1: wrappedJSObject (Firefox specific, reaches the page's real global scope)
      if (typeof wrappedJSObject !== 'undefined') {
        try {
          const code = `
            (function() {
              try {
                ${rule.javascript}
              } catch (e) {
                console.error('[GreasyBoii] Error in injected script:', e);
              }
            })();
          `;
          wrappedJSObject.eval(code);
          console.log('[GreasyBoii] ✓ JavaScript executed via wrappedJSObject');
          return;
        } catch (e) {
          console.log('[GreasyBoii] wrappedJSObject method failed, trying alternative...');
        }
      }

      // Method 2: script tag injection (works on most sites)
      const script = document.createElement('script');
      script.textContent = `
        (function() {
          try {
            ${rule.javascript}
          } catch (e) {
            console.error('[GreasyBoii] Error in injected script:', e);
          }
        })();
      `;
      (document.head || document.documentElement).appendChild(script);
      script.remove();
      console.log('[GreasyBoii] ✓ JavaScript injected successfully');
    } catch (error) {
      console.error(`[GreasyBoii] Error executing JavaScript for rule "${rule.name}":`, error);
    }
  }

  function injectCss(rule) {
    try {
      const old = injectedStyles.get(rule.name);
      if (old) old.remove();

      const style = document.createElement('style');
      style.textContent = rule.css;
      style.setAttribute('data-greasyboii-rule', rule.name);
      (document.head || document.documentElement).appendChild(style);
      injectedStyles.set(rule.name, style);

      console.log(`[GreasyBoii] ✓ CSS injected for rule: ${rule.name}`);
    } catch (error) {
      console.error(`[GreasyBoii] Error applying CSS for rule "${rule.name}":`, error);
    }
  }

  function runAutoClick(rule) {
    const key = rule.name;
    if (autoClickTimers.has(key)) return; // already running for this rule instance

    const intervalSec = Number(rule.autoClickIntervalSec) || 0;
    const max = Number(rule.autoClickMax) || 0;
    let clicks = 0;
    let timerId = null;

    const stop = () => {
      if (timerId) clearInterval(timerId);
      autoClickTimers.delete(key);
    };

    const clickOnce = () => {
      const el = document.querySelector(rule.autoClickSelector);
      if (el) {
        el.click();
        clicks++;
        console.log(`[GreasyBoii] Auto-clicked "${rule.autoClickSelector}" for rule "${rule.name}" (${clicks})`);
      }
      if (max > 0 && clicks >= max) stop();
    };

    clickOnce();
    if (intervalSec > 0 && (max === 0 || clicks < max)) {
      timerId = setInterval(clickOnce, intervalSec * 1000);
      autoClickTimers.set(key, timerId);
    }
  }

  function runTextReplacements(rule) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parentTag = node.parentElement && node.parentElement.tagName;
        return parentTag === 'SCRIPT' || parentTag === 'STYLE'
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);

    nodes.forEach((textNode) => {
      let text = textNode.nodeValue;
      let changed = false;
      rule.textReplacements.forEach(({ find, replace }) => {
        if (find && text.includes(find)) {
          text = text.split(find).join(replace || '');
          changed = true;
        }
      });
      if (changed) textNode.nodeValue = text;
    });

    console.log(`[GreasyBoii] Applied text replacements for rule: ${rule.name}`);
  }

  // ---------------------------------------------------------------------
  // On-demand tools (popup "Tools" tab talks to whichever tab is active)
  // ---------------------------------------------------------------------

  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startPicker') {
      startElementPicker();
    } else if (request.action === 'scanMedia') {
      sendResponse({ items: scanMedia(request.mediaType, request.extensions) });
    } else if (request.action === 'harvestLinks') {
      sendResponse({ items: harvestLinks(request.containerSelector) });
    } else if (request.action === 'scrapeData') {
      sendResponse({ items: scrapeData(request.selector, request.attribute) });
    } else if (request.action === 'exportConversationMarkdown') {
      exportConversationMarkdown().then(sendResponse).catch((error) => {
        sendResponse({ error: error.message || 'Could not export the conversation.' });
      });
      return true;
    }
  });

  async function exportConversationMarkdown() {
    // ponytail: read the message nodes already loaded by ChatGPT; add virtual-scroll
    // pagination only if ChatGPT starts unloading older messages from the DOM.
    const messageElements = [...document.querySelectorAll('[data-message-author-role]')]
      .filter((el) => ['user', 'assistant', 'system'].includes(el.dataset.messageAuthorRole));
    if (!messageElements.length) throw new Error('No ChatGPT messages were found on this page.');

    const imagesByElement = new Map();
    const imagesByUrl = new Map();
    let imageNumber = 0;

    for (const message of messageElements) {
      for (const image of message.querySelectorAll('img')) {
        const url = image.currentSrc || image.src;
        if (!url) continue;
        let imageFile = imagesByUrl.get(url);
        if (!imageFile) {
          imageFile = await readConversationImage(url, ++imageNumber);
          imagesByUrl.set(url, imageFile);
        }
        imagesByElement.set(image, imageFile);
      }
    }

    const title = (document.querySelector('main h1')?.textContent || document.title || 'ChatGPT Conversation')
      .replace(/\s*\|\s*ChatGPT.*$/i, '').trim() || 'ChatGPT Conversation';
    const markdown = [`# ${title.replace(/^#+\s*/, '').replace(/\n/g, ' ')}`, ''];

    messageElements.forEach((message) => {
      const role = message.dataset.messageAuthorRole === 'assistant' ? 'ChatGPT' :
        message.dataset.messageAuthorRole[0].toUpperCase() + message.dataset.messageAuthorRole.slice(1);
      const body = cleanConversationMarkdown(nodeToConversationMarkdown(message, imagesByElement));
      if (body) markdown.push(`## ${role}`, '', body, '');
    });

    return { markdown: `${markdown.join('\n').trim()}\n`, images: [...imagesByUrl.values()] };
  }

  async function readConversationImage(url, number) {
    const fallbackName = `image-${String(number).padStart(3, '0')}.${imageExtension(url)}`;
    try {
      let bytes;
      let mimeType = '';
      if (url.startsWith('data:')) {
        const match = url.match(/^data:([^,]*),(.*)$/s);
        if (!match) throw new Error('Invalid data URL');
        mimeType = (match[1].split(';')[0] || '').toLowerCase();
        bytes = match[1].includes(';base64')
          ? base64ToBytes(match[2])
          : new TextEncoder().encode(decodeURIComponent(match[2]));
      } else {
        const response = await fetch(url, { credentials: 'include' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        mimeType = response.headers.get('content-type') || '';
        bytes = new Uint8Array(await response.arrayBuffer());
      }
      const name = `image-${String(number).padStart(3, '0')}.${imageExtension(url, mimeType)}`;
      return { name, url, mimeType, data: bytesToBase64(bytes) };
    } catch (error) {
      return { name: fallbackName, url, error: error.message || 'download failed' };
    }
  }

  function nodeToConversationMarkdown(node, imagesByElement) {
    if (node.nodeType === Node.TEXT_NODE) return node.nodeValue.replace(/\s+/g, ' ');
    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    const tag = node.tagName.toLowerCase();
    if (['button', 'svg', 'script', 'style', 'textarea'].includes(tag)) return '';
    if (tag === 'img') {
      const image = imagesByElement.get(node);
      return image ? `![${node.alt || 'Image'}](images/${image.name})` : '';
    }
    if (tag === 'pre') return `\n\n\`\`\`\n${node.textContent.trim()}\n\`\`\`\n\n`;
    if (tag === 'br') return '\n';
    if (tag === 'a') {
      const text = cleanConversationMarkdown([...node.childNodes]
        .map((child) => nodeToConversationMarkdown(child, imagesByElement)).join(''));
      return text ? `[${text}](${node.href})` : node.href;
    }
    if (tag === 'code') return `\`${node.textContent.trim()}\``;

    const children = [...node.childNodes]
      .map((child) => nodeToConversationMarkdown(child, imagesByElement)).join('');
    if (/^h[1-6]$/.test(tag)) return `\n\n${'#'.repeat(Number(tag[1]))} ${children.trim()}\n\n`;
    if (tag === 'li') return `\n- ${children.trim()}\n`;
    if (['p', 'div', 'section', 'article', 'blockquote', 'ul', 'ol'].includes(tag)) {
      return `\n${children}\n`;
    }
    return children;
  }

  function cleanConversationMarkdown(text) {
    return text.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  }

  function imageExtension(url, mimeType = '') {
    const mimeExtensions = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif',
      'image/webp': 'webp', 'image/svg+xml': 'svg', 'image/bmp': 'bmp', 'image/avif': 'avif' };
    if (mimeExtensions[mimeType.split(';')[0].toLowerCase()]) return mimeExtensions[mimeType.split(';')[0].toLowerCase()];
    const match = url.match(/\.([a-z0-9]+)(?:[?#]|$)/i);
    return match && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'avif'].includes(match[1].toLowerCase())
      ? match[1].toLowerCase() : 'bin';
  }

  function base64ToBytes(value) {
    const binary = atob(value.replace(/\s/g, ''));
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
  }

  function bytesToBase64(bytes) {
    let binary = '';
    for (let offset = 0; offset < bytes.length; offset += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
    }
    return btoa(binary);
  }

  function scanMedia(mediaType, customExtensions) {
    const extMap = {
      images: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'avif'],
      pdfs: ['pdf'],
      videos: ['mp4', 'webm', 'mov', 'avi', 'mkv']
    };
    const extensions = mediaType === 'custom'
      ? (customExtensions || '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
      : (extMap[mediaType] || []);

    const urls = new Set();

    if (mediaType === 'images') {
      document.querySelectorAll('img[src]').forEach((img) => urls.add(img.src));
    }

    document.querySelectorAll('a[href]').forEach((a) => {
      const ext = (a.href.split('?')[0].split('.').pop() || '').toLowerCase();
      if (extensions.includes(ext)) urls.add(a.href);
    });

    return [...urls].map((url) => ({ url, filename: url.split('/').pop().split('?')[0] || 'file' }));
  }

  function harvestLinks(containerSelector) {
    const root = (containerSelector && containerSelector.trim())
      ? document.querySelector(containerSelector)
      : document;
    if (!root) return [];

    const seen = new Set();
    const links = [];
    root.querySelectorAll('a[href]').forEach((a) => {
      if (!seen.has(a.href)) {
        seen.add(a.href);
        links.push({ url: a.href, text: (a.textContent || '').trim().slice(0, 80) });
      }
    });
    return links;
  }

  function scrapeData(selector, attribute) {
    if (!selector) return [];
    return [...document.querySelectorAll(selector)].map((el) => {
      if (attribute === 'text') return el.textContent.trim();
      if (attribute === 'href') return el.href || '';
      if (attribute === 'src') return el.src || '';
      return el.getAttribute(attribute) || '';
    });
  }

  // ---------------------------------------------------------------------
  // Visual element picker
  // ---------------------------------------------------------------------

  let pickerHighlightEl = null;
  let pickerBanner = null;

  function startElementPicker() {
    if (pickerBanner) return; // already active

    pickerBanner = document.createElement('div');
    pickerBanner.textContent = 'GreasyBoii: click an element to select it — Esc to cancel';
    pickerBanner.style.cssText =
      'position:fixed;top:0;left:0;right:0;z-index:2147483647;background:#ff8a1e;' +
      'color:#111;font:600 13px/1.4 sans-serif;text-align:center;padding:8px;pointer-events:none;';
    document.documentElement.appendChild(pickerBanner);

    document.addEventListener('mouseover', onPickerHover, true);
    document.addEventListener('click', onPickerClick, true);
    document.addEventListener('keydown', onPickerKeydown, true);
  }

  function stopElementPicker() {
    if (pickerHighlightEl) {
      pickerHighlightEl.style.outline = '';
      pickerHighlightEl = null;
    }
    if (pickerBanner) {
      pickerBanner.remove();
      pickerBanner = null;
    }
    document.removeEventListener('mouseover', onPickerHover, true);
    document.removeEventListener('click', onPickerClick, true);
    document.removeEventListener('keydown', onPickerKeydown, true);
  }

  function onPickerHover(e) {
    if (pickerHighlightEl) pickerHighlightEl.style.outline = '';
    pickerHighlightEl = e.target;
    pickerHighlightEl.style.outline = '2px solid #ff8a1e';
  }

  function onPickerClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const selector = computeSelector(e.target);
    stopElementPicker();
    browser.runtime.sendMessage({ action: 'pickerResult', selector });
  }

  function onPickerKeydown(e) {
    if (e.key === 'Escape') {
      stopElementPicker();
      browser.runtime.sendMessage({ action: 'pickerCancelled' });
    }
  }

  // ponytail: heuristic selector — prefers a unique #id, else walks up to 4 ancestors
  // combining tag + first non-numeric class + :nth-of-type until the candidate is
  // unique on the page. Not guaranteed minimal or unique on pathological DOMs (e.g.
  // frameworks that only emit hashed/numeric class names); good enough for "point at
  // a thing, get a usable selector" — upgrade to a proper CSS-selector library if that
  // ever becomes a real problem.
  function computeSelector(el) {
    if (el.id) {
      const idSelector = `#${CSS.escape(el.id)}`;
      if (document.querySelectorAll(idSelector).length === 1) return idSelector;
    }

    const parts = [];
    let node = el;
    for (let depth = 0; node && node.nodeType === 1 && depth < 4; depth++) {
      let part = node.tagName.toLowerCase();
      const cls = [...node.classList].find((c) => c && !/\d/.test(c));
      if (cls) {
        part += `.${CSS.escape(cls)}`;
      } else if (node.parentElement) {
        const siblings = [...node.parentElement.children].filter((c) => c.tagName === node.tagName);
        if (siblings.length > 1) {
          part += `:nth-of-type(${siblings.indexOf(node) + 1})`;
        }
      }
      parts.unshift(part);

      const candidate = parts.join(' > ');
      if (document.querySelectorAll(candidate).length === 1) return candidate;
      node = node.parentElement;
    }
    return parts.join(' > ');
  }
})();
