/* ==========================================================================
   DENTEE - EXACT 3D ANATOMICAL HORSESHOE DENTAL ARCH STUDIO
   Enterprise EHR OS Component - High-Fidelity Clinical Dental Twin
   ========================================================================== */

const ToothChartModule = {
  selectedTooth: 14,
  selectedSurface: "occlusal",
  currentPatientId: "P-1001",
  chartType: "adult", // "adult" (32 teeth) or "child" (20 teeth)
  damagedIndex: 0,

  // CDT Procedure Codes & Fee Schedule Dictionary
  cdtDictionary: {
    caries:    { cdt: "D2150", name: "Resin/Amalgam Restoration (2 Surfaces)", fee: 240, insCov: 192, copay: 48 },
    filling:   { cdt: "D2392", name: "Composite Resin Restoration - Posterior", fee: 280, insCov: 224, copay: 56 },
    crown:     { cdt: "D2740", name: "Crown - Porcelain / Ceramic Substrate", fee: 1250, insCov: 875, copay: 375 },
    rct:       { cdt: "D3330", name: "Endodontic Root Canal Therapy - Molar", fee: 980, insCov: 784, copay: 196 },
    implant:   { cdt: "D6010", name: "Surgical Placement of Endosteal Implant", fee: 2400, insCov: 1200, copay: 1200 },
    extracted: { cdt: "D7140", name: "Extraction, Erupted Tooth or Exposed Root", fee: 220, insCov: 176, copay: 44 },
    sound:     { cdt: "D0120", name: "Periodic Oral Evaluation (Healthy)", fee: 0, insCov: 0, copay: 0 }
  },

  // Condition Metadata
  conditionMeta: {
    sound:     { label: "Sound / Healthy", icon: "🟢", color: "#10b981", hex: 0x10b981, bg: "#d1fae5" },
    caries:    { label: "Caries (Decay)", icon: "🔴", color: "#ef4444", hex: 0xef4444, bg: "#fee2e2" },
    filling:   { label: "Amalgam / Composite", icon: "🔵", color: "#3b82f6", hex: 0x3b82f6, bg: "#dbeafe" },
    crown:     { label: "Crown / Cap 👑", icon: "🟡", color: "#f59e0b", hex: 0xf59e0b, bg: "#fef3c7" },
    rct:       { label: "Root Canal (RCT) 🟣", icon: "🟣", color: "#8b5cf6", hex: 0x8b5cf6, bg: "#f3e8ff" },
    implant:   { label: "Dental Implant 🔩", icon: "🩵", color: "#06b6d4", hex: 0x06b6d4, bg: "#cffafe" },
    extracted: { label: "Extracted / Missing ❌", icon: "⚪", color: "#64748b", hex: 0x64748b, bg: "#e2e8f0" }
  },

  init() {
    this.render();
  },

  getTeethList() {
    if (this.chartType === "child") {
      return {
        upper: ['A','B','C','D','E','F','G','H','I','J'],
        lower: ['T','S','R','Q','P','O','N','M','L','K'],
        all: ['A','B','C','D','E','F','G','H','I','J','T','S','R','Q','P','O','N','M','L','K']
      };
    }
    return {
      upper: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
      lower: [32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17],
      all: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]
    };
  },

  getDamagedTeethList(chartData) {
    const teeth = this.getTeethList().all;
    return teeth.filter(num => {
      const status = chartData.teeth[num]?.status;
      return status && status !== "sound";
    });
  },

  calculateDentitionStats(chartData) {
    const teethList = this.getTeethList().all;
    const totalCount = teethList.length;
    let extractedCount = 0;
    let soundCount = 0;
    let cariesCount = 0;
    let fillingCount = 0;
    let crownCount = 0;
    let rctCount = 0;
    let implantCount = 0;

    teethList.forEach(num => {
      const status = chartData.teeth[num]?.status || "sound";
      if (status === "extracted") extractedCount++;
      else if (status === "caries") cariesCount++;
      else if (status === "filling") fillingCount++;
      else if (status === "crown") crownCount++;
      else if (status === "rct") rctCount++;
      else if (status === "implant") implantCount++;
      else soundCount++;
    });

    const presentCount = totalCount - extractedCount;
    const damagedCount = cariesCount + fillingCount + crownCount + rctCount + implantCount;

    return {
      totalCount,
      presentCount,
      extractedCount,
      damagedCount,
      soundCount,
      cariesCount,
      fillingCount,
      crownCount,
      rctCount,
      implantCount,
      intactPercentage: ((presentCount / totalCount) * 100).toFixed(0)
    };
  },

  renderDentitionSummaryBarHTML(stats) {
    return `
      <div class="dentition-summary-bar" style="
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        align-items: center;
        justify-content: space-between;
        background: var(--bg-tertiary);
        padding: 0.85rem 1.25rem;
        border-radius: var(--radius-xl);
        margin-bottom: 1.25rem;
        border: 1px solid var(--border-color);
        box-shadow: var(--shadow-sm);
      ">
        <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
          <div class="dentition-stat-pill" style="
            background: var(--primary-light);
            color: var(--primary);
            padding: 0.45rem 0.95rem;
            border-radius: var(--radius-lg);
            font-weight: 800;
            font-size: 0.88rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            border: 1.5px solid rgba(2,128,144,0.3);
          ">
            <span>🦷 Teeth Present:</span>
            <span style="font-size:1.05rem; color:var(--text-primary); font-weight:900;">${stats.presentCount} / ${stats.totalCount}</span>
            <span style="font-size:0.72rem; background:var(--primary); color:white; padding:2px 7px; border-radius:var(--radius-full); font-weight:800;">${stats.intactPercentage}% Intact</span>
          </div>

          <div class="dentition-stat-pill" style="
            background: var(--danger-bg);
            color: var(--danger);
            padding: 0.45rem 0.95rem;
            border-radius: var(--radius-lg);
            font-weight: 800;
            font-size: 0.88rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            border: 1.5px solid rgba(239,68,68,0.3);
          ">
            <span>⚠️ Damaged / Lesions Marked:</span>
            <span style="font-size:1.05rem; font-weight:900;">${stats.damagedCount}</span>
          </div>

          <div class="dentition-stat-pill" style="
            background: var(--bg-card);
            color: var(--text-secondary);
            padding: 0.45rem 0.95rem;
            border-radius: var(--radius-lg);
            font-weight: 700;
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            border: 1px solid var(--border-color);
          ">
            <span>⚪ Missing / Extracted:</span>
            <span style="font-size:1.05rem; color:var(--text-primary); font-weight:900;">${stats.extractedCount}</span>
          </div>
        </div>

        <div style="display:flex; gap:0.4rem; flex-wrap:wrap; align-items:center;">
          <span class="dentition-badge" style="font-size:0.75rem; padding:4px 10px; border-radius:var(--radius-full); background:var(--bg-card); border:1px solid var(--border-color); font-weight:700;">🟢 Healthy: ${stats.soundCount}</span>
          <span class="dentition-badge" style="font-size:0.75rem; padding:4px 10px; border-radius:var(--radius-full); background:#fee2e2; color:#b91c1c; font-weight:700; border:1px solid #fca5a5;">🔴 Caries: ${stats.cariesCount}</span>
          <span class="dentition-badge" style="font-size:0.75rem; padding:4px 10px; border-radius:var(--radius-full); background:#dbeafe; color:#1d4ed8; font-weight:700; border:1px solid #93c5fd;">🔵 Filling: ${stats.fillingCount}</span>
          <span class="dentition-badge" style="font-size:0.75rem; padding:4px 10px; border-radius:var(--radius-full); background:#fef3c7; color:#b45309; font-weight:700; border:1px solid #fde68a;">🟡 Crown: ${stats.crownCount}</span>
          <span class="dentition-badge" style="font-size:0.75rem; padding:4px 10px; border-radius:var(--radius-full); background:#f3e8ff; color:#6b21a8; font-weight:700; border:1px solid #c4b5fd;">🟣 RCT: ${stats.rctCount}</span>
          <span class="dentition-badge" style="font-size:0.75rem; padding:4px 10px; border-radius:var(--radius-full); background:#cffafe; color:#0e7490; font-weight:700; border:1px solid #67e8f9;">🩵 Implant: ${stats.implantCount}</span>
        </div>
      </div>
    `;
  },

  render(patientId = this.currentPatientId) {
    this.currentPatientId = patientId;
    const container = document.getElementById("tooth-chart-module");
    if (!container) return;

    const patient = store.getPatientById(patientId);
    const chartData = store.getToothChart(patientId);
    this.chartType = chartData.chartType || "adult";

    const teethList = this.getTeethList();
    const damagedList = this.getDamagedTeethList(chartData);
    const dentitionStats = this.calculateDentitionStats(chartData);

    if (!teethList.all.includes(this.selectedTooth) && !teethList.all.includes(parseInt(this.selectedTooth))) {
      this.selectedTooth = teethList.all[0];
    }

    container.innerHTML = `
      <div class="card">
        <!-- Header -->
        <div class="card-header" style="flex-wrap:wrap; gap:1rem;">
          <div>
            <h2 class="card-title" style="display:flex; align-items:center; gap:0.6rem;">
              <span>🦷 32 TOOTH ANATOMICAL HORSESHOE DENTAL CHART</span>
              <span style="font-size:0.65rem; background:linear-gradient(135deg, #028090, #00a896); color:white; padding:4px 12px; border-radius:var(--radius-full); font-weight:800; letter-spacing:0.5px;">
                ANATOMICAL EHR STUDIO
              </span>
            </h2>
            <div class="page-subtitle">
              Patient: <strong>${patient ? patient.name : "Select Patient"}</strong> (${patient ? patient.id : ""}) — 
              <span style="color:var(--primary); font-weight:700;">${this.chartType === 'adult' ? '32 Permanent Teeth (Universal #1 - #32)' : '20 Primary Child Teeth (A - T)'}</span>
            </div>
          </div>

          <div style="display:flex; gap:0.6rem; align-items:center; flex-wrap:wrap;">
            <button class="btn ${this.chartType === 'adult' ? 'btn-primary' : 'btn-secondary'} btn-sm" id="btn-toggle-chart-type">
              👨‍⚕️ ${this.chartType === "adult" ? "Adult (32 Teeth)" : "Child (20 Teeth)"}
            </button>

            <button class="btn btn-primary btn-sm" onclick="ToothChartModule.addSelectedToTreatmentPlan()">
              + Add Tooth #${this.selectedTooth} to Plan
            </button>
          </div>
        </div>

        <!-- SECTION 1: Dentition Summary ("No. of Teeth Present") Counter Bar -->
        ${this.renderDentitionSummaryBarHTML(dentitionStats)}

        <!-- SECTION 2: DUAL STUDIO GRID (Exact Anatomical Horseshoe Arch on Left + Treatment Simulator on Right) -->
        <div class="dental-twin-studio-grid" style="display:grid; grid-template-columns: 1fr 380px; gap:1.25rem; margin-bottom:1.5rem;">
          <!-- Left Studio Pane: Exact Anatomical Horseshoe Arch -->
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            ${this.renderExactAnatomicalArchHTML(chartData, teethList)}
          </div>

          <!-- Right Studio Pane: Real-Time Treatment Simulator & Copay Estimator -->
          ${this.renderTreatmentSimulatorHTML(chartData)}
        </div>

        <!-- SECTION 3: 2D HORIZONTAL SEQUENTIAL TOOTH GRID (Upper #1-#16 & Lower #32-#17 Rows) -->
        ${this.render2DHorizontalSequentialGridHTML(chartData, teethList)}

        <!-- SECTION 4: Tooth Inspector & Condition Assignment Panel -->
        <div class="tooth-detail-panel" id="tooth-inspector" style="background:var(--bg-tertiary); padding:1.5rem; border-radius:var(--radius-xl); border:1px solid var(--border-color); margin-top:1.5rem;">
          <div>
            <h3 style="font-size:1.05rem; font-weight:800; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem;">
              <span>🔍 Clinical Inspector: Tooth #${this.selectedTooth}</span>
              <span style="font-size:0.72rem; background:var(--primary-light); color:var(--primary); padding:3px 10px; border-radius:var(--radius-full); font-weight:800;">
                ${this.getToothTypeLabel(this.selectedTooth)}
              </span>
            </h3>
            
            <div class="tooth-svg-wrap" style="width:110px; height:140px; margin: 0.75rem auto 1rem auto; filter:drop-shadow(0 6px 16px rgba(0,0,0,0.18));">
              ${this.generate3DOcclusalToothSVG(this.selectedTooth, chartData.teeth[this.selectedTooth], true)}
            </div>
            
            <div style="font-size:0.8rem; color:var(--text-secondary); text-align:center; line-height:1.4; font-weight:600;">
              Selected Tooth: <strong>#${this.selectedTooth} (${this.getToothTypeLabel(this.selectedTooth)})</strong><br>
              Status: <span style="color:${this.conditionMeta[chartData.teeth[this.selectedTooth]?.status || 'sound'].color}; text-transform:uppercase; font-weight:800;">
                ${this.conditionMeta[chartData.teeth[this.selectedTooth]?.status || 'sound'].icon} ${chartData.teeth[this.selectedTooth]?.status || 'Sound'}
              </span>
            </div>
          </div>

          <div>
            <h4 style="font-size:0.95rem; font-weight:800; margin-bottom:0.85rem;">
              Mark Clinical Condition & Damage for Tooth #${this.selectedTooth}:
            </h4>
            
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:0.65rem; margin-bottom:1.25rem;">
              <button class="btn btn-secondary btn-sm" style="border-left:4px solid var(--tooth-sound); font-weight:700;" onclick="ToothChartModule.setStatus('sound')">🟢 Sound / Healthy</button>
              <button class="btn btn-secondary btn-sm" style="border-left:4px solid var(--tooth-caries); font-weight:700;" onclick="ToothChartModule.setStatus('caries')">🔴 Caries (Decay)</button>
              <button class="btn btn-secondary btn-sm" style="border-left:4px solid var(--tooth-filling); font-weight:700;" onclick="ToothChartModule.setStatus('filling')">🔵 Amalgam / Composite</button>
              <button class="btn btn-secondary btn-sm" style="border-left:4px solid var(--tooth-crown); font-weight:700;" onclick="ToothChartModule.setStatus('crown')">🟡 Crown / Cap 👑</button>
              <button class="btn btn-secondary btn-sm" style="border-left:4px solid var(--tooth-rct); font-weight:700;" onclick="ToothChartModule.setStatus('rct')">🟣 Root Canal (RCT)</button>
              <button class="btn btn-secondary btn-sm" style="border-left:4px solid var(--tooth-implant); font-weight:700;" onclick="ToothChartModule.setStatus('implant')">🩵 Dental Implant 🔩</button>
              <button class="btn btn-secondary btn-sm" style="border-left:4px solid var(--tooth-extracted); font-weight:700;" onclick="ToothChartModule.setStatus('extracted')">⚪ Extracted / Missing ❌</button>
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
   * EXACT ANATOMICAL HORSESHOE ARCH HTML GENERATOR
   * Recreates the exact visual diagram: pink palatal & mandibular gum arch beds,
   * center arch labels ("Upper Dental Arch", "Lower Dental Arch"), radial perimeter numbers,
   * and 3D anatomical occlusal teeth.
   */
  renderExactAnatomicalArchHTML(chartData, teethList) {
    return `
      <div class="exact-horseshoe-container" style="
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        padding: 1.75rem 1rem;
        background: #ffffff;
        border-radius: var(--radius-xl);
        border: 1px solid var(--border-color);
        box-shadow: var(--shadow-sm);
      ">
        
        <!-- UPPER DENTAL ARCH (MAXILLARY #1 - #16) -->
        <div class="arch-box upper-arch-box" style="position:relative; width:480px; height:310px; display:flex; justify-content:center; align-items:center;">
          <!-- Pink Palatal Gum Arch Base -->
          <svg viewBox="0 0 500 320" style="position:absolute; inset:0; width:100%; height:100%; filter:drop-shadow(0 6px 14px rgba(225, 29, 72, 0.18));">
            <path d="M 70,290 C 60,110 180,25 250,25 C 320,25 440,110 430,290 C 370,290 320,250 250,250 C 180,250 130,290 70,290 Z" 
                  fill="url(#upperGumsGrad)" stroke="#f43f5e" stroke-width="2"/>
            
            <defs>
              <linearGradient id="upperGumsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#fca5a5" />
                <stop offset="50%" stop-color="#f43f5e" />
                <stop offset="100%" stop-color="#e11d48" />
              </linearGradient>
            </defs>

            <text x="250" y="150" text-anchor="middle" fill="#ffffff" font-size="15" font-weight="800" letter-spacing="0.5px">
              Upper Dental Arch
            </text>
          </svg>

          <!-- Upper Arch Teeth Placement along Parabolic Curve -->
          <div style="position:absolute; inset:0;">
            ${this.renderArchTeethElements(teethList.upper, chartData, true)}
          </div>
        </div>

        <div style="width:70%; height:1px; background:linear-gradient(90deg, transparent, var(--border-color), transparent);"></div>

        <!-- LOWER DENTAL ARCH (MANDIBULAR #32 - #17) -->
        <div class="arch-box lower-arch-box" style="position:relative; width:480px; height:310px; display:flex; justify-content:center; align-items:center;">
          <!-- Pink Mandibular Floor Gum Arch Base -->
          <svg viewBox="0 0 500 320" style="position:absolute; inset:0; width:100%; height:100%; filter:drop-shadow(0 6px 14px rgba(225, 29, 72, 0.18));">
            <path d="M 70,30 C 60,210 180,295 250,295 C 320,295 440,210 430,30 C 370,30 320,70 250,70 C 180,70 130,30 70,30 Z" 
                  fill="url(#lowerGumsGrad)" stroke="#f43f5e" stroke-width="2"/>
            
            <defs>
              <linearGradient id="lowerGumsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#e11d48" />
                <stop offset="50%" stop-color="#f43f5e" />
                <stop offset="100%" stop-color="#fca5a5" />
              </linearGradient>
            </defs>

            <text x="250" y="175" text-anchor="middle" fill="#ffffff" font-size="15" font-weight="800" letter-spacing="0.5px">
              Lower Dental Arch
            </text>
          </svg>

          <!-- Lower Arch Teeth Placement along Inverted Parabolic Curve -->
          <div style="position:absolute; inset:0;">
            ${this.renderArchTeethElements(teethList.lower, chartData, false)}
          </div>
        </div>

      </div>
    `;
  },

  renderArchTeethElements(teethArr, chartData, isUpper) {
    const total = teethArr.length;
    const centerX = 240;
    const centerY = isUpper ? 155 : 155;
    const radiusX = 175;
    const radiusY = 125;

    return teethArr.map((num, index) => {
      const angle = isUpper
        ? (index / (total - 1)) * (Math.PI * 0.90) - (Math.PI * 0.95)
        : (index / (total - 1)) * (Math.PI * 0.90) + (Math.PI * 0.05);

      const toothX = centerX + radiusX * Math.cos(angle);
      const toothY = centerY + radiusY * Math.sin(angle);

      const numRadiusX = radiusX + 32;
      const numRadiusY = radiusY + 28;
      const numX = centerX + numRadiusX * Math.cos(angle);
      const numY = centerY + numRadiusY * Math.sin(angle);

      const toothInfo = chartData.teeth[num] || { status: "sound" };
      const status = toothInfo.status || "sound";
      const meta = this.conditionMeta[status];
      const isSelected = this.selectedTooth == num ? "selected" : "";
      const isDamaged = status !== "sound";

      return `
        <div style="
          position: absolute;
          left: ${numX}px;
          top: ${numY}px;
          transform: translate(-50%, -50%);
          font-weight: 800;
          font-size: 0.85rem;
          color: ${isDamaged ? meta.color : 'var(--text-primary)'};
          user-select: none;
          z-index: 10;
        ">
          ${num}
        </div>

        <div class="horseshoe-tooth-node ${isSelected} ${isDamaged ? 'has-damage' : ''}"
             onclick="ToothChartModule.selectTooth('${num}')"
             style="
               position: absolute;
               left: ${toothX}px;
               top: ${toothY}px;
               transform: translate(-50%, -50%);
               width: 42px;
               height: 42px;
               cursor: pointer;
               z-index: 15;
             "
             title="Tooth #${num} (${this.getToothTypeLabel(num)}) — ${status.toUpperCase()}">
          ${this.generate3DOcclusalToothSVG(num, toothInfo)}
        </div>
      `;
    }).join("");
  },

  /**
   * 2D HORIZONTAL SEQUENTIAL TOOTH GRID GENERATOR
   * Renders horizontal sequential rows for Upper (#1-#16) and Lower (#32-#17) arches
   */
  render2DHorizontalSequentialGridHTML(chartData, teethList) {
    return `
      <div class="horizontal-grid-section" style="
        background: var(--bg-tertiary);
        padding: 1.25rem;
        border-radius: var(--radius-xl);
        border: 1px solid var(--border-color);
        margin-bottom: 1.5rem;
      ">
        <div style="font-size:0.9rem; font-weight:800; color:var(--text-primary); margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <span>📊 2D Sequential Tooth Grid</span>
          <span style="font-size:0.72rem; color:var(--text-muted); font-weight:600;">(Upper Arch #1–#16 & Lower Arch #32–#17 Rows)</span>
        </div>

        <!-- Upper Arch #1 - #16 Horizontal Card Row -->
        <div style="margin-bottom:1rem;">
          <div style="font-size:0.75rem; font-weight:800; color:var(--primary); margin-bottom:0.4rem;">
            ▲ UPPER ARCH (MAXILLARY #1 - #16)
          </div>
          <div class="horseshoe-2d-grid upper-row">
            ${this.renderTeethCards2D(teethList.upper, chartData)}
          </div>
        </div>

        <!-- Lower Arch #32 - #17 Horizontal Card Row -->
        <div>
          <div style="font-size:0.75rem; font-weight:800; color:var(--secondary); margin-bottom:0.4rem;">
            ▼ LOWER ARCH (MANDIBULAR #32 - #17)
          </div>
          <div class="horseshoe-2d-grid lower-row">
            ${this.renderTeethCards2D(teethList.lower, chartData)}
          </div>
        </div>
      </div>
    `;
  },

  renderTeethCards2D(teethArr, chartData) {
    return teethArr.map((num) => {
      const toothInfo = chartData.teeth[num] || { status: 'sound', surfaces: {} };
      const isSelected = this.selectedTooth == num ? 'selected' : '';
      const meta = this.conditionMeta[toothInfo.status || 'sound'];

      return `
        <div class="tooth-card ${isSelected} ${toothInfo.status !== 'sound' ? 'has-lesion' : ''}" 
             onclick="ToothChartModule.selectTooth('${num}')"
             data-tooth="${num}"
             style="border-color:${toothInfo.status !== 'sound' ? meta.color : 'var(--border-color)'}"
             title="Tooth #${num} (${this.getToothTypeLabel(num)}) — ${toothInfo.status || 'Sound'}">
          <div class="tooth-number" style="color:${toothInfo.status !== 'sound' ? meta.color : 'var(--text-muted)'}">#${num}</div>
          <div class="tooth-svg-wrap">
            ${this.generate3DOcclusalToothSVG(num, toothInfo)}
          </div>
          <div class="tooth-label" style="color:${meta.color}">${meta.icon} ${toothInfo.status || 'Sound'}</div>
        </div>
      `;
    }).join("");
  },

  generate3DOcclusalToothSVG(toothNum, toothInfo = {}, large = false) {
    const status = toothInfo.status || 'sound';
    const numStr = String(toothNum);
    const meta = this.conditionMeta[status] || this.conditionMeta.sound;

    const isMolar = ["1","2","3","14","15","16","17","18","19","30","31","32","A","B","I","J","K","L","S","T"].includes(numStr);
    const isPremolar = ["4","5","12","13","20","21","28","29","C","H","M","R"].includes(numStr);
    const isCanine = ["6","11","22","27"].includes(numStr);

    let crownPath = "";
    let occlusalFossa = "";

    if (isMolar) {
      crownPath = "M 18,10 C 35,5 65,5 82,10 C 95,25 95,75 82,90 C 65,95 35,95 18,90 C 5,75 5,25 18,10 Z";
      occlusalFossa = `
        <path d="M 25,25 Q 50,50 75,25 M 25,75 Q 50,50 75,75 M 50,20 L 50,80" stroke="#cbd5e1" stroke-width="2" fill="none" opacity="0.6"/>
        <circle cx="32" cy="30" r="4" fill="#94a3b8" opacity="0.4"/>
        <circle cx="68" cy="30" r="4" fill="#94a3b8" opacity="0.4"/>
        <circle cx="32" cy="70" r="4" fill="#94a3b8" opacity="0.4"/>
        <circle cx="68" cy="70" r="4" fill="#94a3b8" opacity="0.4"/>
      `;
    } else if (isPremolar) {
      crownPath = "M 22,12 C 40,6 60,6 78,12 C 92,30 92,70 78,88 C 60,94 40,94 22,88 C 8,70 8,30 22,12 Z";
      occlusalFossa = `
        <line x1="25" y1="50" x2="75" y2="50" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="30" cy="50" r="3" fill="#94a3b8" opacity="0.4"/>
        <circle cx="70" cy="50" r="3" fill="#94a3b8" opacity="0.4"/>
      `;
    } else if (isCanine) {
      crownPath = "M 50,6 L 86,40 C 90,65 75,92 50,94 C 25,92 10,65 14,40 Z";
      occlusalFossa = `
        <circle cx="50" cy="45" r="5" fill="#cbd5e1" opacity="0.5"/>
        <line x1="50" y1="20" x2="50" y2="80" stroke="#cbd5e1" stroke-width="2" opacity="0.5"/>
      `;
    } else {
      crownPath = "M 25,15 C 40,10 60,10 75,15 C 88,35 85,80 75,85 C 60,90 40,90 25,85 C 15,80 12,35 25,15 Z";
      occlusalFossa = `
        <line x1="25" y1="50" x2="75" y2="50" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
      `;
    }

    let damageOverlaySVG = "";
    if (status === "caries") {
      damageOverlaySVG = `
        <circle cx="50" cy="50" r="18" fill="#ef4444" opacity="0.88"/>
        <circle cx="50" cy="50" r="24" fill="none" stroke="#ef4444" stroke-width="3" stroke-dasharray="4 2"/>
      `;
    } else if (status === "filling") {
      damageOverlaySVG = `
        <rect x="32" y="32" width="36" height="36" rx="8" fill="#3b82f6" opacity="0.88"/>
      `;
    } else if (status === "crown") {
      damageOverlaySVG = `
        <path d="${crownPath}" fill="url(#goldCrownGrad)" opacity="0.95"/>
        <text x="50" y="58" font-size="20" text-anchor="middle">👑</text>
      `;
    } else if (status === "rct") {
      damageOverlaySVG = `
        <circle cx="50" cy="50" r="16" fill="#8b5cf6" opacity="0.9"/>
        <circle cx="50" cy="50" r="6" fill="#ffffff"/>
      `;
    } else if (status === "implant") {
      damageOverlaySVG = `
        <circle cx="50" cy="50" r="22" fill="#06b6d4" opacity="0.9"/>
        <text x="50" y="58" font-size="18" text-anchor="middle" fill="#fff">🔩</text>
      `;
    } else if (status === "extracted") {
      damageOverlaySVG = `
        <line x1="15" y1="15" x2="85" y2="85" stroke="#ef4444" stroke-width="6" stroke-linecap="round"/>
        <line x1="85" y1="15" x2="15" y2="85" stroke="#ef4444" stroke-width="6" stroke-linecap="round"/>
      `;
    }

    return `
      <svg class="occlusal-tooth-svg" viewBox="0 0 100 100" style="width:100%; height:100%; overflow:visible;">
        <defs>
          <linearGradient id="enamelGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="60%" stop-color="#f8fafc" />
            <stop offset="100%" stop-color="#e2e8f0" />
          </linearGradient>
          <linearGradient id="goldCrownGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#fde68a" />
            <stop offset="100%" stop-color="#d97706" />
          </linearGradient>
          <filter id="toothShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" flood-opacity="0.25"/>
          </filter>
        </defs>

        <path d="${crownPath}" fill="${status === 'extracted' ? '#cbd5e1' : 'url(#enamelGrad)'}" 
              stroke="${status !== 'sound' ? meta.color : '#475569'}" 
              stroke-width="${status !== 'sound' ? '3.5' : '2'}" 
              filter="url(#toothShadow)"/>

        ${status !== 'extracted' ? occlusalFossa : ''}
        ${damageOverlaySVG}
      </svg>
    `;
  },

  renderTreatmentSimulatorHTML(chartData) {
    const toothInfo = chartData.teeth[this.selectedTooth] || { status: "sound", notes: "" };
    const status = toothInfo.status || "sound";
    const cdtInfo = this.cdtDictionary[status] || this.cdtDictionary.sound;

    return `
      <div class="treatment-simulator-card" style="
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-xl);
        padding: 1.25rem;
        box-shadow: var(--shadow-sm);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      ">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <h3 style="font-size:1.05rem; font-weight:800; margin:0; display:flex; align-items:center; gap:0.5rem;">
              <span>⚡ Real-Time Treatment Simulator</span>
            </h3>
            <span class="procedure-cdt-badge">CDT ${cdtInfo.cdt}</span>
          </div>

          <div style="background:var(--bg-tertiary); padding:1rem; border-radius:var(--radius-lg); margin-bottom:1rem; border:1px solid var(--border-color);">
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">RECOMMENDED PROCEDURE</div>
            <div style="font-size:0.95rem; font-weight:800; color:var(--text-color); margin:0.25rem 0;">
              ${cdtInfo.name}
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary);">
              Target: <strong>Tooth #${this.selectedTooth} (${this.getToothTypeLabel(this.selectedTooth)})</strong>
            </div>
          </div>

          <div class="copay-breakdown-box">
            <div style="font-size:0.75rem; font-weight:800; color:var(--primary); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.6rem;">
              💳 INSURANCE & COPAY ESTIMATOR
            </div>

            <div class="copay-row">
              <span>Gross Fee (Standard ADA/CDT):</span>
              <strong>$${cdtInfo.fee.toFixed(2)}</strong>
            </div>
            <div class="copay-row" style="color:var(--success);">
              <span>Est. Insurance Coverage (80%):</span>
              <strong>-$${cdtInfo.insCov.toFixed(2)}</strong>
            </div>
            <div style="border-top:1px solid var(--border-color); margin:0.5rem 0;"></div>
            <div class="copay-row" style="font-size:0.95rem; color:var(--primary);">
              <span>Est. Patient Out-Of-Pocket Copay:</span>
              <strong style="font-size:1.1rem;">$${cdtInfo.copay.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        <div>
          <button class="btn btn-primary" style="width:100%; padding:12px; font-weight:800; font-size:0.9rem;" onclick="ToothChartModule.addSelectedToTreatmentPlan()">
            + Add Tooth #${this.selectedTooth} Procedure to Treatment Plan
          </button>
        </div>
      </div>
    `;
  },

  selectTooth(num) {
    this.selectedTooth = num;
    this.render(this.currentPatientId);
  },

  addSelectedToTreatmentPlan() {
    const chartData = store.getToothChart(this.currentPatientId);
    const toothInfo = chartData.teeth[this.selectedTooth] || { status: "sound" };
    const status = toothInfo.status || "sound";
    const cdtInfo = this.cdtDictionary[status] || this.cdtDictionary.sound;

    store.addTreatmentPlanItem(this.currentPatientId, {
      tooth: String(this.selectedTooth),
      cdtCode: cdtInfo.cdt,
      procedure: cdtInfo.name,
      cost: cdtInfo.fee,
      insuranceCoverage: cdtInfo.insCov,
      copay: cdtInfo.copay,
      status: "Planned"
    });

    app.showToast(`✅ Added ${cdtInfo.cdt} (${cdtInfo.name}) for Tooth #${this.selectedTooth} to Treatment Plan!`);

    app.openModal("📋 Procedure Added to Treatment Plan", `
      <div style="padding:0.5rem 0;">
        <div style="display:flex; align-items:center; gap:0.85rem; background:var(--primary-light); padding:1rem; border-radius:var(--radius-lg); margin-bottom:1.25rem; border:1px solid rgba(13, 148, 136, 0.25);">
          <div style="font-size:2.2rem; line-height:1;">🦷</div>
          <div>
            <div style="font-size:1.05rem; font-weight:800; color:var(--primary);">
              Tooth #${this.selectedTooth} (${this.getToothTypeLabel(this.selectedTooth)})
            </div>
            <div style="font-size:0.85rem; color:var(--text-secondary); font-weight:600;">
              Added CDT ${cdtInfo.cdt}: ${cdtInfo.name}
            </div>
          </div>
        </div>

        <div style="background:var(--bg-tertiary); padding:1rem; border-radius:var(--radius-lg); margin-bottom:1.5rem; border:1px solid var(--border-color);">
          <div style="font-size:0.75rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.6rem;">
            COST & INSURANCE ESTIMATE BREAKDOWN
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.88rem; margin-bottom:0.4rem;">
            <span>Standard ADA/CDT Gross Fee:</span> <strong>$${cdtInfo.fee.toFixed(2)}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.88rem; color:var(--success); margin-bottom:0.4rem;">
            <span>Est. Insurance Coverage (80%):</span> <strong>-$${cdtInfo.insCov.toFixed(2)}</strong>
          </div>
          <div style="border-top:1px solid var(--border-color); margin:0.5rem 0;"></div>
          <div style="display:flex; justify-content:space-between; font-size:0.95rem; color:var(--primary); font-weight:800;">
            <span>Patient Out-Of-Pocket Copay:</span> <strong style="font-size:1.1rem;">$${cdtInfo.copay.toFixed(2)}</strong>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
          <button class="btn btn-secondary" onclick="app.closeModal()">🦷 Continue Charting</button>
          <button class="btn btn-primary" style="font-weight:800;" onclick="app.closeModal(); app.navigateTo('treatment-plan');">
            📋 View Treatment Plan & Estimate ➔
          </button>
        </div>
      </div>
    `);
  },

  setStatus(status) {
    store.updateToothSurface(this.currentPatientId, this.selectedTooth, "all", status);
    app.showToast(`Tooth #${this.selectedTooth} status updated to ${status.toUpperCase()}`);
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

  getToothTypeLabel(toothNum) {
    const numStr = String(toothNum);
    if (["8","9","24","25","E","F","O","P"].includes(numStr)) return "Central Incisor";
    if (["7","10","23","26","D","G","N","Q"].includes(numStr)) return "Lateral Incisor";
    if (["6","11","22","27","C","H","M","R"].includes(numStr)) return "Canine (Cuspid)";
    if (["4","5","12","13","20","21","28","29"].includes(numStr)) return "Premolar (Bicuspid)";
    if (["1","2","3","14","15","16","17","18","19","30","31","32","A","B","I","J","K","L","S","T"].includes(numStr)) return "Molar";
    return "Tooth";
  },

  attachEvents() {
    const toggleBtn = document.getElementById("btn-toggle-chart-type");
    if (toggleBtn) {
      toggleBtn.onclick = () => {
        const chart = store.getToothChart(this.currentPatientId);
        chart.chartType = chart.chartType === "adult" ? "child" : "adult";
        this.chartType = chart.chartType;
        store.saveState();
        this.render(this.currentPatientId);
      };
    }
  }
};
