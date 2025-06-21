import api, { endpoints } from './api';

// Get quiz constants (categories and SDG sets)
export const getQuizConstants = async () => {
  try {
    const response = await api.get(endpoints.quizzes.constants);
    return response;
  } catch (error) {
    throw error;
  }
};

// Create a new question
export const createQuestion = async (formData) => {
  try {
    const response = await api.post(endpoints.quizzes.create, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get all questions with optional filters
export const getQuestions = async (filters = {}) => {
  try {
    const response = await api.get(endpoints.quizzes.list, { params: filters });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get a single question by ID
export const getQuestion = async (id) => {
  try {
    const response = await api.get(`${endpoints.quizzes.get}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update an existing question
export const updateQuestion = async (id, formData) => {
  try {
    const response = await api.put(`${endpoints.quizzes.update}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete a question
export const deleteQuestion = async (id) => {
  try {
    const response = await api.delete(`${endpoints.quizzes.delete}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
}; 