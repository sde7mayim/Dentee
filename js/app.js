/* ==========================================================================
   DENTEE - MAIN APPLICATION CONTROLLER & ROUTER
   Enhanced with glassmorphism, responsive layout, notifications,
   global search, favorites, recent patients, inbox, and animations
   ========================================================================== */

const app = {
  currentView: "patients",
  currentPatientId: "P-1001",
  theme: "light",
  mobileSidebarOpen: false,

  init() {
    this.loadTheme();
    this.applyGlassmorphism();
    if (typeof AuthModule !== "undefined") {
      AuthModule.init();
    }
    this.renderSidebar();
    this.renderSidebarExtras();
    this.attachNavigation();
    this.applyPlanUI();
    this.updateActivePatientLabel();
    this.updateActiveUserUI();

    const currentUser = typeof AuthModule !== "undefined" ? AuthModule.getCurrentUser() : null;
    let initialView = this.currentView;
    if (currentUser) {
      if (currentUser.role === "patient") initialView = "patient-portal";
      else if (currentUser.role === "lab") initialView = "lab";
      else if (currentUser.role === "receptionist") initialView = "appointments";
    }

    this.navigateTo(initialView);
    
    // Initialize new modules
    if (typeof GlobalSearchModule !== "undefined") {
      GlobalSearchModule.init();
    }
    if (typeof NotificationModule !== "undefined") {
      NotificationModule.init();
    }
  },

  updateActiveUserUI() {
    const user = typeof AuthModule !== "undefined" ? AuthModule.getCurrentUser() : {
      name: "Dr. S. Jenkins",
      roleLabel: "Super Admin",
      avatar: "🛡️"
    };

    // Update Sidebar Footer Profile Card
    const profileCard = document.querySelector(".doctor-profile-card");
    if (profileCard) {
      profileCard.innerHTML = `
        <div class="doctor-avatar" style="background:var(--primary); font-size:1.1rem; display:flex; align-items:center; justify-content:center;">${user.avatar || '👤'}</div>
        <div class="doctor-info" style="overflow:hidden;">
          <div class="doctor-name" style="font-weight:800; font-size:0.85rem; color:#ffffff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${user.name}</div>
          <div class="doctor-role" style="font-size:0.72rem; color:#a3b8b0;">${user.roleLabel || 'User'}</div>
        </div>
        <button onclick="AuthModule.logout()" style="margin-left:auto; background:rgba(239,68,68,0.2); color:#ef4444; border:1px solid #ef4444; border-radius:6px; padding:3px 8px; font-size:0.7rem; font-weight:800; cursor:pointer;" title="Sign Out">
          🚪 Exit
        </button>
      `;
    }

    // Update Top Header User Badge
    const headerProfileBtn = document.getElementById("btn-header-profile");
    if (headerProfileBtn) {
      headerProfileBtn.innerHTML = `
        <span style="font-size:1rem;">${user.avatar || '👤'}</span>
        <span style="font-weight:800; font-size:0.85rem; color:var(--text-primary);">${user.name}</span>
        <span class="badge" style="font-size:0.68rem; background:var(--primary-light); color:var(--primary); font-weight:900; padding:2px 8px; border-radius:var(--radius-full);">
          ${(user.role || 'admin').toUpperCase()}
        </span>
      `;
      headerProfileBtn.onclick = () => {
        if (confirm(`Sign out of ${user.name} (${user.roleLabel})?`)) {
          AuthModule.logout();
        }
      };
    }
  },

  handleNavClick(viewName) {
    if (!PlanConfig.canAccess(viewName)) {
      this.showToast("This module requires the Premium plan.");
      return;
    }
    if (typeof AuthModule !== "undefined" && !AuthModule.hasPermission(viewName)) {
      const user = AuthModule.getCurrentUser();
      this.showToast(`⛔ Access Restricted: ${user ? user.roleLabel : 'User'} cannot access ${viewName.toUpperCase()}`);
      return;
    }
    this.navigateTo(viewName);

    if (window.innerWidth <= 768) {
      this.closeMobileSidebar();
    }
  },

  renderSidebar() {
    const menu = document.getElementById("sidebar-menu");
    if (!menu || typeof PlanConfig === "undefined") return;

    const user = typeof AuthModule !== "undefined" ? AuthModule.getCurrentUser() : null;

    menu.innerHTML = PlanConfig.NAV_SECTIONS.map(section => {
      const allowedItems = section.items.filter(item => {
        return typeof AuthModule === "undefined" || AuthModule.hasPermission(item.view);
      });

      if (allowedItems.length === 0) return "";

      return `
        <div class="menu-category">${section.label}</div>
        ${allowedItems.map(item => `
          <div class="nav-item${item.view === this.currentView ? " active" : ""}"
               data-view="${item.view}"
               data-tier="${section.tier}"
               id="nav-${item.view}"
               onclick="app.handleNavClick('${item.view}')"
               style="cursor:pointer; position:relative; z-index:10;">
            <span class="icon" style="pointer-events:none;">${item.icon}</span>
            <span class="nav-label" style="pointer-events:none;">${item.label}</span>
            ${section.tier === "premium" ? '<span class="nav-lock-badge" style="pointer-events:none;">★</span>' : ""}
          </div>
        `).join("")}
      `;
    }).join("");
  },

  renderSidebarExtras() {
    this.renderFavorites();
    this.renderRecentPatients();
  },

  renderFavorites() {
    const container = document.getElementById("favorites-list");
    if (!container) return;

    const favs = store.getFavorites();
    if (favs.length === 0) {
      container.innerHTML = '<div style="font-size:0.75rem; color:var(--text-muted); padding:0.25rem 0.5rem;">No favorites yet ⭐</div>';
      return;
    }

    container.innerHTML = favs.map(f => `
      <div class="fav-sidebar-item" style="
        display:flex;
        align-items:center;
        gap:0.5rem;
        padding:0.4rem 0.6rem;
        border-radius:var(--radius-sm);
        cursor:pointer;
        font-size:0.8rem;
        color:var(--text-secondary);
        transition:all var(--transition-fast);
      " onclick="app.setActivePatient('${f.patientId}'); app.navigateTo('patients')"
      onmouseover="this.style.background='var(--bg-tertiary)'"
      onmouseout="this.style.background='transparent'">
        <span class="fav-star active">⭐</span>
        <span style="font-weight:600;">${f.patientName}</span>
      </div>
    `).join("");
  },

  renderRecentPatients() {
    const container = document.getElementById("recent-patients-list");
    if (!container) return;

    const recents = store.getRecentPatients();
    if (recents.length === 0) {
      container.innerHTML = '<div style="font-size:0.75rem; color:var(--text-muted); padding:0.25rem 0.5rem;">No recent patients</div>';
      return;
    }

    container.innerHTML = recents.map(r => {
      const patient = store.getPatientById(r.patientId);
      if (!patient) return "";
      return `
        <div style="
          display:flex;
          align-items:center;
          gap:0.5rem;
          padding:0.4rem 0.6rem;
          border-radius:var(--radius-sm);
          cursor:pointer;
          font-size:0.8rem;
          color:var(--text-secondary);
          transition:all var(--transition-fast);
        " onclick="app.setActivePatient('${r.patientId}'); app.navigateTo('patients')"
        onmouseover="this.style.background='var(--bg-tertiary)'"
        onmouseout="this.style.background='transparent'">
          <span style="font-size:0.7rem;">📌</span>
          <span style="font-weight:600;">${patient.name}</span>
          <span style="margin-left:auto; font-size:0.65rem; color:var(--text-muted);">${app.timeAgo(r.lastAccessed)}</span>
        </div>
      `;
    }).join("");
  },

  timeAgo(timestamp) {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours/24)}d ago`;
  },

  toggleMobileSidebar() {
    this.mobileSidebarOpen = !this.mobileSidebarOpen;
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    if (sidebar) sidebar.classList.toggle("open", this.mobileSidebarOpen);
    if (overlay) overlay.classList.toggle("active", this.mobileSidebarOpen);
  },

  closeMobileSidebar() {
    this.mobileSidebarOpen = false;
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    if (sidebar) sidebar.classList.remove("open");
    if (overlay) overlay.classList.remove("active");
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
    this.renderSidebarExtras();
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
      
      // Close mobile sidebar on navigation
      if (window.innerWidth <= 768) {
        this.closeMobileSidebar();
      }
    });
  },

  navigateTo(viewName, patientId = null) {
    if (typeof AuthModule !== "undefined" && !AuthModule.hasPermission(viewName)) {
      const user = AuthModule.getCurrentUser();
      this.showToast(`⛔ Access Restricted: ${user.roleLabel} role cannot access ${viewName.toUpperCase()}`);
      
      // Fallback view per role
      if (user.role === "patient") viewName = "patient-portal";
      else if (user.role === "lab") viewName = "lab";
      else if (user.role === "receptionist") viewName = "appointments";
      else viewName = "patients";
    }

    if (!PlanConfig.canAccess(viewName)) {
      this.showToast("This module requires the Premium plan.");
      viewName = "patients";
    }

    if (patientId) {
      this.currentPatientId = patientId;
      store.trackRecentPatient(patientId);
      this.updateActivePatientLabel();
      this.renderSidebarExtras();
    } else {
      store.trackRecentPatient(this.currentPatientId);
      this.renderSidebarExtras();
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

      case "inbox":
        document.getElementById("inbox-module").classList.add("active");
        InboxModule.render();
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
    
    store.trackRecentPatient(patientId);
    this.renderSidebarExtras();
    
    this.updateActivePatientLabel();
    this.showToast(`Active patient set to ${patient ? patient.name : patientId}`);
    
    if (this.currentView === "tooth-chart") {
      ToothChartModule.render(patientId);
    } else if (this.currentView === "treatment-plan") {
      TreatmentPlanModule.render(patientId);
    } else if (this.currentView === "patient-portal") {
      PatientPortalModule.render(patientId);
    }
    
    if (typeof NotificationModule !== "undefined") {
      NotificationModule.updateBadge();
    }
  },

  toggleFavorite(patientId) {
    store.toggleFavorite(patientId);
    const isFav = store.isFavorite(patientId);
    this.renderSidebarExtras();
    this.showToast(isFav ? "⭐ Added to favorites" : "Removed from favorites");
    
    // Refresh patient cards if on patients view
    if (this.currentView === "patients") {
      PatientsModule.render();
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
    toast.className = "toast glass";
    toast.innerHTML = `<span>🦷</span> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-removing");
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
