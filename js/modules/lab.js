/* ==========================================================================
   DENTEE - DENTAL LAB WORK ORDERS & PROSTHETICS MODULE
   ========================================================================== */

const LabModule = {
  render() {
    const container = document.getElementById("lab-module");
    if (!container) return;

    const labOrders = store.getLabOrders();

    container.innerHTML = `
      <div class="page-title-bar">
        <div>
          <h1 class="page-title">Dental Lab Orders & Prosthetics</h1>
          <div class="page-subtitle">Track crowns, bridges, dentures, aligners, and lab turnarounds</div>
        </div>
        <button class="btn btn-primary" onclick="LabModule.openNewOrderModal()">
          + Create Lab Work Order
        </button>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Active Dental Lab Cases</h2>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Order ID & Dates</th>
                <th>Patient & Doctor</th>
                <th>Prosthetic / Work Type</th>
                <th>Shade</th>
                <th>Dental Lab Partner</th>
                <th>Status Timeline</th>
                <th>Lab Cost</th>
              </tr>
            </thead>
            <tbody>
              ${labOrders.map(order => `
                <tr>
                  <td>
                    <strong>${order.id}</strong>
                    <div style="font-size:0.75rem; color:var(--text-muted);">Ordered: ${order.orderDate}</div>
                    <div style="font-size:0.75rem; color:var(--primary); font-weight:700;">Due: ${order.dueDate}</div>
                  </td>
                  <td>
                    <strong>${order.patientName}</strong>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${order.dentistName}</div>
                  </td>
                  <td><strong>${order.workType}</strong></td>
                  <td><span class="badge badge-secondary">${order.shade || 'A2'}</span></td>
                  <td>${order.labName}</td>
                  <td>
                    <span class="badge ${order.status === 'Ready for Fitting' ? 'badge-success' : 'badge-warning'}">
                      ${order.status}
                    </span>
                  </td>
                  <td><strong style="color:var(--danger);">$${order.cost.toFixed(2)}</strong></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  openNewOrderModal() {
    const patients = store.getPatients();
    const dentists = store.getDentists();

    app.openModal("Create Lab Work Order", `
      <form id="new-lab-form" onsubmit="LabModule.saveOrder(event)">
        <div class="form-grid">
          <div class="form-group">
            <label>Patient *</label>
            <select class="form-control" name="patientId" required>
              ${patients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join("")}
            </select>
          </div>
          <div class="form-group">
            <label>Ordering Dentist *</label>
            <select class="form-control" name="dentistName" required>
              ${dentists.map(d => `<option value="${d.name}">${d.name}</option>`).join("")}
            </select>
          </div>
          <div class="form-group">
            <label>Dental Lab Partner *</label>
            <input type="text" class="form-control" name="labName" required value="Apex Dental Prosthetics Lab">
          </div>
          <div class="form-group">
            <label>Work Type / Appliance *</label>
            <input type="text" class="form-control" name="workType" required placeholder="e.g. Zirconia Crown Tooth #14">
          </div>
          <div class="form-group">
            <label>VITA Tooth Shade *</label>
            <select class="form-control" name="shade">
              <option value="A1">A1 (Very Light)</option>
              <option value="A2" selected>A2 (Standard)</option>
              <option value="A3">A3 (Reddish-Brownish)</option>
              <option value="B1">B1 (Bleach Shade)</option>
              <option value="C2">C2 (Greyish)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Expected Due Date *</label>
            <input type="date" class="form-control" name="dueDate" required value="2026-08-04">
          </div>
          <div class="form-group full-width">
            <label>Lab Fee Cost ($)</label>
            <input type="number" class="form-control" name="cost" step="0.01" value="250.00">
          </div>
        </div>
        <div style="margin-top:1.5rem; display:flex; justify-content:flex-end; gap:0.75rem;">
          <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Dispatch Lab Order</button>
        </div>
      </form>
    `);
  },

  saveOrder(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const patient = store.getPatientById(data.patientId);
    data.patientName = patient ? patient.name : "Patient";
    data.cost = parseFloat(data.cost) || 0;

    store.addLabOrder(data);
    app.closeModal();
    app.showToast("Lab work order dispatched successfully!");
    this.render();
  }
};
