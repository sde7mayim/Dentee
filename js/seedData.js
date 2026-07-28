/* ==========================================================================
   DENTEE - SEED DATA FOR DEMO & INITIALIZATION
   Populates realistic initial data for all 13 Dental Clinic modules
   ========================================================================== */

const INITIAL_SEED_DATA = {
  clinicInfo: {
    name: "SmileCare International Dental Hospital",
    tagline: "Advanced Dental Excellence & Implantology Center",
    phone: "+1 (800) 555-DENTIST",
    email: "contact@smilecaredental.com",
    address: "742 Evergreen Terrace, Suite 400, Beverly Hills, CA 90210",
    website: "https://smilecaredental.com",
    currency: "$",
    taxRate: 8.5,
    gstIN: "27AABCS1429B1Z5",
    stateCode: "27",
    defaultGSTRate: 18
  },

  insurancePolicies: [
    { id: "POL-001", patientId: "P-1001", patientName: "Sophia Martinez", provider: "Delta Dental PPO", policyNo: "DD-8847291", memberId: "SM-4421", coveragePercent: 80, validUntil: "2027-06-30", groupNo: "GRP-9901" },
    { id: "POL-002", patientId: "P-1002", patientName: "Marcus Vance", provider: "MetLife Dental", policyNo: "ML-2291044", memberId: "MV-7782", coveragePercent: 70, validUntil: "2026-12-31", groupNo: "GRP-5520" },
    { id: "POL-003", patientId: "P-1003", patientName: "Emily Watson", provider: "Star Health Dental", policyNo: "SH-6610238", memberId: "EW-3310", coveragePercent: 85, validUntil: "2027-03-15", groupNo: "GRP-4412" }
  ],

  insuranceClaims: [
    { id: "CLM-001", patientId: "P-1001", patientName: "Sophia Martinez", policyId: "POL-001", invoiceId: "INV-2026-001", amount: 413.00, claimAmount: 306.40, status: "Submitted", submittedDate: "2026-07-28", notes: "Composite filling + X-ray series" },
    { id: "CLM-002", patientId: "P-1002", patientName: "Marcus Vance", policyId: "POL-002", invoiceId: "INV-2026-002", amount: 265.50, claimAmount: 185.85, status: "Approved", submittedDate: "2026-07-27", notes: "Panoramic OPG and consultation" },
    { id: "CLM-003", patientId: "P-1003", patientName: "Emily Watson", policyId: "POL-003", invoiceId: null, amount: 0, claimAmount: 450.00, status: "Draft", submittedDate: null, notes: "Pre-auth for orthodontic assessment" }
  ],
  
  dentists: [
    { id: "D101", name: "Dr. Sarah Jenkins, DDS", specialty: "Cosmetic & Implant Dentistry", chair: "Chair 1 (Operatory A)", color: "#028090" },
    { id: "D102", name: "Dr. Robert Vance, DMD", specialty: "Endodontist & Root Canal Specialist", chair: "Chair 2 (Operatory B)", color: "#3a86ff" },
    { id: "D103", name: "Dr. Elena Rostova, MS", specialty: "Orthodontics & Pediatric Dentistry", chair: "Chair 3 (Operatory C)", color: "#8b5cf6" },
    { id: "D104", name: "Dr. Michael Chen, BDS", specialty: "Periodontist & Oral Surgeon", chair: "Chair 4 (Surgical Suite)", color: "#f59e0b" }
  ],

  patients: [
    {
      id: "P-1001",
      name: "Sophia Martinez",
      age: 29,
      gender: "Female",
      phone: "+1 (555) 234-5678",
      email: "sophia.m@example.com",
      address: "124 Oak Street, Los Angeles, CA",
      bloodGroup: "O+",
      allergies: "Penicillin",
      medicalHistory: "Mild Hypertension",
      registeredDate: "2025-11-12",
      avatar: "👩🏻",
      lastVisit: "2026-07-20",
      balance: 150.00
    },
    {
      id: "P-1002",
      name: "Marcus Vance",
      age: 42,
      gender: "Male",
      phone: "+1 (555) 876-5432",
      email: "marcus.vance@example.com",
      address: "889 Sunset Blvd, Malibu, CA",
      bloodGroup: "A+",
      allergies: "None",
      medicalHistory: "Diabetes Type II (Controlled)",
      registeredDate: "2026-01-05",
      avatar: "👨🏼",
      lastVisit: "2026-07-26",
      balance: 0.00
    },
    {
      id: "P-1003",
      name: "Emily Watson",
      age: 8,
      gender: "Female",
      phone: "+1 (555) 345-6789",
      email: "watson.family@example.com",
      address: "45 Pine Ridge Way, Santa Monica, CA",
      bloodGroup: "B+",
      allergies: "Latex",
      medicalHistory: "Pediatric Patient",
      registeredDate: "2026-03-14",
      avatar: "👧🏼",
      lastVisit: "2026-07-15",
      balance: 45.00
    },
    {
      id: "P-1004",
      name: "Alexander Wright",
      age: 55,
      gender: "Male",
      phone: "+1 (555) 987-6543",
      email: "a.wright@techcorp.com",
      address: "500 Ocean Avenue, Pasadena, CA",
      bloodGroup: "AB+",
      allergies: "Aspirin",
      medicalHistory: "Cardiac Stent (2022)",
      registeredDate: "2024-08-19",
      avatar: "👨🏽",
      lastVisit: "2026-06-30",
      balance: 620.00
    }
  ],

  procedures: [
    { code: "D0120", name: "Periodic Oral Evaluation", category: "Preventive", cost: 65.00, duration: 20 },
    { code: "D1110", name: "Prophylaxis - Adult Cleaning", category: "Preventive", cost: 110.00, duration: 45 },
    { code: "D0210", name: "Intraoral - Complete X-Ray Series", category: "Diagnostic", cost: 140.00, duration: 15 },
    { code: "D2140", name: "Amalgam Filling - 1 Surface", category: "Restorative", cost: 180.00, duration: 30 },
    { code: "D2392", name: "Composite Resin Filling - 2 Surfaces", category: "Restorative", cost: 240.00, duration: 45 },
    { code: "D3310", name: "Endodontic Therapy - Anterior Root Canal", category: "Endodontic", cost: 850.00, duration: 90 },
    { code: "D2750", name: "Crown - Porcelain Fused to High Noble Metal", category: "Prosthodontics", cost: 1200.00, duration: 60 },
    { code: "D6010", name: "Surgical Placement of Implant Body", category: "Implantology", cost: 2200.00, duration: 120 },
    { code: "D7140", name: "Extraction, Erupted Tooth or Exposed Root", category: "Oral Surgery", cost: 210.00, duration: 30 },
    { code: "D9972", name: "In-Office Dental Teeth Bleaching", category: "Cosmetic", cost: 450.00, duration: 60 }
  ],

  toothChartData: {
    "P-1001": {
      chartType: "adult",
      teeth: {
        3: { status: "crown", surfaces: { occlusal: "crown", mesial: "crown" }, notes: "Porcelain Crown fitted 2025" },
        14: { status: "caries", surfaces: { occlusal: "caries", distal: "caries" }, notes: "Deep Occlusal Cavity" },
        19: { status: "rct", surfaces: { occlusal: "rct" }, notes: "Root canal therapy completed" },
        30: { status: "filling", surfaces: { occlusal: "filling", mesial: "filling" }, notes: "Composite Filling" }
      }
    },
    "P-1002": {
      chartType: "adult",
      teeth: {
        8: { status: "filling", surfaces: { mesial: "filling" }, notes: "Esthetic composite" },
        18: { status: "extracted", surfaces: {}, notes: "Extracted 2024" },
        31: { status: "implant", surfaces: { occlusal: "implant" }, notes: "Titanium implant osseointegrated" }
      }
    }
  },

  appointments: [
    {
      id: "APT-801",
      patientId: "P-1001",
      patientName: "Sophia Martinez",
      dentistId: "D101",
      dentistName: "Dr. Sarah Jenkins",
      date: "2026-07-27",
      time: "09:30 AM",
      procedure: "D2392 - Composite Resin Filling",
      chair: "Chair 1 (Operatory A)",
      status: "In-Chair",
      notes: "Tooth #14 occlusal composite restoration."
    },
    {
      id: "APT-802",
      patientId: "P-1002",
      patientName: "Marcus Vance",
      dentistId: "D102",
      dentistName: "Dr. Robert Vance",
      date: "2026-07-27",
      time: "11:00 AM",
      procedure: "D3310 - Anterior Root Canal",
      chair: "Chair 2 (Operatory B)",
      status: "Checked-In",
      notes: "Follow up root canal session."
    },
    {
      id: "APT-803",
      patientId: "P-1003",
      patientName: "Emily Watson",
      dentistId: "D103",
      dentistName: "Dr. Elena Rostova",
      date: "2026-07-27",
      time: "02:15 PM",
      procedure: "D1110 - Pediatric Cleaning",
      chair: "Chair 3 (Operatory C)",
      status: "Scheduled",
      notes: "Pediatric checkup & fluoridation."
    },
    {
      id: "APT-804",
      patientId: "P-1004",
      patientName: "Alexander Wright",
      dentistId: "D104",
      dentistName: "Dr. Michael Chen",
      date: "2026-07-28",
      time: "10:00 AM",
      procedure: "D6010 - Implant Placement",
      chair: "Chair 4 (Surgical Suite)",
      status: "Scheduled",
      notes: "Surgical implant placement stage 1."
    }
  ],

  xrays: [
    {
      id: "XR-401",
      patientId: "P-1001",
      patientName: "Sophia Martinez",
      date: "2026-07-20",
      type: "Bitewing Radiograph",
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
      notes: "Incipient caries observed on tooth #14 distal surface. Periodontal bone levels within normal limits."
    },
    {
      id: "XR-402",
      patientId: "P-1002",
      patientName: "Marcus Vance",
      date: "2026-07-26",
      type: "Panoramic OPG",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
      notes: "Implant site #31 shows excellent bone density. Third molars impacted."
    }
  ],

  prescriptions: [
    {
      id: "RX-901",
      patientId: "P-1001",
      patientName: "Sophia Martinez",
      dentistName: "Dr. Sarah Jenkins",
      date: "2026-07-27",
      medications: [
        { name: "Amoxicillin 500mg", dosage: "1 Capsule", frequency: "Every 8 Hours (TID)", duration: "7 Days", instructions: "Take after meals." },
        { name: "Ibuprofen 600mg", dosage: "1 Tablet", frequency: "Every 6 Hours PRN", duration: "3 Days", instructions: "For pain control." }
      ],
      notes: "Avoid alcohol during antibiotic therapy."
    }
  ],

  invoices: [
    {
      id: "INV-2026-001",
      patientId: "P-1001",
      patientName: "Sophia Martinez",
      date: "2026-07-27",
      items: [
        { description: "Composite Resin Filling (Tooth #14)", amount: 240.00 },
        { description: "Intraoral X-Ray Series", amount: 140.00 }
      ],
      subtotal: 380.00,
      discount: 30.00,
      tax: 63.00,
      cgst: 31.50,
      sgst: 31.50,
      igst: 0,
      gstType: "intra",
      gstRate: 18,
      total: 413.00,
      paid: 250.00,
      status: "Partial",
      paymentMethod: "Credit Card"
    },
    {
      id: "INV-2026-002",
      patientId: "P-1002",
      patientName: "Marcus Vance",
      date: "2026-07-26",
      items: [
        { description: "Panoramic X-Ray OPG", amount: 160.00 },
        { description: "Consultation & Exam", amount: 65.00 }
      ],
      subtotal: 225.00,
      discount: 0.00,
      tax: 40.50,
      cgst: 20.25,
      sgst: 20.25,
      igst: 0,
      gstType: "intra",
      gstRate: 18,
      total: 265.50,
      paid: 265.50,
      status: "Paid",
      paymentMethod: "Cash"
    }
  ],

  inventory: [
    { id: "INV-101", name: "Composite Resin A2 Shade Syringe", category: "Restorative", stock: 45, unit: "Pcs", reorderLevel: 10, supplier: "3M Oral Care", expireDate: "2027-11-30" },
    { id: "INV-102", name: "Dental Anesthetic Articaine 4% 1:100k", category: "Anesthesia", stock: 8, unit: "Boxes (50ct)", reorderLevel: 15, supplier: "Septodont", expireDate: "2026-10-15" },
    { id: "INV-103", name: "Nitrile Examination Gloves (Medium)", category: "PPE & Hygiene", stock: 120, unit: "Boxes", reorderLevel: 25, supplier: "Henry Schein Dental", expireDate: "2028-05-01" },
    { id: "INV-104", name: "Prophy Paste Coarse Mint", category: "Hygiene", stock: 12, unit: "Tubs", reorderLevel: 5, supplier: "Young Dental", expireDate: "2027-01-20" },
    { id: "INV-105", name: "Diamond Burs Assorted Pack", category: "Burs & Instruments", stock: 3, unit: "Packs", reorderLevel: 8, supplier: "Brasseler USA", expireDate: "N/A" }
  ],

  labOrders: [
    {
      id: "LAB-501",
      patientId: "P-1001",
      patientName: "Sophia Martinez",
      dentistName: "Dr. Sarah Jenkins",
      labName: "Apex Dental Prosthetics Lab",
      workType: "Zirconia Crown (Tooth #3)",
      shade: "A2",
      orderDate: "2026-07-21",
      dueDate: "2026-07-29",
      status: "In Fabrication",
      cost: 280.00
    },
    {
      id: "LAB-502",
      patientId: "P-1004",
      patientName: "Alexander Wright",
      dentistName: "Dr. Michael Chen",
      labName: "Precision Implant Dental Lab",
      workType: "Implant Custom Abutment & Crown",
      shade: "A3",
      orderDate: "2026-07-15",
      dueDate: "2026-07-28",
      status: "Ready for Fitting",
      cost: 450.00
    }
  ],

  crmLogs: [
    { id: "CRM-301", patientName: "Sophia Martinez", type: "6-Month Recall", date: "2026-07-25", channel: "SMS", status: "Sent", message: "Reminder: Your routine dental hygiene cleaning is due next month." },
    { id: "CRM-302", patientName: "Marcus Vance", type: "Post-op Followup", date: "2026-07-27", channel: "Call", status: "Completed", message: "Called patient following root canal procedure. Patient reports minimal pain." },
    { id: "CRM-303", patientName: "Emily Watson", type: "Appointment Confirmation", date: "2026-07-26", channel: "Email", status: "Delivered", message: "Appointment confirmed for July 27 at 02:15 PM with Dr. Rostova." }
  ],

  branches: [
    { id: "BR-01", name: "Beverly Hills Central (HQ)", address: "742 Evergreen Terrace, Suite 400, Beverly Hills, CA 90210", phone: "+1 (800) 555-3368", status: "Active", chairsCount: 4, manager: "Dr. Sarah Jenkins", revenueMonth: "$124,500" },
    { id: "BR-02", name: "Westside Implant & Ortho Center", address: "10250 Santa Monica Blvd, West Los Angeles, CA 90067", phone: "+1 (800) 555-8821", status: "Active", chairsCount: 6, manager: "Dr. Robert Vance", revenueMonth: "$98,400" },
    { id: "BR-03", name: "Downtown Smile Hub", address: "555 S Flower Street, Floor 12, Los Angeles, CA 90071", phone: "+1 (800) 555-1902", status: "Active", chairsCount: 3, manager: "Dr. Michael Chen", revenueMonth: "$76,200" }
  ],

  staff: [
    { id: "ST-101", name: "Dr. Sarah Jenkins", role: "Chief Dental Surgeon", branchId: "BR-01", branchName: "Beverly Hills Central", type: "Dentist", email: "s.jenkins@dentee.com", phone: "+1 (555) 901-1122", schedule: "Mon-Fri (08:00 AM - 04:30 PM)", status: "On Duty", avatar: "👩⚕️" },
    { id: "ST-102", name: "Dr. Robert Vance", role: "Endodontist & Root Canal Specialist", branchId: "BR-02", branchName: "Westside Implant Center", type: "Dentist", email: "r.vance@dentee.com", phone: "+1 (555) 901-2233", schedule: "Mon-Thu (09:00 AM - 05:00 PM)", status: "On Duty", avatar: "👨⚕️" },
    { id: "ST-103", name: "Dr. Elena Rostova", role: "Orthodontist & Pediatric Specialist", branchId: "BR-01", branchName: "Beverly Hills Central", type: "Dentist", email: "e.rostova@dentee.com", phone: "+1 (555) 901-3344", schedule: "Tue-Sat (09:00 AM - 05:30 PM)", status: "On Duty", avatar: "👩⚕️" },
    { id: "ST-104", name: "Dr. Michael Chen", role: "Periodontist & Implant Surgeon", branchId: "BR-03", branchName: "Downtown Smile Hub", type: "Dentist", email: "m.chen@dentee.com", phone: "+1 (555) 901-4455", schedule: "Mon-Fri (10:00 AM - 06:00 PM)", status: "On Duty", avatar: "👨⚕️" },
    { id: "ST-201", name: "Jessica Alba", role: "Lead Registered Dental Hygienist", branchId: "BR-01", branchName: "Beverly Hills Central", type: "Hygienist", email: "j.alba@dentee.com", phone: "+1 (555) 901-5566", schedule: "Mon-Fri (08:30 AM - 05:00 PM)", status: "On Duty", avatar: "🩺" },
    { id: "ST-202", name: "David Miller", role: "Certified Dental Assistant", branchId: "BR-01", branchName: "Beverly Hills Central", type: "Assistant", email: "d.miller@dentee.com", phone: "+1 (555) 901-6677", schedule: "Mon-Fri (08:00 AM - 04:30 PM)", status: "On Duty", avatar: "🥼" },
    { id: "ST-301", name: "Rachel Adams", role: "Front Desk & Patient Coordinator", branchId: "BR-01", branchName: "Beverly Hills Central", type: "Receptionist", email: "r.adams@dentee.com", phone: "+1 (555) 901-7788", schedule: "Mon-Fri (07:30 AM - 04:00 PM)", status: "On Duty", avatar: "👩💼" }
  ],

  treatmentPlans: [
    {
      id: "TP-701",
      patientId: "P-1001",
      patientName: "Sophia Martinez",
      title: "Comprehensive Restorative & Crown Rehabilitation",
      createdDate: "2026-07-22",
      dentistName: "Dr. Sarah Jenkins",
      status: "Approved",
      approvedDate: "2026-07-24",
      signature: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='50'><path d='M 10 30 Q 30 5, 60 30 T 110 30 T 160 20' stroke='%230f172a' stroke-width='3' fill='none'/></svg>",
      phases: [
        { phase: "Phase 1: Urgent Care & Hygiene", status: "Completed", items: [{ code: "D1110", description: "Prophylaxis Cleaning", cost: 110.00 }, { code: "D0210", description: "Full X-Ray Series", cost: 140.00 }] },
        { phase: "Phase 2: Restorative Therapy", status: "In Progress", items: [{ code: "D2392", description: "Composite Resin Filling (Tooth #14)", cost: 240.00 }, { code: "D3310", description: "Root Canal Therapy (Tooth #19)", cost: 850.00 }] },
        { phase: "Phase 3: Prosthetics & Protection", status: "Scheduled", items: [{ code: "D2750", description: "Zirconia Porcelain Crown (Tooth #3)", cost: 1200.00 }] }
      ],
      totalEstimate: 2540.00,
      discountPercent: 10,
      finalCost: 2286.00
    },
    {
      id: "TP-702",
      patientId: "P-1004",
      patientName: "Alexander Wright",
      title: "Single Tooth Dental Implant & Bone Grafting",
      createdDate: "2026-07-25",
      dentistName: "Dr. Michael Chen",
      status: "Pending Approval",
      approvedDate: null,
      signature: null,
      phases: [
        { phase: "Phase 1: Surgical Placement", status: "Scheduled", items: [{ code: "D6010", description: "Surgical Placement of Implant Body", cost: 2200.00 }] },
        { phase: "Phase 2: Abutment & Crown Fitting", status: "Pending", items: [{ code: "D6058", description: "Abutment Supported Porcelain Crown", cost: 1450.00 }] }
      ],
      totalEstimate: 3650.00,
      discountPercent: 5,
      finalCost: 3467.50
    }
  ],

  consentForms: [
    { id: "CF-01", title: "General Dental Treatment Consent", category: "General", lastUpdated: "2026-01-15", requiresSignature: true },
    { id: "CF-02", title: "Local Anesthesia & Sedation Consent", category: "Anesthesia", lastUpdated: "2026-02-10", requiresSignature: true },
    { id: "CF-03", title: "Endodontic (Root Canal) Procedure Informed Consent", category: "Endodontics", lastUpdated: "2026-03-20", requiresSignature: true },
    { id: "CF-04", title: "Surgical Tooth Extraction & Bone Graft Consent", category: "Surgery", lastUpdated: "2026-04-12", requiresSignature: true },
    { id: "CF-05", title: "Dental Implant Surgical Informed Consent", category: "Implantology", lastUpdated: "2026-05-01", requiresSignature: true }
  ],

  recalls: [
    { id: "REC-101", patientId: "P-1001", patientName: "Sophia Martinez", type: "6-Month Dental Checkup & Hygiene", dueDate: "2026-08-20", channel: "WhatsApp", status: "Scheduled", phone: "+1 (555) 234-5678" },
    { id: "REC-102", patientId: "P-1002", patientName: "Marcus Vance", type: "Root Canal Follow-Up & Crown Review", dueDate: "2026-08-05", channel: "SMS", status: "Pending Dispatch", phone: "+1 (555) 876-5432" },
    { id: "REC-103", patientId: "P-1003", patientName: "Emily Watson", type: "Pediatric Fluoride & Ortho Assessment", dueDate: "2026-09-15", channel: "Email", status: "Scheduled", phone: "+1 (555) 345-6789" },
    { id: "REC-104", patientId: "P-1004", patientName: "Alexander Wright", type: "Implant Maintenance & Periodontal Eval", dueDate: "2026-08-28", channel: "WhatsApp", status: "Scheduled", phone: "+1 (555) 987-6543" }
  ]
};

