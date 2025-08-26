import api from './api.js';

/**
 * Search for movies based on query
 * @param {string} query - Search query
 * @param {Object} options - Request options (signal, etc.)
 * @returns {Promise} Array of movie objects
 */
export const searchMovies = async (query, options = {}) => {
    try {
        // Add limit parameter to ensure we get all matching results
        const response = await api.get(`/movies/search?query=${encodeURIComponent(query)}&limit=1000`, {
            signal: options.signal
        });
        return response.data;
    } catch (error) {
        if (error.name === 'AbortError') {
            throw error; // Re-throw abort errors
        }
        console.error('Error searching movies:', error);
        throw error;
    }
};
