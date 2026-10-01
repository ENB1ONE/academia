import { create } from 'zustand';
import api from '../services/api';

const useMonitoringStore = create((set) => ({
  isLoading: false,
  error: null,

  createPse: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/v1/monitoring/pse', data);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  createWellness: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/v1/monitoring/wellness', data);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  createPainMap: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/v1/monitoring/pain', data);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  createMenstrual: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/v1/monitoring/menstrual', data);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  createPhysicalTest: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/v1/monitoring/physical-test', data);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));

export default useMonitoringStore;
