import api from './api';
// Course API calls
export const getAllCourses = async () => {
  const response = await api.get(`/courses`);
  return response.data;
};

export const getCourseById = async (id) => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};

export const createCourse = async (courseData) => {
  const formData = new FormData();
  Object.keys(courseData).forEach(key => {
    if (key === 'thumbnail' && courseData[key]) {
      formData.append('thumbnail', courseData[key]);
    } else {
      formData.append(key, courseData[key]);
    }
  });
  
  const response = await api.post(`/courses`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateCourse = async (id, courseData) => {
  const formData = new FormData();
  Object.keys(courseData).forEach(key => {
    if (key === 'thumbnail' && courseData[key]) {
      formData.append('thumbnail', courseData[key]);
    } else {
      formData.append(key, courseData[key]);
    }
  });
  
  const response = await api.put(`/courses/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteCourse = async (id) => {
  const response = await api.delete(`/courses/${id}`);
  return response.data;
};

// Section API calls
export const addSection = async (courseId, sectionData) => {
  const response = await api.post(`/courses/${courseId}/sections`, sectionData);
  return response.data;
};

export const updateSection = async (courseId, sectionId, sectionData) => {
  const response = await api.put(`/courses/${courseId}/sections/${sectionId}`, sectionData);
  return response.data;
};

export const deleteSection = async (courseId, sectionId) => {
  const response = await api.delete(`/courses/${courseId}/sections/${sectionId}`);
  return response.data;
};

// Content API calls
export const addContent = async (courseId, contentData) => {
  const response = await api.post(`/courses/${courseId}/content`, contentData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateContent = async (courseId, sectionId, contentId, contentData) => {
  const response = await api.put(
    `/courses/${courseId}/sections/${sectionId}/content/${contentId}`,
    contentData
  );
  return response.data;
};

export const deleteContent = async (courseId, sectionId, contentId) => {
  const response = await api.delete(
    `/courses/${courseId}/sections/${sectionId}/content/${contentId}`
  );
  return response.data;
};

export const getContentUrl = async (courseId, sectionId, contentId) => {
  const response = await api.get(
    `/courses/${courseId}/sections/${sectionId}/content/${contentId}/url`
  );
  return response.data;
};