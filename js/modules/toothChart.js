/* ==========================================================================
   DENTEE - INTERACTIVE TOOTH CHART & DENTAL CHART MODULE
   Supports 32 Adult Teeth & 20 Primary/Child Teeth with surface condition tagging
   ========================================================================== */

const ToothChartModule = {
  selectedTooth: 14,
  selectedSurface: "occlusal",
  currentPatientId: "P-1001",
  chartType: "adult",

  init() {
    this.render();
  },

  render(patientId = this.currentPatientId) {
    this.currentPatientId = patientId;
    const container = document.getElementById("tooth-chart-module");
    if (!container) return;

    const patient = store.getPatientById(patientId);
    const chartData = store.getToothChart(patientId);
    this.chartType = chartData.chartType || "adult";

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">
              <span class="icon">🦷</span> Interactive Dental & Tooth Chart
            </h2>
            <div class="page-subtitle">
              Patient: <strong>${patient ? patient.name : "Select Patient"}</strong> (${patient ? patient.id : ""})
            </div>
          </div>
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <button class="btn btn-secondary btn-sm" id="btn-toggle-chart-type">
              Switch to ${this.chartType === "adult" ? "Child (20 Teeth)" : "Adult (32 Teeth)"}
            </button>
            <button class="btn btn-primary btn-sm" onclick="app.openNewProcedureModal('${patientId}')">
              + Add Procedure
            </button>
          </div>
        </div>

        <div class="tooth-chart-toolbar">
          <div class="tooth-legend">
            <div class="legend-item"><div class="legend-color" style="background:var(--tooth-caries);"></div> Caries/Decay</div>
            <div class="legend-item"><div class="legend-color" style="background:var(--tooth-filling);"></div> Filling</div>
            <div class="legend-item"><div class="legend-color" style="background:var(--tooth-crown);"></div> Crown</div>
            <div class="legend-item"><div class="legend-color" style="background:var(--tooth-rct);"></div> Root Canal</div>
            <div class="legend-item"><div class="legend-color" style="background:var(--tooth-implant);"></div> Implant</div>
            <div class="legend-item"><div class="legend-color" style="background:var(--tooth-extracted);"></div> Extracted</div>
          </div>
        </div>

        <div class="tooth-arch-section">
          <div style="text-align:center; font-size:0.8rem; font-weight:700; color:var(--text-muted); margin-bottom:0.5rem;">
            UPPER ARCH (MAXILLARY)
          </div>
          <div class="tooth-grid-arch" id="upper-arch-grid">
            ${this.renderArchTeeth(this.chartType === "adult" ? [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16] : ['A','B','C','D','E','F','G','H','I','J'], chartData)}
          </div>

          <div style="text-align:center; font-size:0.8rem; font-weight:700; color:var(--text-muted); margin: 1rem 0 0.5rem 0;">
            LOWER ARCH (MANDIBULAR)
          </div>
          <div class="tooth-grid-arch" id="lower-arch-grid">
            ${this.renderArchTeeth(this.chartType === "adult" ? [32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17] : ['T','S','R','Q','P','O','N','M','L','K'], chartData)}
          </div>
        </div>

        <!-- Tooth Inspector & Condition Form -->
        <div class="tooth-detail-panel" id="tooth-inspector">
          <div>
            <h3 style="font-size:1rem; font-weight:800; margin-bottom:0.75rem;">
              Tooth #${this.selectedTooth} Inspector
            </h3>
            <div class="tooth-svg-wrap" style="width:90px; height:110px; margin: 0 auto 1rem auto;">
              ${this.generateToothSVG(this.selectedTooth, chartData.teeth[this.selectedTooth])}
            </div>
            <div style="font-size:0.82rem; color:var(--text-secondary); text-align:center;">
              Click any surface (Occlusal, Mesial, Distal, Buccal, Lingual) or full tooth to set condition.
            </div>
          </div>

          <div>
            <h4 style="font-size:0.9rem; font-weight:700; margin-bottom:0.75rem;">
              Assign Clinical Condition / Treatment Status
            </h4>
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:0.5rem; margin-bottom:1rem;">
              <button class="btn btn-secondary btn-sm" onclick="ToothChartModule.setStatus('caries')">🔴 Caries (Decay)</button>
              <button class="btn btn-secondary btn-sm" onclick="ToothChartModule.setStatus('filling')">🔵 Amalgam/Composite</button>
              <button class="btn btn-secondary btn-sm" onclick="ToothChartModule.setStatus('crown')">🟡 Crown / Cap</button>
              <button class="btn btn-secondary btn-sm" onclick="ToothChartModule.setStatus('rct')">🟣 Root Canal (RCT)</button>
              <button class="btn btn-secondary btn-sm" onclick="ToothChartModule.setStatus('implant')">🩵 Dental Implant</button>
              <button class="btn btn-secondary btn-sm" onclick="ToothChartModule.setStatus('extracted')">⚪ Extracted / Missing</button>
            </div>

            <div class="form-group" style="margin-bottom:1rem;">
              <label>Clinical Notes for Tooth #${this.selectedTooth}:</label>
              <input type="text" id="tooth-notes-input" class="form-control" 
                value="${chartData.teeth[this.selectedTooth]?.notes || ''}" 
                placeholder="e.g. Incipient caries, planned crown prep...">
            </div>

            <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
              <button class="btn btn-secondary btn-sm" onclick="ToothChartModule.clearTooth('${this.selectedTooth}')">Reset Tooth</button>
              <button class="btn btn-primary btn-sm" onclick="ToothChartModule.saveToothNotes()">Save Notes</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  },

  renderArchTeeth(teethArr, chartData) {
    return teethArr.map(num => {
      const toothInfo = chartData.teeth[num] || { status: 'sound', surfaces: {} };
      const isSelected = this.selectedTooth == num ? 'selected' : '';
      return `
        <div class="tooth-card ${isSelected}" onclick="ToothChartModule.selectTooth('${num}')">
          <div class="tooth-number">#${num}</div>
          <div class="tooth-svg-wrap">
            ${this.generateToothSVG(num, toothInfo)}
          </div>
          <div class="tooth-label">${toothInfo.status || 'Sound'}</div>
        </div>
      `;
    }).join("");
  },

  generateToothSVG(toothNum, toothInfo = {}) {
    const s = toothInfo.surfaces || {};
    const mainStatusClass = toothInfo.status ? `surface-${toothInfo.status}` : '';

    return `
      <svg class="tooth-svg" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
        <!-- Tooth Crown & Surface Map -->
        <!-- Occlusal (Center) -->
        <polygon points="35,35 65,35 65,65 35,65" class="tooth-surface ${s.occlusal ? 'surface-' + s.occlusal : mainStatusClass}" />
        <!-- Mesial (Left) -->
        <polygon points="10,20 35,35 35,65 10,80" class="tooth-surface ${s.mesial ? 'surface-' + s.mesial : mainStatusClass}" />
        <!-- Distal (Right) -->
        <polygon points="65,35 90,20 90,80 65,65" class="tooth-surface ${s.distal ? 'surface-' + s.distal : mainStatusClass}" />
        <!-- Buccal (Top) -->
        <polygon points="10,20 90,20 65,35 35,35" class="tooth-surface ${s.buccal ? 'surface-' + s.buccal : mainStatusClass}" />
        <!-- Lingual (Bottom) -->
        <polygon points="35,65 65,65 90,80 10,80" class="tooth-surface ${s.lingual ? 'surface-' + s.lingual : mainStatusClass}" />
        
        <!-- Root Representation -->
        <path d="M 25 80 Q 30 115 50 118 Q 70 115 75 80 Z" fill="none" stroke="#64748b" stroke-width="2" />
      </svg>
    `;
  },

  selectTooth(num) {
    this.selectedTooth = num;
    this.render(this.currentPatientId);
  },

  setStatus(status) {
    store.updateToothSurface(this.currentPatientId, this.selectedTooth, "all", status);
    app.showToast(`Tooth #${this.selectedTooth} set to ${status.toUpperCase()}`);
    this.render(this.currentPatientId);
  },

  clearTooth(num) {
    const chart = store.getToothChart(this.currentPatientId);
    delete chart.teeth[num];
    store.saveState();
    app.showToast(`Tooth #${num} reset to Sound.`);
    this.render(this.currentPatientId);
  },

  saveToothNotes() {
    const notes = document.getElementById("tooth-notes-input").value;
    const chart = store.getToothChart(this.currentPatientId);
    if (!chart.teeth[this.selectedTooth]) {
      chart.teeth[this.selectedTooth] = { status: "sound", surfaces: {}, notes: "" };
    }
    chart.teeth[this.selectedTooth].notes = notes;
    store.saveState();
    app.showToast(`Saved notes for Tooth #${this.selectedTooth}`);
  },

  attachEvents() {
    const toggleBtn = document.getElementById("btn-toggle-chart-type");
    if (toggleBtn) {
      toggleBtn.onclick = () => {
        const chart = store.getToothChart(this.currentPatientId);
        chart.chartType = chart.chartType === "adult" ? "child" : "adult";
        store.saveState();
        this.render(this.currentPatientId);
      };
    }
  }
};
