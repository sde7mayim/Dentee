/* ==========================================================================
   DENTEE - CRM, PATIENT RECALL & ENGAGEMENT MODULE
   ========================================================================== */

const CrmModule = {
  render() {
    const container = document.getElementById("crm-module");
    if (!container) return;

    const crmLogs = store.getCrmLogs();

    container.innerHTML = `
      <div class="page-title-bar">
        <div>
          <h1 class="page-title">Patient CRM & Recall System</h1>
          <div class="page-subtitle">Automated hygiene reminders, post-op checkup calls, SMS/Email logs</div>
        </div>
        <button class="btn btn-primary" onclick="CrmModule.openSendCampaignModal()">
          + Send Patient Recall / SMS
        </button>
      </div>

      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header">
          <h2 class="card-title">📅 Automated Preventive Care & Recall Schedules</h2>
          <button class="btn btn-secondary btn-sm" onclick="app.showToast('Automated recall rule engine triggered!')">
            ⚡ Run Recall Engine
          </button>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:1rem; padding:0.5rem 0;">
          ${store.getRecalls().map(r => `
            <div style="background:var(--bg-body); border:1px solid var(--border-color); padding:1rem; border-radius:8px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem;">
                <strong style="font-size:0.9rem;">${r.patientName}</strong>
                <span class="badge badge-info">${r.channel}</span>
              </div>
              <div style="font-size:0.82rem; color:var(--primary-color); font-weight:700;">🎯 ${r.type}</div>
              <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.3rem;">Due Date: ${r.dueDate} | Phone: ${r.phone}</div>
              <div style="margin-top:0.6rem; display:flex; justify-content:flex-end;">
                <button class="btn btn-primary btn-sm" onclick="app.shareViaWhatsApp('${r.patientName}', 'Reminder: Your ${r.type} is due on ${r.dueDate}. Reply to confirm your slot!')">
                  📲 Dispatch ${r.channel} Reminder
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Patient Outreach & Notification Audit Log</h2>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Log ID & Date</th>
                <th>Patient Name</th>
                <th>Outreach Type</th>
                <th>Channel</th>
                <th>Outreach Message</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${crmLogs.map(log => `
                <tr>
                  <td>
                    <strong>${log.id}</strong>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${log.date}</div>
                  </td>
                  <td><strong>${log.patientName}</strong></td>
                  <td><span class="badge badge-info">${log.type}</span></td>
                  <td><strong>${log.channel}</strong></td>
                  <td style="max-width:320px; font-size:0.85rem;">${log.message}</td>
                  <td>
                    <span class="badge badge-success">${log.status}</span>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  openSendCampaignModal() {
    const patients = store.getPatients();

    app.openModal("Send Patient Outreach / SMS Recall", `
      <form id="new-crm-form" onsubmit="CrmModule.saveLog(event)">
        <div class="form-grid">
          <div class="form-group">
            <label>Recipient Patient *</label>
            <select class="form-control" name="patientName" required>
              ${patients.map(p => `<option value="${p.name}">${p.name} (${p.phone})</option>`).join("")}
            </select>
          </div>
          <div class="form-group">
            <label>Outreach Campaign Type *</label>
            <select class="form-control" name="type">
              <option value="6-Month Hygiene Recall">6-Month Hygiene Recall</option>
              <option value="Post-op Followup">Post-op Followup Call</option>
              <option value="Appointment Confirmation">Appointment Confirmation</option>
              <option value="Birthday Greeting">Birthday Greeting</option>
            </select>
          </div>
          <div class="form-group">
            <label>Delivery Channel *</label>
            <select class="form-control" name="channel">
              <option value="SMS">SMS Text Message</option>
              <option value="Email">Email</option>
              <option value="Call">Phone Call</option>
              <option value="WhatsApp">WhatsApp</option>
            </select>
          </div>
          <div class="form-group full-width">
            <label>Message Content *</label>
            <textarea class="form-control" name="message" rows="3" required placeholder="Type SMS recall message..."></textarea>
          </div>
        </div>
        <div style="margin-top:1.5rem; display:flex; justify-content:flex-end; gap:0.75rem;">
          <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Dispatch Message</button>
        </div>
      </form>
    `);
  },

  saveLog(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    store.addCrmLog(data);
    app.closeModal();
    app.showToast(`Outreach message sent to ${data.patientName}!`);
    this.render();
  }
};
