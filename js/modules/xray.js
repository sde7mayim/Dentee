/* ==========================================================================
   DENTEE - X-RAY & RADIOGRAPH IMAGE INSPECTION STUDIO MODULE
   Canvas image filter controls (brightness, contrast, invert, zoom, annotations)
   ========================================================================== */

const XRayModule = {
  currentXRayIndex: 0,
  brightness: 100,
  contrast: 100,
  invert: false,
  zoom: 1,

  render() {
    const container = document.getElementById("xray-module");
    if (!container) return;

    const xrays = store.getXRays();
    const currentXR = xrays[this.currentXRayIndex] || xrays[0];

    container.innerHTML = `
      <div class="page-title-bar">
        <div>
          <h1 class="page-title">X-Ray & Radiograph Studio</h1>
          <div class="page-subtitle">Interactive Dental Imaging, contrast enhancement, and radiographic notes</div>
        </div>
        <button class="btn btn-primary" onclick="XRayModule.openUploadModal()">
          + Upload X-Ray Scan
        </button>
      </div>

      <div class="xray-studio-layout">
        <div class="xray-viewport">
          <div class="xray-canvas-container">
            <canvas id="xrayCanvas" width="700" height="420"></canvas>
          </div>
          <div style="position:absolute; bottom:12px; left:12px; background:rgba(0,0,0,0.7); color:white; padding:4px 10px; border-radius:4px; font-size:0.75rem;">
            ${currentXR ? `${currentXR.patientName} (${currentXR.type}) - ${currentXR.date}` : "No Image Loaded"}
          </div>
        </div>

        <div class="xray-controls">
          <h3 style="font-size:1rem; font-weight:800; border-bottom:1px solid var(--border-color); padding-bottom:0.5rem;">
            Imaging Adjustments
          </h3>

          <div class="slider-group">
            <label><span>Brightness</span> <span id="val-brightness">${this.brightness}%</span></label>
            <input type="range" min="30" max="200" value="${this.brightness}" oninput="XRayModule.updateFilter('brightness', this.value)">
          </div>

          <div class="slider-group">
            <label><span>Contrast</span> <span id="val-contrast">${this.contrast}%</span></label>
            <input type="range" min="30" max="250" value="${this.contrast}" oninput="XRayModule.updateFilter('contrast', this.value)">
          </div>

          <div class="slider-group">
            <label><span>Digital Zoom</span> <span id="val-zoom">${Math.round(this.zoom * 100)}%</span></label>
            <input type="range" min="1" max="3" step="0.1" value="${this.zoom}" oninput="XRayModule.updateFilter('zoom', this.value)">
          </div>

          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn btn-secondary btn-sm" onclick="XRayModule.toggleInvert()">
              ${this.invert ? '✓ Color Inverted' : 'Invert (Negative)'}
            </button>
            <button class="btn btn-secondary btn-sm" onclick="XRayModule.resetFilters()">
              Reset Sliders
            </button>
          </div>

          <div style="margin-top:0.5rem; border-top:1px solid var(--border-color); padding-top:0.75rem;">
            <h4 style="font-size:0.85rem; font-weight:700;">Diagnostic Notes:</h4>
            <p style="font-size:0.82rem; color:var(--text-secondary); margin-top:0.3rem;">
              ${currentXR ? currentXR.notes : "No diagnostic notes attached."}
            </p>
          </div>

          <div style="margin-top:auto;">
            <label style="font-size:0.8rem; font-weight:700;">Switch Patient X-Ray:</label>
            <select class="form-control" onchange="XRayModule.selectXRay(this.value)">
              ${xrays.map((xr, idx) => `
                <option value="${idx}" ${this.currentXRayIndex === idx ? 'selected' : ''}>${xr.patientName} - ${xr.type}</option>
              `).join("")}
            </select>
          </div>
        </div>
      </div>
    `;

    this.initCanvas(currentXR ? currentXR.image : null);
  },

  initCanvas(imgSrc) {
    const canvas = document.getElementById("xrayCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    if (!imgSrc) {
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#fff";
      ctx.font = "16px sans-serif";
      ctx.fillText("No X-Ray Image Selected", 230, 210);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      // Apply CSS Filters directly to canvas context
      let filterStr = `brightness(${this.brightness}%) contrast(${this.contrast}%)`;
      if (this.invert) {
        filterStr += ` invert(100%)`;
      }
      ctx.filter = filterStr;

      // Draw Image with Zoom scale
      const w = canvas.width * this.zoom;
      const h = canvas.height * this.zoom;
      const x = (canvas.width - w) / 2;
      const y = (canvas.height - h) / 2;

      ctx.drawImage(img, x, y, w, h);
      ctx.restore();
    };

    // Fallback if image CORS fails
    img.onerror = () => {
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00a896";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("Simulated Dental Radiograph Scan", 180, 180);
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "14px sans-serif";
      ctx.fillText("Tooth #14 Occlusal Caries Diagnostic Series", 190, 220);
    };

    img.src = imgSrc;
  },

  updateFilter(type, val) {
    if (type === "brightness") this.brightness = val;
    if (type === "contrast") this.contrast = val;
    if (type === "zoom") this.zoom = val;

    const elVal = document.getElementById(`val-${type}`);
    if (elVal) elVal.innerText = type === 'zoom' ? `${Math.round(val * 100)}%` : `${val}%`;

    const xrays = store.getXRays();
    const currentXR = xrays[this.currentXRayIndex];
    if (currentXR) this.initCanvas(currentXR.image);
  },

  toggleInvert() {
    this.invert = !this.invert;
    this.render();
  },

  resetFilters() {
    this.brightness = 100;
    this.contrast = 100;
    this.invert = false;
    this.zoom = 1;
    this.render();
  },

  selectXRay(index) {
    this.currentXRayIndex = parseInt(index, 10);
    this.resetFilters();
  },

  openUploadModal() {
    const patients = store.getPatients();
    app.openModal("Upload Patient Dental X-Ray", `
      <form id="upload-xray-form" onsubmit="XRayModule.saveXRay(event)">
        <div class="form-grid">
          <div class="form-group">
            <label>Patient *</label>
            <select class="form-control" name="patientId" required>
              ${patients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join("")}
            </select>
          </div>
          <div class="form-group">
            <label>Radiograph Type *</label>
            <select class="form-control" name="type">
              <option value="Bitewing Radiograph">Bitewing Radiograph</option>
              <option value="Panoramic OPG">Panoramic OPG</option>
              <option value="Periapical X-Ray">Periapical X-Ray</option>
              <option value="3D CBCT Scan">3D CBCT Scan</option>
            </select>
          </div>
          <div class="form-group full-width">
            <label>X-Ray Image URL (or sample scan) *</label>
            <input type="url" class="form-control" name="image" required value="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80">
          </div>
          <div class="form-group full-width">
            <label>Radiographic Notes</label>
            <textarea class="form-control" name="notes" rows="2" placeholder="Clinical findings, bone density notes..."></textarea>
          </div>
        </div>
        <div style="margin-top:1.5rem; display:flex; justify-content:flex-end; gap:0.75rem;">
          <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Upload & Save Scan</button>
        </div>
      </form>
    `);
  },

  saveXRay(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const patient = store.getPatientById(data.patientId);
    data.patientName = patient ? patient.name : "Patient";

    store.addXRay(data);
    app.closeModal();
    app.showToast("X-Ray scan uploaded successfully!");
    this.currentXRayIndex = 0;
    this.render();
  }
};
