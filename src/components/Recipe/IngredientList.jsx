// src/components/Recipe/IngredientList.jsx
import React from 'react';

const IngredientList = ({ ingredients = [], onDelete, readOnly = false }) => {
  if (ingredients.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">
        材料がまだ登録されていません
      </div>
    );
  }

  return (
    <ul className="divide-y">
      {ingredients.map(ingredient => (
        <li key={ingredient.id} className="py-2 flex items-center justify-between">
          <div>
            <span className="font-medium">{ingredient.name}</span>
            {(ingredient.amount || ingredient.unit) && (
              <span className="text-gray-600 ml-2">
                {ingredient.amount} {ingredient.unit}
              </span>
            )}
            {ingredient.note && (
              <p className="text-sm text-gray-500">{ingredient.note}</p>
            )}
          </div>
          {!readOnly && onDelete && (
            <button
              onClick={() => onDelete(ingredient.id)}
              className="text-red-500 hover:text-red-700"
              aria-label="材料を削除"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default IngredientList;