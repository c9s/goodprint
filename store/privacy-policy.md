# Privacy Policy — GoodPrint Chrome Extension

**Last updated:** March 30, 2026

## Data Collection

GoodPrint does **not** collect, transmit, or store any personal data. The extension runs entirely in your browser.

## Data Storage

GoodPrint stores your site rules and preferences using Chrome's built-in `chrome.storage.sync` API. This data:

- Is stored locally in your browser
- Syncs across your Chrome devices if you are signed into Chrome (via Google's built-in sync)
- Is never sent to any third-party server
- Contains only CSS selector strings and site hostnames — no personal information

## Permissions

GoodPrint requests the following permissions:

- **storage** — to save your per-site rules and default selectors
- **activeTab** — to detect the hostname of the current tab in the popup UI
- **Host permission (all URLs)** — the content script needs to run on any page to apply your print rules. It only reads the page hostname and adds CSS classes to elements you have configured.

## Third-Party Services

GoodPrint does not use any third-party services, analytics, or tracking tools.

## Changes

If this privacy policy is updated, the changes will be reflected in the extension's repository and store listing.

## Contact

For questions or concerns, please open an issue on the project's GitHub repository.
