// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import RecipeFormPage from './pages/RecipeFormPage';
import StorageService from './services/StorageService';
import RecipeService from './services/RecipeService';

function App() {
  // Initialize the app when it first loads
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize storage service
        await StorageService.initialize();
        
        // Initialize recipe service (creates default categories and tags)
        await RecipeService.initialize();
        
        console.log('Application initialized successfully');
      } catch (error) {
        console.error('Error initializing application:', error);
      }
    };
    
    initializeApp();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipe/:id" element={<RecipeDetailPage />} />
        <Route path="/recipe/new" element={<RecipeFormPage />} />
        <Route path="/recipe/edit/:id" element={<RecipeFormPage mode="edit" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;