importScripts("defaults.js");

chrome.runtime.onInstalled.addListener(() => {
  // Always refresh with default rules on install or update
  chrome.storage.sync.get("rules", (result) => {
    const existing = result.rules || {};
    // Merge defaults into existing rules (defaults fill in missing sites)
    const merged = Object.assign({}, DEFAULT_RULES, existing);

    // Migrate old format: convert remove/hide arrays to selectors
    for (const [host, rule] of Object.entries(merged)) {
      if (!rule.selectors) {
        merged[host] = {
          selectors: [
            ...(rule.remove || []),
            ...(rule.hide || [])
          ]
        };
      }
    }

    chrome.storage.sync.set({ rules: merged, defaultSelectors: DEFAULT_SELECTORS });
  });
});
