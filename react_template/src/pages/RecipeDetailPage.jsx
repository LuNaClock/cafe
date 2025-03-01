// src/pages/RecipeDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import Footer from '../components/Layout/Footer';
import RecipeDetail from '../components/Recipe/RecipeDetail';
import RecipeService from '../services/RecipeService';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipeData, setRecipeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadRecipeData = async () => {
      setLoading(true);
      try {
        const data = await RecipeService.getRecipeWithRelatedData(id);
        
        if (!data || !data.recipe) {
          setError('レシピが見つかりませんでした');
          return;
        }
        
        setRecipeData(data);
      } catch (err) {
        console.error('Error loading recipe:', err);
        setError('レシピの読み込み中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };
    
    loadRecipeData();
  }, [id]);
  
  const handleDelete = async (recipeId) => {
    try {
      const success = await RecipeService.deleteRecipe(recipeId);
      if (success) {
        navigate('/');
      } else {
        setError('レシピの削除に失敗しました');
      }
    } catch (err) {
      console.error('Error deleting recipe:', err);
      setError('レシピの削除中にエラーが発生しました');
    }
  };
  
  const handleToggleFavorite = async (recipeId) => {
    try {
      const updatedRecipe = await RecipeService.toggleFavorite(recipeId);
      setRecipeData(prev => ({
        ...prev,
        recipe: updatedRecipe
      }));
    } catch (err) {
      console.error('Error toggling favorite status:', err);
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
  
  if (error || !recipeData) {
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
            <RecipeDetail 
              recipe={recipeData.recipe}
              ingredients={recipeData.ingredients}
              steps={recipeData.steps}
              videos={recipeData.videos}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default RecipeDetailPage;