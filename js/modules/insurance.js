/* ==========================================================================
   DENTEE - INSURANCE POLICIES & CLAIMS MODULE (Pro Plan)
   ========================================================================== */

const InsuranceModule = {
  render() {
    const container = document.getElementById("insurance-module");
    if (!container) return;

    const policies = store.getInsurancePolicies();
    const claims = store.getInsuranceClaims();
    const pendingClaims = claims.filter(c => c.status === "Draft" || c.status === "Submitted").length;
    const approvedTotal = claims.filter(c => c.status === "Approved").reduce((s, c) => s + c.claimAmount, 0);

    container.innerHTML = `
      <div class="page-title-bar">
        <div>
          <h1 class="page-title">Insurance Management</h1>
          <div class="page-subtitle">Patient policies, pre-authorization, and claim tracking linked to invoices</div>
        </div>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-secondary" onclick="InsuranceModule.openPolicyModal()">+ Add Policy</button>
          <button class="btn btn-primary" onclick="InsuranceModule.openClaimModal()">+ File Claim</button>
        </div>
      </div>

      <div class="grid-stats">
        <div class="stat-card">
          <div class="stat-icon emerald">🛡️</div>
          <div>
            <div class="stat-val">${policies.length}</div>
            <div class="stat-label">Active Policies</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon amber">📋</div>
          <div>
            <div class="stat-val">${pendingClaims}</div>
            <div class="stat-label">Pending Claims</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon emerald">✅</div>
          <div>
            <div class="stat-val">$${approvedTotal.toFixed(2)}</div>
            <div class="stat-label">Approved Claims (Total)</div>
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header"><h2 class="card-title">Patient Insurance Policies</h2></div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Provider</th>
                <th>Policy / Member ID</th>
                <th>Coverage</th>
                <th>Valid Until</th>
              </tr>
            </thead>
            <tbody>
              ${policies.length === 0 ? `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No policies on file</td></tr>` : policies.map(p => `
                <tr>
                  <td><strong>${p.patientName}</strong><div style="font-size:0.75rem; color:var(--text-muted);">${p.patientId}</div></td>
                  <td><strong>${p.provider}</strong></td>
                  <td>${p.policyNo}<div style="font-size:0.75rem; color:var(--text-muted);">Member: ${p.memberId}</div></td>
                  <td><span class="badge badge-info">${p.coveragePercent}%</span></td>
                  <td>${p.validUntil}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h2 class="card-title">Insurance Claims</h2></div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Patient</th>
                <th>Linked Invoice</th>
                <th>Invoice Total</th>
                <th>Claim Amount</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${claims.map(c => `
                <tr>
                  <td><strong>${c.id}</strong></td>
                  <td>${c.patientName}</td>
                  <td>${c.invoiceId || "—"}</td>
                  <td>$${(c.amount || 0).toFixed(2)}</td>
                  <td><strong style="color:var(--primary);">$${c.claimAmount.toFixed(2)}</strong></td>
                  <td><span class="badge ${this.statusBadge(c.status)}">${c.status}</span></td>
                  <td>${c.submittedDate || "—"}</td>
                  <td>
                    ${c.status === "Draft" ? `<button class="btn btn-secondary btn-sm" onclick="InsuranceModule.submitClaim('${c.id}')">Submit</button>` : ""}
                    ${c.status === "Submitted" ? `<button class="btn btn-secondary btn-sm" onclick="InsuranceModule.updateClaimStatus('${c.id}', 'Approved')">Approve</button>
                    <button class="btn btn-secondary btn-sm" onclick="InsuranceModule.updateClaimStatus('${c.id}', 'Denied')">Deny</button>` : ""}
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  statusBadge(status) {
    if (status === "Approved") return "badge-success";
    if (status === "Denied") return "badge-danger";
    if (status === "Submitted") return "badge-warning";
    return "badge-secondary";
  },

  openPolicyModal() {
    const patients = store.getPatients();
    app.openModal("Add Insurance Policy", `
      <form onsubmit="InsuranceModule.savePolicy(event)">
        <div class="form-grid">
          <div class="form-group">
            <label>Patient *</label>
            <select class="form-control" name="patientId" required>
              ${patients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join("")}
            </select>
          </div>
          <div class="form-group">
            <label>Insurance Provider *</label>
            <input type="text" class="form-control" name="provider" placeholder="e.g. Delta Dental, Star Health" required>
          </div>
          <div class="form-group">
            <label>Policy Number *</label>
            <input type="text" class="form-control" name="policyNo" required>
          </div>
          <div class="form-group">
            <label>Member ID *</label>
            <input type="text" class="form-control" name="memberId" required>
          </div>
          <div class="form-group">
            <label>Coverage % *</label>
            <input type="number" class="form-control" name="coveragePercent" min="0" max="100" value="80" required>
          </div>
          <div class="form-group">
            <label>Valid Until *</label>
            <input type="date" class="form-control" name="validUntil" required>
          </div>
        </div>
        <div style="margin-top:1.5rem; display:flex; justify-content:flex-end; gap:0.75rem;">
          <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Policy</button>
        </div>
      </form>
    `);
  },

  savePolicy(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const patient = store.getPatientById(data.patientId);
    store.addInsurancePolicy({
      patientId: data.patientId,
      patientName: patient ? patient.name : data.patientId,
      provider: data.provider,
      policyNo: data.policyNo,
      memberId: data.memberId,
      coveragePercent: parseInt(data.coveragePercent, 10),
      validUntil: data.validUntil
    });
    app.closeModal();
    app.showToast("Insurance policy saved.");
    this.render();
  },

  openClaimModal() {
    const patients = store.getPatients();
    const invoices = store.getInvoices();
    const policies = store.getInsurancePolicies();

    app.openModal("File Insurance Claim", `
      <form onsubmit="InsuranceModule.saveClaim(event)">
        <div class="form-grid">
          <div class="form-group">
            <label>Patient *</label>
            <select class="form-control" name="patientId" id="claim-patient" required onchange="InsuranceModule.syncClaimPolicy()">
              ${patients.map(p => `<option value="${p.id}">${p.name}</option>`).join("")}
            </select>
          </div>
          <div class="form-group">
            <label>Policy *</label>
            <select class="form-control" name="policyId" id="claim-policy" required>
              ${policies.map(p => `<option value="${p.id}" data-patient="${p.patientId}" data-coverage="${p.coveragePercent}">${p.provider} — ${p.patientName}</option>`).join("")}
            </select>
          </div>
          <div class="form-group">
            <label>Linked Invoice</label>
            <select class="form-control" name="invoiceId" id="claim-invoice" onchange="InsuranceModule.calcClaimAmount()">
              <option value="">— None —</option>
              ${invoices.map(i => `<option value="${i.id}" data-patient="${i.patientId}" data-total="${i.total}">${i.id} — ${i.patientName} ($${i.total.toFixed(2)})</option>`).join("")}
            </select>
          </div>
          <div class="form-group">
            <label>Invoice Total ($)</label>
            <input type="number" class="form-control" name="amount" id="claim-amount" step="0.01" value="0">
          </div>
          <div class="form-group">
            <label>Claim Amount ($) *</label>
            <input type="number" class="form-control" name="claimAmount" id="claim-claim-amount" step="0.01" required>
          </div>
        </div>
        <div style="margin-top:1.5rem; display:flex; justify-content:flex-end; gap:0.75rem;">
          <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Create Draft Claim</button>
        </div>
      </form>
    `);
  },

  syncClaimPolicy() {
    const patientId = document.getElementById("claim-patient")?.value;
    const policySelect = document.getElementById("claim-policy");
    if (!policySelect || !patientId) return;
    for (const opt of policySelect.options) {
      opt.hidden = opt.dataset.patient !== patientId;
    }
    const first = [...policySelect.options].find(o => !o.hidden);
    if (first) policySelect.value = first.value;
    this.calcClaimAmount();
  },

  calcClaimAmount() {
    const invoiceSelect = document.getElementById("claim-invoice");
    const policySelect = document.getElementById("claim-policy");
    const amountInput = document.getElementById("claim-amount");
    const claimInput = document.getElementById("claim-claim-amount");
    if (!invoiceSelect || !amountInput || !claimInput) return;

    const opt = invoiceSelect.selectedOptions[0];
    const total = opt?.dataset.total ? parseFloat(opt.dataset.total) : 0;
    const coverage = policySelect?.selectedOptions[0]?.dataset.coverage
      ? parseFloat(policySelect.selectedOptions[0].dataset.coverage) : 80;

    amountInput.value = total.toFixed(2);
    claimInput.value = (total * coverage / 100).toFixed(2);
  },

  saveClaim(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const patient = store.getPatientById(data.patientId);
    store.addInsuranceClaim({
      patientId: data.patientId,
      patientName: patient ? patient.name : data.patientId,
      policyId: data.policyId,
      invoiceId: data.invoiceId || null,
      amount: parseFloat(data.amount) || 0,
      claimAmount: parseFloat(data.claimAmount),
      status: "Draft",
      submittedDate: null
    });
    app.closeModal();
    app.showToast("Insurance claim draft created.");
    this.render();
  },

  submitClaim(claimId) {
    store.updateInsuranceClaimStatus(claimId, "Submitted");
    app.showToast("Claim submitted to insurer.");
    this.render();
  },

  updateClaimStatus(claimId, status) {
    store.updateInsuranceClaimStatus(claimId, status);
    app.showToast(`Claim marked as ${status}.`);
    this.render();
  }
};
