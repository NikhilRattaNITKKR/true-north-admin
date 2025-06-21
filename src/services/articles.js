import api, { endpoints } from './api';

// Create a new article
export const createArticle = async (formData) => {
  try {
    const response = await api.post(endpoints.articles.create, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get all articles
export const getArticles = async () => {
  try {
    const response = await api.get(endpoints.articles.list);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get a single article by ID
export const getArticle = async (id) => {
  try {
    const response = await api.get(`${endpoints.articles.get}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update an article
export const updateArticle = async (id, formData) => {
  try {
    const response = await api.put(`${endpoints.articles.update}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete an article
export const deleteArticle = async (id) => {
  try {
    const response = await api.delete(`${endpoints.articles.delete}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Set featured article
export const setFeaturedArticle = async (id) => {
  try {
    const response = await api.put(`/articles/${id}/featured`);
    return response;
  } catch (error) {
    throw error;
  }
};