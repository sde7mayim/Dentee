/* ==========================================================================
   DENTEE - MULTI-CLINIC MANAGEMENT HUB MODULE
   Centralized multi-branch control, shared records, dentist allocation, and branch performance comparison
   ========================================================================== */

const MultiClinicModule = {
  activeBranchId: "BR-01",

  init() {
    this.render();
  },

  render() {
    const container = document.getElementById("multi-clinic-module");
    if (!container) return;

    const branches = store.getBranches();
    const staff = store.getStaff();
    const patients = store.getPatients();
    const appointments = store.getAppointments();

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <span class="badge badge-info" style="margin-bottom:0.4rem;">🏥 MULTI-BRANCH CLINIC OS</span>
            <h2 class="card-title">Multi-Clinic Management Hub</h2>
            <div class="page-subtitle">Centralized oversight of all clinic locations, staff allocations, and branch revenue performance.</div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="app.showToast('New Branch Setup Wizard launched!')">
            + Add New Branch Location
          </button>
        </div>

        <!-- Branch Comparison Metrics Cards -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem; margin-bottom:1.5rem;">
          ${branches.map(b => `
            <div class="card" style="border: 1px solid var(--border-color); background: var(--bg-surface); padding:1.25rem; position:relative; overflow:hidden;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
                <h3 style="font-size:1.05rem; font-weight:800;">${b.name}</h3>
                <span class="badge badge-success">${b.status}</span>
              </div>
              <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.75rem;">📍 ${b.address}</div>
              <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:0.5rem; background:var(--bg-body); padding:0.75rem; border-radius:6px; font-size:0.82rem;">
                <div>Dental Chairs: <strong>${b.chairsCount} Operatories</strong></div>
                <div>Branch Lead: <strong>${b.manager.split(' ')[1]}</strong></div>
                <div>Monthly Revenue: <strong style="color:var(--primary-color);">${b.revenueMonth}</strong></div>
                <div>Phone: <strong>${b.phone}</strong></div>
              </div>
              <div style="margin-top:0.75rem; display:flex; justify-content:flex-end;">
                <button class="btn btn-secondary btn-sm" onclick="MultiClinicModule.switchBranch('${b.id}', '${b.name}')">
                  ⚡ Switch Workspace Context
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Centralized Operations Overview -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap:1.5rem;">
          
          <!-- Shared Patient Records Directory -->
          <div class="card" style="border:1px solid var(--border-color); padding:1.25rem;">
            <h3 style="font-size:1rem; font-weight:700; margin-bottom:1rem;">👥 Cross-Branch Shared Patient Directory</h3>
            <div style="overflow-x:auto;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Registered Branch</th>
                    <th>Last Visit</th>
                  </tr>
                </thead>
                <tbody>
                  ${patients.map(p => `
                    <tr>
                      <td><strong>${p.name}</strong> (${p.id})</td>
                      <td><span class="badge badge-info">Beverly Hills HQ</span></td>
                      <td>${p.lastVisit}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Staff Allocation per Branch -->
          <div class="card" style="border:1px solid var(--border-color); padding:1.25rem;">
            <h3 style="font-size:1rem; font-weight:700; margin-bottom:1rem;">🩺 Centralized Staff Allocation</h3>
            <div style="display:flex; flex-direction:column; gap:0.75rem;">
              ${staff.map(s => `
                <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-body); padding:0.75rem 1rem; border-radius:6px;">
                  <div>
                    <div style="font-weight:700; font-size:0.88rem;">${s.avatar} ${s.name}</div>
                    <div style="font-size:0.78rem; color:var(--text-muted);">${s.role}</div>
                  </div>
                  <span class="badge badge-secondary">${s.branchName}</span>
                </div>
              `).join('')}
            </div>
          </div>

        </div>
      </div>
    `;
  },

  switchBranch(branchId, branchName) {
    this.activeBranchId = branchId;
    app.showToast(`Switched active clinic context to ${branchName}!`);
  }
};
