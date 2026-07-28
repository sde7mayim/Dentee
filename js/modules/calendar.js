/* ==========================================================================
   DENTEE - DENTIST CALENDAR & SCHEDULE MODULE
   ========================================================================== */

const CalendarModule = {
  selectedDentistId: "all",

  render() {
    const container = document.getElementById("calendar-module");
    if (!container) return;

    const dentists = store.getDentists();
    const appointments = store.getAppointments();

    container.innerHTML = `
      <div class="page-title-bar">
        <div>
          <h1 class="page-title">Dentist Operatory Calendar</h1>
          <div class="page-subtitle">Schedule grid view across all operatory chairs and specialists</div>
        </div>
        <div style="display:flex; gap:0.5rem; align-items:center;">
          <label style="font-size:0.85rem; font-weight:700;">Filter Dentist:</label>
          <select class="form-control" style="width:auto;" onchange="CalendarModule.filterDentist(this.value)">
            <option value="all">All Specialists & Chairs</option>
            ${dentists.map(d => `<option value="${d.id}" ${this.selectedDentistId === d.id ? 'selected' : ''}>${d.name}</option>`).join("")}
          </select>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">📅 Current Week Schedule (July 2026)</h2>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-secondary btn-sm">◀ Previous</button>
            <button class="btn btn-secondary btn-sm">Today</button>
            <button class="btn btn-secondary btn-sm">Next ▶</button>
          </div>
        </div>

        <div class="calendar-grid">
          <div class="calendar-day-header">Mon (Jul 27)</div>
          <div class="calendar-day-header">Tue (Jul 28)</div>
          <div class="calendar-day-header">Wed (Jul 29)</div>
          <div class="calendar-day-header">Thu (Jul 30)</div>
          <div class="calendar-day-header">Fri (Jul 31)</div>
          <div class="calendar-day-header">Sat (Aug 01)</div>
          <div class="calendar-day-header">Sun (Aug 02)</div>

          ${this.renderCalendarDays(appointments)}
        </div>
      </div>
    `;
  },

  renderCalendarDays(appointments) {
    const days = [27, 28, 29, 30, 31, 1, 2];
    
    return days.map(dayNum => {
      const isToday = dayNum === 27;
      const dateStr = dayNum >= 27 ? `2026-07-${dayNum}` : `2026-08-0${dayNum}`;

      let dayApts = appointments.filter(a => a.date === dateStr);
      if (this.selectedDentistId !== "all") {
        dayApts = dayApts.filter(a => a.dentistId === this.selectedDentistId);
      }

      return `
        <div class="calendar-cell ${isToday ? 'today' : ''}">
          <div class="cell-number">${dayNum} ${dayNum === 27 ? '(Today)' : ''}</div>
          <div style="display:flex; flex-direction:column; gap:4px; margin-top:4px;">
            ${dayApts.map(apt => `
              <div class="calendar-event" title="${apt.patientName} - ${apt.procedure}"
                onclick="app.showToast('${apt.time}: ${apt.patientName} (${apt.procedure})')">
                ⏱️ ${apt.time} - ${apt.patientName.split(" ")[0]}
              </div>
            `).join("")}
            ${dayApts.length === 0 ? '<div style="font-size:0.7rem; color:var(--text-muted); text-align:center; margin-top:1rem;">No bookings</div>' : ''}
          </div>
        </div>
      `;
    }).join("");
  },

  filterDentist(id) {
    this.selectedDentistId = id;
    this.render();
  }
};
