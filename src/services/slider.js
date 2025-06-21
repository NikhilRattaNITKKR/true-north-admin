import api from './api';
// Get all active sliders
export const getSliders = async () => {
  return api.get('/slider');
};

// Get all sliders for admin
export const getAdminSliders = async () => {
  return api.get('/slider/admin');
};

// Get single slider
export const getSliderById = async (id) => {
  return api.get(`/slider/${id}`);
};

// Create new slider
export const createSlider = async (formData) => {
  return api.post('/slider', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Update slider
export const updateSlider = async (id, formData) => {
  return api.put(`/slider/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Delete slider
export const deleteSlider = async (id) => {
  return api.delete(`/slider/${id}`);
};