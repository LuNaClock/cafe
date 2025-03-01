// src/pages/RecipeFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import Footer from '../components/Layout/Footer';
import RecipeForm from '../components/Recipe/RecipeForm';
import RecipeService from '../services/RecipeService';
import YouTubeService from '../services/YouTubeService';
import StorageService from '../services/StorageService';

const RecipeFormPage = () => {
  const { id, mode } = useParams();
  const navigate = useNavigate();
  const [recipeData, setRecipeData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isEditing = mode === 'edit' && id;
  
  useEffect(() => {
    const loadFormData = async () => {
      setLoading(true);
      try {
        // Load categories and tags
        const loadedCategories = await StorageService.getAll('categories');
        const loadedTags = await StorageService.getAll('tags');
        setCategories(loadedCategories);
        setTags(loadedTags);
        
        // If editing an existing recipe, load its data
        if (isEditing) {
          const data = await RecipeService.getRecipeWithRelatedData(id);
          
          if (!data || !data.recipe) {
            setError('レシピが見つかりませんでした');
            return;
          }
          
          setRecipeData(data);
        }
      } catch (err) {
        console.error('Error loading form data:', err);
        setError('データの読み込み中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };
    
    loadFormData();
  }, [id, isEditing]);
  
  const handleSave = async (formData) => {
    try {
      const { recipe, ingredients, steps, videos } = formData;
      
      // Save or update recipe
      let savedRecipe;
      if (isEditing) {
        savedRecipe = await RecipeService.updateRecipe(recipe.id, recipe);
        
        // When editing, remove existing related items before adding new ones
        // Clear existing ingredients
        const existingIngredients = await StorageService.getAll('ingredients');
        for (const ingredient of existingIngredients.filter(i => i.recipeId === recipe.id)) {
          await StorageService.remove('ingredients', ingredient.id);
        }
        
        // Clear existing steps
        const existingSteps = await StorageService.getAll('steps');
        for (const step of existingSteps.filter(s => s.recipeId === recipe.id)) {
          await StorageService.remove('steps', step.id);
        }
        
        // Clear existing videos
        const existingVideos = await StorageService.getAll('videos');
        for (const video of existingVideos.filter(v => v.recipeId === recipe.id)) {
          await StorageService.remove('videos', video.id);
        }
      } else {
        savedRecipe = await RecipeService.createRecipe(recipe);
      }
      
      // Save ingredients
      for (const ingredient of ingredients) {
        await RecipeService.saveIngredient({
          ...ingredient,
          recipeId: savedRecipe.id
        });
      }
      
      // Save steps
      for (const step of steps) {
        await RecipeService.saveStep({
          ...step,
          recipeId: savedRecipe.id
        });
      }
      
      // Save videos
      for (const video of videos) {
        await YouTubeService.linkVideoToRecipe(savedRecipe.id, video);
      }
      
      return savedRecipe;
    } catch (err) {
      console.error('Error saving recipe:', err);
      throw new Error('レシピの保存中にエラーが発生しました');
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="container mx-auto flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (isEditing && (error || !recipeData)) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="container mx-auto">
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">エラーが発生しました</h3>
                <p className="text-gray-500 mb-6">{error || 'レシピの情報を取得できませんでした。'}</p>
                <button 
                  onClick={() => navigate('/')}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                  ホームに戻る
                </button>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              {isEditing ? 'レシピを編集' : '新しいレシピ'}
            </h1>
            
            <RecipeForm 
              initialRecipe={recipeData?.recipe || {}}
              initialIngredients={recipeData?.ingredients || []}
              initialSteps={recipeData?.steps || []}
              initialVideos={recipeData?.videos || []}
              categories={categories}
              tags={tags}
              onSave={handleSave}
              isEditing={isEditing}
            />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default RecipeFormPage;