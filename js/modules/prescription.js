/* ==========================================================================
   DENTEE - PRESCRIPTION MANAGEMENT MODULE & DIGITAL Rx GENERATOR
   ========================================================================== */

const PrescriptionModule = {
  render() {
    const container = document.getElementById("prescription-module");
    if (!container) return;

    const prescriptions = store.getPrescriptions();

    container.innerHTML = `
      <div class="page-title-bar">
        <div>
          <h1 class="page-title">Digital Dental Prescription (Rx)</h1>
          <div class="page-subtitle">Generate, issue, and print dental medicine prescriptions</div>
        </div>
        <button class="btn btn-primary" onclick="PrescriptionModule.openNewRxModal()">
          + Write New Prescription
        </button>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Issued Prescriptions Log</h2>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Rx ID & Date</th>
                <th>Patient Name</th>
                <th>Attending Doctor</th>
                <th>Prescribed Medications</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${prescriptions.map(rx => `
                <tr>
                  <td>
                    <strong>${rx.id}</strong>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${rx.date}</div>
                  </td>
                  <td><strong>${rx.patientName}</strong></td>
                  <td>${rx.dentistName}</td>
                  <td>
                    ${rx.medications.map(m => `
                      <div style="font-size:0.82rem;">
                        💊 <strong>${m.name}</strong> - ${m.dosage} (${m.frequency}) for ${m.duration}
                      </div>
                    `).join("")}
                  </td>
                  <td>
                    <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
                      <button class="btn btn-secondary btn-sm" onclick="PrescriptionModule.printRx('${rx.id}')">
                        🖨️ Print / PDF
                      </button>
                      <button class="btn btn-secondary btn-sm" onclick="app.shareViaWhatsApp('${rx.patientName}', 'Rx Prescription ${rx.id}: ${rx.medications.map(m=>m.name).join(', ')}')">
                        📱 WhatsApp
                      </button>
                    </div>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  openNewRxModal() {
    const patients = store.getPatients();
    const dentists = store.getDentists();

    app.openModal("Write Prescription (Rx)", `
      <form id="new-rx-form" onsubmit="PrescriptionModule.saveRx(event)">
        <div class="form-grid">
          <div class="form-group">
            <label>Patient *</label>
            <select class="form-control" name="patientId" required>
              ${patients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join("")}
            </select>
          </div>
          <div class="form-group">
            <label>Prescribing Doctor *</label>
            <select class="form-control" name="dentistName" required>
              ${dentists.map(d => `<option value="${d.name}">${d.name}</option>`).join("")}
            </select>
          </div>
        </div>

        <div style="margin-top:1rem; border-top:1px solid var(--border-color); padding-top:1rem;">
          <h4 style="font-size:0.9rem; font-weight:700; margin-bottom:0.75rem;">Medication Item #1</h4>
          <div class="form-grid">
            <div class="form-group">
              <label>Medicine Name *</label>
              <input type="text" class="form-control" name="med1_name" required placeholder="e.g. Amoxicillin 500mg">
            </div>
            <div class="form-group">
              <label>Dosage *</label>
              <input type="text" class="form-control" name="med1_dosage" required placeholder="e.g. 1 Capsule">
            </div>
            <div class="form-group">
              <label>Frequency *</label>
              <select class="form-control" name="med1_freq">
                <option value="Every 8 Hours (TID)">Every 8 Hours (TID)</option>
                <option value="Every 12 Hours (BID)">Every 12 Hours (BID)</option>
                <option value="Once Daily (QD)">Once Daily (QD)</option>
                <option value="Every 6 Hours PRN">Every 6 Hours PRN (Pain)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Duration *</label>
              <input type="text" class="form-control" name="med1_dur" required value="5 Days">
            </div>
          </div>
        </div>

        <div class="form-group full-width" style="margin-top:1rem;">
          <label>Special Instructions / Precautions</label>
          <input type="text" class="form-control" name="notes" placeholder="e.g. Take with food. Finish full course.">
        </div>

        <div style="margin-top:1.5rem; display:flex; justify-content:flex-end; gap:0.75rem;">
          <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save & Issue Prescription</button>
        </div>
      </form>
    `);
  },

  saveRx(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const patient = store.getPatientById(data.patientId);

    const rxData = {
      patientId: data.patientId,
      patientName: patient ? patient.name : "Patient",
      dentistName: data.dentistName,
      medications: [
        {
          name: data.med1_name,
          dosage: data.med1_dosage,
          frequency: data.med1_freq,
          duration: data.med1_dur
        }
      ],
      notes: data.notes || ""
    };

    const newRx = store.addPrescription(rxData);
    app.closeModal();
    app.showToast("Prescription written successfully!");
    this.render();
  },

  printRx(rxId) {
    const rx = store.getPrescriptions().find(r => r.id === rxId);
    if (!rx) return;

    const clinic = store.getClinicInfo();
    const printableHTML = `
      <div style="padding:2rem; font-family:sans-serif; max-width:700px; margin:auto; border:2px solid #028090; border-radius:12px;">
        <div style="display:flex; justify-content:space-between; border-bottom:2px solid #028090; padding-bottom:1rem; margin-bottom:1rem;">
          <div>
            <h1 style="color:#028090; font-size:1.5rem; margin:0;">${clinic.name}</h1>
            <p style="font-size:0.85rem; color:#555; margin:2px 0;">${clinic.address}</p>
            <p style="font-size:0.85rem; color:#555; margin:0;">Tel: ${clinic.phone}</p>
          </div>
          <div style="text-align:right;">
            <h2 style="color:#00a896; margin:0;">Rx Prescription</h2>
            <p style="margin:4px 0 0 0; font-weight:bold;">Rx #: ${rx.id}</p>
            <p style="margin:0; font-size:0.85rem;">Date: ${rx.date}</p>
          </div>
        </div>

        <div style="background:#f1f5f9; padding:0.75rem; border-radius:8px; margin-bottom:1.5rem;">
          <p style="margin:0;"><strong>Patient Name:</strong> ${rx.patientName} (ID: ${rx.patientId})</p>
          <p style="margin:4px 0 0 0;"><strong>Doctor:</strong> ${rx.dentistName}</p>
        </div>

        <h3 style="color:#028090; margin-bottom:0.5rem;">Prescribed Medications (Rx):</h3>
        <table style="width:100%; border-collapse:collapse; margin-bottom:1.5rem;">
          <thead>
            <tr style="background:#028090; color:white;">
              <th style="padding:8px; text-align:left;">Medicine Name</th>
              <th style="padding:8px; text-align:left;">Dosage</th>
              <th style="padding:8px; text-align:left;">Frequency</th>
              <th style="padding:8px; text-align:left;">Duration</th>
            </tr>
          </thead>
          <tbody>
            ${rx.medications.map(m => `
              <tr style="border-bottom:1px solid #ccc;">
                <td style="padding:8px; font-weight:bold;">${m.name}</td>
                <td style="padding:8px;">${m.dosage}</td>
                <td style="padding:8px;">${m.frequency}</td>
                <td style="padding:8px;">${m.duration}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        ${rx.notes ? `<p style="background:#fff3cd; padding:8px; border-radius:4px; font-size:0.85rem;"><strong>Special Advice:</strong> ${rx.notes}</p>` : ''}

        <div style="margin-top:4rem; display:flex; justify-content:space-between; align-items:flex-end;">
          <div>
            <p style="font-size:0.75rem; color:#888; margin:0;">Generated by Dentee Clinic OS</p>
          </div>
          <div style="text-align:center;">
            <div style="border-bottom:1px solid #000; width:180px; margin-bottom:4px;"></div>
            <p style="font-size:0.85rem; font-weight:bold; margin:0;">${rx.dentistName}</p>
            <p style="font-size:0.75rem; color:#555; margin:0;">Doctor Signature / Seal</p>
          </div>
        </div>
      </div>
    `;

    app.openModal("Print Prescription", printableHTML + `
      <div style="margin-top:1rem; text-align:right;">
        <button class="btn btn-primary" onclick="window.print()">🖨️ Click to Print Document</button>
      </div>
    `);
  }
};
