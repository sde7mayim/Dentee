/* ==========================================================================
   DENTEE - DENTAL PROCEDURES & CDT CODES CATALOG MODULE
   ========================================================================== */

const ProceduresModule = {
  render() {
    const container = document.getElementById("procedures-module");
    if (!container) return;

    const procedures = store.getProcedures();

    container.innerHTML = `
      <div class="page-title-bar">
        <div>
          <h1 class="page-title">Dental Procedures & Fee Schedule</h1>
          <div class="page-subtitle">CDT coded master catalog for treatments, costs, and chair durations</div>
        </div>
        <button class="btn btn-primary" onclick="ProceduresModule.openAddProcedureModal()">
          + Add New Procedure
        </button>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Master Procedure Catalog</h2>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>CDT Code</th>
                <th>Procedure Name</th>
                <th>Category</th>
                <th>Est. Duration</th>
                <th>Fee ($)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${procedures.map(p => `
                <tr>
                  <td><strong style="color:var(--primary);">${p.code}</strong></td>
                  <td><strong>${p.name}</strong></td>
                  <td><span class="badge badge-info">${p.category}</span></td>
                  <td>${p.duration} mins</td>
                  <td><strong style="color:var(--success);">$${p.cost.toFixed(2)}</strong></td>
                  <td>
                    <button class="btn btn-outline btn-sm" onclick="app.showToast('Selected ${p.code}')">
                      Select
                    </button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  openAddProcedureModal() {
    app.openModal("Add Dental Procedure", `
      <form id="new-proc-form" onsubmit="ProceduresModule.saveProcedure(event)">
        <div class="form-grid">
          <div class="form-group">
            <label>CDT Code *</label>
            <input type="text" class="form-control" name="code" placeholder="e.g. D2150" required>
          </div>
          <div class="form-group">
            <label>Procedure Name *</label>
            <input type="text" class="form-control" name="name" placeholder="e.g. Amalgam 2 Surfaces" required>
          </div>
          <div class="form-group">
            <label>Category *</label>
            <select class="form-control" name="category">
              <option value="Preventive">Preventive</option>
              <option value="Restorative">Restorative</option>
              <option value="Diagnostic">Diagnostic</option>
              <option value="Endodontic">Endodontic</option>
              <option value="Prosthodontics">Prosthodontics</option>
              <option value="Oral Surgery">Oral Surgery</option>
              <option value="Cosmetic">Cosmetic</option>
            </select>
          </div>
          <div class="form-group">
            <label>Standard Fee ($) *</label>
            <input type="number" class="form-control" name="cost" step="0.01" required placeholder="150.00">
          </div>
          <div class="form-group full-width">
            <label>Duration (Minutes)</label>
            <input type="number" class="form-control" name="duration" value="30">
          </div>
        </div>
        <div style="margin-top:1.5rem; display:flex; justify-content:flex-end; gap:0.75rem;">
          <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Procedure</button>
        </div>
      </form>
    `);
  },

  saveProcedure(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.cost = parseFloat(data.cost);
    data.duration = parseInt(data.duration, 10);

    store.addProcedure(data);
    app.closeModal();
    app.showToast(`Procedure ${data.code} added!`);
    this.render();
  }
};
