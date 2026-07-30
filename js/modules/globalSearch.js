/* ==========================================================================
   DENTEE - GLOBAL SEARCH / COMMAND PALETTE (Ctrl+K)
   Fuzzy search across patients, appointments, invoices, and procedures
   ========================================================================== */

const GlobalSearchModule = {
  isOpen: false,
  searchQuery: "",
  selectedIndex: -1,
  results: [],

  init() {
    this.render();
    this.attachKeyboardListener();
  },

  render() {
    const container = document.getElementById("search-palette");
    if (!container) return;

    container.innerHTML = `
      <div class="search-palette-overlay" id="search-overlay" style="
        position:fixed;
        top:0;
        left:0;
        width:100vw;
        height:100vh;
        background:rgba(15,23,42,0.6);
        backdrop-filter:blur(4px);
        z-index:500;
        display:none;
        align-items:flex-start;
        justify-content:center;
        padding-top:12vh;
      ">
        <div class="search-palette glass-panel" style="
          width:100%;
          max-width:620px;
          border-radius:var(--radius-lg);
          overflow:hidden;
          box-shadow:0 24px 80px rgba(0,0,0,0.2);
        ">
          <!-- Search Input -->
          <div style="
            display:flex;
            align-items:center;
            gap:0.75rem;
            padding:0.85rem 1.25rem;
            border-bottom:1px solid var(--border-color);
          ">
            <span style="font-size:1.1rem; color:var(--text-muted);">🔍</span>
            <input type="text" id="search-input" class="form-control" 
              placeholder="Search patients, appointments, invoices, procedures..."
              style="border:none; background:transparent; padding:0; font-size:1rem; flex:1;"
              autofocus
              oninput="GlobalSearchModule.handleSearch(this.value)"
              onkeydown="GlobalSearchModule.handleKeydown(event)"
            />
            <kbd style="
              background:var(--bg-tertiary);
              padding:0.2rem 0.5rem;
              border-radius:4px;
              font-size:0.7rem;
              color:var(--text-muted);
              border:1px solid var(--border-color);
              font-family:inherit;
            ">Esc</kbd>
          </div>

          <!-- Results -->
          <div id="search-results" style="max-height:360px; overflow-y:auto; padding:0.5rem 0;">
            <div style="padding:1.5rem; text-align:center; color:var(--text-muted); font-size:0.85rem;">
              <div style="font-size:2rem; margin-bottom:0.5rem;">🔍</div>
              <div>Type to search across all modules...</div>
              <div style="font-size:0.75rem; margin-top:0.5rem;">Press <kbd style="background:var(--bg-tertiary); padding:0.1rem 0.3rem; border-radius:3px;">↑↓</kbd> to navigate, <kbd style="background:var(--bg-tertiary); padding:0.1rem 0.3rem; border-radius:3px;">Enter</kbd> to select</div>
          </div>

          <!-- Footer -->
          <div style="
            padding:0.6rem 1.25rem;
            border-top:1px solid var(--border-color);
            display:flex;
            gap:1rem;
            font-size:0.7rem;
            color:var(--text-muted);
          ">
            <span>👤 Patients</span>
            <span>📅 Appointments</span>
            <span>💵 Invoices</span>
            <span>🦷 Procedures</span>
          </div>
      </div>
    `;
  },

  open() {
    this.isOpen = true;
    this.searchQuery = "";
    this.selectedIndex = -1;
    this.results = [];
    const overlay = document.getElementById("search-overlay");
    if (overlay) {
      overlay.style.display = "flex";
      setTimeout(() => {
        const input = document.getElementById("search-input");
        if (input) input.focus();
      }, 100);
    }
    this.renderResults([]);
  },

  close() {
    this.isOpen = false;
    const overlay = document.getElementById("search-overlay");
    if (overlay) overlay.style.display = "none";
  },

  attachKeyboardListener() {
    document.addEventListener("keydown", (e) => {
      // Ctrl+K or Cmd+K to open
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        this.open();
      }
      // Escape to close
      if (e.key === "Escape" && this.isOpen) {
        this.close();
      }
    });
  },

  handleSearch(query) {
    this.searchQuery = query;
    this.selectedIndex = -1;

    if (!query.trim()) {
      this.renderResults([]);
      return;
    }

    const index = store.buildSearchIndex();
    const q = query.toLowerCase();

    // Simple fuzzy match
    this.results = index.filter(item => {
      const searchStr = `${item.label} ${item.subtitle}`.toLowerCase();
      // Check if all characters in query appear in order in search string
      let qi = 0;
      for (let i = 0; i < searchStr.length && qi < q.length; i++) {
        if (searchStr[i] === q[qi]) qi++;
      }
      return qi === q.length;
    }).slice(0, 20); // Max 20 results

    this.renderResults(this.results);
  },

  renderResults(results) {
    const container = document.getElementById("search-results");
    if (!container) return;

    if (!this.searchQuery.trim()) {
      container.innerHTML = `
        <div style="padding:2rem; text-align:center; color:var(--text-muted);">
          <div style="font-size:2rem; margin-bottom:0.5rem;">🔍</div>
          <div style="font-size:0.85rem;">Search across ${store.buildSearchIndex().length} records...</div>
      `;
      return;
    }

    if (results.length === 0) {
      container.innerHTML = `
        <div style="padding:2rem; text-align:center; color:var(--text-muted);">
          <div style="font-size:2rem; margin-bottom:0.5rem;">🔎</div>
          <div style="font-size:0.85rem;">No results found for "<strong>${this.searchQuery}</strong>"</div>
      `;
      return;
    }

    container.innerHTML = results.map((item, idx) => `
      <div class="search-result-item ${idx === this.selectedIndex ? 'selected' : ''}" 
        data-index="${idx}"
        onclick="GlobalSearchModule.selectResult(${idx})"
        style="
          display:flex;
          align-items:center;
          gap:0.85rem;
          padding:0.75rem 1.25rem;
          cursor:pointer;
          transition:background var(--transition-fast);
          ${idx === this.selectedIndex ? 'background:var(--primary-light);' : ''}
        "
        onmouseenter="GlobalSearchModule.setSelected(${idx})"
      >
        <div style="font-size:1.3rem; width:32px; text-align:center;">${item.icon || '📄'}</div>
        <div style="flex:1; min-width:0;">
          <div style="font-weight:700; font-size:0.9rem; color:var(--text-primary);">${this.highlightMatch(item.label)}</div>
          <div style="font-size:0.78rem; color:var(--text-muted); margin-top:2px;">
            <span class="badge badge-secondary" style="font-size:0.6rem; margin-right:0.4rem;">${item.type}</span>
            ${this.highlightMatch(item.subtitle)}
          </div>
        <kbd style="
          background:var(--bg-tertiary);
          padding:0.1rem 0.3rem;
          border-radius:3px;
          font-size:0.65rem;
          color:var(--text-muted);
          border:1px solid var(--border-color);
          font-family:inherit;
        ">↵</kbd>
      </div>
    `).join("");
  },

  highlightMatch(text) {
    if (!this.searchQuery.trim()) return text;
    const q = this.searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${q.split('').join('.*?')})`, 'gi');
    return text.replace(regex, '<strong style="color:var(--primary);">$1</strong>');
  },

  setSelected(idx) {
    this.selectedIndex = idx;
    const items = document.querySelectorAll(".search-result-item");
    items.forEach((item, i) => {
      item.style.background = i === idx ? "var(--primary-light)" : "";
    });
  },

  handleKeydown(e) {
    const results = document.querySelectorAll(".search-result-item");
    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      this.selectedIndex = Math.min(this.selectedIndex + 1, results.length - 1);
      this.scrollToSelected();
      this.renderResults(this.results);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
      this.scrollToSelected();
      this.renderResults(this.results);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (this.selectedIndex >= 0 && this.selectedIndex < this.results.length) {
        this.selectResult(this.selectedIndex);
      }
    }
  },

  scrollToSelected() {
    const items = document.querySelectorAll(".search-result-item");
    if (items[this.selectedIndex]) {
      items[this.selectedIndex].scrollIntoView({ block: "nearest" });
    }
  },

  selectResult(idx) {
    const item = this.results[idx];
    if (!item) return;

    this.close();

    switch (item.type) {
      case "patient":
        app.setActivePatient(item.id);
        app.navigateTo("patients");
        break;
      case "appointment":
        app.navigateTo("appointments");
        app.showToast(`Found: ${item.label}`);
        break;
      case "invoice":
        app.navigateTo("billing");
        app.showToast(`Found: ${item.label}`);
        break;
      case "procedure":
        app.navigateTo("billing");
        app.showToast(`Procedure: ${item.label}`);
        break;
      default:
        app.showToast(item.label);
    }
  }
};
