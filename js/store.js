/* ==========================================================================
   DENTEE - CENTRAL DATA STORE & LOCAL STORAGE MANAGER
   Reactive state storage supporting instant CRUD for all 13 modules
   ========================================================================== */

class DenteeStore {
  constructor() {
    this.STORAGE_KEY = "DENTEE_CLINIC_DATA_V2";
    this.listeners = [];
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to read localStorage, falling back to seed data.", e);
    }
    // Deep clone initial seed data
    const defaultData = JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
    this.saveState(defaultData);
    return defaultData;
  }

  saveState(dataToSave = this.state) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
      this.notifyListeners();
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  }

  resetToSeedData() {
    this.state = JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
    this.saveState();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(fn => fn(this.state));
  }

  /* --------------------------------------------------------------------------
     1. CLINIC & PATIENTS API
     -------------------------------------------------------------------------- */
  getClinicInfo() {
    return this.state.clinicInfo;
  }

  getDentists() {
    return this.state.dentists;
  }

  getPatients() {
    return this.state.patients;
  }

  getPatientById(id) {
    return this.state.patients.find(p => p.id === id);
  }

  addPatient(patientData) {
    const newId = `P-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPatient = {
      id: newId,
      registeredDate: new Date().toISOString().split("T")[0],
      avatar: patientData.gender === "Female" ? "👩🏻" : "👨🏼",
      lastVisit: new Date().toISOString().split("T")[0],
      balance: 0.00,
      ...patientData
    };
    this.state.patients.unshift(newPatient);
    this.saveState();
    return newPatient;
  }

  /* --------------------------------------------------------------------------
     2. TOOTH CHART & DENTAL CHART API
     -------------------------------------------------------------------------- */
  getToothChart(patientId) {
    if (!this.state.toothChartData[patientId]) {
      this.state.toothChartData[patientId] = {
        chartType: "adult",
        teeth: {}
      };
      this.saveState();
    }
    return this.state.toothChartData[patientId];
  }

  updateToothSurface(patientId, toothNumber, surface, conditionStatus, notes = "") {
    const chart = this.getToothChart(patientId);
    if (!chart.teeth[toothNumber]) {
      chart.teeth[toothNumber] = { status: conditionStatus, surfaces: {}, notes: "" };
    }
    
    if (surface === "all") {
      chart.teeth[toothNumber].status = conditionStatus;
      chart.teeth[toothNumber].surfaces = {
        occlusal: conditionStatus,
        mesial: conditionStatus,
        distal: conditionStatus,
        buccal: conditionStatus,
        lingual: conditionStatus
      };
    } else {
      chart.teeth[toothNumber].surfaces[surface] = conditionStatus;
      chart.teeth[toothNumber].status = conditionStatus;
    }
    if (notes) {
      chart.teeth[toothNumber].notes = notes;
    }
    this.saveState();
  }

  /* --------------------------------------------------------------------------
     3. PROCEDURES API
     -------------------------------------------------------------------------- */
  getProcedures() {
    return this.state.procedures;
  }

  addProcedure(proc) {
    this.state.procedures.push(proc);
    this.saveState();
  }

  /* --------------------------------------------------------------------------
     4. APPOINTMENTS API
     -------------------------------------------------------------------------- */
  getAppointments() {
    return this.state.appointments;
  }

  addAppointment(aptData) {
    const newApt = {
      id: `APT-${Math.floor(800 + Math.random() * 200)}`,
      status: "Scheduled",
      ...aptData
    };
    this.state.appointments.unshift(newApt);
    this.saveState();
    return newApt;
  }

  updateAppointmentStatus(id, status) {
    const apt = this.state.appointments.find(a => a.id === id);
    if (apt) {
      apt.status = status;
      this.saveState();
    }
  }

  /* --------------------------------------------------------------------------
     5. X-RAY STUDIO API
     -------------------------------------------------------------------------- */
  getXRays() {
    return this.state.xrays;
  }

  addXRay(xrayData) {
    const newXRay = {
      id: `XR-${Math.floor(400 + Math.random() * 500)}`,
      date: new Date().toISOString().split("T")[0],
      ...xrayData
    };
    this.state.xrays.unshift(newXRay);
    this.saveState();
    return newXRay;
  }

  /* --------------------------------------------------------------------------
     6. PRESCRIPTIONS API
     -------------------------------------------------------------------------- */
  getPrescriptions() {
    return this.state.prescriptions;
  }

  addPrescription(rxData) {
    const newRx = {
      id: `RX-${Math.floor(900 + Math.random() * 100)}`,
      date: new Date().toISOString().split("T")[0],
      ...rxData
    };
    this.state.prescriptions.unshift(newRx);
    this.saveState();
    return newRx;
  }

  /* --------------------------------------------------------------------------
     7. BILLING & INVOICING API
     -------------------------------------------------------------------------- */
  getInvoices() {
    return this.state.invoices;
  }

  addInvoice(invData) {
    const newInv = {
      id: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split("T")[0],
      ...invData
    };
    this.state.invoices.unshift(newInv);
    this.saveState();
    return newInv;
  }

  /* --------------------------------------------------------------------------
     8. INVENTORY API
     -------------------------------------------------------------------------- */
  getInventory() {
    return this.state.inventory;
  }

  addInventoryItem(item) {
    const newItem = {
      id: `INV-${Math.floor(100 + Math.random() * 900)}`,
      ...item
    };
    this.state.inventory.unshift(newItem);
    this.saveState();
  }

  /* --------------------------------------------------------------------------
     9. LAB WORK ORDERS API
     -------------------------------------------------------------------------- */
  getLabOrders() {
    return this.state.labOrders;
  }

  addLabOrder(labData) {
    const newOrder = {
      id: `LAB-${Math.floor(500 + Math.random() * 400)}`,
      orderDate: new Date().toISOString().split("T")[0],
      status: "Ordered",
      ...labData
    };
    this.state.labOrders.unshift(newOrder);
    this.saveState();
    return newOrder;
  }

  /* --------------------------------------------------------------------------
     10. CRM & LOGS API
     -------------------------------------------------------------------------- */
  getCrmLogs() {
    return this.state.crmLogs || [];
  }

  addCrmLog(crmData) {
    if (!this.state.crmLogs) this.state.crmLogs = [];
    const newLog = {
      id: `CRM-${Math.floor(300 + Math.random() * 400)}`,
      date: new Date().toISOString().split("T")[0],
      status: "Sent",
      ...crmData
    };
    this.state.crmLogs.unshift(newLog);
    this.saveState();
    return newLog;
  }

  /* --------------------------------------------------------------------------
     11. BRANCHES & MULTI-CLINIC API
     -------------------------------------------------------------------------- */
  getBranches() {
    return this.state.branches || [];
  }

  /* --------------------------------------------------------------------------
     12. STAFF & ROSTER API
     -------------------------------------------------------------------------- */
  getStaff() {
    return this.state.staff || [];
  }

  addStaffMember(staffData) {
    if (!this.state.staff) this.state.staff = [];
    const newStaff = {
      id: `ST-${Math.floor(400 + Math.random() * 500)}`,
      status: "On Duty",
      ...staffData
    };
    this.state.staff.unshift(newStaff);
    this.saveState();
    return newStaff;
  }

  /* --------------------------------------------------------------------------
     13. TREATMENT PLANS & ESTIMATES API
     -------------------------------------------------------------------------- */
  getTreatmentPlans(patientId = null) {
    const plans = this.state.treatmentPlans || [];
    if (patientId) {
      return plans.filter(tp => tp.patientId === patientId);
    }
    return plans;
  }

  addTreatmentPlan(planData) {
    if (!this.state.treatmentPlans) this.state.treatmentPlans = [];
    const newPlan = {
      id: `TP-${Math.floor(700 + Math.random() * 300)}`,
      createdDate: new Date().toISOString().split("T")[0],
      status: "Pending Approval",
      approvedDate: null,
      signature: null,
      ...planData
    };
    this.state.treatmentPlans.unshift(newPlan);
    this.saveState();
    return newPlan;
  }

  approveTreatmentPlan(planId, signatureData) {
    const plan = (this.state.treatmentPlans || []).find(p => p.id === planId);
    if (plan) {
      plan.status = "Approved";
      plan.approvedDate = new Date().toISOString().split("T")[0];
      plan.signature = signatureData;
      this.saveState();
    }
    return plan;
  }

  /* --------------------------------------------------------------------------
     14. CONSENT FORMS & RECALLS API
     -------------------------------------------------------------------------- */
  getConsentForms() {
    return this.state.consentForms || [];
  }

  getRecalls() {
    return this.state.recalls || [];
  }

  addRecall(recallData) {
    if (!this.state.recalls) this.state.recalls = [];
    const newRecall = {
      id: `REC-${Math.floor(200 + Math.random() * 700)}`,
      status: "Scheduled",
      ...recallData
    };
    this.state.recalls.unshift(newRecall);
    this.saveState();
    return newRecall;
  }

  /* --------------------------------------------------------------------------
     15. INSURANCE POLICIES & CLAIMS API (Pro Plan)
     -------------------------------------------------------------------------- */
  getInsurancePolicies(patientId = null) {
    const policies = this.state.insurancePolicies || [];
    if (patientId) return policies.filter(p => p.patientId === patientId);
    return policies;
  }

  addInsurancePolicy(policyData) {
    if (!this.state.insurancePolicies) this.state.insurancePolicies = [];
    const newPolicy = {
      id: `POL-${Math.floor(100 + Math.random() * 900)}`,
      ...policyData
    };
    this.state.insurancePolicies.unshift(newPolicy);
    this.saveState();
    return newPolicy;
  }

  getInsuranceClaims(patientId = null) {
    const claims = this.state.insuranceClaims || [];
    if (patientId) return claims.filter(c => c.patientId === patientId);
    return claims;
  }

  addInsuranceClaim(claimData) {
    if (!this.state.insuranceClaims) this.state.insuranceClaims = [];
    const newClaim = {
      id: `CLM-${Math.floor(100 + Math.random() * 900)}`,
      ...claimData
    };
    this.state.insuranceClaims.unshift(newClaim);
    this.saveState();
    return newClaim;
  }

  updateInsuranceClaimStatus(claimId, status) {
    const claim = (this.state.insuranceClaims || []).find(c => c.id === claimId);
    if (claim) {
      claim.status = status;
      if (status === "Submitted" && !claim.submittedDate) {
        claim.submittedDate = new Date().toISOString().split("T")[0];
      }
      this.saveState();
    }
    return claim;
  }

  getGstConfig() {
    const clinic = this.getClinicInfo();
    return {
      gstIN: clinic.gstIN || "",
      stateCode: clinic.stateCode || "27",
      defaultGSTRate: clinic.defaultGSTRate || 18
    };
  }
}

// Global Store Instance
const store = new DenteeStore();
