/* ==========================================================================
   DENTEE - DENTAL CLINIC INVENTORY & STOCK CONTROL MODULE
   ========================================================================== */

const InventoryModule = {
  render() {
    const container = document.getElementById("inventory-module");
    if (!container) return;

    const inventory = store.getInventory();
    const lowStockCount = inventory.filter(i => i.stock <= i.reorderLevel).length;

    container.innerHTML = `
      <div class="page-title-bar">
        <div>
          <h1 class="page-title">Dental Inventory & Stock Control</h1>
          <div class="page-subtitle">Track dental supplies, composite shades, anesthetics, and expiration dates</div>
        </div>
        <button class="btn btn-primary" onclick="InventoryModule.openAddItemModal()">
          + Add Stock Item
        </button>
      </div>

      <div class="grid-stats">
        <div class="stat-card">
          <div class="stat-icon teal">📦</div>
          <div>
            <div class="stat-val">${inventory.length}</div>
            <div class="stat-label">Total Catalog SKU Items</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon ${lowStockCount > 0 ? 'amber' : 'emerald'}">⚠️</div>
          <div>
            <div class="stat-val">${lowStockCount}</div>
            <div class="stat-label">Low Stock Reorder Alerts</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Stock Catalog</h2>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>SKU ID</th>
                <th>Material / Item Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Reorder Level</th>
                <th>Supplier</th>
                <th>Expiration</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${inventory.map(item => {
                const isLow = item.stock <= item.reorderLevel;
                return `
                  <tr>
                    <td><strong style="color:var(--text-muted);">${item.id}</strong></td>
                    <td><strong>${item.name}</strong></td>
                    <td><span class="badge badge-secondary">${item.category}</span></td>
                    <td>
                      <span class="badge ${isLow ? 'badge-danger' : 'badge-success'}">
                        ${item.stock} ${item.unit}
                      </span>
                    </td>
                    <td>${item.reorderLevel} ${item.unit}</td>
                    <td>${item.supplier}</td>
                    <td>${item.expireDate}</td>
                    <td>
                      <button class="btn btn-outline btn-sm" onclick="app.showToast('Reorder PO sent to ${item.supplier}')">
                        📦 Reorder
                      </button>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  openAddItemModal() {
    app.openModal("Add Inventory Item", `
      <form id="new-inv-item-form" onsubmit="InventoryModule.saveItem(event)">
        <div class="form-grid">
          <div class="form-group">
            <label>Item Name *</label>
            <input type="text" class="form-control" name="name" required placeholder="e.g. Etching Gel 37%">
          </div>
          <div class="form-group">
            <label>Category *</label>
            <select class="form-control" name="category">
              <option value="Restorative">Restorative</option>
              <option value="Anesthesia">Anesthesia</option>
              <option value="PPE & Hygiene">PPE & Hygiene</option>
              <option value="Hygiene">Hygiene</option>
              <option value="Burs & Instruments">Burs & Instruments</option>
            </select>
          </div>
          <div class="form-group">
            <label>Initial Stock Quantity *</label>
            <input type="number" class="form-control" name="stock" required value="20">
          </div>
          <div class="form-group">
            <label>Unit (e.g. Pcs, Boxes) *</label>
            <input type="text" class="form-control" name="unit" required value="Boxes">
          </div>
          <div class="form-group">
            <label>Reorder Alert Level *</label>
            <input type="number" class="form-control" name="reorderLevel" required value="5">
          </div>
          <div class="form-group">
            <label>Supplier Name *</label>
            <input type="text" class="form-control" name="supplier" required placeholder="e.g. Henry Schein">
          </div>
          <div class="form-group full-width">
            <label>Expiration Date</label>
            <input type="date" class="form-control" name="expireDate" value="2027-12-31">
          </div>
        </div>
        <div style="margin-top:1.5rem; display:flex; justify-content:flex-end; gap:0.75rem;">
          <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Inventory Item</button>
        </div>
      </form>
    `);
  },

  saveItem(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.stock = parseInt(data.stock, 10);
    data.reorderLevel = parseInt(data.reorderLevel, 10);

    store.addInventoryItem(data);
    app.closeModal();
    app.showToast("Stock item added successfully!");
    this.render();
  }
};
