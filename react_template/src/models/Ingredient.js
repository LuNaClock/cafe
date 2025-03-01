// src/models/Ingredient.js
class Ingredient {
  constructor(ingredientData = {}) {
    this.id = ingredientData.id || crypto.randomUUID();
    this.recipeId = ingredientData.recipeId || '';
    this.name = ingredientData.name || '';
    this.amount = ingredientData.amount || 0;
    this.unit = ingredientData.unit || '';
    this.note = ingredientData.note || '';
  }

  toJSON() {
    return {
      id: this.id,
      recipeId: this.recipeId,
      name: this.name,
      amount: this.amount,
      unit: this.unit,
      note: this.note
    };
  }

  static fromJSON(json) {
    return new Ingredient(json);
  }
}

export default Ingredient;