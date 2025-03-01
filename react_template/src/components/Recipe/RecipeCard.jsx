// src/components/Recipe/RecipeCard.jsx
import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';

const RecipeCard = ({ recipe, video }) => {
  const navigate = useNavigate();
  
  // Calculate total time
  const totalTime = recipe.prepTime + recipe.cookTime;
  
  const handleClick = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    // In a real app, we would call RecipeService.toggleFavorite
    console.log('Toggle favorite for recipe ID:', recipe.id);
  };

  // Determine what thumbnail to show
  const thumbnailUrl = video?.thumbnailUrl || 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
        <img 
          src={thumbnailUrl} 
          alt={recipe.title} 
          className="w-full h-40 object-cover"
        />
        {video && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black bg-opacity-20 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-100 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${recipe.favorite ? 'text-yellow-500' : 'text-gray-400'}`} viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-2 line-clamp-2">{recipe.title}</h3>
        
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span>{totalTime} 分</span>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2">{recipe.description}</p>
      </div>
    </div>
  );
};

export default RecipeCard;