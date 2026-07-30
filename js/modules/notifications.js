/* ==========================================================================
   DENTEE - NOTIFICATION SYSTEM
   Real-time notifications for appointments, billing, recalls, and system alerts
   ========================================================================== */

const NotificationModule = {
  isOpen: false,

  init() {
    this.render();
  },

  render() {
    const bellBtn = document.getElementById("notif-bell-btn");
    if (!bellBtn) return;

    const unreadCount = store.getUnreadNotificationCount();
    const badge = bellBtn.querySelector(".notif-badge-count");
    if (badge) {
      badge.textContent = unreadCount;
      badge.style.display = unreadCount > 0 ? "flex" : "none";
    }

    const dropdown = document.getElementById("notif-dropdown");
    if (!dropdown) return;

    const notifications = store.getNotifications();
    dropdown.innerHTML = `
      <div style="padding:0.75rem 1rem; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
        <strong style="font-size:0.9rem;">🔔 Notifications</strong>
        <button class="btn btn-secondary btn-sm" onclick="NotificationModule.markAllRead()" style="font-size:0.7rem; padding:0.25rem 0.5rem;">
          Mark All Read
        </button>
      </div>
      <div style="max-height:320px; overflow-y:auto;">
        ${notifications.length === 0 ? `
          <div style="padding:2rem; text-align:center; color:var(--text-muted);">
            <div style="font-size:2rem; margin-bottom:0.5rem;">🔔</div>
            <div>No notifications yet</div>
          </div>
        ` : notifications.map(n => `
          <div class="notif-item ${n.read ? '' : 'unread'}" onclick="NotificationModule.handleClick('${n.id}')" style="
            display:flex;
            gap:0.75rem;
            padding:0.85rem 1rem;
            border-bottom:1px solid var(--border-color);
            cursor:pointer;
            transition:background var(--transition-fast);
            ${n.read ? '' : 'background:var(--primary-light);'}
          ">
            <div style="font-size:1.3rem; width:32px; text-align:center;">${n.icon || '🔔'}</div>
            <div style="flex:1; min-width:0;">
              <div style="font-weight:${n.read ? '600' : '800'}; font-size:0.85rem; color:var(--text-primary);">${n.title}</div>
              <div style="font-size:0.78rem; color:var(--text-secondary); margin-top:2px; line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${n.message}</div>
              <div style="font-size:0.7rem; color:var(--text-muted); margin-top:4px;">
                ${this.timeAgo(n.timestamp)}
                <span class="badge badge-secondary" style="font-size:0.6rem; margin-left:0.4rem;">${n.type}</span>
              </div>
            </div>
            <button class="close-btn" style="width:20px; height:20px; font-size:0.7rem; flex-shrink:0;" onclick="event.stopPropagation(); NotificationModule.dismiss('${n.id}')">✕</button>
          </div>
        `).join('')}
      </div>
      <div style="padding:0.6rem 1rem; border-top:1px solid var(--border-color); text-align:center;">
        <button class="btn btn-secondary btn-sm" onclick="NotificationModule.toggleDropdown(); app.navigateTo('inbox')" style="font-size:0.78rem;">
          View All in Inbox 📥
        </button>
      </div>
    `;
  },

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    const dropdown = document.getElementById("notif-dropdown");
    const overlay = document.getElementById("notif-overlay");
    if (dropdown) {
      dropdown.style.display = this.isOpen ? "block" : "none";
      dropdown.classList.toggle("glass-panel", this.isOpen);
    }
    if (overlay) overlay.style.display = this.isOpen ? "block" : "none";
    if (this.isOpen) this.render();
  },

  closeDropdown() {
    this.isOpen = false;
    const dropdown = document.getElementById("notif-dropdown");
    const overlay = document.getElementById("notif-overlay");
    if (dropdown) dropdown.style.display = "none";
    if (overlay) overlay.style.display = "none";
  },

  handleClick(notifId) {
    store.markNotificationRead(notifId);
    this.render();
    // Update bell badge
    const badge = document.getElementById("notif-bell-btn")?.querySelector(".notif-badge-count");
    if (badge) badge.textContent = store.getUnreadNotificationCount();
  },

  markAllRead() {
    store.markAllNotificationsRead();
    this.render();
    this.updateBadge();
    app.showToast("All notifications marked as read.");
  },

  dismiss(notifId) {
    store.clearNotification(notifId);
    this.render();
    this.updateBadge();
  },

  updateBadge() {
    const badge = document.getElementById("notif-bell-btn")?.querySelector(".notif-badge-count");
    if (badge) {
      const count = store.getUnreadNotificationCount();
      badge.textContent = count;
      badge.style.display = count > 0 ? "flex" : "none";
    }
  },

  timeAgo(timestamp) {
    const now = Date.now();
    const diff = now - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  }
};

/* ==========================================================================
   AUTO-NOTIFICATION GENERATOR
   Creates notifications from system events
   ========================================================================== */

const NotificationGenerator = {
  appointmentReminder(apt) {
    store.addNotification({
      type: "appointment",
      icon: "📅",
      title: "Appointment Reminder",
      message: `${apt.patientName} has an appointment in 30 minutes with ${apt.dentistName} (${apt.chair}).`
    });
  },

  paymentReceived(invoice) {
    store.addNotification({
      type: "billing",
      icon: "💵",
      title: "Payment Received",
      message: `Payment of $${invoice.paid.toFixed(2)} received from ${invoice.patientName} (Invoice ${invoice.id}).`
    });
  },

  recallDue(recall) {
    store.addNotification({
      type: "recall",
      icon: "🔄",
      title: "Recall Due",
      message: `${recall.patientName}'s ${recall.type} is due on ${recall.dueDate}.`
    });
  },

  lowStock(item) {
    store.addNotification({
      type: "inventory",
      icon: "📦",
      title: "Low Stock Alert",
      message: `${item.name} stock is low (${item.stock} ${item.unit}). Reorder level: ${item.reorderLevel}.`
    });
  },

  claimUpdate(claim, newStatus) {
    store.addNotification({
      type: "system",
      icon: "🛡️",
      title: "Insurance Claim Update",
      message: `Claim ${claim.id} for ${claim.patientName} has been ${newStatus.toLowerCase()}.`
    });
  }
};

