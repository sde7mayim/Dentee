/* ==========================================================================
   DENTEE - INTERACTIVE 32 TOOTH DENTAL CHART MODULE (NORMAL 2D VIEW)
   Clean, Standard 2D Clinical Dental Chart Layout
   Supports 32 Adult Teeth & 20 Primary/Child Teeth with Surface Tagging
   ========================================================================== */

const ToothChartModule = {
  selectedTooth: 14,
  selectedSurface: "occlusal",
  currentPatientId: "P-1001",
  chartType: "adult",

  // Condition 2D color tokens & radial gradients
  conditionGradients: {
    sound:     { top: "#a7f3d0", bottom: "#059669", highlight: "#d1fae5" },
    caries:    { top: "#fca5a5", bottom: "#dc2626", highlight: "#fecaca" },
    filling:   { top: "#93c5fd", bottom: "#2563eb", highlight: "#bfdbfe" },
    crown:     { top: "#fde68a", bottom: "#d97706", highlight: "#fef3c7" },
    rct:       { top: "#c4b5fd", bottom: "#7c3aed", highlight: "#ddd6fe" },
    implant:   { top: "#67e8f9", bottom: "#0891b2", highlight: "#cffafe" },
    extracted: { top: "#cbd5e1", bottom: "#64748b", highlight: "#e2e8f0" }
  },

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

    const upperTeeth = this.chartType === "adult" 
      ? [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16] 
      : ['A','B','C','D','E','F','G','H','I','J'];
    
    const lowerTeeth = this.chartType === "adult" 
      ? [32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17] 
      : ['T','S','R','Q','P','O','N','M','L','K'];

    container.innerHTML = `
      <div class="card">
        <div class="card-header" style="flex-wrap:wrap; gap:1rem;">
          <div>
            <h2 class="card-title">
              <span class="icon">🦷</span> Interactive Dental & Tooth Chart
              <span style="font-size:0.65rem; background:var(--primary-light); color:var(--primary); padding:3px 10px; border-radius:var(--radius-full); font-weight:800; letter-spacing:0.5px;">STANDARD DENTAL CHART (2D)</span>
            </h2>
            <div class="page-subtitle">
              Patient: <strong>${patient ? patient.name : "Select Patient"}</strong> (${patient ? patient.id : ""}) — 
              <span style="color:var(--primary); font-weight:700;">${this.chartType === 'adult' ? '32 Adult Teeth (Universal System #1 - #32)' : '20 Primary/Child Teeth (A - T)'}</span>
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

        <!-- Toolbar & Legend -->
        <div class="tooth-chart-toolbar" style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1rem; padding:0.75rem 1.25rem; background:var(--bg-tertiary); border-radius:var(--radius-lg); margin-bottom:1.25rem; border:1px solid var(--border-color);">
          <div class="tooth-legend" style="display:flex; flex-wrap:wrap; gap:1.25rem; align-items:center;">
            <div class="legend-item"><div class="legend-color" style="background:var(--tooth-sound);"></div> Sound / Healthy</div>
            <div class="legend-item"><div class="legend-color" style="background:var(--tooth-caries);"></div> Caries (Decay)</div>
            <div class="legend-item"><div class="legend-color" style="background:var(--tooth-filling);"></div> Filling</div>
            <div class="legend-item"><div class="legend-color" style="background:var(--tooth-crown);"></div> Crown</div>
            <div class="legend-item"><div class="legend-color" style="background:var(--tooth-rct);"></div> Root Canal</div>
            <div class="legend-item"><div class="legend-color" style="background:var(--tooth-implant);"></div> Implant</div>
            <div class="legend-item"><div class="legend-color" style="background:var(--tooth-extracted);"></div> Extracted</div>
          </div>
        </div>

        <!-- 2D Normal Dental Chart View Area -->
        <div style="display:flex; flex-direction:column; gap:1.25rem; margin-bottom:1.5rem;">
          
          <!-- Maxillary (Upper Arch) 2D Grid -->
          <div class="tooth-chart-2d-container">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; padding:0 0.5rem;">
              <span style="font-size:0.72rem; font-weight:800; color:var(--text-muted); letter-spacing:1px;">QUADRANT 1: UPPER RIGHT (#1 - #8)</span>
              <span style="font-size:0.85rem; font-weight:800; color:var(--primary); letter-spacing:1px; background:var(--primary-light); padding:4px 14px; border-radius:var(--radius-full);">
                UPPER ARCH (MAXILLARY)
              </span>
              <span style="font-size:0.72rem; font-weight:800; color:var(--text-muted); letter-spacing:1px;">QUADRANT 2: UPPER LEFT (#9 - #16)</span>
            </div>
            <div class="tooth-arch-2d">
              ${this.renderTeeth2D(upperTeeth, chartData, 'upper')}
            </div>
          </div>

          <!-- Mandibular (Lower Arch) 2D Grid -->
          <div class="tooth-chart-2d-container">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; padding:0 0.5rem;">
              <span style="font-size:0.72rem; font-weight:800; color:var(--text-muted); letter-spacing:1px;">QUADRANT 4: LOWER RIGHT (#25 - #32)</span>
              <span style="font-size:0.85rem; font-weight:800; color:var(--secondary); letter-spacing:1px; background:var(--accent-light); padding:4px 14px; border-radius:var(--radius-full);">
                LOWER ARCH (MANDIBULAR)
              </span>
              <span style="font-size:0.72rem; font-weight:800; color:var(--text-muted); letter-spacing:1px;">QUADRANT 3: LOWER LEFT (#17 - #24)</span>
            </div>
            <div class="tooth-arch-2d">
              ${this.renderTeeth2D(lowerTeeth, chartData, 'lower')}
            </div>
          </div>

        </div>

        <!-- Tooth Inspector & Condition Form -->
        <div class="tooth-detail-panel" id="tooth-inspector" style="background:var(--bg-tertiary); padding:1.5rem; border-radius:var(--radius-xl); border:1px solid var(--border-color);">
          <div>
            <h3 style="font-size:1.05rem; font-weight:800; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem;">
              <span>🔍 Inspector: Tooth #${this.selectedTooth}</span>
              <span style="font-size:0.72rem; background:var(--primary-light); color:var(--primary); padding:3px 10px; border-radius:var(--radius-full); font-weight:800;">
                ${this.getToothTypeLabel(this.selectedTooth)}
              </span>
            </h3>
            
            <div class="tooth-svg-wrap" style="width:110px; height:140px; margin: 0.75rem auto 1rem auto; filter:drop-shadow(0 6px 16px rgba(0,0,0,0.18));">
              ${this.generateAnatomicalToothSVG(this.selectedTooth, chartData.teeth[this.selectedTooth], true)}
            </div>
            
            <div style="font-size:0.8rem; color:var(--text-secondary); text-align:center; line-height:1.4; font-weight:600;">
              Click any surface zone (Occlusal, Mesial, Distal, Buccal, Lingual) on the tooth diagram to assign specific surface restorations.
            </div>
          </div>

          <div>
            <h4 style="font-size:0.95rem; font-weight:800; margin-bottom:0.85rem;">
              Assign Clinical Condition / Restoration Status for Tooth #${this.selectedTooth}
            </h4>
            
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:0.65rem; margin-bottom:1.25rem;">
              <button class="btn btn-secondary btn-sm" style="border-left:4px solid var(--tooth-sound); font-weight:700;" onclick="ToothChartModule.setStatus('sound')">🟢 Sound / Healthy</button>
              <button class="btn btn-secondary btn-sm" style="border-left:4px solid var(--tooth-caries); font-weight:700;" onclick="ToothChartModule.setStatus('caries')">🔴 Caries (Decay)</button>
              <button class="btn btn-secondary btn-sm" style="border-left:4px solid var(--tooth-filling); font-weight:700;" onclick="ToothChartModule.setStatus('filling')">🔵 Amalgam / Composite</button>
              <button class="btn btn-secondary btn-sm" style="border-left:4px solid var(--tooth-crown); font-weight:700;" onclick="ToothChartModule.setStatus('crown')">🟡 Crown / Cap</button>
              <button class="btn btn-secondary btn-sm" style="border-left:4px solid var(--tooth-rct); font-weight:700;" onclick="ToothChartModule.setStatus('rct')">🟣 Root Canal (RCT)</button>
              <button class="btn btn-secondary btn-sm" style="border-left:4px solid var(--tooth-implant); font-weight:700;" onclick="ToothChartModule.setStatus('implant')">🩵 Dental Implant</button>
              <button class="btn btn-secondary btn-sm" style="border-left:4px solid var(--tooth-extracted); font-weight:700;" onclick="ToothChartModule.setStatus('extracted')">⚪ Extracted / Missing</button>
            </div>

            <div class="form-group" style="margin-bottom:1rem;">
              <label style="font-size:0.85rem; font-weight:700;">Clinical & Radiographic Notes for Tooth #${this.selectedTooth}:</label>
              <input type="text" id="tooth-notes-input" class="form-control" 
                value="${chartData.teeth[this.selectedTooth]?.notes || ''}" 
                placeholder="e.g. Incipient mesial caries, planned ceramic crown prep...">
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

  /**
   * Returns anatomical classification label for a tooth number
   */
  getToothTypeLabel(toothNum) {
    const num = parseInt(toothNum);
    if ([8, 9, 24, 25].includes(num)) return "Central Incisor";
    if ([7, 10, 23, 26].includes(num)) return "Lateral Incisor";
    if ([6, 11, 22, 27].includes(num)) return "Canine (Cuspid)";
    if ([4, 5, 12, 13, 20, 21, 28, 29].includes(num)) return "Premolar (Bicuspid)";
    if ([1, 2, 3, 14, 15, 16, 17, 18, 19, 30, 31, 32].includes(num)) return "Molar";
    return "Primary Tooth";
  },

  /**
   * Render teeth in clean, standard 2D dental chart grid
   */
  renderTeeth2D(teethArr, chartData, archType) {
    return teethArr.map((num) => {
      const toothInfo = chartData.teeth[num] || { status: 'sound', surfaces: {} };
      const isSelected = this.selectedTooth == num ? 'selected' : '';

      return `
        <div class="tooth-card ${isSelected}" 
             onclick="ToothChartModule.selectTooth('${num}')"
             data-tooth="${num}"
             title="Tooth #${num} (${this.getToothTypeLabel(num)}) — ${toothInfo.status || 'Sound'}">
          <div class="tooth-number">#${num}</div>
          <div class="tooth-svg-wrap">
            ${this.generateAnatomicalToothSVG(num, toothInfo)}
          </div>
          <div class="tooth-label">${toothInfo.status || 'Sound'}</div>
        </div>
      `;
    }).join("");
  },

  /**
   * Generate clean anatomical SVG tooth graphics with surface zones
   */
  generateAnatomicalToothSVG(toothNum, toothInfo = {}, large = false) {
    const s = toothInfo.surfaces || {};
    const status = toothInfo.status || 'sound';
    const suffix = large ? 'L' : 'S';
    const num = parseInt(toothNum) || 14;
    
    const defs = this.buildGradientDefs(suffix);
    
    const occlStatus = s.occlusal || status;
    const mesStatus = s.mesial || status;
    const disStatus = s.distal || status;
    const bucStatus = s.buccal || status;
    const linStatus = s.lingual || status;

    const isMolar = [1, 2, 3, 14, 15, 16, 17, 18, 19, 30, 31, 32].includes(num);
    const isPremolar = [4, 5, 12, 13, 20, 21, 28, 29].includes(num);
    const isCanine = [6, 11, 22, 27].includes(num);
    const isUpper = num <= 16;

    return `
      <svg class="tooth-svg" viewBox="0 0 100 135" xmlns="http://www.w3.org/2000/svg">
        <defs>${defs}</defs>

        <!-- Root Structure -->
        ${this.renderAnatomicalRoots(num, status, isUpper, isMolar, isPremolar, isCanine)}

        <!-- Tooth Crown Surface Poly Polygons -->
        <!-- Mesial (Left Surface) -->
        <polygon points="10,32 35,47 35,77 10,92" class="tooth-surface" fill="url(#grad-${mesStatus}${suffix})" 
                 onclick="event.stopPropagation(); ToothChartModule.selectSurface('${toothNum}', 'mesial')" />
        
        <!-- Distal (Right Surface) -->
        <polygon points="65,47 90,32 90,92 65,77" class="tooth-surface" fill="url(#grad-${disStatus}${suffix})" 
                 onclick="event.stopPropagation(); ToothChartModule.selectSurface('${toothNum}', 'distal')" />
        
        <!-- Buccal (Top Surface) -->
        <polygon points="10,32 90,32 65,47 35,47" class="tooth-surface" fill="url(#grad-${bucStatus}${suffix})" 
                 onclick="event.stopPropagation(); ToothChartModule.selectSurface('${toothNum}', 'buccal')" />
        
        <!-- Lingual (Bottom Surface) -->
        <polygon points="35,77 65,77 90,92 10,92" class="tooth-surface" fill="url(#grad-${linStatus}${suffix})" 
                 onclick="event.stopPropagation(); ToothChartModule.selectSurface('${toothNum}', 'lingual')" />
        
        <!-- Occlusal (Center Surface) -->
        <polygon points="35,47 65,47 65,77 35,77" class="tooth-surface" fill="url(#grad-${occlStatus}${suffix})" 
                 onclick="event.stopPropagation(); ToothChartModule.selectSurface('${toothNum}', 'occlusal')" />

        <!-- 2D Specular Light Reflection Overlay -->
        <polygon points="20,40 45,40 40,60 25,60" class="tooth-shine" fill="white" opacity="0.25" />

        <!-- Crown Outline -->
        <polygon points="10,32 35,47 65,47 90,32 90,92 65,77 35,77 10,92" 
                 fill="none" stroke="var(--text-primary)" stroke-width="1.2" stroke-linejoin="round" opacity="0.5" />

        <!-- Special Restorative Overlay Visuals -->
        ${status === 'crown' ? `
          <polygon points="8,30 92,30 92,94 8,94" fill="url(#grad-crown${suffix})" opacity="0.35" stroke="#d97706" stroke-width="1.5"/>
          <text x="50" y="66" font-size="11" font-weight="900" fill="#92400e" text-anchor="middle">👑</text>
        ` : ''}

        ${status === 'implant' ? `
          <circle cx="50" cy="62" r="16" fill="#0891b2" opacity="0.85"/>
          <text x="50" y="66" font-size="11" font-weight="900" fill="white" text-anchor="middle">🔩</text>
        ` : ''}

        ${status === 'rct' ? `
          <line x1="50" y1="35" x2="50" y2="115" stroke="#7c3aed" stroke-width="4" stroke-linecap="round" opacity="0.85"/>
        ` : ''}

        ${status === 'extracted' ? `
          <line x1="15" y1="20" x2="85" y2="105" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round" opacity="0.8"/>
          <line x1="85" y1="20" x2="15" y2="105" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round" opacity="0.8"/>
        ` : ''}
      </svg>
    `;
  },

  /**
   * Render anatomical root structures based on category
   */
  renderAnatomicalRoots(num, status, isUpper, isMolar, isPremolar, isCanine) {
    if (status === 'implant') {
      return `
        <g class="implant-post">
          <rect x="42" y="78" width="16" height="42" rx="4" fill="url(#grad-implantS)" stroke="#0891b2" stroke-width="1"/>
          <line x1="40" y1="84" x2="60" y2="84" stroke="#0891b2" stroke-width="1.5"/>
          <line x1="40" y1="92" x2="60" y2="92" stroke="#0891b2" stroke-width="1.5"/>
          <line x1="40" y1="100" x2="60" y2="100" stroke="#0891b2" stroke-width="1.5"/>
          <line x1="40" y1="108" x2="60" y2="108" stroke="#0891b2" stroke-width="1.5"/>
        </g>
      `;
    }

    if (isMolar) {
      return `
        <path d="M 22 88 Q 28 122 36 126 Q 45 120 48 88" fill="none" stroke="var(--text-secondary)" stroke-width="2" opacity="0.75"/>
        <path d="M 52 88 Q 55 120 64 126 Q 72 122 78 88" fill="none" stroke="var(--text-secondary)" stroke-width="2" opacity="0.75"/>
        <path d="M 38 88 Q 50 115 62 88" fill="none" stroke="var(--text-muted)" stroke-width="1.2" opacity="0.5"/>
      `;
    } else if (isPremolar) {
      return `
        <path d="M 28 88 Q 36 120 44 124" fill="none" stroke="var(--text-secondary)" stroke-width="2" opacity="0.75"/>
        <path d="M 72 88 Q 64 120 56 124" fill="none" stroke="var(--text-secondary)" stroke-width="2" opacity="0.75"/>
      `;
    } else if (isCanine) {
      return `
        <path d="M 28 88 Q 50 132 72 88" fill="none" stroke="var(--text-secondary)" stroke-width="2.5" opacity="0.8"/>
      `;
    } else {
      return `
        <path d="M 32 88 Q 50 125 68 88" fill="none" stroke="var(--text-secondary)" stroke-width="2" opacity="0.7"/>
      `;
    }
  },

  /**
   * Build SVG radial gradients for 2D conditions
   */
  buildGradientDefs(suffix) {
    const gradients = Object.entries(this.conditionGradients).map(([key, colors]) => {
      const gradId = `grad-${key}${suffix}`;
      return `
        <radialGradient id="${gradId}" cx="35%" cy="35%" r="75%" fx="30%" fy="30%">
          <stop offset="0%" stop-color="${colors.highlight}" />
          <stop offset="45%" stop-color="${colors.top}" />
          <stop offset="100%" stop-color="${colors.bottom}" />
        </radialGradient>`;
    }).join('');

    return `
      ${gradients}
      <filter id="blur${suffix}" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${suffix === 'L' ? '3' : '1.5'}" />
      </filter>
    `;
  },

  selectTooth(num) {
    this.selectedTooth = num;
    this.render(this.currentPatientId);
  },

  selectSurface(toothNum, surface) {
    this.selectedTooth = toothNum;
    this.selectedSurface = surface;
    app.showToast(`Selected Surface: ${surface.toUpperCase()} on Tooth #${toothNum}`);
  },

  setStatus(status) {
    store.updateToothSurface(this.currentPatientId, this.selectedTooth, "all", status);
    app.showToast(`Tooth #${this.selectedTooth} condition updated to ${status.toUpperCase()}`);
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
    const notesInput = document.getElementById("tooth-notes-input");
    const notes = notesInput ? notesInput.value : "";
    const chart = store.getToothChart(this.currentPatientId);
    if (!chart.teeth[this.selectedTooth]) {
      chart.teeth[this.selectedTooth] = { status: "sound", surfaces: {}, notes: "" };
    }
    chart.teeth[this.selectedTooth].notes = notes;
    store.saveState();
    app.showToast(`Saved clinical notes for Tooth #${this.selectedTooth}`);
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
