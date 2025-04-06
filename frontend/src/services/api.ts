import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  register: (data: {
    email: string;
    password: string;
    name: string;
  }) => api.post('/auth/register', data),
};

// Portfolio Items API
export const portfolioApi = {
  getItems: () => api.get('/portfolio-items'),
  getItem: (id: number) => api.get(`/portfolio-items/${id}`),
  createItem: (data: any) => api.post('/portfolio-items', data),
  updateItem: (id: number, data: any) =>
    api.put(`/portfolio-items/${id}`, data),
  deleteItem: (id: number) => api.delete(`/portfolio-items/${id}`),
};

// Categories API
export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getOne: (id: number) => api.get(`/categories/${id}`),
  create: (data: any) => api.post('/categories', data),
  update: (id: number, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

// Profile API
export const profileApi = {
  get: () => api.get('/profile'),
  update: (data: any) => api.put('/profile', data),
};

// Contacts API
export const contactsApi = {
  getAll: () => api.get('/contacts'),
  getOne: (id: number) => api.get(`/contacts/${id}`),
  create: (data: any) => api.post('/contacts', data),
  delete: (id: number) => api.delete(`/contacts/${id}`),
  markAsRead: (id: number) => api.put(`/contacts/${id}/read`),
};

export default api; 