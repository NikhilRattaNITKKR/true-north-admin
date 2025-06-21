import api, { endpoints } from './api';

// Create a new case study
export const createCaseStudy = async (formData) => {
  try {
    const response = await api.post(endpoints.caseStudies.create, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get all case studies
export const getCaseStudies = async () => {
  try {
    const response = await api.get(endpoints.caseStudies.list);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get a single case study by ID
export const getCaseStudy = async (id) => {
  try {
    const response = await api.get(`${endpoints.caseStudies.get}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update an case study
export const updateCaseStudy = async (id, formData) => {
  try {
    const response = await api.put(`${endpoints.caseStudies.update}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete an case study
export const deleteCaseStudy = async (id) => {
  try {
    const response = await api.delete(`${endpoints.caseStudies.delete}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Set featured case study
export const setFeaturedCaseStudy = async (id) => {
  try {
    const response = await api.put(`/case-studies/${id}/featured`);
    return response;
  } catch (error) {
    throw error;
  }
};

