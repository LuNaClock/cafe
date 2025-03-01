// src/services/RecipeService.js
import Recipe from '../models/Recipe';
import Ingredient from '../models/Ingredient';
import CookingStep from '../models/CookingStep';
import StorageService from './StorageService';
import YouTubeService from './YouTubeService';

class RecipeService {
  constructor() {
    this.storageService = StorageService;
  }

  async initialize() {
    // Create some default categories if none exist
    const categories = await this.storageService.getAll('categories');
    
    if (categories.length === 0) {
      const defaultCategories = [
        { id: crypto.randomUUID(), name: 'メイン料理', color: '#EF4444', icon: 'fire' },
        { id: crypto.randomUUID(), name: 'サイド・副菜', color: '#10B981', icon: 'leaf' },
        { id: crypto.randomUUID(), name: 'スープ・汁物', color: '#F59E0B', icon: 'beaker' },
        { id: crypto.randomUUID(), name: 'デザート', color: '#EC4899', icon: 'cake' },
        { id: crypto.randomUUID(), name: 'パン・ベーカリー', color: '#8B5CF6', icon: 'bread' }
      ];
      
      for (const category of defaultCategories) {
        await this.storageService.set('categories', category);
      }
    }
    
    // Create some default tags if none exist
    const tags = await this.storageService.getAll('tags');
    
    if (tags.length === 0) {
      const defaultTags = [
        { id: crypto.randomUUID(), name: '簡単' },
        { id: crypto.randomUUID(), name: '時短' },
        { id: crypto.randomUUID(), name: 'ヘルシー' },
        { id: crypto.randomUUID(), name: 'パーティー向け' },
        { id: crypto.randomUUID(), name: '子供向け' }
      ];
      
      for (const tag of defaultTags) {
        await this.storageService.set('tags', tag);
      }
    }
  }

  async getAllRecipes() {
    try {
      const recipes = await this.storageService.getAll('recipes');
      return recipes.map(recipe => Recipe.fromJSON(recipe));
    } catch (error) {
      console.error('Error getting all recipes:', error);
      return [];
    }
  }

  async getRecipeById(id) {
    try {
      const recipe = await this.storageService.get('recipes', id);
      return recipe ? Recipe.fromJSON(recipe) : null;
    } catch (error) {
      console.error('Error getting recipe by ID:', error);
      return null;
    }
  }

  async createRecipe(recipeData) {
    try {
      const recipe = new Recipe(recipeData);
      
      await this.storageService.set('recipes', recipe.toJSON());
      return recipe;
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    }
  }

  async updateRecipe(id, recipeData) {
    try {
      const existingRecipe = await this.getRecipeById(id);
      
      if (!existingRecipe) {
        throw new Error('Recipe not found');
      }
      
      const updatedRecipe = new Recipe({
        ...existingRecipe,
        ...recipeData,
        id,
        updatedAt: new Date()
      });
      
      await this.storageService.set('recipes', updatedRecipe.toJSON());
      return updatedRecipe;
    } catch (error) {
      console.error('Error updating recipe:', error);
      throw error;
    }
  }

  async deleteRecipe(id) {
    try {
      // Delete the recipe
      await this.storageService.remove('recipes', id);
      
      // Delete related ingredients
      const ingredients = await this.storageService.getAll('ingredients');
      for (const ingredient of ingredients.filter(i => i.recipeId === id)) {
        await this.storageService.remove('ingredients', ingredient.id);
      }
      
      // Delete related steps
      const steps = await this.storageService.getAll('steps');
      for (const step of steps.filter(s => s.recipeId === id)) {
        await this.storageService.remove('steps', step.id);
      }
      
      // Delete related videos
      const videos = await this.storageService.getAll('videos');
      for (const video of videos.filter(v => v.recipeId === id)) {
        await this.storageService.remove('videos', video.id);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting recipe:', error);
      return false;
    }
  }

  async getFavoriteRecipes() {
    try {
      const allRecipes = await this.getAllRecipes();
      return allRecipes.filter(recipe => recipe.favorite);
    } catch (error) {
      console.error('Error getting favorite recipes:', error);
      return [];
    }
  }

  async toggleFavorite(id) {
    try {
      const recipe = await this.getRecipeById(id);
      
      if (!recipe) {
        throw new Error('Recipe not found');
      }
      
      recipe.favorite = !recipe.favorite;
      await this.storageService.set('recipes', recipe.toJSON());
      
      return recipe;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }

  async getIngredientsByRecipeId(recipeId) {
    try {
      const allIngredients = await this.storageService.getAll('ingredients');
      const recipeIngredients = allIngredients.filter(i => i.recipeId === recipeId);
      return recipeIngredients.map(i => Ingredient.fromJSON(i));
    } catch (error) {
      console.error('Error getting ingredients for recipe:', error);
      return [];
    }
  }

  async saveIngredient(ingredientData) {
    try {
      const ingredient = new Ingredient(ingredientData);
      await this.storageService.set('ingredients', ingredient.toJSON());
      return ingredient;
    } catch (error) {
      console.error('Error saving ingredient:', error);
      throw error;
    }
  }

  async deleteIngredient(id) {
    try {
      await this.storageService.remove('ingredients', id);
      return true;
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      return false;
    }
  }

  async getStepsByRecipeId(recipeId) {
    try {
      const allSteps = await this.storageService.getAll('steps');
      const recipeSteps = allSteps.filter(s => s.recipeId === recipeId);
      return recipeSteps
        .map(s => CookingStep.fromJSON(s))
        .sort((a, b) => a.stepNumber - b.stepNumber);
    } catch (error) {
      console.error('Error getting steps for recipe:', error);
      return [];
    }
  }

  async saveStep(stepData) {
    try {
      const step = new CookingStep(stepData);
      await this.storageService.set('steps', step.toJSON());
      return step;
    } catch (error) {
      console.error('Error saving step:', error);
      throw error;
    }
  }

  async deleteStep(id) {
    try {
      await this.storageService.remove('steps', id);
      return true;
    } catch (error) {
      console.error('Error deleting step:', error);
      return false;
    }
  }

  async getRecipeWithRelatedData(id) {
    try {
      const recipe = await this.getRecipeById(id);
      
      if (!recipe) {
        return null;
      }
      
      const ingredients = await this.getIngredientsByRecipeId(id);
      const steps = await this.getStepsByRecipeId(id);
      const videos = await YouTubeService.getLinkedVideos(id);
      
      return {
        recipe,
        ingredients,
        steps,
        videos
      };
    } catch (error) {
      console.error('Error getting recipe with related data:', error);
      return null;
    }
  }
}

export default new RecipeService();