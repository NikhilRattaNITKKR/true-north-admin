import { setCookie, getCookie, removeCookie } from './cookies';
import api, { endpoints } from './api';

const TOKEN_KEY = 'auth_token';

export const login = async (credentials) => {
  try {
    const response = await api.post(endpoints.auth.login, credentials);
    const { token } = response.data;

    if (!token) {
      throw new Error('No token received from server');
    }

    if (response.status !== 200) {
      throw new Error('Failed to login');
    }

    // Store tokens in cookies
    setCookie(TOKEN_KEY, token);
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    removeCookie(TOKEN_KEY);
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const getAuthToken = () => {
  return getCookie(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};


export const getUser = async () => {
  const token = getAuthToken();
  if (!token) {
    return null;
  }
  const response = await api.get(endpoints.auth.profile);
  return response;
};