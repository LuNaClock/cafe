// src/models/Recipe.js
class Recipe {
  constructor(recipeData = {}) {
    this.id = recipeData.id || crypto.randomUUID();
    this.title = recipeData.title || '';
    this.description = recipeData.description || '';
    this.servings = recipeData.servings || 1;
    this.prepTime = recipeData.prepTime || 0;
    this.cookTime = recipeData.cookTime || 0;
    this.createdAt = recipeData.createdAt || new Date();
    this.updatedAt = recipeData.updatedAt || new Date();
    this.favorite = recipeData.favorite || false;
    this.categoryIds = recipeData.categoryIds || [];
    this.tagIds = recipeData.tagIds || [];
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      servings: this.servings,
      prepTime: this.prepTime,
      cookTime: this.cookTime,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      favorite: this.favorite,
      categoryIds: this.categoryIds,
      tagIds: this.tagIds
    };
  }

  static fromJSON(json) {
    return new Recipe({
      ...json,
      createdAt: new Date(json.createdAt),
      updatedAt: new Date(json.updatedAt)
    });
  }
}

export default Recipe;