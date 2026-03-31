(function () {
  "use strict";

  const HIDE_CLASS = "goodprint-hide";
  const hostname = location.hostname;
  let siteRules = null;
  let defaultStyles = DEFAULT_STYLES;

  // Build CSS string from a styles object { "selector": { "prop": "value" } }
  function buildStylesCSS(styles) {
    if (!styles || typeof styles !== "object") return "";
    return Object.entries(styles)
      .map(([selector, props]) => {
        const declarations = Object.entries(props)
          .map(([prop, val]) => `    ${prop}: ${val};`)
          .join("\n");
        return `  ${selector} {\n${declarations}\n  }`;
      })
      .join("\n");
  }

  // Inject print styles (hide class + default styles + per-site styles)
  function injectStyleRule() {
    const styleEl = document.createElement("style");
    styleEl.id = "goodprint-style";

    const defaultCSS = buildStylesCSS(defaultStyles);
    const siteCSS = buildStylesCSS(siteRules && siteRules.styles);

    styleEl.textContent =
      `@media print {\n  .${HIDE_CLASS} { display: none !important; }\n${defaultCSS}\n${siteCSS}\n}`;
    document.head.appendChild(styleEl);
  }

  function updateStyleRule() {
    const existing = document.getElementById("goodprint-style");
    if (existing) existing.remove();
    injectStyleRule();
  }

  function loadRules() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(["rules", "defaultSelectors", "defaultStyles"], (result) => {
        const rules = result.rules || {};
        const fallback = result.defaultSelectors || DEFAULT_SELECTORS;
        defaultStyles = result.defaultStyles || DEFAULT_STYLES;
        siteRules = rules[hostname] || { selectors: fallback, remove: [] };
        resolve(siteRules);
      });
    });
  }

  // Remove the class from all elements that currently have it
  function clearHideClass() {
    const els = document.querySelectorAll(`.${HIDE_CLASS}`);
    for (const el of els) {
      el.classList.remove(HIDE_CLASS);
    }
  }

  // Add the class to all elements matching the selectors
  function applyHideClass() {
    if (!siteRules) return;
    const selectors = siteRules.selectors || [];
    for (const selector of selectors) {
      const els = document.querySelectorAll(selector);
      for (const el of els) {
        el.classList.add(HIDE_CLASS);
        console.log("[GoodPrint] hiding:", selector, el);
      }
    }
  }

  // Remove elements from DOM permanently
  function removeElements() {
    if (!siteRules) return;
    const selectors = siteRules.remove || [];
    for (const selector of selectors) {
      const els = document.querySelectorAll(selector);
      for (const el of els) {
        console.log("[GoodPrint] removing:", selector, el);
        el.remove();
      }
    }
  }

  function applyRules() {
    clearHideClass();
    applyHideClass();
    removeElements();
    updateStyleRule();
  }

  // Listen for rule changes from popup
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.rules) {
      const newRules = changes.rules.newValue || {};
      const fallback = { selectors: DEFAULT_SELECTORS, remove: [] };
      siteRules = newRules[hostname] || fallback;
      applyRules();
    }
  });

  // Re-apply before print to catch dynamically added elements
  window.addEventListener("beforeprint", () => {
    applyHideClass();
    removeElements();
  });

  // Initialize
  loadRules().then(applyRules);
})();
