/* ==========================================================================
   DENTEE - AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC) MODULE
   Strict Credential Authentication & Full-Page Login Portal
   ========================================================================== */

const AuthModule = {
  // Pre-configured Role User Accounts (Strict Credentials)
  accounts: {
    admin: {
      id: "U-101",
      email: "admin@dentee.com",
      password: "admin@123",
      name: "Dr. S. Jenkins",
      role: "admin",
      roleLabel: "Super Admin",
      avatar: "🛡️",
      title: "Chief Dental Officer & Owner",
      clinicId: "HQ-01"
    },
    doctor: {
      id: "U-102",
      email: "doctor@dentee.com",
      password: "doc@123",
      name: "Dr. Sarah Mitchell",
      role: "doctor",
      roleLabel: "Senior Dentist",
      avatar: "👨‍⚕️",
      title: "Prosthodontist & Oral Surgeon",
      clinicId: "HQ-01"
    },
    receptionist: {
      id: "U-103",
      email: "receptionist@dentee.com",
      password: "rec@123",
      name: "Jessica Taylor",
      role: "receptionist",
      roleLabel: "Front Desk Lead",
      avatar: "📋",
      title: "Patient Relations & Billing Lead",
      clinicId: "HQ-01"
    },
    lab: {
      id: "U-104",
      email: "lab@dentee.com",
      password: "lab@123",
      name: "Mark Vance",
      role: "lab",
      roleLabel: "Lab Technician",
      avatar: "🔬",
      title: "Chief Dental Prosthetics Technician",
      clinicId: "HQ-01"
    },
    patient: {
      id: "U-105",
      email: "patient@dentee.com",
      password: "patient@123",
      name: "Sophia Martinez",
      role: "patient",
      roleLabel: "Registered Patient",
      avatar: "👤",
      title: "Patient Account (P-1001)",
      clinicId: "HQ-01",
      patientId: "P-1001"
    }
  },

  currentUser: null,

  init() {
    const saved = localStorage.getItem("dentee_session");
    if (saved) {
      try {
        this.currentUser = JSON.parse(saved);
      } catch(e) {
        this.currentUser = null;
      }
    }
    this.checkAuthUI();
  },

  checkAuthUI() {
    const loginPage = document.getElementById("login-page-screen");
    const appLayout = document.getElementById("app-layout");

    if (this.currentUser) {
      if (loginPage) loginPage.style.display = "none";
      if (appLayout) appLayout.style.display = "flex";
      if (typeof app !== "undefined") {
        app.renderSidebar();
        app.updateActiveUserUI();
      }
    } else {
      if (appLayout) appLayout.style.display = "none";
      if (loginPage) loginPage.style.display = "flex";
    }
  },

  getCurrentUser() {
    return this.currentUser;
  },

  saveSession() {
    if (this.currentUser) {
      localStorage.setItem("dentee_session", JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem("dentee_session");
    }
  },

  login(roleKey) {
    const account = this.accounts[roleKey];
    if (account) {
      this.currentUser = account;
      this.saveSession();
      this.checkAuthUI();

      if (typeof app !== "undefined") {
        app.showToast(`🔑 Authenticated as ${account.name} (${account.roleLabel})`);
        
        if (account.role === "patient" && account.patientId) {
          app.setActivePatient(account.patientId);
          app.navigateTo("patient-portal");
        } else if (account.role === "lab") {
          app.navigateTo("lab");
        } else if (account.role === "receptionist") {
          app.navigateTo("appointments");
        } else {
          app.navigateTo("patients");
        }
      }
      return true;
    }
    return false;
  },

  loginWithCredentials(email, password) {
    const found = Object.values(this.accounts).find(
      acc => acc.email.toLowerCase() === email.trim().toLowerCase() && acc.password === password.trim()
    );
    if (found) {
      return this.login(found.role);
    }
    return false;
  },

  handleLoginFormSubmit(e) {
    if (e) e.preventDefault();
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    const email = emailInput ? emailInput.value : "";
    const password = passwordInput ? passwordInput.value : "";

    const success = this.loginWithCredentials(email, password);
    if (!success) {
      if (typeof app !== "undefined") {
        app.showToast("❌ Invalid Email or Password! Access Denied.");
      }
    }
  },

  logout() {
    this.currentUser = null;
    localStorage.removeItem("dentee_session");
    this.checkAuthUI();
    if (typeof app !== "undefined") {
      app.showToast("🚪 Logged out successfully. Please sign in with your credentials.");
    }
  },

  hasPermission(viewName) {
    const user = this.getCurrentUser();
    if (!user) return false;
    if (user.role === "admin") return true;

    if (typeof PlanConfig !== "undefined") {
      return PlanConfig.canRoleAccess(viewName, user.role);
    }
    return true;
  }
};
