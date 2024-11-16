// src/Api.js
import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // Base URL of your API
  headers: {
    'Content-Type': 'application/json', // Set the content type to JSON
  },
});

// Optional: Add an interceptor to handle errors globally (if needed)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here if needed
    return Promise.reject(error);
  }
);

export default api;
