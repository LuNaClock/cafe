// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import Footer from '../components/Layout/Footer';
import RecipeList from '../components/Recipe/RecipeList';
import StorageService from '../services/StorageService';
import RecipeService from '../services/RecipeService';

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);
  const [filter, setFilter] = useState({});
  
  // Initialize database and load sample data if needed
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize storage service
        await StorageService.initialize();
        
        // Initialize recipe service (creates default categories and tags)
        await RecipeService.initialize();
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing application:', error);
      }
    };
    
    initializeApp();
  }, []);
  
  // Handle search query parameters
  useEffect(() => {
    const newFilter = {};
    
    // Handle search
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      newFilter.search = searchQuery;
    }
    
    // Handle category filter
    const categoryId = searchParams.get('category');
    if (categoryId) {
      newFilter.category = categoryId;
    }
    
    // Handle favorites filter
    const favorites = searchParams.get('favorites');
    if (favorites === 'true') {
      newFilter.favorites = true;
    }
    
    setFilter(newFilter);
  }, [searchParams]);
  
  // Generate page title based on filter
  const getPageTitle = () => {
    if (filter.search) {
      return `「${filter.search}」の検索結果`;
    } else if (filter.category) {
      return 'カテゴリ別レシピ';
    } else if (filter.favorites) {
      return 'お気に入りレシピ';
    }
    return 'すべてのレシピ';
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">アプリを準備中...</p>
        </div>
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
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{getPageTitle()}</h1>
            <RecipeList filter={filter} />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default HomePage;