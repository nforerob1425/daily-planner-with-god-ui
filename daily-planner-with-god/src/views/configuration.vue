<template>
  <v-container class="fill-height config-view" fluid>
    <v-row justify="center" class="ma-4">
      <v-col cols="12" md="10" lg="8">
        <h1 class="text-h3 mb-6 pb-6 gradient-text">Configuración de Visualización</h1>
        
        <v-row class="config-grid">
          <v-col 
            v-for="config in configurations" 
            :key="config.id" 
            cols="12" 
            md="6"
          >
            <v-card 
              class="config-card"
              :class="{ 'active-config': config.id === user.configurationId }"
              @click="selectConfiguration(config)"
              :style="cardStyle(config)"
            >
              <div class="card-content">
                <div class="header">
                  <v-icon 
                    large 
                    :color="config.id === user.configurationId ? 'white' : 'grey lighten-1'"
                    class="selection-icon"
                  >
                    mdi-{{ config.id === user.configurationId ? 'check-circle' : 'checkbox-blank-circle-outline' }}
                  </v-icon>
                  <h2 class="text-h5">{{ config.name }}</h2>
                </div>

                <v-divider class="my-4"></v-divider>

                <div class="config-details">
                  <div class="config-item">
                    <v-icon :color="config.showFavorites ? 'yellow darken-2' : 'grey'">
                      mdi-{{ config.showFavorites ? 'star' : 'star-off' }}
                    </v-icon>
                    <span class="ml-2" :class="textClass(config)">Favoritos</span>
                    <v-chip 
                      small 
                      :color="config.showFavorites ? 'green' : 'red'" 
                      class="ml-2"
                    >
                      {{ config.showFavorites ? 'Activado' : 'Desactivado' }}
                    </v-chip>
                  </div>

                  <div class="config-item">
                    <v-icon :color="config.showPetitions ? 'blue lighten-1' : 'grey'">
                      mdi-clipboard-{{ config.showPetitions ? 'text' : 'remove' }}
                    </v-icon>
                    <span class="ml-2" :class="textClass(config)">Peticiones</span>
                    <v-chip 
                      small 
                      :color="config.showPetitions ? 'green' : 'red'" 
                      class="ml-2"
                    >
                      {{ config.showPetitions ? 'Activado' : 'Desactivado' }}
                    </v-chip>
                  </div>
                </div>
              </div>

              <div class="active-overlay" v-if="config.id === user.configurationId"></div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import api from '@/plugins/axios';

export default {
  name: 'configuration-view',
  data(){
    return{
      configurations: []
    }
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    async fetchConfigurations() {
      try {
        const response = await api.get(`/api/Configurations`);
        this.configurations = response.data?.data || [];
      } catch (error) {
        console.error('Error fetching items:', error);
        if (error.response.status === 401) {
          this.logout();
        }
      }
    },
    async selectConfiguration(config) {
      try {
        const newConfig = {
          configurationId: config.id,
          configurationName: config.name,
          showFavorites: config.showFavorites,
          showPetitions: config.showPetitions
        }

        const payload = {
          UserId: this.user.id,
          ConfigurationId: config.id
        }
        
        await this.$store.dispatch('updateUserConfiguration', { newConfig, payload });
        
      } catch (error) {
        console.log('Error updating configuration:', error);
        if (error.response.status === 401) {
          this.logout();
        }
      }
    },
    cardStyle(config) {
      const isActive = config.id === this.user.configurationId
      return {
        background: isActive 
          ? 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' 
          : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
        transform: isActive ? 'scale(1.02)' : 'scale(1)'
      }
    },
    textClass(config) {
      return {
        'white--text': config.id === this.user.configurationId,
        'grey--text text--darken-1': config.id !== this.user.configurationId
      }
    }
  },
  mounted() {
    this.fetchConfigurations();
  }
}
</script>

<style scoped>
/* Mantener los mismos estilos del archivo anterior */
.config-view {
  background: linear-gradient(45deg, #f8f9fa 0%, #e9ecef 100%);
}

.gradient-text {
  background: linear-gradient(45deg, #1e3c72, #2a5298);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.config-grid {
  gap: 1.5rem;
}

.config-card {
  position: relative;
  border-radius: 20px !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  overflow: hidden;
  border: 2px solid transparent;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important;
}

.config-card:hover {
  transform: translateY(-8px) rotateX(2deg) rotateY(2deg);
  box-shadow: 0 12px 32px rgba(0,0,0,0.15) !important;
}

.active-config {
  border-color: #1e3c72 !important;
  z-index: 2;
  color: white;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  position: relative;
  z-index: 1;
}

.selection-icon {
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.config-details {
  padding: 0 1.5rem 1.5rem;
  position: relative;
  z-index: 1;
}

.config-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: rgba(255,255,255,0.1);
  margin: 0.5rem 0;
}

.config-item:hover {
  background: rgba(255,255,255,0.2);
  transform: translateX(8px);
}

.active-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(30,60,114,0.1) 0%, rgba(42,82,152,0.05) 100%);
  z-index: 0;
  animation: pulseGlow 2s infinite alternate;
}

@keyframes pulseGlow {
  from { opacity: 0.3; }
  to { opacity: 0.6; }
}

.v-chip {
  font-weight: 600;
  letter-spacing: 0.5px;
  font-size: 0.75rem;
}

@media (max-width: 960px) {
  .config-card {
    border-radius: 16px !important;
  }
  
  .header {
    padding: 1rem;
  }
  
  .config-details {
    padding: 0 1rem 1rem;
  }
}
</style>