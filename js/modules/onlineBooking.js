/* ==========================================================================
   DENTEE - ONLINE APPOINTMENT BOOKING PORTAL MODULE
   Patient-facing online appointment booking with real-time dentist availability
   ========================================================================== */

const OnlineBookingModule = {
  selectedBranch: "BR-01",
  selectedDentist: "D101",
  selectedDate: "2026-07-28",
  selectedTime: "10:00 AM",

  init() {
    this.render();
  },

  render() {
    const container = document.getElementById("online-booking-module");
    if (!container) return;

    const branches = store.getBranches();
    const dentists = store.getDentists();
    const procedures = store.getProcedures();

    container.innerHTML = `
      <div class="card" style="max-width:900px; margin: 0 auto;">
        <div class="card-header" style="border-bottom:1px solid var(--border-color); padding-bottom:1rem; margin-bottom:1.5rem;">
          <div>
            <div class="badge badge-info" style="margin-bottom:0.4rem;">🌐 PATIENT ONLINE BOOKING ENGINE</div>
            <h2 class="card-title">Book Dental Appointment Online</h2>
            <div class="page-subtitle">Select clinic branch, dentist specialist, procedure, and live open slot.</div>
          </div>
        </div>

        <form onsubmit="OnlineBookingModule.handleBookAppointment(event)">
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:1.25rem; margin-bottom:1.5rem;">
            
            <!-- Step 1: Select Clinic Branch -->
            <div class="form-group">
              <label style="font-weight:700;">1. Select Clinic Branch:</label>
              <select id="booking-branch" class="form-control" onchange="OnlineBookingModule.selectedBranch = this.value">
                ${branches.map(b => `<option value="${b.id}">${b.name} (${b.address.split(',')[0]})</option>`).join('')}
              </select>
            </div>

            <!-- Step 2: Select Dentist Specialist -->
            <div class="form-group">
              <label style="font-weight:700;">2. Select Dentist Specialist:</label>
              <select id="booking-dentist" class="form-control" onchange="OnlineBookingModule.selectedDentist = this.value">
                ${dentists.map(d => `<option value="${d.id}">${d.name} - ${d.specialty}</option>`).join('')}
              </select>
            </div>

            <!-- Step 3: Select Dental Service / Procedure -->
            <div class="form-group">
              <label style="font-weight:700;">3. Dental Service / Procedure:</label>
              <select id="booking-procedure" class="form-control">
                ${procedures.map(p => `<option value="${p.code} - ${p.name}">[${p.code}] ${p.name} ($${p.cost})</option>`).join('')}
              </select>
            </div>

            <!-- Step 4: Preferred Date -->
            <div class="form-group">
              <label style="font-weight:700;">4. Appointment Date:</label>
              <input type="date" id="booking-date" class="form-control" value="2026-07-28" min="2026-07-27">
            </div>

          </div>

          <!-- Step 5: Live Open Time Slots -->
          <div style="margin-bottom:1.5rem;">
            <label style="font-weight:700; display:block; margin-bottom:0.5rem;">5. Real-Time Available Time Slots:</label>
            <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap:0.5rem;" id="slot-picker">
              ${['09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM', '01:30 PM', '02:15 PM', '03:00 PM', '04:15 PM'].map(time => `
                <button type="button" class="btn ${time === this.selectedTime ? 'btn-primary' : 'btn-secondary'} btn-sm slot-btn" 
                  onclick="OnlineBookingModule.selectSlot('${time}', this)">
                  ⏰ ${time}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Step 6: Patient Details -->
          <div style="background:var(--bg-body); padding:1.25rem; border-radius:8px; margin-bottom:1.5rem;">
            <h4 style="margin-bottom:1rem; font-size:0.95rem; font-weight:800;">6. Patient Details:</h4>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:1rem;">
              <div class="form-group">
                <label>Full Name:</label>
                <input type="text" id="booking-patient-name" class="form-control" value="Sophia Martinez" required>
              </div>
              <div class="form-group">
                <label>Phone Number (WhatsApp):</label>
                <input type="tel" id="booking-patient-phone" class="form-control" value="+1 (555) 234-5678" required>
              </div>
              <div class="form-group">
                <label>Email Address:</label>
                <input type="email" id="booking-patient-email" class="form-control" value="sophia.m@example.com" required>
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end;">
            <button type="submit" class="btn btn-primary" style="padding:0.75rem 2rem; font-size:1rem;">
              ⚡ Confirm Instant Online Booking
            </button>
          </div>
        </form>
      </div>
    `;
  },

  selectSlot(time, btnEl) {
    this.selectedTime = time;
    document.querySelectorAll(".slot-btn").forEach(b => {
      b.classList.remove("btn-primary");
      b.classList.add("btn-secondary");
    });
    btnEl.classList.remove("btn-secondary");
    btnEl.classList.add("btn-primary");
  },

  handleBookAppointment(e) {
    e.preventDefault();
    const name = document.getElementById("booking-patient-name").value;
    const phone = document.getElementById("booking-patient-phone").value;
    const email = document.getElementById("booking-patient-email").value;
    const dentistId = document.getElementById("booking-dentist").value;
    const dentistObj = store.getDentists().find(d => d.id === dentistId);
    const proc = document.getElementById("booking-procedure").value;
    const date = document.getElementById("booking-date").value;

    const apt = store.addAppointment({
      patientId: "P-1001",
      patientName: name,
      dentistId: dentistId,
      dentistName: dentistObj ? dentistObj.name : "Dr. Sarah Jenkins",
      date: date,
      time: this.selectedTime,
      procedure: proc,
      chair: "Chair 1 (Operatory A)",
      notes: "Booked via Patient Online Booking Engine",
      status: "Scheduled"
    });

    // Auto trigger SMS/WhatsApp notification simulation
    store.addCrmLog({
      patientName: name,
      type: "Online Booking Confirmation",
      channel: "WhatsApp",
      status: "Delivered",
      message: `Your appointment with ${dentistObj ? dentistObj.name : 'Dentist'} on ${date} at ${this.selectedTime} is confirmed!`
    });

    app.showToast(`Appointment ${apt.id} booked successfully! Confirmation sent via WhatsApp/SMS.`);
    app.navigateTo("appointments");
  }
};
