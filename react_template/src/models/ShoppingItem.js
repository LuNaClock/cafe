// src/models/ShoppingItem.js
class ShoppingItem {
  constructor(itemData = {}) {
    this.id = itemData.id || crypto.randomUUID();
    this.name = itemData.name || '';
    this.amount = itemData.amount || 0;
    this.unit = itemData.unit || '';
    this.recipeId = itemData.recipeId || '';
    this.checked = itemData.checked || false;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      amount: this.amount,
      unit: this.unit,
      recipeId: this.recipeId,
      checked: this.checked
    };
  }

  static fromJSON(json) {
    return new ShoppingItem(json);
  }

  toggleChecked() {
    this.checked = !this.checked;
    return this.checked;
  }
}

export default ShoppingItem;