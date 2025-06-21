import api, { endpoints } from './api';

// Create a new newsletter
export const createNewsLetter = async (formData) => {
  try {
    const response = await api.post(endpoints.newsletters.create, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get all newsletters
export const getNewsLetters = async () => {
  try {
    const response = await api.get(endpoints.newsletters.list);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get a single newsletter by ID
export const getNewsLetter = async (id) => {
  try {
    const response = await api.get(`${endpoints.newsletters.get}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update an update
export const updateNewsLetter = async (id, formData) => {
  try {
    const response = await api.put(`${endpoints.newsletters.update}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete an newsletter
export const deleteNewsLetter = async (id) => {
  try {
    const response = await api.delete(`${endpoints.newsletters.delete}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
