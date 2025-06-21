import api, { endpoints } from './api';

// Create a new workshop
export const createWorkshop = async (formData) => {
  try {
    const response = await api.post(endpoints.workshops.create, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get all workshops
export const getWorkshops = async () => {
  try {
    const response = await api.get(endpoints.workshops.list);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get a single workshop by ID
export const getWorkshop = async (id) => {
  try {
    const response = await api.get(`${endpoints.workshops.get}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update an workshop
export const updateWorkshop = async (id, formData) => {
  try {
    const response = await api.put(`${endpoints.workshops.update}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete an workshop
export const deleteWorkshop = async (id) => {
  try {
    const response = await api.delete(`${endpoints.workshops.delete}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
