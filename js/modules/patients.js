/* ==========================================================================
   DENTEE - PATIENT REGISTRATION & RECORDS MODULE
   ========================================================================== */

const PatientsModule = {
  searchQuery: "",

  render() {
    const container = document.getElementById("patients-module");
    if (!container) return;

    let patients = store.getPatients();
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      patients = patients.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.id.toLowerCase().includes(q) || 
        p.phone.includes(q)
      );
    }

    container.innerHTML = `
      <div class="page-title-bar">
        <div>
          <h1 class="page-title">Patient Management & Registration</h1>
          <div class="page-subtitle">Manage patient profiles, medical alerts, and history records</div>
        </div>
        <button class="btn btn-primary" onclick="PatientsModule.openAddPatientModal()">
          + Register New Patient
        </button>
      </div>

      <div class="card" style="margin-bottom:1.5rem;">
        <div style="display:flex; justify-content:space-between; gap:1rem; flex-wrap:wrap;">
          <div class="search-box" style="width:100%; max-width:400px;">
            <span class="search-icon">🔍</span>
            <input type="text" id="patient-search-input" value="${this.searchQuery}" placeholder="Search patient by name, ID, or phone..." oninput="PatientsModule.handleSearch(this.value)">
          </div>
          <div style="display:flex; gap:0.5rem;">
            <span class="badge badge-info" style="font-size:0.85rem;">Total Patients: ${patients.length}</span>
          </div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:1.25rem;">
        ${patients.map(p => this.renderPatientCard(p)).join("")}
      </div>
    `;
  },

  renderPatientCard(p) {
    const isCurrent = app.currentPatientId === p.id;
    return `
      <div class="card" style="position:relative; border-top: 4px solid ${isCurrent ? 'var(--primary)' : 'transparent'};">
        <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1rem;">
          <div style="font-size:2.2rem; background:var(--bg-tertiary); width:56px; height:56px; border-radius:50%; display:flex; align-items:center; justify-content:center;">
            ${p.avatar || '👤'}
          </div>
          <div>
            <h3 style="font-size:1.1rem; font-weight:800;">${p.name}</h3>
            <div style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">ID: ${p.id} • ${p.gender}, ${p.age} yrs</div>
          </div>
        </div>

        <div style="font-size:0.85rem; color:var(--text-secondary); display:flex; flex-direction:column; gap:0.35rem; margin-bottom:1.25rem;">
          <div>📞 <strong>Phone:</strong> ${p.phone}</div>
          <div>✉️ <strong>Email:</strong> ${p.email}</div>
          <div>🩸 <strong>Blood Group:</strong> ${p.bloodGroup}</div>
          <div>⚠️ <strong>Allergies:</strong> <span class="badge badge-danger">${p.allergies}</span></div>
          <div>🏥 <strong>Medical History:</strong> ${p.medicalHistory}</div>
        </div>

        <div style="display:flex; align-items:center; justify-content:space-between; gap:0.5rem; pt-3; border-top:1px solid var(--border-color); flex-wrap:wrap;">
          <button class="btn ${isCurrent ? 'btn-primary' : 'btn-outline'} btn-sm" onclick="app.setActivePatient('${p.id}')">
            ${isCurrent ? '✓ Active Patient' : 'Select Patient'}
          </button>
          <button class="btn btn-secondary btn-sm" onclick="PatientsModule.openFullEDRModal('${p.id}')">
            📄 EDR Record
          </button>
          <button class="btn btn-primary btn-sm" style="font-weight:800;" onclick="app.navigateTo('tooth-chart', '${p.id}')">
            🦷 Open 3D Tooth Chart
          </button>
        </div>
      </div>
    `;
  },

  openFullEDRModal(patientId) {
    const p = store.getPatientById(patientId);
    if (!p) return;

    const bodyHTML = `
      <div style="max-height:70vh; overflow-y:auto;">
        <div style="display:flex; align-items:center; gap:1rem; padding-bottom:1rem; border-bottom:1px solid var(--border-color); margin-bottom:1rem;">
          <div style="font-size:3rem;">${p.avatar || '👤'}</div>
          <div>
            <h3 style="margin:0; font-size:1.2rem;">${p.name} (${p.id})</h3>
            <div style="font-size:0.85rem; color:var(--text-muted);">${p.gender}, ${p.age} yrs | Phone: ${p.phone} | Email: ${p.email}</div>
            <div style="font-size:0.85rem; margin-top:0.2rem;">Address: ${p.address}</div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:1rem; margin-bottom:1rem;">
          <div style="background:var(--bg-body); padding:0.75rem; border-radius:8px;">
            <div style="font-size:0.8rem; color:var(--text-muted);">Medical History & Conditions</div>
            <div style="font-weight:700;">${p.medicalHistory || 'None reported'}</div>
          </div>
          <div style="background:var(--bg-body); padding:0.75rem; border-radius:8px;">
            <div style="font-size:0.8rem; color:var(--text-muted);">Allergies & Sensitivities</div>
            <div style="font-weight:700; color:#ef4444;">${p.allergies || 'None'}</div>
          </div>
          <div style="background:var(--bg-body); padding:0.75rem; border-radius:8px;">
            <div style="font-size:0.8rem; color:var(--text-muted);">Blood Group</div>
            <div style="font-weight:700;">${p.bloodGroup || 'Unknown'}</div>
          </div>
        </div>

        <div style="margin-bottom:1rem;">
          <h4 style="font-size:0.95rem; font-weight:800; margin-bottom:0.5rem;">Signed Consent Forms:</h4>
          <div style="display:flex; flex-direction:column; gap:0.5rem;">
            ${store.getConsentForms().map(cf => `
              <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-body); padding:0.5rem 0.75rem; border-radius:6px; font-size:0.85rem;">
                <div>📄 <strong>${cf.title}</strong> (${cf.category})</div>
                <span class="badge badge-success">✓ Signed & Verified</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1rem;">
          <button class="btn btn-secondary" onclick="app.closeModal()">Close</button>
          <button class="btn btn-primary" onclick="window.print()">🖨️ Print Full EDR</button>
        </div>
      </div>
    `;

    app.openModal(`Digital Patient Dental Record - ${p.name}`, bodyHTML);
  },

  handleSearch(val) {
    this.searchQuery = val;
    this.render();
  },

  openAddPatientModal() {
    app.openModal("👤 Register New Patient", `
      <form id="new-patient-form" onsubmit="PatientsModule.savePatient(event)">
        
        <!-- Demographics Section -->
        <div style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--primary); letter-spacing:0.5px; margin-bottom:0.75rem; border-bottom:1px solid var(--border-color); padding-bottom:0.35rem;">
          📋 Patient Demographics
        </div>
        <div class="form-grid" style="margin-bottom:1.25rem;">
          <div class="form-group">
            <label>Full Name *</label>
            <input type="text" class="form-control" name="name" required placeholder="e.g. John Doe">
          </div>
          <div class="form-group">
            <label>Age *</label>
            <input type="number" class="form-control" name="age" required min="1" max="120" placeholder="e.g. 34">
          </div>
          <div class="form-group">
            <label>Gender *</label>
            <select class="form-control" name="gender">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="form-group">
            <label>Blood Group</label>
            <select class="form-control" name="bloodGroup">
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+" selected>O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
            </select>
          </div>
        </div>

        <!-- Contact Details Section -->
        <div style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--primary); letter-spacing:0.5px; margin-bottom:0.75rem; border-bottom:1px solid var(--border-color); padding-bottom:0.35rem;">
          📞 Contact Information
        </div>
        <div class="form-grid" style="margin-bottom:1.25rem;">
          <div class="form-group">
            <label>Phone Number *</label>
            <input type="tel" class="form-control" name="phone" required placeholder="+1 (555) 000-0000">
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" class="form-control" name="email" placeholder="patient@example.com">
          </div>
        </div>

        <!-- Medical History Section -->
        <div style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--primary); letter-spacing:0.5px; margin-bottom:0.75rem; border-bottom:1px solid var(--border-color); padding-bottom:0.35rem;">
          🩺 Medical Alerts & History
        </div>
        <div class="form-grid">
          <div class="form-group full-width">
            <label>Known Allergies</label>
            <input type="text" class="form-control" name="allergies" placeholder="e.g. Penicillin, Latex, None">
          </div>
          <div class="form-group full-width">
            <label>Medical Conditions / History</label>
            <textarea class="form-control" name="medicalHistory" rows="2" placeholder="e.g. Hypertension, Diabetes, Asthma..."></textarea>
          </div>
        </div>

        <div style="margin-top:1.5rem; pt-3; border-top:1px solid var(--border-color); display:flex; justify-content:flex-end; gap:0.75rem;">
          <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary" style="padding:0.6rem 1.4rem; font-weight:800;">✓ Save & Register Patient</button>
        </div>
      </form>
    `);
  },

  savePatient(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.age = parseInt(data.age, 10);
    
    const newPatient = store.addPatient(data);
    app.closeModal();
    app.setActivePatient(newPatient.id);
    this.render();

    // Instant Confirmation Modal with 1-Click Tooth Chart Launcher
    app.openModal("🎉 Patient Registered Successfully", `
      <div style="padding:0.75rem 0; text-align:center;">
        <div style="font-size:3.2rem; margin-bottom:0.5rem; animation:fadeInUp 0.3s ease;">🦷</div>
        <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-primary); margin-bottom:0.35rem;">
          ${newPatient.name} (ID: ${newPatient.id}) Registered!
        </h3>
        <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:1.5rem;">
          Default 32-tooth anatomical dentition chart created. Would you like to open the Tooth Chart now?
        </p>

        <div style="background:var(--bg-tertiary); padding:1rem; border-radius:var(--radius-lg); margin-bottom:1.5rem; text-align:left; border:1px solid var(--border-color);">
          <div style="display:flex; justify-content:space-between; font-size:0.88rem; margin-bottom:0.35rem;">
            <span>Patient ID & Name:</span> <strong>${newPatient.id} — ${newPatient.name}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.88rem; margin-bottom:0.35rem;">
            <span>Demographics:</span> <strong>${newPatient.gender}, ${newPatient.age} yrs • ${newPatient.bloodGroup}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.88rem;">
            <span>Phone & Contact:</span> <strong>${newPatient.phone}</strong>
          </div>
        </div>

        <div style="display:flex; justify-content:center; gap:0.85rem; flex-wrap:wrap;">
          <button class="btn btn-secondary" onclick="app.closeModal()">📋 View Patient Directory</button>
          <button class="btn btn-primary" style="padding:0.65rem 1.4rem; font-weight:800; font-size:0.92rem;" onclick="app.closeModal(); app.navigateTo('tooth-chart', '${newPatient.id}');">
            🦷 Open 3D Tooth Chart Now ➔
          </button>
        </div>
      </div>
    `);
  }
};
