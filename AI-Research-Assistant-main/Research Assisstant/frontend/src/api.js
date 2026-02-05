import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('Making API request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API response received:', response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || 'Server error occurred';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(new Error('Unable to connect to server. Make sure the backend is running on port 3001.'));
    } else {
      // Something else happened
      return Promise.reject(new Error('An unexpected error occurred'));
    }
  }
);

/**
 * Send text to backend for summarization
 * @param {string} text - The text to summarize
 * @returns {Promise<Object>} - Promise resolving to summary data
 */
export const summarizeText = async (text) => {
  try {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      throw new Error('Text is required for summarization');
    }

    if (text.length > 10000) {
      throw new Error('Text is too long. Please limit to 10,000 characters.');
    }

    const response = await api.post('/summarize', {
      text: text.trim()
    });

    if (!response.data || !response.data.summary) {
      throw new Error('Invalid response from server');
    }

    return response.data;
  } catch (error) {
    console.error('Summarization error:', error);
    throw error;
  }
};

/**
 * Check if backend server is running
 * @returns {Promise<boolean>} - Promise resolving to server status
 */
export const checkServerHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export default api;