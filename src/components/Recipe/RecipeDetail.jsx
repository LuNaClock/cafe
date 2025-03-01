// src/components/Recipe/RecipeDetail.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IngredientList from './IngredientList';
import StepList from './StepList';
import YouTubePreview from '../YouTube/YouTubePreview';

const RecipeDetail = ({ recipe, ingredients, steps, videos, onDelete, onToggleFavorite }) => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!recipe) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const handleEdit = () => {
    navigate(`/recipe/edit/${recipe.id}`);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(recipe.id);
    navigate('/');
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Recipe Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl md:text-3xl font-bold">{recipe.title}</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => onToggleFavorite(recipe.id)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-6 w-6 ${recipe.favorite ? 'text-yellow-300' : 'text-white'}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
            <div className="relative group">
              <button
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <button
                  onClick={handleEdit}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  編集
                </button>
                <button
                  onClick={handleDelete}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">合計: {totalTime}分</span>
          </div>
          <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="text-sm font-medium">{recipe.servings}人分</span>
          </div>
          {recipe.categoryIds && recipe.categoryIds.length > 0 && (
            <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">カテゴリ</span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {recipe.description && (
        <div className="p-6 border-b">
          <p className="text-gray-700">{recipe.description}</p>
        </div>
      )}

      {/* YouTube Videos */}
      {videos && videos.length > 0 && (
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-4">動画</h2>
          <div className="space-y-4">
            {videos.map(video => (
              <YouTubePreview key={video.id} video={video} />
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col md:flex-row">
        {/* Ingredients */}
        <div className="p-6 md:w-1/3 border-r">
          <h2 className="text-xl font-semibold mb-4">材料 <span className="text-sm font-normal text-gray-500">({recipe.servings}人分)</span></h2>
          <IngredientList ingredients={ingredients} readOnly />
        </div>
        
        {/* Steps */}
        <div className="p-6 md:w-2/3">
          <h2 className="text-xl font-semibold mb-4">作り方</h2>
          <StepList steps={steps} readOnly />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">レシピを削除しますか？</h3>
            <p className="text-gray-700 mb-6">「{recipe.title}」を削除します。この操作は元に戻せません。</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                キャンセル
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;