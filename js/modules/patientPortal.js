/* ==========================================================================
   DENTEE - PATIENT PORTAL & MOBILE APPLICATION MODULE
   Secure patient self-service portal for accessing records, X-Rays, prescriptions, and paying bills
   High-Contrast VetCastle Dark Pine Green & Neon Lime Theme
   ========================================================================== */

const PatientPortalModule = {
  currentPatientId: "P-1001",

  init() {
    this.render();
  },

  render(patientId = app.currentPatientId) {
    this.currentPatientId = patientId;
    const container = document.getElementById("patient-portal-module");
    if (!container) return;

    const patient = store.getPatientById(patientId) || store.getPatients()[0];
    const appointments = store.getAppointments().filter(a => a.patientId === patient.id);
    const prescriptions = store.getPrescriptions().filter(p => p.patientId === patient.id);
    const xrays = store.getXRays().filter(x => x.patientId === patient.id);
    const invoices = store.getInvoices().filter(i => i.patientId === patient.id);

    container.innerHTML = `
      <div style="max-width:1000px; margin:0 auto;">
        
        <!-- VetCastle High-Contrast Patient Portal Top Banner -->
        <div style="
          background: linear-gradient(135deg, #09221d 0%, #0d332b 100%) !important;
          color: #ffffff !important;
          padding: 1.6rem 1.75rem;
          border-radius: var(--radius-xl);
          border: 1px solid #14352e;
          box-shadow: 0 12px 32px rgba(9, 34, 29, 0.25);
          margin-bottom: 1.5rem;
        ">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
            <div style="display:flex; align-items:center; gap:1.25rem;">
              <div style="font-size:2.5rem; background:rgba(192, 235, 56, 0.15); width:64px; height:64px; border-radius:50%; border:2px solid #c0eb38; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                ${patient.avatar || '👤'}
              </div>
              <div>
                <div style="display:inline-block; background:#c0eb38 !important; color:#09221d !important; font-weight:900 !important; padding:3px 10px; border-radius:6px; font-size:0.72rem; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.35rem;">
                  PATIENT SELF-SERVICE PORTAL
                </div>
                <h2 style="margin:0.25rem 0 0.15rem 0; font-weight:900; color:#ffffff !important; font-size:1.5rem; letter-spacing:-0.3px;">
                  Welcome, ${patient.name}
                </h2>
                <div style="font-size:0.85rem; color:#a3b8b0 !important; font-weight:700;">
                  Patient ID: ${patient.id} | Phone: ${patient.phone} | Blood: ${patient.bloodGroup || 'O+'}
                </div>
              </div>
            </div>
            <button class="btn" style="
              background: #c0eb38 !important;
              color: #09221d !important;
              border: none;
              font-weight: 900 !important;
              font-size: 0.88rem;
              padding: 0.65rem 1.25rem;
              box-shadow: 0 4px 14px rgba(192, 235, 56, 0.3);
              cursor: pointer;
            " onclick="AppointmentsModule.openNewAppointmentModal('${patient.id}')">
              🗓️ Book New Appointment
            </button>
          </div>
        </div>

        <!-- Quick Metrics Cards -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
          <div class="card" style="text-align:center; padding:1.25rem; border-top:4px solid #0d332b;">
            <div style="font-size:1.8rem;">📅</div>
            <div style="font-size:1.4rem; font-weight:900; color:#09221d;">${appointments.length}</div>
            <div style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">Upcoming & Past Visits</div>
          </div>
          <div class="card" style="text-align:center; padding:1.25rem; border-top:4px solid #10b981;">
            <div style="font-size:1.8rem;">💊</div>
            <div style="font-size:1.4rem; font-weight:900; color:#09221d;">${prescriptions.length}</div>
            <div style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">Active Prescriptions</div>
          </div>
          <div class="card" style="text-align:center; padding:1.25rem; border-top:4px solid #3b82f6;">
            <div style="font-size:1.8rem;">🩻</div>
            <div style="font-size:1.4rem; font-weight:900; color:#09221d;">${xrays.length}</div>
            <div style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">Dental Scans & Radiographs</div>
          </div>
          <div class="card" style="text-align:center; padding:1.25rem; border-top:4px solid ${patient.balance > 0 ? '#ef4444' : '#10b981'};">
            <div style="font-size:1.8rem;">💳</div>
            <div style="font-size:1.4rem; font-weight:900; color:${patient.balance > 0 ? '#ef4444' : '#10b981'};">$${patient.balance.toFixed(2)}</div>
            <div style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">Outstanding Balance</div>
          </div>
        </div>

        <!-- Portal Tabs Section -->
        <div class="card">
          <div class="card-header" style="border-bottom:1px solid var(--border-color); padding-bottom:0.75rem; margin-bottom:1rem;">
            <h3 class="card-title" style="color:#09221d; font-weight:900;">My Health & Dental Record</h3>
          </div>

          <div style="margin-bottom:1rem; border-bottom:1px solid var(--border-color); display:flex; gap:0.5rem; overflow-x:auto; padding-bottom:0.5rem;" id="portal-tab-header">
            <button class="btn btn-secondary btn-sm active" onclick="PatientPortalModule.switchTab('apts', this)">Appointments</button>
            <button class="btn btn-secondary btn-sm" onclick="PatientPortalModule.switchTab('rx', this)">Prescriptions (Rx)</button>
            <button class="btn btn-secondary btn-sm" onclick="PatientPortalModule.switchTab('scans', this)">X-Rays & Imaging</button>
            <button class="btn btn-secondary btn-sm" onclick="PatientPortalModule.switchTab('bills', this)">Invoices & Pay Online</button>
          </div>

          <!-- Tab Content: Appointments -->
          <div id="portal-tab-apts">
            ${appointments.length === 0 ? '<p style="color:var(--text-muted);">No appointment records found.</p>' : `
              <div style="display:flex; flex-direction:column; gap:0.75rem;">
                ${appointments.map(a => `
                  <div style="display:flex; justify-content:space-between; align-items:center; padding:1rem; background:var(--bg-tertiary); border-radius:8px; border:1px solid var(--border-color);">
                    <div>
                      <div style="font-weight:800; font-size:0.95rem; color:#09221d;">${a.procedure}</div>
                      <div style="font-size:0.8rem; color:var(--text-muted);">Doctor: ${a.dentistName} | Chair: ${a.chair}</div>
                      <div style="font-size:0.8rem; color:#0d332b; font-weight:700; margin-top:0.2rem;">🗓️ ${a.date} at ${a.time}</div>
                    </div>
                    <span class="badge ${a.status === 'Completed' ? 'badge-success' : 'badge-info'}" style="font-weight:800;">${a.status}</span>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Tab Content: Prescriptions -->
          <div id="portal-tab-rx" style="display:none;">
            ${prescriptions.length === 0 ? '<p style="color:var(--text-muted);">No digital prescriptions found.</p>' : `
              <div style="display:flex; flex-direction:column; gap:1rem;">
                ${prescriptions.map(r => `
                  <div style="border:1px solid var(--border-color); padding:1rem; border-radius:8px; background:var(--bg-tertiary);">
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                      <strong style="color:#09221d;">Rx ID: ${r.id} (${r.date})</strong>
                      <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">Doctor: ${r.dentistName}</span>
                    </div>
                    <ul style="padding-left:1.25rem; font-size:0.85rem; margin:0 0 0.5rem 0; color:#09221d;">
                      ${r.medications.map(m => `<li><strong>${m.name}</strong> - ${m.dosage} ${m.frequency} for ${m.duration} (${m.instructions})</li>`).join('')}
                    </ul>
                    <div style="display:flex; gap:0.5rem;">
                      <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Print Rx</button>
                      <button class="btn btn-secondary btn-sm" onclick="app.shareViaWhatsApp('${r.patientName}', 'Rx ${r.id}: ${r.medications.map(m=>m.name).join(', ')}')">📱 WhatsApp Share</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Tab Content: Scans -->
          <div id="portal-tab-scans" style="display:none;">
            ${xrays.length === 0 ? '<p style="color:var(--text-muted);">No dental imaging scans found.</p>' : `
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:1rem;">
                ${xrays.map(x => `
                  <div style="border:1px solid var(--border-color); border-radius:8px; overflow:hidden; background:var(--bg-tertiary);">
                    <img src="${x.image}" style="width:100%; height:140px; object-fit:cover;" alt="${x.type}">
                    <div style="padding:0.75rem;">
                      <div style="font-weight:800; font-size:0.85rem; color:#09221d;">${x.type}</div>
                      <div style="font-size:0.75rem; color:var(--text-muted);">${x.date}</div>
                      <div style="font-size:0.78rem; margin-top:0.4rem; color:#09221d;">${x.notes}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Tab Content: Invoices & Online Payment -->
          <div id="portal-tab-bills" style="display:none;">
            ${invoices.length === 0 ? '<p style="color:var(--text-muted);">No invoices found.</p>' : `
              <div style="display:flex; flex-direction:column; gap:1rem;">
                ${invoices.map(inv => `
                  <div style="display:flex; justify-content:space-between; align-items:center; padding:1rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-tertiary); flex-wrap:wrap; gap:0.5rem;">
                    <div>
                      <div style="font-weight:800; color:#09221d;">Invoice ${inv.id} (${inv.date})</div>
                      <div style="font-size:0.8rem; color:var(--text-muted);">Total: $${inv.total.toFixed(2)} | Paid: $${inv.paid.toFixed(2)}</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                      <span class="badge ${inv.status === 'Paid' ? 'badge-success' : 'badge-warning'}" style="font-weight:800;">${inv.status}</span>
                      ${inv.status !== 'Paid' ? `
                        <button class="btn btn-primary btn-sm" onclick="BillingModule.openPaymentGateway('${inv.id}', ${inv.total - inv.paid})">💳 Pay Online Now</button>
                      ` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

        </div>
      </div>
    `;
  },

  switchTab(tabKey, btnEl) {
    const tabs = ['apts', 'rx', 'scans', 'bills'];
    tabs.forEach(t => {
      const el = document.getElementById(`portal-tab-${t}`);
      if (el) el.style.display = t === tabKey ? 'block' : 'none';
    });
    const headerBtns = document.querySelectorAll("#portal-tab-header button");
    headerBtns.forEach(b => b.classList.remove("active"));
    btnEl.classList.add("active");
  }
};
