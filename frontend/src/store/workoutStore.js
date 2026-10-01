import { create } from 'zustand';
import api from '../services/api';

const useWorkoutStore = create((set, get) => ({
  workouts: [],
  isLoading: false,
  error: null,

  fetchWorkouts: async (athleteId = null) => {
    set({ isLoading: true, error: null });
    try {
      const params = athleteId ? { athlete_id: athleteId } : {};
      const response = await api.get('/api/v1/workouts/', { params });
      set({ workouts: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  createWorkout: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/v1/workouts/', data);
      set((state) => ({ 
        workouts: [...state.workouts, response.data],
        isLoading: false 
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateWorkout: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/api/v1/workouts/${id}`, data);
      set((state) => ({
        workouts: state.workouts.map(w => w.id === id ? response.data : w),
        isLoading: false
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteWorkout: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/api/v1/workouts/${id}`);
      set((state) => ({
        workouts: state.workouts.filter(w => w.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));

export default useWorkoutStore;
