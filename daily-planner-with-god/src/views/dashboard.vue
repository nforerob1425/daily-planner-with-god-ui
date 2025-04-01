<template>
  <v-container fluid class="dashboard-container fill-height config-view">
    <v-row v-if="dataLoaded" class="animate__animated animate__fadeIn ma-10">
      <!-- Sección Usuarios -->
      <v-col cols="12">
        <v-card class="mb-4 elevation-3" hover>
          <v-card-title class="primary">
            <v-icon large left>mdi-account-group</v-icon>
            Usuarios
          </v-card-title>
          <v-card-text>
            <div class="stats-grid pa-5">
              <stat-card icon="mdi-account" title="Total" :value="users.totalUsers" color="blue"/>
              <stat-card icon="mdi-sheep" title="Ovejas" :value="users.sheeps" color="orange"/>
              <stat-card icon="mdi-account-cowboy-hat" title="Líderes" :value="users.leaders" color="green"/>
              <stat-card icon="mdi-account-network" title="Coordinadores" :value="users.networkCoordinators" color="purple"/>
              <stat-card icon="mdi-account-star" title="Líderes Red" :value="users.networkLeaders" color="teal"/>
              <stat-card icon="mdi-account-tie" title="Cabezas Red" :value="users.networkHeaders" color="pink"/>
              <stat-card icon="mdi-account-hard-hat" title="Pastores" :value="users.pastors" color="deep-orange"/>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Sección Tarjetas -->
      <v-col cols="12" md="6">
        <v-card class="mb-4 elevation-3" hover>
          <v-card-title class="secondary">
            <v-icon large left>mdi-cards</v-icon>
            Tarjetas
          </v-card-title>
          <v-card-text>
            <div class="color-palette pa-5">
              <color-box v-for="(color, index) in topColors" 
                        :key="index" 
                        :color="color.value" 
                        :rank="index + 1"/>
            </div>
            <v-list density="compact">
              <v-list-item v-for="(value, key) in cards" :key="key">
                <template v-if="!key.includes('Color') && key !== 'topOneColorSelected' && key !== 'topTwoColorSelected' && key !== 'topThreeColorSelected'">
                  <v-list-item-title>{{ formatKey(key) }}</v-list-item-title>
                  <v-list-item-subtitle class="text-right">{{ value }}</v-list-item-subtitle>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Sección Roles -->
      <v-col cols="12" md="6">
        <v-card class="elevation-3" hover>
          <v-card-title class="teal">
            <v-icon large left>mdi-account-tie</v-icon>
            Distribución de Roles
          </v-card-title>
          <v-card-text>
            <!-- Tarjetas de métricas principales -->
            <v-row class="mb-4">
              <v-col cols="6" sm="4" v-for="(metric, index) in roleMetrics" :key="index">
                <div class="role-metric text-center pa-3">
                  <div class="text-h5 font-weight-bold" :style="{ color: chartColors[index] }">
                    {{ metric.value }}
                  </div>
                  <div class="text-caption text-grey-darken-1">
                    {{ metric.title }}
                  </div>
                </div>
              </v-col>
            </v-row>

            <!-- Listado visual de roles con progreso -->
            <v-list density="compact" class="role-list">
              <v-list-item
                v-for="(role, index) in roles.rolesNames"
                :key="index"
                class="px-0"
              >
                <template v-slot:prepend>
                  <v-avatar :color="chartColors[index % 3]" size="32" class="mr-3">
                    <v-icon color="white">{{ roleIcons[index] || 'mdi-account' }}</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-medium">
                  {{ role }}
                </v-list-item-title>

                <template v-slot:append>
                  <v-progress-circular
                    :model-value="roleDistribution[index]"
                    :size="48"
                    :width="4"
                    :color="chartColors[index % 3]"
                  >
                    <span class="text-caption">{{ roleDistribution[index] }}%</span>
                  </v-progress-circular>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Sección Peticiones -->
      <v-col cols="12" md="4">
        <v-card class="elevation-3" hover>
          <v-card-title class="accent">
            <v-icon large left>mdi-hand-heart</v-icon>
            Peticiones
          </v-card-title>
          <v-card-text>
            <!-- Gráfico circular simplificado -->
            <div class="d-flex justify-center align-center pa-5">
              <div class="text-center">
                <div class="text-h3 primary--text">{{ petitions.totalPetitions }}</div>
                <div class="text-caption">Total de peticiones</div>
                <v-divider class="my-3"></v-divider>
                <div class="text-h5 pink--text">{{ petitions.petitionsInPray }}</div>
                <div class="text-caption">En oración</div>
              </div>
            </div>

            <!-- Listado de tipos de peticiones -->
            <v-list density="compact" class="mt-2">
              <v-list-item
                v-for="(type, index) in filteredPetitionTypes"
                :key="index"
                :class="index < 3 ? 'font-weight-bold' : ''"
              >
                <template v-slot:prepend>
                  <v-icon :color="chartColors[index]">mdi-circle-small</v-icon>
                </template>
                
                <v-list-item-title>
                  {{ type || 'Sin clasificar' }}
                </v-list-item-title>

                <template v-slot:append>
                  <v-chip variant="text" :color="chartColors[index]">
                    #{{ index + 1 }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Nueva Sección Colores -->
      <v-col cols="12" md="4">
        <v-card class="elevation-3" hover>
          <v-card-title class="indigo">
            <v-icon large left>mdi-palette</v-icon>
            Colores
          </v-card-title>
          <v-card-text>
            <v-row class="pa-5">
              <v-col v-for="(value, key) in colors" :key="key" cols="6" sm="4">
                <stat-card 
                  :icon="colorIcons[key]" 
                  :title="formatKey(key)" 
                  :value="value"
                  color="indigo"
                  small
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Sección Estadísticas Generales -->
      <v-col cols="12" md="4">
        <v-card class="elevation-3" hover>
          <v-card-title class="orange">
            <v-icon large left>mdi-chart-box</v-icon>
            Estadísticas Generales
          </v-card-title>
          <v-card-text>
            <v-row class="pa-5">
              <v-col cols="6">
                <stat-card 
                  icon="mdi-calendar" 
                  title="Agendas" 
                  :value="totalAgendas"
                  color="orange"
                />
              </v-col>
              <v-col cols="6">
                <stat-card 
                  icon="mdi-advertisements" 
                  title="Anuncios" 
                  :value="totalAds"
                  color="cyan"
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
import StatCard from '@/components/StatCard.vue';
import ColorBox from '@/components/ColorBox.vue';

export default {
  name: 'dashboard-view',
  components: { StatCard, ColorBox },
  data: () => ({
    dataLoaded: false,
    chartColors: ['#114D7A', '#5C164E', '#FFD166'],
    colorIcons: {
      totalColors: 'mdi-invert-colors',
      totalPrimaryBackground: 'mdi-format-color-fill',
      totalPrimaryLetter: 'mdi-format-letter-case',
      totalTitle: 'mdi-format-title',
      totalTitleDate: 'mdi-calendar-text',
      totalTitleDateBackground: 'mdi-calendar-clock'
    },
    dashboardData: null
  }),
  computed: {
    users() { return this.dashboardData?.users || {} },
    cards() { return this.dashboardData?.cards || {} },
    petitions() { return this.dashboardData?.petitions || {} },
    colors() { return this.dashboardData?.colors || {} },
    roles() { return this.dashboardData?.roles || {} },
    totalAgendas() { return this.dashboardData?.totalAgendas || 0 },
    totalAds() { return this.dashboardData?.totalAds || 0 },
    
    filteredPetitionTypes() {
      return [
        this.petitions.topOnePetitionType,
        this.petitions.topTwoPetitionType,
        this.petitions.topThreePetitionType
      ].filter(t => t && t.trim() !== '')
    },
    
    petitionCounts() {
      const total = this.petitions.totalPetitions
      return this.filteredPetitionTypes.map((_, i) => 
        Math.round(total * (1 - i * 0.3)) // Ejemplo de distribución
      )
    },

    petitionsData() {
      return {
        labels: this.filteredPetitionTypes,
        values: this.petitionCounts,
        colors: this.chartColors
      }
    },

    topColors() {
      return [
        { name: 'Primario', value: this.cards.topOneColorSelected },
        { name: 'Secundario', value: this.cards.topTwoColorSelected },
        { name: 'Terciario', value: this.cards.topThreeColorSelected }
      ].filter(c => c.value)
    },

    rolesData() {
      return {
        labels: this.roles.rolesNames,
        values: [
          this.users.sheeps,
          this.users.leaders,
          this.users.networkCoordinators,
          this.users.networkLeaders,
          this.users.networkHeaders,
          this.users.pastors,
          this.roles.totalModeratorUsers,
          this.roles.totalAdminUsers,
        ],
        colors: this.chartColors
      }
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
        (this.users.leaders / totalUsers * 100).toFixed(1),
        (this.users.networkCoordinators / totalUsers * 100).toFixed(1),
        (this.users.networkLeaders / totalUsers * 100).toFixed(1),
        (this.users.networkHeaders / totalUsers * 100).toFixed(1),
        (this.users.pastors / totalUsers * 100).toFixed(1),
        (this.roles.totalModeratorUsers / totalUsers * 100).toFixed(1),
        (this.roles.totalAdminUsers / totalUsers * 100).toFixed(1),
      ]
    },

    roleIcons() {
      return [
        'mdi-sheep',
        'mdi-account-network',
        'mdi-shield',
        'mdi-glasses',
        'mdi-church',
        'mdi-account-star',
        'mdi-account-cowboy-hat',
        'mdi-account-group'
      ]
    }
  },
  methods: {
    async fetchItems() {
      try {
        const response = await api.get('/api/Dashboard');
        this.dashboardData = response.data?.data || [];
        this.dataLoaded = true;
      } catch (error) {
        console.error('Error fetching items:', error);
        if (error.response?.status === 401) this.logout();
      }
    },
    formatKey(key) {
      return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
    }
  },
  mounted() {
    this.fetchItems();
  }
};
</script>

<style scoped>
.dashboard-container {
  position: relative;
  min-height: 300px;
}

.loading-spinner {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.color-palette {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  justify-content: center;
}

.v-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15) !important;
}

.animate__animated {
  --animate-duration: 0.6s;
}

.v-card-title {
  color: white !important;
  padding: 16px !important;
  border-radius: 8px 8px 0 0;
}

.v-card-title.primary { background: #2196F3; }
.v-card-title.secondary { background: #3F51B5; }
.v-card-title.accent { background: #FF4081; }
.v-card-title.indigo { background: #536DFE; }
.v-card-title.teal { background: #009688; }
.v-card-title.orange { background: #FF9800; }

.v-list-item__prepend {
  align-self: center !important;
}

.v-chip--rank {
  min-width: 40px;
  justify-content: center;
}
</style>