// src/services/SearchService.js
import StorageService from './StorageService';
import Recipe from '../models/Recipe';

class SearchService {
  constructor() {
    this.storageService = StorageService;
  }

  async searchRecipes(query) {
    if (!query || query.trim() === '') {
      return [];
    }

    try {
      const recipes = await this.storageService.getAll('recipes');
      const lowercaseQuery = query.toLowerCase().trim();
      
      const matchingRecipes = recipes.filter(recipe => {
        // Search in title and description
        if (recipe.title.toLowerCase().includes(lowercaseQuery) || 
            recipe.description.toLowerCase().includes(lowercaseQuery)) {
          return true;
        }
        
        return false;
      });

      return matchingRecipes.map(recipe => Recipe.fromJSON(recipe));
    } catch (error) {
      console.error('Error searching recipes:', error);
      return [];
    }
  }

  async filterRecipesByIngredient(ingredientName) {
    if (!ingredientName || ingredientName.trim() === '') {
      return [];
    }

    try {
      // Get all ingredients
      const ingredients = await this.storageService.getAll('ingredients');
      const lowercaseName = ingredientName.toLowerCase().trim();
      
      // Find ingredients matching the search term
      const matchingIngredients = ingredients.filter(ingredient => 
        ingredient.name.toLowerCase().includes(lowercaseName)
      );
      
      // Get unique recipe IDs
      const recipeIds = [...new Set(matchingIngredients.map(ingredient => ingredient.recipeId))];
      
      // Get the recipes
      const recipes = [];
      for (const id of recipeIds) {
        const recipe = await this.storageService.get('recipes', id);
        if (recipe) {
          recipes.push(Recipe.fromJSON(recipe));
        }
      }
      
      return recipes;
    } catch (error) {
      console.error('Error filtering recipes by ingredient:', error);
      return [];
    }
  }

  async filterRecipesByCookTime(maxTime) {
    if (!maxTime || maxTime <= 0) {
      return [];
    }

    try {
      const recipes = await this.storageService.getAll('recipes');
      
      const matchingRecipes = recipes.filter(recipe => {
        const totalTime = recipe.prepTime + recipe.cookTime;
        return totalTime <= maxTime;
      });

      return matchingRecipes.map(recipe => Recipe.fromJSON(recipe));
    } catch (error) {
      console.error('Error filtering recipes by cook time:', error);
      return [];
    }
  }

  async filterRecipesByMultipleCriteria(criteria = {}) {
    try {
      const recipes = await this.storageService.getAll('recipes');
      
      const filteredRecipes = recipes.filter(recipe => {
        // Filter by query text
        if (criteria.query) {
          const lowercaseQuery = criteria.query.toLowerCase().trim();
          if (!recipe.title.toLowerCase().includes(lowercaseQuery) && 
              !recipe.description.toLowerCase().includes(lowercaseQuery)) {
            return false;
          }
        }
        
        // Filter by category
        if (criteria.categoryId && !recipe.categoryIds.includes(criteria.categoryId)) {
          return false;
        }
        
        // Filter by tag
        if (criteria.tagId && !recipe.tagIds.includes(criteria.tagId)) {
          return false;
        }
        
        // Filter by favorite status
        if (criteria.onlyFavorites === true && !recipe.favorite) {
          return false;
        }
        
        // Filter by maximum cook time
        if (criteria.maxCookTime && (recipe.prepTime + recipe.cookTime) > criteria.maxCookTime) {
          return false;
        }
        
        return true;
      });

      return filteredRecipes.map(recipe => Recipe.fromJSON(recipe));
    } catch (error) {
      console.error('Error filtering recipes by multiple criteria:', error);
      return [];
    }
  }
}

export default new SearchService();