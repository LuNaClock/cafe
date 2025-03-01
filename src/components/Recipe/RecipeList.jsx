// src/components/Recipe/RecipeList.jsx
import React, { useState, useEffect, useMemo } from 'react';
import RecipeCard from './RecipeCard';
import RecipeService from '../../services/RecipeService';
import YouTubeService from '../../services/YouTubeService';

const RecipeList = ({ filter = {} }) => {
  const [recipes, setRecipes] = useState([]);
  const [videos, setVideos] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      try {
        let fetchedRecipes = [];
        
        // Apply filters based on the filter prop
        if (filter.search) {
          // We'd use SearchService in a real app
          fetchedRecipes = await RecipeService.getAllRecipes();
          fetchedRecipes = fetchedRecipes.filter(recipe => 
            recipe.title.toLowerCase().includes(filter.search.toLowerCase()) || 
            recipe.description.toLowerCase().includes(filter.search.toLowerCase())
          );
        } else if (filter.category) {
          fetchedRecipes = await RecipeService.getAllRecipes();
          fetchedRecipes = fetchedRecipes.filter(recipe => 
            recipe.categoryIds && recipe.categoryIds.includes(filter.category)
          );
        } else if (filter.favorites) {
          fetchedRecipes = await RecipeService.getFavoriteRecipes();
        } else {
          fetchedRecipes = await RecipeService.getAllRecipes();
        }
        
        setRecipes(fetchedRecipes);

        // Fetch the first video for each recipe to use as thumbnail
        const videosObj = {};
        for (const recipe of fetchedRecipes) {
          const recipeVideos = await YouTubeService.getLinkedVideos(recipe.id);
          if (recipeVideos.length > 0) {
            videosObj[recipe.id] = recipeVideos[0];
          }
        }
        setVideos(videosObj);
      } catch (error) {
        console.error('Error loading recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [filter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">レシピが見つかりませんでした</h3>
        <p className="text-gray-500">
          {filter.search ? `「${filter.search}」に一致するレシピはありません。` : 
           filter.category ? 'このカテゴリのレシピはまだありません。' :
           filter.favorites ? 'お気に入りのレシピはまだありません。' :
           'レシピはまだ登録されていません。'}
        </p>
      </div>
    );
  }

  // Memoize the rendered recipe list for better performance
  const recipeList = useMemo(() => {
    return recipes.map(recipe => (
      <RecipeCard 
        key={recipe.id} 
        recipe={recipe} 
        video={videos[recipe.id]} 
      />
    ));
  }, [recipes, videos]);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {recipeList}
    </div>
  );
};

export default RecipeList;