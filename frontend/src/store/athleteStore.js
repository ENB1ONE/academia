import { create } from 'zustand';
import api from '../services/api';

const useAthleteStore = create((set) => ({
  athletes: [],
  isLoading: false,
  error: null,

  fetchAthletes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/api/v1/athletes/');
      set({ athletes: response.data.athletes || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createAthlete: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/v1/athletes/', data);
      set((state) => ({ 
        athletes: [...state.athletes, response.data],
        isLoading: false 
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateAthlete: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/api/v1/athletes/${id}`, data);
      set((state) => ({
        athletes: state.athletes.map(a => a.id === id ? response.data : a),
        isLoading: false
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteAthlete: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/api/v1/athletes/${id}`);
      set((state) => ({
        athletes: state.athletes.filter(a => a.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));

export default useAthleteStore;
