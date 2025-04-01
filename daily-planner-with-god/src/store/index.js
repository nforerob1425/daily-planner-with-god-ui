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
    },
    UPDATE_USER_CONFIG(state, config) {
      state.user.configurationId = config.configurationId
      state.user.configurationName = config.configurationName
      state.user.showFavorites = config.showFavorites
      state.user.showPetitions = config.showPetitions
    },
    UPDATE_PETITION(state, updatedPetition) {
      if (state.user?.petitionsReported) {
        const index = state.user.petitionsReported.findIndex(p => p.id === updatedPetition.id);
        if (index !== -1) {
          state.user.petitionsReported.splice(index, 1, updatedPetition);
        }
      }
    },
  },
  actions: {
    async updateUserConfiguration({ commit }, { newConfig, payload }) {
      try {
        await api.patch('/api/users',payload)
        commit('UPDATE_USER_CONFIG', newConfig)
        return newConfig
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },
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
          commit('SET_USER_DATA', response.data.data);
          commit('SET_ERROR', null);
          return response.data.data;
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
    },

    async togglePraying({ commit }, petition) {
      try {
        const newState = !petition.isPraying;
        const response = await api.patch(`/api/petitions?petitionId=${petition.id}`);
        
        // Actualizar en el store
        const updatedPetition = { ...petition, isPraying: newState };
        commit('UPDATE_PETITION', updatedPetition);
        
        return response.data;
      } catch (error) {
        console.error('Error actualizando estado:', error);
        throw error;
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