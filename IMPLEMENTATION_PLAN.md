# Dentee — Implementation Plan (Pro & Premium)

> Reframed around the official **Pro** and **Premium** product tiers.

---

## 1. Product Tier Overview

Dentee ships as two plans. **Pro** covers day-to-day clinic operations. **Premium** adds advanced clinical tools, communications, multi-location control, and AI.

| # | Feature | Pro | Premium |
|---|---------|:---:|:-------:|
| 1 | Patient records | ✓ | ✓ |
| 2 | Appointments | ✓ | ✓ |
| 3 | Treatment plan | ✓ | ✓ |
| 4 | Billing & GST billing | ✓ | ✓ |
| 5 | Insurance | ✓ | ✓ |
| 6 | Prescriptions | | ✓ |
| 7 | Inventory | | ✓ |
| 8 | Pharmacy | | ✓ |
| 9 | SMS / Email | | ✓ |
| 10 | WhatsApp reminder | | ✓ |
| 11 | Mobile app | | ✓ |
| 12 | 32 Tooth chart | | ✓ |
| 13 | AI features | | ✓ |
| 14 | Multiclinic management | | ✓ |
| 15 | Staff individual access | | ✓ |
| 16 | Lab follow-up | | ✓ |
| 17 | Digital imaging | | ✓ |

---

## 2. Implementation Phases

### Phase 1 — Pro Plan (Core Clinic OS)

**Goal:** A single-clinic practice can run patients, scheduling, treatment, billing, and insurance without Premium modules.

| Module | Scope | Priority |
|--------|-------|----------|
| **Patient records** | Registration, demographics, medical alerts, visit history, search | P0 |
| **Appointments** | Queue, calendar, dentist schedule, status workflow | P0 |
| **Treatment plan** | Phased plans, cost estimates, patient approval | P0 |
| **Billing & GST billing** | Invoices, receipts, GST line items, payment tracking | P0 |
| **Insurance** | Policy details, claim submission, pre-auth, claim status | P0 |

**Pro exit criteria**
- [ ] Front desk can register a patient and book an appointment end-to-end
- [ ] Dentist can create and approve a treatment plan with cost breakdown
- [ ] Billing generates GST-compliant invoice and records payment
- [ ] Insurance claim can be filed and tracked against an invoice
- [ ] Navigation shows only Pro modules when plan = `pro`

---

### Phase 2 — Premium Plan (Advanced Clinic OS)

**Goal:** Upsell features for larger or multi-location practices: clinical depth, outreach, inventory, and AI.

| Module | Scope | Priority |
|--------|-------|----------|
| **Prescriptions** | Rx templates, drug catalog, print/share | P1 |
| **Inventory** | Stock, reorder alerts, supplier tracking | P1 |
| **Pharmacy** | Dispense linked to Rx, batch/expiry, billing tie-in | P1 |
| **SMS / Email** | Campaigns, recall rules, delivery logs | P1 |
| **WhatsApp reminder** | Appointment & recall templates via WhatsApp API | P1 |
| **Mobile app** | Patient self-service (appointments, bills, Rx) — PWA or native | P2 |
| **32 Tooth chart** | Interactive 32/20 chart, per-tooth status & notes | P1 |
| **AI features** | Symptom assist, treatment suggestions, SOAP notes | P2 |
| **Multiclinic management** | Branch switcher, per-branch stats, central dashboard | P1 |
| **Staff individual access** | Roles, permissions, per-staff login | P1 |
| **Lab follow-up** | Lab orders, status pipeline, patient linkage | P1 |
| **Digital imaging** | X-ray upload, viewer, tooth annotation | P1 |

**Premium exit criteria**
- [ ] Plan toggle (`pro` / `premium`) gates Premium nav items and routes
- [ ] All 12 Premium modules functional with seed/demo data
- [ ] SMS/Email and WhatsApp flows log outbound messages in CRM
- [ ] Staff roles restrict access (e.g. receptionist vs dentist)
- [ ] Multiclinic context persists across modules

---

## 3. Current Codebase Mapping

### Pro modules — status

| Feature | File(s) | Status | Notes |
|---------|---------|--------|-------|
| Patient records | `js/modules/patients.js` | ✅ Built | CRUD, profile, alerts |
| Appointments | `js/modules/appointments.js`, `calendar.js` | ✅ Built | Queue + dentist calendar |
| Treatment plan | `js/modules/treatmentPlan.js` | ✅ Built | Phases, approval, quotation |
| Billing & GST | `js/modules/billing.js` | ⚠️ Partial | Invoices exist; **GST fields & tax breakdown needed** |
| Insurance | — | ❌ Missing | **New module required** |

### Premium modules — status

| Feature | File(s) | Status | Notes |
|---------|---------|--------|-------|
| Prescriptions | `js/modules/prescription.js` | ✅ Built | |
| Inventory | `js/modules/inventory.js` | ✅ Built | |
| Pharmacy | — | ❌ Missing | **New module**; link to Rx + inventory |
| SMS / Email | `js/modules/crm.js` | ⚠️ Partial | UI + logs; needs provider integration stub |
| WhatsApp reminder | `js/app.js` (`shareViaWhatsApp`) | ⚠️ Partial | Manual share only; needs scheduled reminders |
| Mobile app | `js/modules/patientPortal.js`, `onlineBooking.js` | ⚠️ Partial | Web portal; not a native/PWA mobile shell |
| 32 Tooth chart | `js/modules/toothChart.js` | ✅ Built | |
| AI features | `js/modules/aiAssistant.js` | ✅ Built | Demo responses |
| Multiclinic | `js/modules/multiClinic.js` | ✅ Built | Header branch selector exists |
| Staff access | `js/modules/staff.js` | ⚠️ Partial | Roster only; **no role-based permissions** |
| Lab follow-up | `js/modules/lab.js` | ✅ Built | |
| Digital imaging | `js/modules/xray.js` | ✅ Built | |

### Out of tier scope (demo extras)

These exist in the demo app but are **not** on the Pro/Premium sheet. Keep them internal or fold into Premium later:

| Module | File | Suggestion |
|--------|------|------------|
| Procedures catalog | `procedures.js` | Merge into treatment plan / billing |
| Reports & analytics | `reports.js` | Premium add-on or Pro lite reports |
| Online booking | `onlineBooking.js` | Part of Mobile app / patient portal |

---

## 4. Recommended Build Order

```
Phase 1 — Pro (weeks 1–4)
├── 1.1 Patient records          [done]
├── 1.2 Appointments + calendar    [done]
├── 1.3 Treatment plan             [done]
├── 1.4 Billing + GST fields       [in progress]
└── 1.5 Insurance module           [to build]

Phase 2 — Premium clinical (weeks 5–8)
├── 2.1 32 Tooth chart             [done]
├── 2.2 Digital imaging            [done]
├── 2.3 Prescriptions              [done]
├── 2.4 Lab follow-up              [done]
└── 2.5 Inventory                  [done]

Phase 3 — Premium operations (weeks 9–12)
├── 3.1 Pharmacy module            [to build]
├── 3.2 SMS/Email automation       [extend crm.js]
├── 3.3 WhatsApp scheduled reminders
├── 3.4 Staff roles & permissions  [extend staff.js]
└── 3.5 Multiclinic hardening      [extend multiClinic.js]

Phase 4 — Premium platform (weeks 13–16)
├── 4.1 AI features (API integration)
├── 4.2 Mobile app (PWA shell)
└── 4.3 Plan gating in UI + store
```

---

## 5. Architecture: Plan Gating

Introduce a single source of truth for the active plan:

```js
// js/planConfig.js
const PLAN_FEATURES = {
  pro: [
    "patients", "appointments", "calendar", "treatment-plan",
    "billing", "insurance"
  ],
  premium: [
    "patients", "appointments", "calendar", "treatment-plan",
    "billing", "insurance",
    "prescription", "inventory", "pharmacy", "crm",
    "tooth-chart", "ai-assistant", "multi-clinic", "staff",
    "lab", "xray", "patient-portal"
  ]
};
```

**UI changes**
- Sidebar grouped as **Pro Core** vs **Premium** (locked items show upgrade badge)
- `brand-tag` reflects active plan (`PRO` / `PREMIUM`)
- `app.navigateTo()` blocks Premium routes when plan = `pro`

---

## 6. New Modules to Build

### 6.1 Insurance (`js/modules/insurance.js`) — Pro

- Patient insurance policy (provider, member ID, coverage %)
- Link claims to invoices and treatment plans
- Claim lifecycle: Draft → Submitted → Approved / Denied
- Pre-authorization requests

### 6.2 Pharmacy (`js/modules/pharmacy.js`) — Premium

- Dispense from prescription + inventory stock
- Batch number, expiry, quantity
- Optional pharmacy billing line on invoice

### 6.3 GST billing enhancements — Pro

- GSTIN on clinic profile
- CGST / SGST / IGST split on invoice line items
- GST summary on invoice PDF/print view

---

## 7. Navigation Restructure (Target)

Align `index.html` sidebar with tiers:

**Pro Core**
- Digital Patient Records
- Appointments Queue
- Dentist Calendar
- Treatment Plans
- Billing & GST
- Insurance

**Premium** *(badge or lock on Pro plan)*
- 32 Tooth Chart
- Digital Imaging
- Prescriptions
- Inventory
- Pharmacy
- Lab Follow-up
- SMS / Email & WhatsApp
- AI Assistant
- Multiclinic Hub
- Staff & Access Control
- Patient Mobile Portal

---

## 8. Data Model Additions

| Entity | Plan | Key fields |
|--------|------|------------|
| `insurancePolicies` | Pro | patientId, provider, policyNo, coverage, validUntil |
| `insuranceClaims` | Pro | invoiceId, policyId, amount, status, submittedDate |
| `pharmacyDispenses` | Premium | rxId, drugId, qty, batch, expiry, dispensedBy |
| `staffRoles` | Premium | staffId, role, permissions[] |
| `whatsappReminders` | Premium | patientId, template, scheduledAt, status |
| `gstConfig` | Pro | clinicGSTIN, defaultTaxRate, stateCode |

---

## 9. Success Metrics

| Metric | Pro | Premium |
|--------|-----|---------|
| Time to first invoice | < 10 min after patient registration | — |
| Appointment → reminder sent | — | Automated within 24h |
| Multi-branch switch | — | < 1s context change |
| Insurance claim tracked | 100% linked to invoice | — |
| Premium upgrade path | Clear locked UI + one-click demo toggle | — |

---

## 10. Immediate Next Steps

1. **Add `js/planConfig.js`** and wire plan gating in `app.js` + sidebar
2. **Build Insurance module** (last Pro gap)
3. **Add GST fields** to billing invoices and clinic profile
4. **Reorganize `index.html` nav** into Pro / Premium sections
5. **Build Pharmacy module** and link to prescriptions + inventory
6. **Extend CRM** for scheduled WhatsApp/SMS reminders
7. **Add staff permissions** (role matrix on Premium)

---

*Last updated: July 28, 2026 — aligned to Pro/Premium feature comparison sheet.*
