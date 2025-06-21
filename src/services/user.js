import api from './api';
import { removeCookie, setCookie } from './cookies';

export const getUserProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const { token, user } = response.data;
    
    // Set auth token in cookie
    setCookie('auth_token', token, { path: '/' });
    
    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    removeCookie('auth_token');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear auth token and redirect to login
    removeCookie('auth_token');
    window.location.href = '/login';
  }
}; 