/* ==========================================================================
   DENTEE - MAIN APPLICATION CONTROLLER & ROUTER
   ========================================================================== */

const app = {
  currentView: "patients",
  currentPatientId: "P-1001",
  theme: "light",

  init() {
    this.loadTheme();
    this.renderSidebar();
    this.attachNavigation();
    this.applyPlanUI();
    this.updateActivePatientLabel();
    this.navigateTo(this.currentView);
  },

  loadTheme() {
    const savedTheme = localStorage.getItem("DENTEE_THEME") || "light";
    this.theme = savedTheme;
    document.documentElement.setAttribute("data-theme", savedTheme);
  },

  toggleTheme() {
    this.theme = this.theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", this.theme);
    localStorage.setItem("DENTEE_THEME", this.theme);
    this.showToast(`Switched to ${this.theme.toUpperCase()} theme mode.`);
  },

  renderSidebar() {
    const menu = document.getElementById("sidebar-menu");
    if (!menu || typeof PlanConfig === "undefined") return;

    menu.innerHTML = PlanConfig.NAV_SECTIONS.map(section => `
      <div class="menu-category">${section.label}</div>
      ${section.items.map(item => `
        <div class="nav-item${item.view === this.currentView ? " active" : ""}"
             data-view="${item.view}"
             data-tier="${section.tier}"
             id="nav-${item.view}">
          <span class="icon">${item.icon}</span>
          <span class="nav-label">${item.label}</span>
          ${section.tier === "premium" ? '<span class="nav-lock-badge">★</span>' : ""}
        </div>
      `).join("")}
    `).join("");
  },

  applyPlanUI() {
    const plan = PlanConfig.getActivePlan();
    const isPremium = PlanConfig.isPremium();

    const brandTag = document.getElementById("brand-tag");
    if (brandTag) {
      brandTag.textContent = isPremium ? "PREMIUM" : "PRO";
      brandTag.classList.toggle("brand-tag-premium", isPremium);
    }

    const planSelect = document.getElementById("plan-select");
    if (planSelect) planSelect.value = plan;

    document.querySelectorAll(".nav-item[data-view]").forEach(item => {
      const view = item.getAttribute("data-view");
      const tier = item.getAttribute("data-tier");
      const locked = tier === "premium" && !isPremium;

      item.classList.toggle("nav-item-locked", locked);
      item.title = locked ? "Upgrade to Premium to unlock this module" : "";
    });

    const portalBtn = document.getElementById("btn-patient-portal");
    if (portalBtn) portalBtn.style.display = isPremium ? "" : "none";
  },

  togglePlan(plan) {
    PlanConfig.setActivePlan(plan);
    this.renderSidebar();
    this.applyPlanUI();

    if (!PlanConfig.canAccess(this.currentView)) {
      this.navigateTo("patients");
    } else {
      this.navigateTo(this.currentView);
    }

    this.showToast(`Switched to ${plan.toUpperCase()} plan.`);
  },

  attachNavigation() {
    const menu = document.getElementById("sidebar-menu");
    if (!menu) return;

    menu.addEventListener("click", (e) => {
      const item = e.target.closest(".nav-item[data-view]");
      if (!item) return;

      const view = item.getAttribute("data-view");
      if (item.classList.contains("nav-item-locked")) {
        this.showToast("This module requires the Premium plan. Use the plan switcher in the header.");
        return;
      }
      this.navigateTo(view);
    });
  },

  navigateTo(viewName, patientId = null) {
    if (!PlanConfig.canAccess(viewName)) {
      this.showToast("This module requires the Premium plan.");
      viewName = "patients";
    }

    if (patientId) {
      this.currentPatientId = patientId;
      this.updateActivePatientLabel();
    }

    this.currentView = viewName;

    document.querySelectorAll(".nav-item").forEach(el => {
      el.classList.toggle("active", el.getAttribute("data-view") === viewName);
    });

    document.querySelectorAll(".page-view").forEach(el => el.classList.remove("active"));

    switch (viewName) {
      case "patients":
        document.getElementById("patients-module").classList.add("active");
        PatientsModule.render();
        break;

      case "tooth-chart":
        document.getElementById("tooth-chart-module").classList.add("active");
        ToothChartModule.render(this.currentPatientId);
        break;

      case "treatment-plan":
        document.getElementById("treatment-plan-module").classList.add("active");
        TreatmentPlanModule.render(this.currentPatientId);
        break;

      case "patient-portal":
        document.getElementById("patient-portal-module").classList.add("active");
        PatientPortalModule.render(this.currentPatientId);
        break;

      case "ai-assistant":
        document.getElementById("ai-assistant-module").classList.add("active");
        AiAssistantModule.render();
        break;

      case "multi-clinic":
        document.getElementById("multi-clinic-module").classList.add("active");
        MultiClinicModule.render();
        break;

      case "staff":
        document.getElementById("staff-module").classList.add("active");
        StaffModule.render();
        break;

      case "xray":
        document.getElementById("xray-module").classList.add("active");
        XRayModule.render();
        break;

      case "prescription":
        document.getElementById("prescription-module").classList.add("active");
        PrescriptionModule.render();
        break;

      case "appointments":
        document.getElementById("appointments-module").classList.add("active");
        AppointmentsModule.render();
        break;

      case "calendar":
        document.getElementById("calendar-module").classList.add("active");
        CalendarModule.render();
        break;

      case "billing":
        document.getElementById("billing-module").classList.add("active");
        BillingModule.render();
        break;

      case "insurance":
        document.getElementById("insurance-module").classList.add("active");
        InsuranceModule.render();
        break;

      case "inventory":
        document.getElementById("inventory-module").classList.add("active");
        InventoryModule.render();
        break;

      case "lab":
        document.getElementById("lab-module").classList.add("active");
        LabModule.render();
        break;

      case "crm":
        document.getElementById("crm-module").classList.add("active");
        CrmModule.render();
        break;

      default:
        document.getElementById("patients-module").classList.add("active");
        PatientsModule.render();
        break;
    }
  },

  setActivePatient(patientId) {
    this.currentPatientId = patientId;
    const patient = store.getPatientById(patientId);
    this.updateActivePatientLabel();
    this.showToast(`Active patient set to ${patient ? patient.name : patientId}`);
    if (this.currentView === "tooth-chart") {
      ToothChartModule.render(patientId);
    } else if (this.currentView === "treatment-plan") {
      TreatmentPlanModule.render(patientId);
    } else if (this.currentView === "patient-portal") {
      PatientPortalModule.render(patientId);
    }
  },

  updateActivePatientLabel() {
    const patient = store.getPatientById(this.currentPatientId);
    const label = document.getElementById("active-patient-name");
    if (label && patient) {
      label.innerText = `${patient.name} (${patient.id})`;
    }
  },

  shareViaWhatsApp(patientName, textDetails) {
    const msg = encodeURIComponent(`Hello ${patientName}, from SmileCare Dental: ${textDetails}`);
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
    this.showToast(`WhatsApp message draft launched for ${patientName}!`);
  },

  openModal(title, bodyHTML) {
    const modal = document.getElementById("global-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");

    if (!modal) return;

    modalTitle.innerText = title;
    modalBody.innerHTML = bodyHTML;
    modal.classList.add("active");
  },

  closeModal() {
    const modal = document.getElementById("global-modal");
    if (modal) modal.classList.remove("active");
  },

  showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span>🦷</span> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  resetDemoData() {
    if (confirm("Reset all clinic data to fresh demo seed state?")) {
      store.resetToSeedData();
      this.showToast("Clinic database reset to initial demo state!");
      this.navigateTo(this.currentView);
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  app.init();
});
