# GoodPrint

A Chrome extension that removes images, ads, sidebars, and other non-essential elements when printing web pages — so you use less ink and get cleaner printouts.

## How It Works

GoodPrint adds a CSS class to elements you want hidden. The class is scoped to `@media print`, so your page looks normal on screen but prints without the clutter.

- **Per-site rules** — define exactly which elements to hide on each website
- **Default selectors** — a fallback set (e.g. `figure`, `aside`, `nav`, `video`, `iframe`) applied to sites without custom rules
- **No DOM destruction** — elements are hidden with CSS, not removed, so nothing breaks

## Pre-configured Sites

GoodPrint ships with rules for:

| Site | What gets hidden |
|------|-----------------|
| www.nownews.com | Header, images, sidebar, ads |
| tw.news.yahoo.com | Sticky bars, images, sidebar, videos |
| www.ettoday.net | Header, ads, sidebar, images, videos, social buttons, comments, footer |

All other sites use the default selectors: `figure`, `aside`, `nav`, `video`, `iframe`, `.sticky`.

## Installation

1. Download or clone this repository
2. Open `chrome://extensions/` in Chrome
3. Enable **Developer mode** (toggle in top-right)
4. Click **Load unpacked** and select the project folder
5. The GoodPrint icon appears in your toolbar

## Usage

1. Navigate to any web page
2. Click the GoodPrint icon to view or edit rules for the current site
3. Press **Ctrl+P** (or **Cmd+P** on Mac) — hidden elements won't appear in the print preview

### Managing Rules

- **Add a site** — click "+ Add Site" in the popup, then add CSS selectors
- **Add a selector** — type a CSS selector (e.g. `figure`, `.ad-banner`, `#sidebar`) and press Enter or click Add
- **Remove a selector** — click the x on any selector tag
- **Delete all rules for a site** — click "Remove All Rules for This Site" (the site falls back to default selectors)
- **Edit default selectors** — add or remove selectors in the "Default Selectors" section; these apply to all sites without custom rules

### Import / Export

Use the **Export** and **Import** buttons to back up your rules or share them with others. Rules are saved as a JSON file.

## Selector Examples

| Selector | What it matches |
|----------|----------------|
| `figure` | All `<figure>` elements (usually images with captions) |
| `aside` | All `<aside>` elements (sidebars) |
| `nav` | Navigation bars |
| `.ad-banner` | Elements with class `ad-banner` |
| `#sidebar` | The element with id `sidebar` |
| `.story > p > img` | Images inside paragraphs inside `.story` |
| `div[class*="ad"]` | Any div with "ad" in its class name |

## License

MIT
