import api, { endpoints } from './api';

// Create a new research paper
export const createResearchPaper = async (formData) => {
  try {
    const response = await api.post(endpoints.researchPapers.create, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get all research papers
export const getResearchPapers = async () => {
  try {
    const response = await api.get(endpoints.researchPapers.list);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get a single research paper by ID
export const getResearchPaper = async (id) => {
  try {
    const response = await api.get(`${endpoints.researchPapers.get}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update an research paper
export const updateResearchPaper = async (id, formData) => {
  try {
    const response = await api.put(`${endpoints.researchPapers.update}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete an research paper
export const deleteResearchPaper = async (id) => {
  try {
    const response = await api.delete(`${endpoints.researchPapers.delete}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
