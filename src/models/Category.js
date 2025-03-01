// src/models/Category.js
class Category {
  constructor(categoryData = {}) {
    this.id = categoryData.id || crypto.randomUUID();
    this.name = categoryData.name || '';
    this.color = categoryData.color || '#6366F1'; // Default indigo color
    this.icon = categoryData.icon || 'tag'; // Default icon
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      icon: this.icon
    };
  }

  static fromJSON(json) {
    return new Category(json);
  }
}

export default Category;