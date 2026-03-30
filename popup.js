(function () {
  "use strict";

  let allRules = {};
  let defaultSelectors = [];
  let currentHostname = "";

  const $ = (id) => document.getElementById(id);

  // --- Storage helpers ---

  function loadAll() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(["rules", "defaultSelectors"], (result) => {
        allRules = result.rules || {};
        defaultSelectors = result.defaultSelectors || DEFAULT_SELECTORS;
        resolve();
      });
    });
  }

  function saveRules() {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ rules: allRules }, resolve);
    });
  }

  function saveDefaultSelectors() {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ defaultSelectors }, resolve);
    });
  }

  // --- Get current tab hostname ---

  function getCurrentHostname() {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].url) {
          try {
            const url = new URL(tabs[0].url);
            resolve(url.hostname);
          } catch {
            resolve("");
          }
        } else {
          resolve("");
        }
      });
    });
  }

  // --- Render ---

  function renderTagList(containerId, selectors, onRemove) {
    const container = $(containerId);
    container.innerHTML = "";

    if (selectors.length === 0) {
      const empty = document.createElement("span");
      empty.className = "empty-msg";
      empty.textContent = "No selectors";
      container.appendChild(empty);
      return;
    }

    for (const sel of selectors) {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = sel;

      const removeBtn = document.createElement("span");
      removeBtn.className = "remove-tag";
      removeBtn.textContent = "\u00d7";
      removeBtn.addEventListener("click", () => onRemove(sel));

      tag.appendChild(removeBtn);
      container.appendChild(tag);
    }
  }

  function renderCurrentSite() {
    $("current-hostname").textContent = currentHostname || "(no site)";

    const rules = allRules[currentHostname];
    const rulesSection = $("current-site-rules");
    const addBtn = $("btn-add-site");
    const usingDefaults = $("using-defaults");

    if (!currentHostname) {
      rulesSection.style.display = "none";
      addBtn.style.display = "none";
      usingDefaults.style.display = "none";
      return;
    }

    if (rules) {
      addBtn.style.display = "none";
      rulesSection.style.display = "block";
      usingDefaults.style.display = "none";
      renderTagList("selector-list", rules.selectors || [], removeSelector);
    } else {
      addBtn.style.display = "inline-block";
      rulesSection.style.display = "none";
      usingDefaults.style.display = "block";
    }
  }

  function renderDefaultSelectors() {
    renderTagList("default-selector-list", defaultSelectors, removeDefaultSelector);
  }

  function renderAllSites() {
    const container = $("sites-list");
    container.innerHTML = "";

    const hostnames = Object.keys(allRules).sort();
    if (hostnames.length === 0) {
      container.innerHTML = '<span class="empty-msg">No sites configured</span>';
      return;
    }

    for (const host of hostnames) {
      const rules = allRules[host];
      const count = (rules.selectors || []).length;

      const item = document.createElement("div");
      item.className = "site-item";

      const name = document.createElement("span");
      name.className = "site-name";
      name.textContent = host;

      const info = document.createElement("span");
      info.className = "site-count";
      info.textContent = `${count} selector${count !== 1 ? "s" : ""}`;

      item.appendChild(name);
      item.appendChild(info);
      container.appendChild(item);
    }
  }

  function renderAll() {
    renderCurrentSite();
    renderDefaultSelectors();
    renderAllSites();
  }

  // --- Actions ---

  function addSelector(selector) {
    if (!selector || !currentHostname) return;
    if (!allRules[currentHostname]) {
      allRules[currentHostname] = { selectors: [] };
    }
    const list = allRules[currentHostname].selectors;
    if (!list.includes(selector)) {
      list.push(selector);
      saveRules().then(renderAll);
    }
  }

  function removeSelector(selector) {
    if (!allRules[currentHostname]) return;
    const list = allRules[currentHostname].selectors;
    const idx = list.indexOf(selector);
    if (idx !== -1) {
      list.splice(idx, 1);
      saveRules().then(renderAll);
    }
  }

  function addDefaultSelector(selector) {
    if (!selector) return;
    if (!defaultSelectors.includes(selector)) {
      defaultSelectors.push(selector);
      saveDefaultSelectors().then(renderAll);
    }
  }

  function removeDefaultSelector(selector) {
    const idx = defaultSelectors.indexOf(selector);
    if (idx !== -1) {
      defaultSelectors.splice(idx, 1);
      saveDefaultSelectors().then(renderAll);
    }
  }

  function addCurrentSite() {
    if (!currentHostname) return;
    allRules[currentHostname] = { selectors: [] };
    saveRules().then(renderAll);
  }

  function deleteCurrentSite() {
    if (!currentHostname || !allRules[currentHostname]) return;
    delete allRules[currentHostname];
    saveRules().then(renderAll);
  }

  function exportRules() {
    const data = { rules: allRules, defaultSelectors };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "goodprint-rules.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importRules(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (typeof imported === "object" && imported !== null) {
          if (imported.rules) {
            for (const [host, rules] of Object.entries(imported.rules)) {
              allRules[host] = {
                selectors: Array.isArray(rules.selectors) ? rules.selectors : []
              };
            }
          }
          if (Array.isArray(imported.defaultSelectors)) {
            defaultSelectors = imported.defaultSelectors;
          }
          Promise.all([saveRules(), saveDefaultSelectors()]).then(renderAll);
        }
      } catch {
        // Invalid JSON; ignore
      }
    };
    reader.readAsText(file);
  }

  // --- Event listeners ---

  function setupListeners() {
    $("btn-add-site").addEventListener("click", addCurrentSite);
    $("btn-delete-site").addEventListener("click", deleteCurrentSite);

    $("btn-add-selector").addEventListener("click", () => {
      const input = $("selector-input");
      addSelector(input.value.trim());
      input.value = "";
    });

    $("selector-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const input = $("selector-input");
        addSelector(input.value.trim());
        input.value = "";
      }
    });

    $("btn-add-default").addEventListener("click", () => {
      const input = $("default-selector-input");
      addDefaultSelector(input.value.trim());
      input.value = "";
    });

    $("default-selector-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const input = $("default-selector-input");
        addDefaultSelector(input.value.trim());
        input.value = "";
      }
    });

    $("btn-export").addEventListener("click", exportRules);
    $("btn-import").addEventListener("click", () => $("import-file").click());
    $("import-file").addEventListener("change", (e) => {
      if (e.target.files[0]) {
        importRules(e.target.files[0]);
      }
    });
  }

  // --- Init ---

  async function init() {
    await loadAll();
    currentHostname = await getCurrentHostname();
    renderAll();
    setupListeners();
  }

  init();
})();
