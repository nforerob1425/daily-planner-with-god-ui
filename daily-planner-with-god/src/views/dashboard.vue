<template>
  <v-container fluid class="dashboard-container fill-height config-view">
    <v-row v-if="dataLoaded" class="animate__animated animate__fadeIn ma-4">
      <!-- Sección Usuarios -->
      <v-col cols="12">
        <v-card class="mb-4 elevation-4 glass-card" rounded="xl">
          <v-card-title class="card-header-primary">
            <v-icon large left>mdi-account-group</v-icon>
            <span class="header-title">Usuarios</span>
            <v-spacer></v-spacer>
            <v-chip variant="outlined" color="white" class="total-chip pulse">
              Total: {{ users.totalUsers }}
            </v-chip>
          </v-card-title>
          <v-card-text>
            <div class="stats-grid pa-5">
              <stat-card 
                v-for="(stat, index) in userStats" 
                :key="index"
                class="animate__animated animate__fadeInUp stats-grid-hover"
                :style="{ 'animation-delay': `${index * 0.1}s` }"
                :icon="stat.icon"
                :title="stat.title"
                :value="stat.value"
                :color="stat.color"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Sección Tarjetas -->
      <v-col cols="12" md="6">
        <v-card class="mb-4 elevation-4 glass-card animate__animated animate__fadeInLeft" rounded="xl">
          <v-card-title class="card-header-secondary">
            <v-icon large left>mdi-cards</v-icon>
            <span class="header-title">Tarjetas</span>
            <v-spacer></v-spacer>
            <v-icon color="white">mdi-palette-swatch</v-icon>
          </v-card-title>
          <v-card-text>
            <div class="color-palette pa-5">
              <color-box 
                v-for="(color, index) in topColors" 
                :key="index" 
                :color="color.value" 
                :rank="index + 1"
                class="animate__zoomIn ma-5"
                :style="{ 'animation-delay': `${index * 0.2}s` }"
              />
            </div>
            <v-list density="compact" class="metric-list">
              <v-list-item 
                v-for="([key, value]) in filteredCards" 
                :key="key"
                class="list-item-hover ml-5 mr-5"
              >
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-circle-medium</v-icon>
                </template>
                <v-list-item-title class="metric-title">
                  {{ formatKey(key) }}
                </v-list-item-title>
                <template v-slot:append>
                  <v-chip variant="outlined" color="primary" class="metric-value">
                    {{ value }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Sección Roles -->
      <v-col cols="12" md="6">
        <v-card class="elevation-4 glass-card animate__animated animate__fadeInRight" rounded="xl">
          <v-card-title class="card-header-accent mb-5">
            <v-icon large left>mdi-account-tie</v-icon>
            <span class="header-title">Distribución de Roles</span>
            <v-spacer></v-spacer>
            <v-icon color="white">mdi-chart-pie</v-icon>
          </v-card-title>
          <v-card-text>
            <v-row class="mb-4">
              <v-col 
                cols="6" 
                sm="4" 
                v-for="(metric, index) in roleMetrics" 
                :key="index"
                class="animate__animated animate__fadeInUp"
                :style="{ 'animation-delay': `${index * 0.15}s` }"
              >
                <div class="role-metric text-center pa-3">
                  <div class="text-h5 font-weight-bold metric-value" :style="{ color: chartColors[index] }">
                    {{ metric.value }}
                  </div>
                  <div class="text-caption metric-label">
                    {{ metric.title }}
                  </div>
                </div>
              </v-col>
            </v-row>

            <v-list density="compact" class="role-list">
              <v-list-item
                v-for="(role, index) in roles.rolesNames"
                :key="index"
                class="list-item-hover px-0 ml-5 mr-5"
              >
                <template v-slot:prepend>
                  <v-avatar 
                    :color="chartColors[index % 3]" 
                    size="32" 
                    class="mr-3 animate__animated animate__bounceIn"
                    :style="{ 'animation-delay': `${index * 0.1}s` }"
                  >
                    <v-icon color="white">{{ roleIcons[index] || 'mdi-account' }}</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-medium role-title">
                  {{ role }}
                </v-list-item-title>

                <template v-slot:append>
                  <v-progress-circular
                    :model-value="roleDistribution[index]"
                    :size="48"
                    :width="4"
                    :color="chartColors[index % 3]"
                    class="progress-ring"
                  >
                    <span class="text-caption progress-value">{{ roleDistribution[index] }}%</span>
                  </v-progress-circular>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Sección Peticiones -->
      <v-col cols="12" md="4">
        <v-card class="elevation-4 glass-card animate__animated animate__fadeInUp" rounded="xl">
          <v-card-title class="card-header-indigo">
            <v-icon large left>mdi-hand-heart</v-icon>
            <span class="header-title">Peticiones</span>
            <v-spacer></v-spacer>
            <v-icon color="white">mdi-chat-processing</v-icon>
          </v-card-title>
          <v-card-text>
            <div class="d-flex justify-center align-center pa-5">
              <div class="text-center">
                <div class="text-h3 primary--text animate__pulse">{{ petitions.totalPetitions }}</div>
                <div class="text-caption metric-label">Total de peticiones</div>
                <v-divider class="my-3"></v-divider>
                <div class="text-h5 pink--text">{{ petitions.petitionsInPray }}</div>
                <div class="text-caption metric-label">En oración</div>
              </div>
            </div>

            <v-list density="compact" class="mt-2 metric-list">
              <v-list-item
                v-for="(type, index) in filteredPetitionTypes"
                :key="index"
                :class="index < 3 ? 'font-weight-bold' : ''"
                class="list-item-hover ml-5 mr-5"
              >
                <template v-slot:prepend>
                  <v-icon :color="chartColors[index]">mdi-circle-small</v-icon>
                </template>
                
                <v-list-item-title class="metric-title">
                  {{ type || 'Sin clasificar' }}
                </v-list-item-title>

                <template v-slot:append>
                  <v-chip variant="text" :color="chartColors[index]" class="metric-value">
                    #{{ index + 1 }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Sección Colores -->
      <v-col cols="12" md="4">
        <v-card class="elevation-4 glass-card animate__animated animate__fadeInUp" rounded="xl">
          <v-card-title class="card-header-purple">
            <v-icon large left>mdi-palette</v-icon>
            <span class="header-title">Colores</span>
            <v-spacer></v-spacer>
            <v-icon color="white">mdi-brush</v-icon>
          </v-card-title>
          <v-card-text>
            <v-row class="pa-5">
              <v-col v-for="(value, key) in colors" :key="key" cols="6" sm="4">
                <stat-card 
                  :icon="colorIcons[key]" 
                  :title="formatKey(key)" 
                  :value="value"
                  color="purple"
                  small
                  class="animate__zoomIn stats-grid-hover"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Sección Estadísticas Generales -->
      <v-col cols="12" md="4">
        <v-card class="elevation-4 glass-card animate__animated animate__fadeInUp" rounded="xl">
          <v-card-title class="card-header-orange">
            <v-icon large left>mdi-chart-box</v-icon>
            <span class="header-title">Estadísticas</span>
            <v-spacer></v-spacer>
            <v-icon color="white">mdi-poll</v-icon>
          </v-card-title>
          <v-card-text>
            <v-row class="pa-5">
              <v-col cols="4">
                <stat-card 
                  icon="mdi-calendar" 
                  title="Agendas" 
                  :value="totalAgendas"
                  color="orange"
                  class="animate__zoomIn stats-grid-hover"
                />
              </v-col>
              <v-col cols="4">
                <stat-card 
                  icon="mdi-advertisements" 
                  title="Anuncios" 
                  :value="totalAds"
                  color="cyan"
                  class="animate__zoomIn stats-grid-hover"
                />
              </v-col>
              <v-col cols="4">
                <stat-card 
                  icon="mdi-note-text" 
                  title="Notas" 
                  :value="totalNotes"
                  color="purple"
                  class="animate__zoomIn stats-grid-hover"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-progress-circular
      v-else
      indeterminate
      color="primary"
      size="64"
      class="loading-spinner"
    />
  </v-container>
</template>


<script>
import api from '@/plugins/axios';
import { mapActions, mapState } from 'vuex';
import StatCard from '@/components/StatCard.vue';
import ColorBox from '@/components/ColorBox.vue';
import { useNotification } from "@kyvg/vue3-notification";

export default {
  name: 'dashboard-view',
  components: {
    StatCard,
    ColorBox
  },
  data() {
    return {
      dataLoaded: false,
      dashboardData: null,
      chartColors: ['#114D7A', '#5C164E', '#FFD166'],
      colorIcons: {
        totalColors: 'mdi-invert-colors',
        totalPrimaryBackground: 'mdi-format-color-fill',
        totalPrimaryLetter: 'mdi-format-letter-case',
        totalTitle: 'mdi-format-title',
        totalTitleDate: 'mdi-calendar-text',
        totalTitleDateBackground: 'mdi-calendar-clock'
      }
    }
  },
  setup() {
    const { notify } = useNotification();
    return { notify };
  },
  computed: {
    ...mapState(['user']),
    filteredCards() {
      return Object.entries(this.cards || {}).filter(([key]) => 
        !key.includes('Color') && 
        key !== 'topOneColorSelected' && 
        key !== 'topTwoColorSelected' && 
        key !== 'topThreeColorSelected'
      )
    },
    users() { return this.dashboardData?.users || {} },
    cards() { return this.dashboardData?.cards || {} },
    petitions() { return this.dashboardData?.petitions || {} },
    colors() { return this.dashboardData?.colors || {} },
    roles() { return this.dashboardData?.roles || {} },
    totalAgendas() { return this.dashboardData?.totalAgendas || 0 },
    totalAds() { return this.dashboardData?.totalAds || 0 },
    totalNotes() { return this.dashboardData?.totalNotes || 0 },
    userStats() {
      return [
        { icon: 'mdi-sheep', title: 'Ovejas', value: this.users.sheeps, color: 'orange' },
        { icon: 'mdi-account-cowboy-hat', title: 'Líderes', value: this.users.leaders, color: 'green' },
        { icon: 'mdi-account-network', title: 'Coordinadores', value: this.users.networkCoordinators, color: 'purple' },
        { icon: 'mdi-account-star', title: 'Líderes Red', value: this.users.networkLeaders, color: 'teal' },
        { icon: 'mdi-account-tie', title: 'Cabezas Red', value: this.users.networkHeaders, color: 'pink' },
        { icon: 'mdi-account-hard-hat', title: 'Pastores', value: this.users.pastors, color: 'deep-orange' },
        { icon: 'mdi-glasses', title: 'Moderadores', value: this.roles.totalModeratorUsers, color: 'blue' },
        { icon: 'mdi-shield', title: 'Administradores', value: this.roles.totalAdminUsers, color: 'red' }
      ]
    },
    roleMetrics() {
      return [
        { title: 'Total Roles', value: this.roles.totalRolesExist },
        { title: 'Administradores', value: this.roles.totalAdminUsers },
        { title: 'Moderadores', value: this.roles.totalModeratorUsers }
      ]
    },
    roleDistribution() {
      const totalUsers = this.users.totalUsers || 1
      return [
        (this.users.sheeps / totalUsers * 100).toFixed(1),
        (this.users.networkCoordinators / totalUsers * 100).toFixed(1),
        (this.roles.totalAdminUsers / totalUsers * 100).toFixed(1),
        (this.roles.totalModeratorUsers / totalUsers * 100).toFixed(1),
        (this.users.pastors / totalUsers * 100).toFixed(1),
        (this.users.networkLeaders / totalUsers * 100).toFixed(1),
        (this.users.leaders / totalUsers * 100).toFixed(1),
        (this.users.networkHeaders / totalUsers * 100).toFixed(1),
      ]
    },
    filteredPetitionTypes() {
      return [
        this.petitions.topOnePetitionType,
        this.petitions.topTwoPetitionType,
        this.petitions.topThreePetitionType
      ].filter(t => t && t.trim() !== '')
    },
    topColors() {
      return [
        { name: 'Primario', value: this.cards.topOneColorSelected },
        { name: 'Secundario', value: this.cards.topTwoColorSelected },
        { name: 'Terciario', value: this.cards.topThreeColorSelected }
      ].filter(c => c.value)
    },
    roleIcons() {
      return [
        'mdi-sheep',
        'mdi-account-network',
        'mdi-shield',
        'mdi-glasses',
        'mdi-account-hard-hat',
        'mdi-account-star',
        'mdi-account-cowboy-hat',
        'mdi-account-tie'
      ]
    }
  },
  methods: {
    ...mapActions(['logout']),
    formatKey(key) {
      return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
    },
    async fetchItems() {
      try {
        const response = await api.get('/api/Dashboard');
        if(!response.data.success) {
          this.notify({
            title: 'Error',
            text: 'Error al cargar la data para las graficas.',
            type: 'error',
            duration: 2000
          });
          console.error(response.data?.message);
        }
        else{
          this.dashboardData = response.data?.data || [];
        }
      } catch (error) {
        if (error.status === 401) {
          this.logout();
        }
        this.notify({
          title: 'Error',
          text: error.message ||'Error al procesar la peticion.',
          type: 'error',
          duration: 2000
        });
      }
    }
  },
  async mounted() {
    if(!this.user.permissions.includes('CSDV')){
      this.logout();
    }
    await this.fetchItems();
    this.dataLoaded = true;
  }
};
</script>

<style scoped>
.dashboard-container {
  background: linear-gradient(45deg, #f5f7fa, #e6e9ef);
  min-height: 100vh;
  padding: 2rem;
}

.card-header-primary {
  background: linear-gradient(45deg, #2196F3, #1976D2) !important;
  color: white !important;
  padding: 1.5rem !important;
  border-radius: 16px 16px 0 0;
}

.card-header-secondary {
  background: linear-gradient(45deg, #3F51B5, #303F9F) !important;
  color: white !important;
}

.card-header-accent {
  background: linear-gradient(45deg, #FF4081, #F50057) !important;
  color: white !important;
}

.card-header-indigo {
  background: linear-gradient(45deg, #536DFE, #304FFE) !important;
  color: white !important;
}

.card-header-purple {
  background: linear-gradient(45deg, #9C27B0, #7B1FA2) !important;
  color: white !important;
}

.card-header-orange {
  background: linear-gradient(45deg, #FF9800, #F57C00) !important;
  color: white !important;
}

.glass-card {
  background: rgba(255, 255, 255, 0.9) !important;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 32px rgba(0,0,0,0.12) !important;
}

.header-title {
  font-weight: 600;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.total-chip {
  border-width: 2px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.15) !important;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.stats-grid-hover:hover {
  background: rgba(33, 150, 243, 0.05) !important;
  transform: translateX(5px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.list-item-hover {
  transition: all 0.3s ease;
  border-radius: 10px;
  margin: 4px 0;
  padding: 8px;
}

.list-item-hover:hover {
  background: rgba(33, 150, 243, 0.05) !important;
  transform: translateX(10px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.metric-list {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.metric-title {
  font-weight: 500;
  color: #2c3e50;
  letter-spacing: 0.3px;
}

.metric-value {
  font-weight: 600;
  letter-spacing: 0.5px;
  background: rgba(255, 255, 255, 0.9) !important;
}

.role-metric {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05);
}

.role-metric:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
}

.progress-ring {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-ring:hover {
  transform: rotate(360deg) scale(1.1);
}

.progress-value {
  font-weight: 500;
  color: #2c3e50;
}

.role-title {
  color: #34495e;
  letter-spacing: 0.3px;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.pulse {
  animation: pulse 2s infinite;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  .header-title {
    font-size: 1.25rem;
  }
  
  .v-card-title {
    padding: 12px !important;
  }
  
  .glass-card {
    margin-bottom: 1.5rem;
  }
}

@keyframes animate__zoomIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate__zoomIn {
  animation: animate__zoomIn 0.6s ease;
}
</style>