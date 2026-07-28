/* ==========================================================================
   DENTEE - APPOINTMENTS & CHAIR QUEUE MANAGEMENT MODULE
   ========================================================================== */

const AppointmentsModule = {
  render() {
    const container = document.getElementById("appointments-module");
    if (!container) return;

    const appointments = store.getAppointments();

    container.innerHTML = `
      <div class="page-title-bar">
        <div>
          <h1 class="page-title">Appointment Scheduler & Queue</h1>
          <div class="page-subtitle">Manage patient chair bookings, operatory status, and dental flow</div>
        </div>
        <button class="btn btn-primary" onclick="AppointmentsModule.openNewAppointmentModal()">
          + Book Appointment
        </button>
      </div>

      <div class="grid-stats">
        <div class="stat-card">
          <div class="stat-icon teal">📅</div>
          <div>
            <div class="stat-val">${appointments.length}</div>
            <div class="stat-label">Total Appointments Today</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon emerald">🪑</div>
          <div>
            <div class="stat-val">${appointments.filter(a => a.status === 'In-Chair').length}</div>
            <div class="stat-label">Currently In-Chair</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon amber">⏳</div>
          <div>
            <div class="stat-val">${appointments.filter(a => a.status === 'Checked-In').length}</div>
            <div class="stat-label">Waiting in Lounge</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Today's Appointment Queue</h2>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Time & ID</th>
                <th>Patient</th>
                <th>Dentist & Chair</th>
                <th>Procedure</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${appointments.map(apt => `
                <tr>
                  <td>
                    <strong>${apt.time}</strong>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${apt.id}</div>
                  </td>
                  <td>
                    <strong>${apt.patientName}</strong>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${apt.patientId}</div>
                  </td>
                  <td>
                    <div>${apt.dentistName}</div>
                    <div style="font-size:0.75rem; color:var(--primary); font-weight:700;">${apt.chair}</div>
                  </td>
                  <td>${apt.procedure}</td>
                  <td>
                    <span class="badge ${this.getStatusBadge(apt.status)}">${apt.status}</span>
                  </td>
                  <td>
                    <select class="form-control" style="padding:0.3rem 0.5rem; font-size:0.8rem; width:auto;"
                      onchange="AppointmentsModule.changeStatus('${apt.id}', this.value)">
                      <option value="Scheduled" ${apt.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
                      <option value="Checked-In" ${apt.status === 'Checked-In' ? 'selected' : ''}>Checked-In</option>
                      <option value="In-Chair" ${apt.status === 'In-Chair' ? 'selected' : ''}>In-Chair</option>
                      <option value="Completed" ${apt.status === 'Completed' ? 'selected' : ''}>Completed</option>
                      <option value="Cancelled" ${apt.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  getStatusBadge(status) {
    switch (status) {
      case "Completed": return "badge-success";
      case "In-Chair": return "badge-danger";
      case "Checked-In": return "badge-warning";
      case "Scheduled": return "badge-info";
      default: return "badge-secondary";
    }
  },

  changeStatus(id, newStatus) {
    store.updateAppointmentStatus(id, newStatus);
    app.showToast(`Appointment ${id} status updated to ${newStatus}`);
    this.render();
  },

  openNewAppointmentModal() {
    const patients = store.getPatients();
    const dentists = store.getDentists();
    const procedures = store.getProcedures();

    app.openModal("Book Dental Appointment", `
      <form id="new-apt-form" onsubmit="AppointmentsModule.saveAppointment(event)">
        <div class="form-grid">
          <div class="form-group">
            <label>Select Patient *</label>
            <select class="form-control" name="patientId" required>
              ${patients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join("")}
            </select>
          </div>
          <div class="form-group">
            <label>Attending Dentist *</label>
            <select class="form-control" name="dentistId" required>
              ${dentists.map(d => `<option value="${d.id}">${d.name} (${d.chair})</option>`).join("")}
            </select>
          </div>
          <div class="form-group">
            <label>Appointment Date *</label>
            <input type="date" class="form-control" name="date" value="${new Date().toISOString().split("T")[0]}" required>
          </div>
          <div class="form-group">
            <label>Appointment Time *</label>
            <input type="time" class="form-control" name="time" value="10:00" required>
          </div>
          <div class="form-group full-width">
            <label>Procedure to Perform *</label>
            <select class="form-control" name="procedure" required>
              ${procedures.map(pr => `<option value="${pr.code} - ${pr.name}">${pr.code} - ${pr.name} ($${pr.cost})</option>`).join("")}
            </select>
          </div>
          <div class="form-group full-width">
            <label>Clinical Notes / Chair Prep</label>
            <textarea class="form-control" name="notes" rows="2" placeholder="Special requirements, pre-medication notes..."></textarea>
          </div>
        </div>
        <div style="margin-top:1.5rem; display:flex; justify-content:flex-end; gap:0.75rem;">
          <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Confirm Booking</button>
        </div>
      </form>
    `);
  },

  saveAppointment(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const patient = store.getPatientById(data.patientId);
    const dentist = store.getDentists().find(d => d.id === data.dentistId);

    const aptObj = {
      patientId: data.patientId,
      patientName: patient ? patient.name : "Patient",
      dentistId: data.dentistId,
      dentistName: dentist ? dentist.name : "Dentist",
      chair: dentist ? dentist.chair : "Chair 1",
      date: data.date,
      time: data.time,
      procedure: data.procedure,
      notes: data.notes || ""
    };

    store.addAppointment(aptObj);
    app.closeModal();
    app.showToast("Appointment booked successfully!");
    this.render();
  }
};
