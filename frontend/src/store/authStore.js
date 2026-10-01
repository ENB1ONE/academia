import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  athleteProfile: JSON.parse(localStorage.getItem('athleteProfile')) || null,
  
  login: async (email, password) => {
    try {
      // Fallback exclusivo para apresentação admin
      if (email === 'admin@formclub.com.br' && password === 'FormaClub123') {
        try {
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
          console.warn("API bloqueada. Usando fallback de apresentação.");
          const fakeToken = "demo_token_admin";
          const fakeUser = { id: 1, email: "admin@formclub.com.br", name: "Administrador", role: "admin" };
          localStorage.setItem('token', fakeToken);
          localStorage.setItem('user', JSON.stringify(fakeUser));
          set({ user: fakeUser, token: fakeToken, isAuthenticated: true });
          return true;
        }
      }

      // Fluxo normal
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

      let athleteProfile = null;
      if (user.role === 'atleta') {
        try {
          const profileRes = await api.get('/api/v1/athletes/me/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          athleteProfile = profileRes.data;
          localStorage.setItem('athleteProfile', JSON.stringify(athleteProfile));
        } catch(e) {
          console.error("Erro ao buscar perfil do atleta", e);
        }
      }
      
      set({ user, token, isAuthenticated: true, athleteProfile });
      return true;
    } catch (error) {
      console.error('Login error', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('athleteProfile');
    set({ user: null, token: null, isAuthenticated: false, athleteProfile: null });
  },
  
  loadUser: () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const athleteProfile = JSON.parse(localStorage.getItem('athleteProfile'));
    if (token && user) {
      set({ user, token, isAuthenticated: true, athleteProfile });
    }
  }
}));

export default useAuthStore;
