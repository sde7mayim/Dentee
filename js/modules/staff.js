/* ==========================================================================
   DENTEE - STAFF & DENTIST MANAGEMENT MODULE
   Roster management, roles & permissions, duty shift schedules, and leave tracking
   ========================================================================== */

const StaffModule = {
  init() {
    this.render();
  },

  render() {
    const container = document.getElementById("staff-module");
    if (!container) return;

    const staffList = store.getStaff();

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title"><span class="icon">👨⚕️</span> Staff & Dentist Management</h2>
            <div class="page-subtitle">Manage clinic dentists, hygienists, assistants, receptionists, duty schedules, and roles.</div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="StaffModule.openAddStaffModal()">
            + Add Staff Member
          </button>
        </div>

        <!-- Role Summary Cards -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
          <div class="card" style="text-align:center; padding:1rem; background:var(--bg-body);">
            <div style="font-size:1.5rem;">👨⚕️</div>
            <div style="font-size:1.3rem; font-weight:800; color:var(--primary-color);">4 Dentists</div>
            <div style="font-size:0.78rem; color:var(--text-muted);">Specialists & Surgeons</div>
          </div>
          <div class="card" style="text-align:center; padding:1rem; background:var(--bg-body);">
            <div style="font-size:1.5rem;">🩺</div>
            <div style="font-size:1.3rem; font-weight:800; color:var(--primary-color);">1 Hygienist</div>
            <div style="font-size:0.78rem; color:var(--text-muted);">Preventive Hygiene</div>
          </div>
          <div class="card" style="text-align:center; padding:1rem; background:var(--bg-body);">
            <div style="font-size:1.5rem;">🥼</div>
            <div style="font-size:1.3rem; font-weight:800; color:var(--primary-color);">1 Assistant</div>
            <div style="font-size:0.78rem; color:var(--text-muted);">Chairside Support</div>
          </div>
          <div class="card" style="text-align:center; padding:1rem; background:var(--bg-body);">
            <div style="font-size:1.5rem;">👩💼</div>
            <div style="font-size:1.3rem; font-weight:800; color:var(--primary-color);">1 Receptionist</div>
            <div style="font-size:0.78rem; color:var(--text-muted);">Front Desk Coordinator</div>
          </div>
        </div>

        <!-- Staff Roster Table -->
        <div style="overflow-x:auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Role & Category</th>
                <th>Branch Location</th>
                <th>Duty Schedule</th>
                <th>Status</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${staffList.map(s => `
                <tr>
                  <td>
                    <div style="display:flex; align-items:center; gap:0.75rem;">
                      <div style="font-size:1.5rem;">${s.avatar}</div>
                      <div>
                        <div style="font-weight:700;">${s.name}</div>
                        <div style="font-size:0.78rem; color:var(--text-muted);">${s.email} | ${s.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style="font-weight:600;">${s.role}</div>
                    <span class="badge badge-info" style="font-size:0.7rem;">${s.type}</span>
                  </td>
                  <td>${s.branchName}</td>
                  <td><span style="font-family:monospace; font-size:0.8rem;">${s.schedule}</span></td>
                  <td><span class="badge badge-success">${s.status}</span></td>
                  <td style="text-align:right;">
                    <button class="btn btn-secondary btn-sm" onclick="app.showToast('Updated schedule for ${s.name}')">🗓️ Shift</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  openAddStaffModal() {
    const bodyHTML = `
      <form onsubmit="StaffModule.handleAddStaff(event)">
        <div class="form-group" style="margin-bottom:1rem;">
          <label>Full Name:</label>
          <input type="text" id="staff-name" class="form-control" placeholder="e.g. Dr. Arthur Pendelton" required>
        </div>
        <div class="form-group" style="margin-bottom:1rem;">
          <label>Role Designation:</label>
          <input type="text" id="staff-role" class="form-control" placeholder="e.g. Pediatric Dentist Specialist" required>
        </div>
        <div class="form-group" style="margin-bottom:1rem;">
          <label>Category:</label>
          <select id="staff-type" class="form-control">
            <option value="Dentist">Dentist</option>
            <option value="Hygienist">Hygienist</option>
            <option value="Assistant">Dental Assistant</option>
            <option value="Receptionist">Receptionist</option>
          </select>
        </div>
        <div class="form-group" style="margin-bottom:1rem;">
          <label>Email & Phone:</label>
          <input type="email" id="staff-email" class="form-control" placeholder="doctor@dentee.com" required>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
          <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Add Staff Member</button>
        </div>
      </form>
    `;
    app.openModal("Add New Clinic Staff Member", bodyHTML);
  },

  handleAddStaff(e) {
    e.preventDefault();
    const name = document.getElementById("staff-name").value;
    const role = document.getElementById("staff-role").value;
    const type = document.getElementById("staff-type").value;
    const email = document.getElementById("staff-email").value;

    store.addStaffMember({
      name: name,
      role: role,
      type: type,
      branchId: "BR-01",
      branchName: "Beverly Hills Central",
      email: email,
      phone: "+1 (555) 000-1122",
      schedule: "Mon-Fri (09:00 AM - 05:00 PM)",
      avatar: type === "Dentist" ? "👨⚕️" : "🩺"
    });

    app.closeModal();
    app.showToast(`Staff member ${name} added to roster!`);
    this.render();
  }
};
