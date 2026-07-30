/* ==========================================================================
   DENTEE - INBOX MESSAGING MODULE
   System inbox for appointment confirmations, billing alerts, recall notices
   ========================================================================== */

const InboxModule = {
  currentFilter: "all",

  render() {
    const container = document.getElementById("inbox-module");
    if (!container) return;

    let messages = store.getInboxMessages();
    const unreadCount = store.getUnreadInboxCount();

    if (this.currentFilter !== "all") {
      messages = messages.filter(m => m.category === this.currentFilter);
    }

    container.innerHTML = `
      <div class="page-title-bar">
        <div>
          <h1 class="page-title">📥 Inbox</h1>
          <div class="page-subtitle">System notifications, clinical alerts, administrative messages</div>
        <div style="display:flex; gap:0.5rem; align-items:center;">
          <span class="badge badge-info" style="font-size:0.85rem;">${unreadCount} Unread</span>
          <button class="btn btn-secondary btn-sm" onclick="InboxModule.markAllRead()">✓ Mark All Read</button>
        </div>

      <!-- Filter Tabs -->
      <div class="card" style="padding:0.75rem 1rem; margin-bottom:1.5rem;">
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <button class="btn ${this.currentFilter === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="InboxModule.filterBy('all')">All</button>
          <button class="btn ${this.currentFilter === 'clinical' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="InboxModule.filterBy('clinical')">🏥 Clinical</button>
          <button class="btn ${this.currentFilter === 'administrative' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="InboxModule.filterBy('administrative')">📋 Administrative</button>
          <button class="btn ${this.currentFilter === 'insurance' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="InboxModule.filterBy('insurance')">🛡️ Insurance</button>
          <button class="btn ${this.currentFilter === 'inventory' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="InboxModule.filterBy('inventory')">📦 Inventory</button>
          <button class="btn ${this.currentFilter === 'system' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="InboxModule.filterBy('system')">⚙️ System</button>
        </div>

      <!-- Inbox Messages -->
      <div class="card" style="padding:0;">
        ${messages.length === 0 ? `
          <div style="padding:3rem; text-align:center; color:var(--text-muted);">
            <div style="font-size:2.5rem; margin-bottom:0.5rem;">📥</div>
            <h3>All caught up!</h3>
            <p style="font-size:0.85rem;">No messages in this category.</p>
          </div>
        ` : messages.map(msg => `
          <div class="inbox-item ${msg.read ? '' : 'unread'}" onclick="InboxModule.openMessage('${msg.id}')" style="
            display:flex;
            gap:1rem;
            padding:1rem 1.25rem;
            border-bottom:1px solid var(--border-color);
            cursor:pointer;
            transition:background var(--transition-fast);
            ${msg.read ? '' : 'background:var(--primary-light);'}
          ">
            <div style="width:40px; height:40px; border-radius:50%; background:${this.getPriorityColor(msg.priority)}; display:flex; align-items:center; justify-content:center; color:white; font-weight:800; font-size:0.85rem; flex-shrink:0;">
              ${msg.from.charAt(0)}
            </div>
            <div style="flex:1; min-width:0;">
              <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem;">
                <div style="font-weight:${msg.read ? '600' : '800'}; font-size:0.9rem; color:var(--text-primary);">${msg.subject}</div>
                <div style="display:flex; gap:0.3rem; align-items:center; flex-shrink:0;">
                  <span class="badge ${this.getCategoryBadge(msg.category)}" style="font-size:0.6rem;">${msg.category}</span>
                  <span class="badge ${this.getPriorityBadge(msg.priority)}" style="font-size:0.6rem;">${msg.priority}</span>
                  ${!msg.read ? '<span style="width:8px; height:8px; background:var(--primary); border-radius:50%; display:inline-block;"></span>' : ''}
                </div>
              <div style="font-size:0.82rem; color:var(--text-secondary); margin-top:2px;">
                <strong>${msg.from}</strong>
              </div>
              <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px; line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
                ${msg.message}
              </div>
              <div style="font-size:0.7rem; color:var(--text-muted); margin-top:6px;">
                ${this.timeAgo(msg.timestamp)}
              </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  filterBy(category) {
    this.currentFilter = category;
    this.render();
  },

  openMessage(msgId) {
    store.markInboxRead(msgId);
    const msg = store.getInboxMessages().find(m => m.id === msgId);
    if (!msg) return;

    app.openModal(msg.subject, `
      <div style="max-height:60vh; overflow-y:auto;">
        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem; padding-bottom:0.75rem; border-bottom:1px solid var(--border-color);">
          <div style="width:40px; height:40px; border-radius:50%; background:${this.getPriorityColor(msg.priority)}; display:flex; align-items:center; justify-content:center; color:white; font-weight:800;">
            ${msg.from.charAt(0)}
          </div>
          <div>
            <div style="font-weight:700;">${msg.from}</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">${this.timeAgo(msg.timestamp)} • <span class="badge ${this.getCategoryBadge(msg.category)}">${msg.category}</span></div>
        </div>
        <p style="line-height:1.6; font-size:0.9rem; color:var(--text-secondary);">${msg.message}</p>
        <div style="margin-top:1.5rem; display:flex; justify-content:flex-end; gap:0.5rem;">
          <button class="btn btn-secondary" onclick="app.closeModal()">Close</button>
        </div>
    `);
    this.render();
  },

  markAllRead() {
    store.markAllInboxRead();
    app.showToast("All inbox messages marked as read.");
    this.render();
    // Update notification badge too
    NotificationModule.updateBadge();
  },

  getPriorityColor(priority) {
    if (priority === "high") return "#ef4444";
    if (priority === "medium") return "#f59e0b";
    return "#028090";
  },

  getPriorityBadge(priority) {
    if (priority === "high") return "badge-danger";
    if (priority === "medium") return "badge-warning";
    return "badge-info";
  },

  getCategoryBadge(category) {
    switch (category) {
      case "clinical": return "badge-danger";
      case "administrative": return "badge-info";
      case "insurance": return "badge-warning";
      case "inventory": return "badge-secondary";
      case "system": return "badge-success";
      default: return "badge-secondary";
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
