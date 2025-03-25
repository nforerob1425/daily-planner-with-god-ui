import { createStore } from 'vuex';
import api from '@/plugins/axios';

export default createStore({
  state: {
    datos: null,
    loading: false,
    error: null,
    user: null,
    token: null
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
    SET_USER_DATA(state, payload) {
      const { token, ...userData } = payload;
      state.user = userData;
      state.token = token;
      localStorage.setItem('authData', JSON.stringify(payload));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },
    CLEAR_USER_DATA(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('authData');
      delete api.defaults.headers.common['Authorization'];
    }
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
    
    async login({ commit }, credentials) {
      commit('SET_LOADING', true);
      try {
        const response = await api.post('/api/Login/login', credentials);
        
        if (response.status === 200) {
          commit('SET_USER_DATA', response.data);
          commit('SET_ERROR', null);
          return response.data;
        }
        
      } catch (error) {
        let errorMessage = 'Error de autenticación';
        
        if (error.response) {
          if (error.response.status === 401) {
            errorMessage = 'Credenciales inválidas';
          }
          errorMessage = error.response.data?.message || errorMessage;
        }
        
        commit('SET_ERROR', errorMessage);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    logout({ commit }) {
      commit('CLEAR_USER_DATA');
      commit('SET_ERROR', null);
      window.location.reload();
      
      // Limpiar cookies relacionadas
      if (typeof document !== 'undefined') {
        document.cookie = 'Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }
    }
  },
  getters: {
    datos: (state) => state.datos,
    loading: (state) => state.loading,
    error: (state) => state.error,
    currentUser: (state) => state.user,
    authToken: (state) => state.token,
    isAuthenticated: (state) => !!state.token
  }
});