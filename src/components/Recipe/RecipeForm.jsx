// src/components/Recipe/RecipeForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IngredientList from './IngredientList';
import StepList from './StepList';
import YouTubePreview from '../YouTube/YouTubePreview';
import YouTubeService from '../../services/YouTubeService';

const RecipeForm = ({ 
  initialRecipe = {}, 
  initialIngredients = [], 
  initialSteps = [], 
  initialVideos = [],
  categories = [],
  tags = [],
  onSave,
  isEditing = false
}) => {
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    id: initialRecipe.id || crypto.randomUUID(),
    title: initialRecipe.title || '',
    description: initialRecipe.description || '',
    servings: initialRecipe.servings || 2,
    prepTime: initialRecipe.prepTime || 10,
    cookTime: initialRecipe.cookTime || 20,
    favorite: initialRecipe.favorite || false,
    categoryIds: initialRecipe.categoryIds || [],
    tagIds: initialRecipe.tagIds || []
  });
  
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [steps, setSteps] = useState(initialSteps);
  const [videos, setVideos] = useState(initialVideos);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // New empty ingredient
  const [newIngredient, setNewIngredient] = useState({
    id: crypto.randomUUID(),
    recipeId: recipe.id,
    name: '',
    amount: '',
    unit: ''
  });

  // New empty step
  const [newStep, setNewStep] = useState({
    id: crypto.randomUUID(),
    recipeId: recipe.id,
    stepNumber: steps.length + 1,
    instruction: '',
    imageUrls: [],
    timerDuration: 0
  });

  const handleRecipeChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRecipe({
      ...recipe,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCategoryToggle = (categoryId) => {
    setRecipe(prev => {
      const categoryIds = [...prev.categoryIds];
      if (categoryIds.includes(categoryId)) {
        return {
          ...prev,
          categoryIds: categoryIds.filter(id => id !== categoryId)
        };
      } else {
        return {
          ...prev,
          categoryIds: [...categoryIds, categoryId]
        };
      }
    });
  };

  const handleTagToggle = (tagId) => {
    setRecipe(prev => {
      const tagIds = [...prev.tagIds];
      if (tagIds.includes(tagId)) {
        return {
          ...prev,
          tagIds: tagIds.filter(id => id !== tagId)
        };
      } else {
        return {
          ...prev,
          tagIds: [...tagIds, tagId]
        };
      }
    });
  };

  const handleNewIngredientChange = (e) => {
    const { name, value } = e.target;
    setNewIngredient({
      ...newIngredient,
      [name]: value
    });
  };

  const addIngredient = () => {
    if (newIngredient.name.trim() === '') {
      setError('材料名を入力してください');
      return;
    }

    setIngredients([...ingredients, newIngredient]);
    setNewIngredient({
      id: crypto.randomUUID(),
      recipeId: recipe.id,
      name: '',
      amount: '',
      unit: ''
    });
    setError(null);
  };

  const removeIngredient = (id) => {
    setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
  };

  const handleNewStepChange = (e) => {
    const { name, value } = e.target;
    setNewStep({
      ...newStep,
      [name]: value
    });
  };

  const addStep = () => {
    if (newStep.instruction.trim() === '') {
      setError('手順を入力してください');
      return;
    }

    setSteps([...steps, newStep]);
    setNewStep({
      id: crypto.randomUUID(),
      recipeId: recipe.id,
      stepNumber: steps.length + 2, // Increment for next step
      instruction: '',
      imageUrls: [],
      timerDuration: 0
    });
    setError(null);
  };

  const removeStep = (id) => {
    const updatedSteps = steps.filter(step => step.id !== id);
    
    // Update step numbers
    const reorderedSteps = updatedSteps.map((step, index) => ({
      ...step,
      stepNumber: index + 1
    }));
    
    setSteps(reorderedSteps);
  };

  const addYouTubeVideo = async () => {
    if (!youtubeUrl.trim()) {
      setError('YouTubeのURLを入力してください');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const videoInfo = await YouTubeService.getVideoInfo(youtubeUrl);
      if (videoInfo) {
        const videoWithRecipeId = {
          ...videoInfo,
          recipeId: recipe.id
        };
        setVideos([...videos, videoWithRecipeId]);
        setYoutubeUrl('');
      }
    } catch (err) {
      setError(`YouTube動画の読み込みに失敗しました: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const removeVideo = (id) => {
    setVideos(videos.filter(video => video.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!recipe.title.trim()) {
      setError('レシピのタイトルを入力してください');
      return;
    }

    try {
      await onSave({
        recipe,
        ingredients,
        steps,
        videos
      });
      
      navigate(`/recipe/${recipe.id}`);
    } catch (err) {
      setError(`レシピの保存に失敗しました: ${err.message}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {/* Recipe Basic Info */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">レシピ情報</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                タイトル *
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={recipe.title}
                onChange={handleRecipeChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                説明
              </label>
              <textarea
                id="description"
                name="description"
                value={recipe.description}
                onChange={handleRecipeChange}
                rows="3"
                className="w-full px-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-1">
                  人数
                </label>
                <input
                  id="servings"
                  type="number"
                  name="servings"
                  min="1"
                  max="20"
                  value={recipe.servings}
                  onChange={handleRecipeChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 mb-1">
                  準備時間（分）
                </label>
                <input
                  id="prepTime"
                  type="number"
                  name="prepTime"
                  min="0"
                  value={recipe.prepTime}
                  onChange={handleRecipeChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700 mb-1">
                  調理時間（分）
                </label>
                <input
                  id="cookTime"
                  type="number"
                  name="cookTime"
                  min="0"
                  value={recipe.cookTime}
                  onChange={handleRecipeChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Categories and Tags */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categories */}
          <div>
            <h3 className="text-lg font-medium mb-2">カテゴリ</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  type="button"
                  key={category.id}
                  onClick={() => handleCategoryToggle(category.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    recipe.categoryIds.includes(category.id)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Tags */}
          <div>
            <h3 className="text-lg font-medium mb-2">タグ</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  type="button"
                  key={tag.id}
                  onClick={() => handleTagToggle(tag.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    recipe.tagIds.includes(tag.id)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Ingredients */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">材料</h2>
          
          {/* Ingredient List */}
          <IngredientList 
            ingredients={ingredients} 
            onDelete={removeIngredient} 
          />
          
          {/* Add New Ingredient Form */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div>
              <input
                type="text"
                name="name"
                placeholder="材料名"
                value={newIngredient.name}
                onChange={handleNewIngredientChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <input
                type="text"
                name="amount"
                placeholder="量"
                value={newIngredient.amount}
                onChange={handleNewIngredientChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <input
                type="text"
                name="unit"
                placeholder="単位"
                value={newIngredient.unit}
                onChange={handleNewIngredientChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          
          <div className="mt-2">
            <button
              type="button"
              onClick={addIngredient}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              材料を追加
            </button>
          </div>
        </div>
        
        {/* Steps */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">作り方</h2>
          
          {/* Step List */}
          <StepList 
            steps={steps} 
            onDelete={removeStep} 
          />
          
          {/* Add New Step Form */}
          <div className="mt-4">
            <textarea
              name="instruction"
              placeholder="手順の説明"
              value={newStep.instruction}
              onChange={handleNewStepChange}
              rows="3"
              className="w-full px-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <div className="mt-2">
            <button
              type="button"
              onClick={addStep}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              手順を追加
            </button>
          </div>
        </div>
        
        {/* YouTube Videos */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">YouTube動画</h2>
          
          {/* Video List */}
          {videos.length > 0 && (
            <div className="mb-4 space-y-4">
              {videos.map(video => (
                <div key={video.id} className="border rounded-md overflow-hidden">
                  <YouTubePreview video={video} />
                  <div className="p-2 bg-gray-50">
                    <button
                      type="button"
                      onClick={() => removeVideo(video.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Add YouTube Video */}
          <div className="flex gap-2">
            <input
              type="text"
              value={youtubeUrl}
              onChange={e => setYoutubeUrl(e.target.value)}
              placeholder="YouTube URL"
              className="flex-1 px-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
            <button
              type="button"
              onClick={addYouTubeVideo}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              disabled={loading}
            >
              {loading ? '読み込み中...' : '動画を追加'}
            </button>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate(isEditing ? `/recipe/${recipe.id}` : '/')}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;