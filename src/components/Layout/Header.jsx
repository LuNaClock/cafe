// src/components/Layout/Header.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-gradient-to-r from-red-600 to-orange-500 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div 
              className="text-white font-bold text-2xl cursor-pointer"
              onClick={() => navigate('/')}
            >
              MY RECIPE BOX
            </div>
          </div>
          
          <form onSubmit={handleSearch} className="w-full md:w-1/2">
            <div className="relative">
              <input
                type="text"
                placeholder="レシピを検索..."
                className="w-full px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-0 top-0 h-full px-4 rounded-r-full bg-orange-600 text-white hover:bg-orange-700"
              >
                検索
              </button>
            </div>
          </form>

          <div className="mt-4 md:mt-0">
            <button
              onClick={() => navigate('/recipe/new')}
              className="bg-white text-orange-600 hover:bg-orange-100 px-4 py-2 rounded-md font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              新しいレシピ
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;