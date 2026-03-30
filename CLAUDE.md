# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

GoodPrint — a Chrome extension (Manifest V3) that removes or hides specific HTML elements when printing web pages to save ink.

## Architecture

- **manifest.json** — Manifest V3 config; declares content scripts, popup, background service worker
- **defaults.js** — ships default per-site rules (shared by content script, popup, and background)
- **background.js** — service worker; seeds default rules into `chrome.storage.sync` on install
- **content.js** — injected into all pages; applies rules on `beforeprint`/`afterprint` events
- **popup.html/js/css** — extension popup UI for managing per-site rules

### Rule model

Rules are stored in `chrome.storage.sync` under key `"rules"`. Structure:

```json
{
  "www.example.com": {
    "selectors": ["figure", "aside", ".ad-banner"]
  }
}
```

All selectors are hidden via `@media print { selector { display: none !important } }` — no DOM manipulation.

## Development

Load as unpacked extension: `chrome://extensions` → Developer mode → Load unpacked → select this directory.

No build step required — plain JS, no bundler.
