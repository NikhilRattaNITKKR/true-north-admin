import api, { endpoints } from "./api";

// Create a new feedback
export const createFeedback = async (formData) => {
  try {
    const response = await api.post(endpoints.feedbacks.create, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get all feedbacks
export const getFeedbacks = async (params) => {
  try {
    const response = await api.get(endpoints.feedbacks.list, { params });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get a single feedback by ID
export const getFeedback = async (id) => {
  try {
    const response = await api.get(`${endpoints.feedbacks.get}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update an feedback
export const updateFeedback = async (id, formData) => {
  try {
    const response = await api.put(
      `${endpoints.feedbacks.update}/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete an feedback
export const deleteFeedback = async (id) => {
  try {
    const response = await api.delete(`${endpoints.feedbacks.delete}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
