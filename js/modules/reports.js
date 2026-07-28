/* ==========================================================================
   DENTEE - CLINIC REPORTS & ANALYTICS DASHBOARD MODULE
   Interactive SVG Charting for Financials, Procedures, & Patient Stats
   ========================================================================== */

const ReportsModule = {
  render() {
    const container = document.getElementById("reports-module");
    if (!container) return;

    const invoices = store.getInvoices();
    const totalRev = invoices.reduce((a, b) => a + b.paid, 0);

    container.innerHTML = `
      <div class="page-title-bar">
        <div>
          <h1 class="page-title">Clinic Reports & Analytics</h1>
          <div class="page-subtitle">Real-time performance dashboards, procedure distribution, and revenue trends</div>
        </div>
      </div>

      <div class="grid-stats">
        <div class="stat-card">
          <div class="stat-icon emerald">📈</div>
          <div>
            <div class="stat-val">$${totalRev.toFixed(2)}</div>
            <div class="stat-label">Monthly Gross Revenue</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon teal">👥</div>
          <div>
            <div class="stat-val">142</div>
            <div class="stat-label">Total Active Patients</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon blue">✅</div>
          <div>
            <div class="stat-val">98.4%</div>
            <div class="stat-label">Appointment Completion Rate</div>
          </div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap:1.5rem;">
        <!-- Bar Chart Card -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">📊 Revenue Growth Trend (Monthly)</h2>
          </div>
          <div style="height:260px; display:flex; align-items:flex-end; justify-content:space-between; padding-top:20px;">
            ${this.renderRevenueBarChart()}
          </div>
        </div>

        <!-- Procedure Pie Chart Card -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">🦷 Dental Procedure Breakdown</h2>
          </div>
          <div style="display:flex; align-items:center; justify-content:space-around; height:240px;">
            ${this.renderProcedurePieChart()}
          </div>
        </div>
      </div>
    `;
  },

  renderRevenueBarChart() {
    const months = [
      { name: "Feb", val: 18400 },
      { name: "Mar", val: 22100 },
      { name: "Apr", val: 26800 },
      { name: "May", val: 31000 },
      { name: "Jun", val: 34500 },
      { name: "Jul", val: 42800 }
    ];

    const max = 50000;

    return months.map(m => {
      const heightPct = (m.val / max) * 100;
      return `
        <div style="display:flex; flex-direction:column; align-items:center; flex:1; gap:8px;">
          <div style="font-size:0.75rem; font-weight:700; color:var(--primary);">$${(m.val/1000).toFixed(1)}k</div>
          <div style="width:36px; height:${heightPct}%; background:linear-gradient(to top, var(--primary), var(--accent)); border-radius:6px 6px 0 0; transition:height 0.5s ease;"></div>
          <div style="font-size:0.8rem; font-weight:700; color:var(--text-muted);">${m.name}</div>
        </div>
      `;
    }).join("");
  },

  renderProcedurePieChart() {
    return `
      <svg width="180" height="180" viewBox="0 0 42 42">
        <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#028090" stroke-width="6" stroke-dasharray="40 60" stroke-dashoffset="25"></circle>
        <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#00a896" stroke-width="6" stroke-dasharray="25 75" stroke-dashoffset="85"></circle>
        <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#3a86ff" stroke-width="6" stroke-dasharray="20 80" stroke-dashoffset="60"></circle>
        <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f59e0b" stroke-width="6" stroke-dasharray="15 85" stroke-dashoffset="40"></circle>
      </svg>
      <div style="font-size:0.82rem; display:flex; flex-direction:column; gap:0.4rem;">
        <div><span style="color:#028090;">■</span> Restorative & Fillings (40%)</div>
        <div><span style="color:#00a896;">■</span> Preventive & Cleanings (25%)</div>
        <div><span style="color:#3a86ff;">■</span> Endodontics / RCT (20%)</div>
        <div><span style="color:#f59e0b;">■</span> Crown & Implants (15%)</div>
      </div>
    `;
  }
};
