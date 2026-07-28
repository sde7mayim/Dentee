/* ==========================================================================
   DENTEE - BILLING, INVOICING & PAYMENT MANAGEMENT MODULE
   ========================================================================== */

const BillingModule = {
  render() {
    const container = document.getElementById("billing-module");
    if (!container) return;

    const invoices = store.getInvoices();
    const totalRev = invoices.reduce((acc, inv) => acc + inv.paid, 0);
    const pendingRev = invoices.reduce((acc, inv) => acc + (inv.total - inv.paid), 0);

    container.innerHTML = `
      <div class="page-title-bar">
        <div>
          <h1 class="page-title">Billing & GST Invoices</h1>
          <div class="page-subtitle">GST-compliant tax invoices with CGST/SGST/IGST breakdown and payment tracking</div>
        </div>
        <button class="btn btn-primary" onclick="BillingModule.openNewInvoiceModal()">
          + Generate New Invoice
        </button>
      </div>

      <div class="grid-stats">
        <div class="stat-card">
          <div class="stat-icon emerald">💵</div>
          <div>
            <div class="stat-val">$${totalRev.toFixed(2)}</div>
            <div class="stat-label">Total Revenue Collected</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon amber">⏳</div>
          <div>
            <div class="stat-val">$${pendingRev.toFixed(2)}</div>
            <div class="stat-label">Pending / Uncollected Balance</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Billing Invoices Log</h2>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Invoice # & Date</th>
                <th>Patient</th>
                <th>Subtotal</th>
                <th>GST</th>
                <th>Total</th>
                <th>Paid Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${invoices.map(inv => `
                <tr>
                  <td>
                    <strong>${inv.id}</strong>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${inv.date}</div>
                  </td>
                  <td>
                    <strong>${inv.patientName}</strong>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${inv.patientId}</div>
                  </td>
                  <td>$${inv.subtotal.toFixed(2)}</td>
                  <td>
                    ${inv.gstType === "inter"
                      ? `IGST ${inv.gstRate || 18}%: $${(inv.igst || inv.tax || 0).toFixed(2)}`
                      : `CGST: $${(inv.cgst || 0).toFixed(2)} / SGST: $${(inv.sgst || 0).toFixed(2)}`}
                  </td>
                  <td><strong style="color:var(--primary);">$${inv.total.toFixed(2)}</strong></td>
                  <td><strong style="color:var(--success);">$${inv.paid.toFixed(2)}</strong></td>
                  <td>
                    <span class="badge ${inv.status === 'Paid' ? 'badge-success' : inv.status === 'Partial' ? 'badge-warning' : 'badge-danger'}">
                      ${inv.status}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="BillingModule.printInvoice('${inv.id}')">
                      📄 Print Tax Invoice
                    </button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  openNewInvoiceModal() {
    const patients = store.getPatients();
    const procedures = store.getProcedures();
    const gst = store.getGstConfig();

    app.openModal("Create GST Tax Invoice", `
      <form id="new-inv-form" onsubmit="BillingModule.saveInvoice(event)">
        <div style="background:var(--bg-body); padding:0.75rem; border-radius:8px; margin-bottom:1rem; font-size:0.82rem;">
          <strong>GSTIN:</strong> ${gst.gstIN || "Not configured"} &nbsp;|&nbsp;
          <strong>Default Rate:</strong> ${gst.defaultGSTRate}%
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>Patient *</label>
            <select class="form-control" name="patientId" required>
              ${patients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join("")}
            </select>
          </div>
          <div class="form-group">
            <label>Payment Method</label>
            <select class="form-control" name="paymentMethod">
              <option value="Credit Card">Credit / Debit Card</option>
              <option value="Cash">Cash</option>
              <option value="Insurance Claim">Dental Insurance Claim</option>
              <option value="UPI">UPI / GPay</option>
            </select>
          </div>
          <div class="form-group">
            <label>GST Type *</label>
            <select class="form-control" name="gstType" id="inv-gst-type" onchange="BillingModule.updateGstPreview()">
              <option value="intra">Intra-state (CGST + SGST)</option>
              <option value="inter">Inter-state (IGST)</option>
            </select>
          </div>
          <div class="form-group">
            <label>GST Rate (%) *</label>
            <input type="number" class="form-control" name="gstRate" id="inv-gst-rate" value="${gst.defaultGSTRate}" min="0" max="28" step="0.5" onchange="BillingModule.updateGstPreview()">
          </div>
        </div>

        <div style="margin-top:1rem; border-top:1px solid var(--border-color); padding-top:1rem;">
          <h4 style="font-size:0.9rem; font-weight:700; margin-bottom:0.75rem;">Procedure Item #1</h4>
          <div class="form-grid">
            <div class="form-group">
              <label>Select Procedure *</label>
              <select class="form-control" name="proc_select" onchange="BillingModule.onProcSelect(this.value)">
                ${procedures.map(pr => `<option value="${pr.cost}">${pr.code} - ${pr.name} ($${pr.cost})</option>`).join("")}
              </select>
            </div>
            <div class="form-group">
              <label>Taxable Amount ($) *</label>
              <input type="number" class="form-control" id="inv-amount-input" name="subtotal" step="0.01" value="${procedures[0].cost}" required onchange="BillingModule.updateGstPreview()">
            </div>
            <div class="form-group">
              <label>Discount ($)</label>
              <input type="number" class="form-control" name="discount" id="inv-discount" step="0.01" value="0.00" onchange="BillingModule.updateGstPreview()">
            </div>
            <div class="form-group">
              <label>Amount Paid Now ($) *</label>
              <input type="number" class="form-control" name="paid" id="inv-paid" step="0.01" value="${procedures[0].cost}" required>
            </div>
          </div>
          <div id="gst-preview" style="margin-top:0.75rem; font-size:0.85rem; color:var(--text-muted);"></div>
        </div>

        <div style="margin-top:1.5rem; display:flex; justify-content:flex-end; gap:0.75rem;">
          <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Generate GST Invoice</button>
        </div>
      </form>
    `);
    this.updateGstPreview();
  },

  calcGst(subtotal, discount, gstRate, gstType) {
    const taxable = Math.max(subtotal - discount, 0);
    const tax = taxable * (gstRate / 100);
    if (gstType === "inter") {
      return { taxable, tax, cgst: 0, sgst: 0, igst: tax, total: taxable + tax };
    }
    const half = tax / 2;
    return { taxable, tax, cgst: half, sgst: half, igst: 0, total: taxable + tax };
  },

  updateGstPreview() {
    const subtotal = parseFloat(document.getElementById("inv-amount-input")?.value) || 0;
    const discount = parseFloat(document.getElementById("inv-discount")?.value) || 0;
    const gstRate = parseFloat(document.getElementById("inv-gst-rate")?.value) || 18;
    const gstType = document.getElementById("inv-gst-type")?.value || "intra";
    const preview = document.getElementById("gst-preview");
    if (!preview) return;

    const g = this.calcGst(subtotal, discount, gstRate, gstType);
    preview.innerHTML = gstType === "inter"
      ? `Taxable: $${g.taxable.toFixed(2)} → IGST (${gstRate}%): $${g.igst.toFixed(2)} → <strong>Total: $${g.total.toFixed(2)}</strong>`
      : `Taxable: $${g.taxable.toFixed(2)} → CGST (${gstRate / 2}%): $${g.cgst.toFixed(2)} + SGST (${gstRate / 2}%): $${g.sgst.toFixed(2)} → <strong>Total: $${g.total.toFixed(2)}</strong>`;
  },

  onProcSelect(costVal) {
    const input = document.getElementById("inv-amount-input");
    const paid = document.getElementById("inv-paid");
    const val = parseFloat(costVal).toFixed(2);
    if (input) input.value = val;
    if (paid) paid.value = val;
    this.updateGstPreview();
  },

  saveInvoice(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const patient = store.getPatientById(data.patientId);
    const subtotal = parseFloat(data.subtotal);
    const discount = parseFloat(data.discount) || 0;
    const gstRate = parseFloat(data.gstRate) || 18;
    const gstType = data.gstType || "intra";
    const g = this.calcGst(subtotal, discount, gstRate, gstType);
    const paid = parseFloat(data.paid);

    let status = "Unpaid";
    if (paid >= g.total) status = "Paid";
    else if (paid > 0) status = "Partial";

    const invData = {
      patientId: data.patientId,
      patientName: patient ? patient.name : "Patient",
      items: [{ description: "Dental Procedure Services", amount: subtotal }],
      subtotal,
      discount,
      tax: g.tax,
      cgst: g.cgst,
      sgst: g.sgst,
      igst: g.igst,
      gstType,
      gstRate,
      total: g.total,
      paid,
      status,
      paymentMethod: data.paymentMethod
    };

    store.addInvoice(invData);
    app.closeModal();
    app.showToast("Invoice created successfully!");
    this.render();
  },

  printInvoice(invId) {
    const inv = store.getInvoices().find(i => i.id === invId);
    if (!inv) return;

    const clinic = store.getClinicInfo();
    const gst = store.getGstConfig();
    const printableHTML = `
      <div style="padding:2rem; font-family:sans-serif; max-width:750px; margin:auto; border:1px solid #ccc; background:#fff; color:#000;">
        <div style="display:flex; justify-content:space-between; border-bottom:3px solid #028090; padding-bottom:1rem; margin-bottom:1.5rem;">
          <div>
            <h1 style="color:#028090; margin:0;">${clinic.name}</h1>
            <p style="margin:4px 0 0 0; font-size:0.85rem; color:#555;">${clinic.address}</p>
            <p style="margin:0; font-size:0.85rem; color:#555;">Phone: ${clinic.phone} | Email: ${clinic.email}</p>
            <p style="margin:4px 0 0 0; font-size:0.85rem; color:#555;"><strong>GSTIN:</strong> ${gst.gstIN || "—"}</p>
          </div>
          <div style="text-align:right;">
            <h2 style="margin:0; color:#333;">GST TAX INVOICE</h2>
            <p style="margin:4px 0 0 0; font-weight:bold; color:#028090;"># ${inv.id}</p>
            <p style="margin:0; font-size:0.85rem;">Date: ${inv.date}</p>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; margin-bottom:1.5rem; background:#f8fafc; padding:1rem; border-radius:6px;">
          <div>
            <h4 style="margin:0 0 4px 0;">Billed To:</h4>
            <p style="margin:0; font-weight:bold;">${inv.patientName}</p>
            <p style="margin:0; font-size:0.85rem; color:#555;">Patient ID: ${inv.patientId}</p>
          </div>
          <div style="text-align:right;">
            <h4 style="margin:0 0 4px 0;">Payment Details:</h4>
            <p style="margin:0; font-size:0.85rem;">Method: <strong>${inv.paymentMethod}</strong></p>
            <p style="margin:0; font-size:0.85rem;">Status: <strong style="color:${inv.status === 'Paid' ? '#10b981' : '#f59e0b'};">${inv.status}</strong></p>
          </div>
        </div>

        <table style="width:100%; border-collapse:collapse; margin-bottom:1.5rem;">
          <thead>
            <tr style="background:#028090; color:white;">
              <th style="padding:10px; text-align:left;">Item & Description</th>
              <th style="padding:10px; text-align:right;">Amount ($)</th>
            </tr>
          </thead>
          <tbody>
            ${inv.items.map(item => `
              <tr style="border-bottom:1px solid #eee;">
                <td style="padding:10px;">${item.description}</td>
                <td style="padding:10px; text-align:right;">$${item.amount.toFixed(2)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div style="display:flex; justify-content:flex-end;">
          <div style="width:260px;">
            <div style="display:flex; justify-content:space-between; padding:4px 0;">
              <span>Subtotal:</span>
              <strong>$${inv.subtotal.toFixed(2)}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; padding:4px 0; color:#ef4444;">
              <span>Discount:</span>
              <strong>-$${inv.discount.toFixed(2)}</strong>
            </div>
            ${inv.gstType === "inter" ? `
            <div style="display:flex; justify-content:space-between; padding:4px 0;">
              <span>IGST (${inv.gstRate || 18}%):</span>
              <strong>+$${(inv.igst || inv.tax || 0).toFixed(2)}</strong>
            </div>` : `
            <div style="display:flex; justify-content:space-between; padding:4px 0;">
              <span>CGST (${(inv.gstRate || 18) / 2}%):</span>
              <strong>+$${(inv.cgst || 0).toFixed(2)}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; padding:4px 0;">
              <span>SGST (${(inv.gstRate || 18) / 2}%):</span>
              <strong>+$${(inv.sgst || 0).toFixed(2)}</strong>
            </div>`}
            <div style="display:flex; justify-content:space-between; padding:8px 0; border-top:2px solid #000; border-bottom:2px solid #000; font-size:1.1rem;">
              <span>Total Amount:</span>
              <strong style="color:#028090;">$${inv.total.toFixed(2)}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; padding:4px 0; color:#10b981;">
              <span>Amount Paid:</span>
              <strong>$${inv.paid.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        <div style="margin-top:3rem; text-align:center; font-size:0.8rem; color:#777; border-top:1px solid #eee; padding-top:1rem;">
          Thank you for choosing ${clinic.name}. Please retain this receipt for insurance claims.
        </div>
      </div>
    `;

    app.openModal("Tax Invoice Preview", printableHTML + `
      <div style="margin-top:1rem; text-align:right;">
        <button class="btn btn-primary" onclick="window.print()">🖨️ Print Tax Invoice</button>
      </div>
    `);
  },

  openPaymentGateway(invId, amountDue) {
    const inv = store.getInvoices().find(i => i.id === invId);

    const bodyHTML = `
      <div style="text-align:center; max-width:450px; margin:0 auto;">
        <div style="font-size:0.9rem; color:var(--text-muted); margin-bottom:0.5rem;">Online Payment for Invoice <strong>${invId}</strong></div>
        <div style="font-size:1.8rem; font-weight:900; color:var(--primary-color); margin-bottom:1.25rem;">
          Amount Due: $${amountDue.toFixed(2)}
        </div>

        <div style="display:flex; justify-content:center; gap:0.5rem; margin-bottom:1.25rem;">
          <button class="btn btn-secondary btn-sm active" onclick="app.showToast('Selected Credit/Debit Card')">💳 Card</button>
          <button class="btn btn-secondary btn-sm" onclick="app.showToast('Selected Instant UPI QR Code')">📲 UPI QR</button>
          <button class="btn btn-secondary btn-sm" onclick="app.showToast('Selected Net Banking')">🏦 NetBanking</button>
          <button class="btn btn-secondary btn-sm" onclick="app.showToast('Selected 0% Interest EMI')">📊 EMI Options</button>
        </div>

        <!-- Simulated UPI QR Code Renderer -->
        <div style="background:white; padding:1.25rem; border-radius:12px; display:inline-block; border:1px solid #e2e8f0; margin-bottom:1.25rem;">
          <div style="width:160px; height:160px; background:#000; margin:0 auto; display:flex; align-items:center; justify-content:center; color:white; font-family:monospace; font-size:0.75rem; text-align:center; padding:10px;">
            [SIMULATED UPI / CARD SECURE PAYMENT QR CODE]
          </div>
          <div style="font-size:0.75rem; color:#64748b; margin-top:0.5rem;">Scan with GPay, PhonePe, Paytm, or Banking App</div>
        </div>

        <!-- EMI Calculator Preview -->
        <div style="background:var(--bg-body); padding:0.75rem; border-radius:8px; font-size:0.8rem; margin-bottom:1.25rem; text-align:left;">
          <div style="font-weight:700; margin-bottom:0.25rem;">💡 Low-Cost EMI Option Breakdown:</div>
          <div>• 3 Months Plan: <strong>$${(amountDue / 3).toFixed(2)} / mo</strong></div>
          <div>• 6 Months Plan: <strong>$${(amountDue / 6).toFixed(2)} / mo</strong></div>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
          <button class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
          <button class="btn btn-primary" onclick="BillingModule.confirmPayment('${invId}', ${amountDue})">
            ⚡ Process Payment & Issue Receipt
          </button>
        </div>
      </div>
    `;

    app.openModal("Dentee Payment Gateway - Online Checkout", bodyHTML);
  },

  confirmPayment(invId, amountPaid) {
    const inv = store.getInvoices().find(i => i.id === invId);
    if (inv) {
      inv.paid += amountPaid;
      if (inv.paid >= inv.total) inv.status = "Paid";
      else inv.status = "Partial";
      store.saveState();
    }
    app.closeModal();
    app.showToast(`Payment of $${amountPaid.toFixed(2)} recorded successfully! Digital receipt issued.`);
    this.render();
  }
};
