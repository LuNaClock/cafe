// src/utils/helpers.js
/**
 * Format minutes into a human-readable time string
 * @param {number} minutes - Time in minutes
 * @returns {string} Formatted time string
 */
export const formatTime = (minutes) => {
  if (!minutes || minutes <= 0) return '0分';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return mins > 0 ? `${hours}時間${mins}分` : `${hours}時間`;
  }
  return `${mins}分`;
};

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return crypto.randomUUID();
};

/**
 * Format a date to a localized string
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Group array items by a specific property
 * @param {Array} array - The array to group
 * @param {string} key - The property to group by
 * @returns {Object} Grouped items
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Truncate text to a specific length and add ellipsis if needed
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Debounce a function call
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Parse YouTube video ID from a URL
 * @param {string} url - YouTube URL
 * @returns {string|null} Video ID or null if invalid
 */
export const parseYouTubeVideoId = (url) => {
  if (!url) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
};

/**
 * Check if the app is running in offline mode
 * @returns {boolean} True if offline
 */
export const isOffline = () => {
  return !navigator.onLine;
};

/**
 * Calculate total time for a recipe
 * @param {Object} recipe - Recipe object
 * @returns {number} Total time in minutes
 */
export const calculateTotalTime = (recipe) => {
  if (!recipe) return 0;
  return (recipe.prepTime || 0) + (recipe.cookTime || 0);
};