/* ==========================================================================
   DENTEE - PRO / PREMIUM PLAN CONFIGURATION & FEATURE GATING
   ========================================================================== */

const PlanConfig = {
  PLANS: { PRO: "pro", PREMIUM: "premium" },
  STORAGE_KEY: "DENTEE_ACTIVE_PLAN",

  PRO_FEATURES: [
    "patients",
    "appointments",
    "calendar",
    "treatment-plan",
    "billing",
    "insurance",
    "inbox"
  ],

  PREMIUM_FEATURES: [
    "tooth-chart",
    "xray",
    "prescription",
    "inventory",
    "lab",
    "crm",
    "patient-portal",
    "ai-assistant",
    "multi-clinic",
    "staff"
  ],

  NAV_SECTIONS: [
    {
      label: "Quick Access",
      tier: "pro",
      items: [
        { view: "inbox", icon: "📥", label: "Inbox" }
      ]
    },
    {
      label: "Pro Plan",
      tier: "pro",
      items: [
        { view: "patients", icon: "👥", label: "Patient Records" },
        { view: "appointments", icon: "📅", label: "Appointments" },
        { view: "calendar", icon: "🗓️", label: "Dentist Calendar" },
        { view: "treatment-plan", icon: "📋", label: "Treatment Plans" },
        { view: "billing", icon: "💵", label: "Billing & GST" },
        { view: "insurance", icon: "🛡️", label: "Insurance" }
      ]
    },
    {
      label: "Premium Plan",
      tier: "premium",
      items: [
        { view: "tooth-chart", icon: "🦷", label: "32 Tooth Chart" },
        { view: "xray", icon: "🩻", label: "Digital Imaging" },
        { view: "prescription", icon: "💊", label: "Prescriptions" },
        { view: "inventory", icon: "📦", label: "Inventory" },
        { view: "lab", icon: "🔬", label: "Lab Follow-up" },
        { view: "crm", icon: "💬", label: "SMS / Email & WhatsApp" },
        { view: "ai-assistant", icon: "🤖", label: "AI Features" },
        { view: "multi-clinic", icon: "🏥", label: "Multiclinic Management" },
        { view: "staff", icon: "👨⚕️", label: "Staff Access Control" },
        { view: "patient-portal", icon: "📱", label: "Mobile App / Portal" }
      ]
    }
  ],

  getActivePlan() {
    return localStorage.getItem(this.STORAGE_KEY) || this.PLANS.PREMIUM;
  },

  setActivePlan(plan) {
    localStorage.setItem(this.STORAGE_KEY, plan);
  },

  isPremium() {
    return this.getActivePlan() === this.PLANS.PREMIUM;
  },

  canAccess(viewName) {
    if (this.PRO_FEATURES.includes(viewName)) return true;
    if (this.PREMIUM_FEATURES.includes(viewName)) {
      return this.isPremium();
    }
    return true;
  },

  getAllowedFeatures() {
    const features = [...this.PRO_FEATURES];
    if (this.isPremium()) features.push(...this.PREMIUM_FEATURES);
    return features;
  }
};
