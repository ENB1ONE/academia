import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  
  login: async (email, password) => {
    try {
      // Mock API call for now since backend might not exist
      // const response = await api.post('/api/v1/auth/login', { email, password });
      // Mocked response
      const mockToken = 'mock-jwt-token-123';
      const mockUser = { id: 1, name: 'Treinador Teste', email, role: 'treinador' };
      
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      set({ user: mockUser, token: mockToken, isAuthenticated: true });
      return true;
    } catch (error) {
      console.error('Login error', error);
      throw error;
    }
  },
  
  register: async (data) => {
    try {
      // const response = await api.post('/api/v1/auth/register', data);
      const mockToken = 'mock-jwt-token-123';
      const mockUser = { id: 2, name: data.name, email: data.email, role: data.role };
      
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      set({ user: mockUser, token: mockToken, isAuthenticated: true });
      return true;
    } catch (error) {
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  loadUser: () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      set({ user, token, isAuthenticated: true });
    }
  }
}));

export default useAuthStore;
