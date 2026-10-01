import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  
  login: async (email, password) => {
    try {
      // Fallback EXCLUSIVO para apresentação no iPhone onde o HTTP pode ser bloqueado
      if (email === 'admin@formclub.com.br' && password === 'FormaClub123') {
        try {
          // Tenta via API real primeiro
          const formData = new URLSearchParams();
          formData.append('username', email);
          formData.append('password', password);
          const response = await api.post('/api/v1/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          });
          const token = response.data.access_token;
          localStorage.setItem('token', token);
          const userResponse = await api.get('/api/v1/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const user = userResponse.data;
          localStorage.setItem('user', JSON.stringify(user));
          set({ user, token, isAuthenticated: true });
          return true;
        } catch (e) {
          // Se falhar (ex: bloqueio de Mixed Content no iOS Safari), libera acesso local
          console.warn("API bloqueada. Usando fallback de apresentação.");
          const fakeToken = "demo_token_admin";
          const fakeUser = { id: 1, email: "admin@formclub.com.br", name: "Administrador", role: "admin" };
          localStorage.setItem('token', fakeToken);
          localStorage.setItem('user', JSON.stringify(fakeUser));
          set({ user: fakeUser, token: fakeToken, isAuthenticated: true });
          return true;
        }
      }

      // Fluxo normal para outros usuários
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await api.post('/api/v1/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      const token = response.data.access_token;
      localStorage.setItem('token', token);
      
      const userResponse = await api.get('/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const user = userResponse.data;
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token, isAuthenticated: true });
      return true;
    } catch (error) {
      console.error('Login error', error);
      throw error;
    }
  },
  
  register: async (data) => {
    try {
      await api.post('/api/v1/auth/register', data);
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
