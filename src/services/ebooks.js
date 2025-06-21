import api, { endpoints } from './api';

// Create a new ebook
export const createEbook = async (formData) => {
  try {
    const response = await api.post(endpoints.ebooks.create, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get all ebooks
export const getEbooks = async () => {
  try {
    const response = await api.get(endpoints.ebooks.list);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get a single ebook by ID
export const getEbook = async (id) => {
  try {
    const response = await api.get(`${endpoints.ebooks.get}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update an ebook
export const updateEbook = async (id, formData) => {
  try {
    const response = await api.put(`${endpoints.ebooks.update}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete an ebook
export const deleteEbook = async (id) => {
  try {
    const response = await api.delete(`${endpoints.ebooks.delete}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
