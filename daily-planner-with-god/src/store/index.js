import { createStore } from 'vuex';
import api from '@/plugins/axios';

export default createStore({
  state: {
    datos: null,
    loading: false,
    error: null,
  },
  mutations: {
    SET_DATOS(state, datos) {
      state.datos = datos;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    async fetchDatos({ commit }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get('/endpoint');
        commit('SET_DATOS', response.data);
      } catch (error) {
        commit('SET_ERROR', error.message);
      } finally {
        commit('SET_LOADING', false);
      }
    },
  },
  getters: {
    datos: (state) => state.datos,
    loading: (state) => state.loading,
    error: (state) => state.error,
  },
});