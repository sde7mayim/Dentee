/* ==========================================================================
   DENTEE - TREATMENT PLANNING & COST ESTIMATION MODULE
   ========================================================================== */

const TreatmentPlanModule = {
  currentPatientId: "P-1001",

  init() {
    this.render();
  },

  render(patientId = app.currentPatientId) {
    this.currentPatientId = patientId;
    const container = document.getElementById("treatment-plan-module");
    if (!container) return;

    const patient = store.getPatientById(patientId);
    const plans = store.getTreatmentPlans(patientId);
    const allPlans = store.getTreatmentPlans();

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title"><span class="icon">📋</span> Treatment Plans & Cost Estimates</h2>
            <div class="page-subtitle">Patient: <strong>${patient ? patient.name : 'All Patients'}</strong></div>
          </div>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-primary btn-sm" onclick="TreatmentPlanModule.openCreatePlanModal('${patientId}')">
              + Create New Treatment Plan
            </button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr; gap:1.5rem;">
          ${plans.length === 0 ? `
            <div style="text-align:center; padding:3rem; color:var(--text-muted); border:2px dashed var(--border-color); border-radius:12px;">
              <div style="font-size:2.5rem; margin-bottom:0.5rem;">📋</div>
              <h3>No Treatment Plan Found for ${patient ? patient.name : 'this patient'}</h3>
              <p>Create a customized phased treatment plan, calculate costs, and send for patient digital signature approval.</p>
              <button class="btn btn-primary btn-sm" style="margin-top:1rem;" onclick="TreatmentPlanModule.openCreatePlanModal('${patientId}')">+ Create Plan Now</button>
            </div>
          ` : plans.map(plan => this.renderPlanCard(plan)).join('')}
        </div>
      </div>
    `;
  },

  renderPlanCard(plan) {
    const isApproved = plan.status === "Approved";
    return `
      <div class="card" style="border: 1px solid var(--border-color); background: var(--bg-surface); padding:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
          <div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <h3 style="font-size:1.1rem; font-weight:800;">${plan.title}</h3>
              <span class="badge ${isApproved ? 'badge-success' : 'badge-warning'}">${plan.status}</span>
            </div>
            <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.2rem;">
              Plan ID: <strong>${plan.id}</strong> | Created: ${plan.createdDate} | Dentist: ${plan.dentistName}
            </div>
          </div>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-secondary btn-sm" onclick="TreatmentPlanModule.printPlan('${plan.id}')">🖨️ Print Quotation</button>
            <button class="btn btn-secondary btn-sm" onclick="app.shareViaWhatsApp('${plan.patientName}', 'Treatment Plan ${plan.id} quotation total: $${plan.finalCost}')">📱 Share WhatsApp</button>
            ${!isApproved ? `
              <button class="btn btn-primary btn-sm" onclick="TreatmentPlanModule.openApprovalModal('${plan.id}')">✍️ Digital Approval</button>
            ` : ''}
          </div>
        </div>

        <!-- Phased Breakdown Table -->
        <div style="overflow-x:auto; margin-bottom:1rem;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Phase & Clinical Status</th>
                <th>Procedure Code & Description</th>
                <th style="text-align:right;">Standard Cost</th>
              </tr>
            </thead>
            <tbody>
              ${plan.phases.map(phase => `
                <tr style="background:var(--bg-card-hover);">
                  <td colspan="3" style="font-weight:700; color:var(--primary-color);">
                    📍 ${phase.phase} <span class="badge badge-info" style="margin-left:0.5rem;">${phase.status}</span>
                  </td>
                </tr>
                ${phase.items.map(item => `
                  <tr>
                    <td style="padding-left:1.5rem; color:var(--text-muted); font-size:0.85rem;">Clinical Item</td>
                    <td><strong>${item.code}</strong> - ${item.description}</td>
                    <td style="text-align:right; font-weight:600;">$${item.cost.toFixed(2)}</td>
                  </tr>
                `).join('')}
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Pricing & Signature Summary -->
        <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-body); padding:1rem; border-radius:8px; flex-wrap:wrap; gap:1rem;">
          <div>
            ${isApproved && plan.signature ? `
              <div style="font-size:0.78rem; color:var(--text-muted);">Approved by Patient on ${plan.approvedDate}:</div>
              <div style="height:35px; border-bottom:2px stroke var(--text-color); display:flex; align-items:center;">
                <span style="font-family:'Courier New', monospace; font-size:1.1rem; font-weight:bold; color:var(--primary-color);">${plan.patientName} (Digitally Signed)</span>
              </div>
            ` : `
              <div style="font-size:0.8rem; color:var(--text-warning); font-weight:600;">⏳ Awaiting Patient Electronic Signature</div>
            `}
          </div>

          <div style="text-align:right;">
            <div style="font-size:0.85rem; color:var(--text-muted);">Subtotal: $${plan.totalEstimate.toFixed(2)} (${plan.discountPercent}% Discount Applied)</div>
            <div style="font-size:1.3rem; font-weight:900; color:var(--primary-color);">Total Estimated Cost: $${plan.finalCost.toFixed(2)}</div>
          </div>
        </div>
      </div>
    `;
  },

  openCreatePlanModal(patientId) {
    const patient = store.getPatientById(patientId);
    const procedures = store.getProcedures();

    const bodyHTML = `
      <form onsubmit="TreatmentPlanModule.handleCreatePlan(event, '${patientId}')">
        <div class="form-group" style="margin-bottom:1rem;">
          <label>Plan Title / Treatment Objective:</label>
          <input type="text" id="new-plan-title" class="form-control" placeholder="e.g. Full Mouth Rehabilitation & Implants" required>
        </div>

        <div class="form-group" style="margin-bottom:1rem;">
          <label>Select Dentist Specialist:</label>
          <select id="new-plan-dentist" class="form-control">
            <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins (Cosmetic & Implants)</option>
            <option value="Dr. Robert Vance">Dr. Robert Vance (Endodontist)</option>
            <option value="Dr. Elena Rostova">Dr. Elena Rostova (Orthodontics)</option>
            <option value="Dr. Michael Chen">Dr. Michael Chen (Oral Surgeon)</option>
          </select>
        </div>

        <div class="form-group" style="margin-bottom:1rem;">
          <label>Select Primary Procedure to Include:</label>
          <select id="new-plan-proc" class="form-control">
            ${procedures.map(p => `<option value="${p.code}|${p.name}|${p.cost}">[${p.code}] ${p.name} - $${p.cost}</option>`).join('')}
          </select>
        </div>

        <div class="form-group" style="margin-bottom:1rem;">
          <label>Discount Percentage (%):</label>
          <input type="number" id="new-plan-discount" class="form-control" value="10" min="0" max="50">
        </div>

        <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
          <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Generate Plan & Quotation</button>
        </div>
      </form>
    `;

    app.openModal(`Create Treatment Plan for ${patient ? patient.name : 'Patient'}`, bodyHTML);
  },

  handleCreatePlan(e, patientId) {
    e.preventDefault();
    const title = document.getElementById("new-plan-title").value;
    const dentistName = document.getElementById("new-plan-dentist").value;
    const procVal = document.getElementById("new-plan-proc").value.split("|");
    const discount = parseFloat(document.getElementById("new-plan-discount").value) || 0;

    const patient = store.getPatientById(patientId);
    const procCode = procVal[0];
    const procName = procVal[1];
    const cost = parseFloat(procVal[2]);

    const totalEstimate = cost + 150; // include evaluation fee
    const finalCost = totalEstimate * (1 - discount / 100);

    const planData = {
      patientId: patientId,
      patientName: patient ? patient.name : "Sophia Martinez",
      title: title,
      dentistName: dentistName,
      phases: [
        { phase: "Phase 1: Diagnosis & Preparation", status: "Completed", items: [{ code: "D0120", description: "Comprehensive Dental Exam", cost: 150.00 }] },
        { phase: "Phase 2: Main Treatment Procedure", status: "Scheduled", items: [{ code: procCode, description: procName, cost: cost }] }
      ],
      totalEstimate: totalEstimate,
      discountPercent: discount,
      finalCost: finalCost
    };

    store.addTreatmentPlan(planData);
    app.closeModal();
    app.showToast("Treatment Plan created successfully!");
    this.render(patientId);
  },

  openApprovalModal(planId) {
    const bodyHTML = `
      <div style="text-align:center;">
        <p style="margin-bottom:1rem; font-size:0.9rem; color:var(--text-secondary);">
          By signing below, the patient acknowledges and accepts the proposed treatment plan phases and estimated cost.
        </p>
        <div style="border:2px dashed var(--primary-color); background:var(--bg-body); height:120px; border-radius:8px; display:flex; align-items:center; justify-content:center; margin-bottom:1rem; cursor:pointer;" onclick="app.showToast('Signature captured!')">
          <span style="font-family:'Courier New', monospace; font-size:1.5rem; font-weight:bold; color:var(--primary-color);">✍️ Tap to Sign Electronically</span>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
          <button class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
          <button class="btn btn-primary" onclick="TreatmentPlanModule.confirmApproval('${planId}')">Confirm & Approve Plan</button>
        </div>
      </div>
    `;
    app.openModal("Patient Electronic Signature Approval", bodyHTML);
  },

  confirmApproval(planId) {
    store.approveTreatmentPlan(planId, "electronic-signature-verified");
    app.closeModal();
    app.showToast("Treatment plan approved by patient!");
    this.render(this.currentPatientId);
  },

  printPlan(planId) {
    window.print();
  }
};
