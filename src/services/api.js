import axios from 'axios';
import { logout } from './user';
import { getCookie } from './cookies';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getCookie('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Handle unauthorized/forbidden responses
      await logout();
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  auth: {
    login: '/auth/admin/login',
    profile: '/auth/profile',
  },
  articles: {
    create: '/articles',
    list: '/articles/list',
    get: '/articles',
    update: '/articles',
    delete: '/articles',
  },
  ebooks: {
    create: '/ebooks',
    list: '/ebooks',
    get: '/ebooks',
    update: '/ebooks',
    delete: '/ebooks',
  },
  caseStudies: {
    create: '/case-studies',
    list: '/case-studies',
    get: '/case-studies',
    update: '/case-studies',
    delete: '/case-studies',
  },
  researchPapers: {
    create: '/research-papers',
    list: '/research-papers',
    get: '/research-papers',
    update: '/research-papers',
    delete: '/research-papers',
  },
  workshops: {
    create: '/workshops',
    list: '/workshops',
    get: '/workshops',
    update: '/workshops',
    delete: '/workshops',
  },
  newsletters: {
    create: '/newsletters',
    list: '/newsletters',
    get: '/newsletters',
    update: '/newsletters',
    delete: '/newsletters',
  },
  quizzes: {
    constants: '/quizzes/quiz-constants',
    create: '/quizzes/questions',
    list: '/quizzes/questions',
    get: '/quizzes/questions',
    update: '/quizzes/questions',
    delete: '/quizzes/questions',
  },
  feedbacks: {
    create: '/feedback',
    list: '/feedback',
    get: '/feedback',
    update: '/feedback',
    delete: '/feedback',
  },
};

export default api; 