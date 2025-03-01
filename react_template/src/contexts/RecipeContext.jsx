// src/contexts/RecipeContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import RecipeService from '../services/RecipeService';
import StorageService from '../services/StorageService';

// Create context
const RecipeContext = createContext();

// Context provider component
export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize the app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize storage
        await StorageService.initialize();
        
        // Initialize recipe service (creates default categories and tags)
        await RecipeService.initialize();
        
        setIsInitialized(true);
        
        // Load initial data
        await loadAllData();
      } catch (error) {
        console.error('Error initializing application:', error);
      }
    };
    
    initializeApp();
  }, []);
  
  // Load all data from storage
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      // Load recipes
      const loadedRecipes = await RecipeService.getAllRecipes();
      setRecipes(loadedRecipes);
      
      // Load categories
      const loadedCategories = await StorageService.getAll('categories');
      setCategories(loadedCategories);
      
      // Load tags
      const loadedTags = await StorageService.getAll('tags');
      setTags(loadedTags);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add a new recipe
  const addRecipe = async (recipeData) => {
    try {
      const newRecipe = await RecipeService.createRecipe(recipeData);
      setRecipes(prevRecipes => [...prevRecipes, newRecipe]);
      return newRecipe;
    } catch (error) {
      console.error('Error adding recipe:', error);
      throw error;
    }
  };
  
  // Update a recipe
  const updateRecipe = async (id, recipeData) => {
    try {
      const updatedRecipe = await RecipeService.updateRecipe(id, recipeData);
      setRecipes(prevRecipes => 
        prevRecipes.map(recipe => 
          recipe.id === id ? updatedRecipe : recipe
        )
      );
      return updatedRecipe;
    } catch (error) {
      console.error('Error updating recipe:', error);
      throw error;
    }
  };
  
  // Delete a recipe
  const deleteRecipe = async (id) => {
    try {
      const success = await RecipeService.deleteRecipe(id);
      if (success) {
        setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== id));
      }
      return success;
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    }
  };
  
  // Toggle favorite status
  const toggleFavorite = async (id) => {
    try {
      const updatedRecipe = await RecipeService.toggleFavorite(id);
      setRecipes(prevRecipes => 
        prevRecipes.map(recipe => 
          recipe.id === id ? updatedRecipe : recipe
        )
      );
      return updatedRecipe;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  };
  
  // Value provided by the context
  const value = {
    recipes,
    categories,
    tags,
    isLoading,
    isInitialized,
    loadAllData,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    toggleFavorite,
  };
  
  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
};

// Custom hook to use the recipe context
export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};

export default RecipeContext;