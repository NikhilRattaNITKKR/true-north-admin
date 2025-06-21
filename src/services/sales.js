import api from './api';

export const getSales = async () => {
  try {
    const response = await api.get('/sales');
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateSales = async (data) => {
  try {
    const response = await api.post('/sales', data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const toggleSalesPublish = async () => {
  try {
    const response = await api.put('/sales/toggle-publish');
    return response;
  } catch (error) {
    throw error;
  }
}; 