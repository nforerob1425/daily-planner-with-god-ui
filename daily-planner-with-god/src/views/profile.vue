<template>
  <v-container class="fill-height config-view " fluid>
    <v-row justify="center" class="ma-4">
      <v-col cols="12" md="10" lg="8">
        <!-- Tarjeta principal con animación de entrada -->
        <v-fade-transition>
          <v-card v-if="profileDetails" class="profile-card pa-6 rounded-xl elevation-12">
            <!-- Encabezado con efecto de onda -->
            <v-slide-y-reverse-transition>
              <v-row 
                align="center" 
                class="mb-6 header-gradient py-4 rounded-t-lg"
              >
                <v-col cols="auto">
                  <v-avatar color="white" size="80" class="elevation-4 floating">
                    <v-icon size="x-large" color="blue">
                      <v-img
                        src="/assets/backgrounds/Daily-planner-logo.png"
                        alt="logo"
                        class="daily-logo"
                      >
                      </v-img>
                    </v-icon>
                  </v-avatar>
                </v-col>
                <v-col>
                  <h1 class="text-h3 font-weight-bold white--text slide-in">
                    {{ fullName }}
                  </h1>
                  <p class="text-subtitle-1 white--text text--lighten-2 fade-in-delay">
                    @{{ username }}
                  </p>
                </v-col>
              </v-row>
            </v-slide-y-reverse-transition>

            <!-- Botón de cambiar contraseña -->
            <v-slide-y-transition>
              <v-btn 
                color="blue darken-2" 
                class="mt-4 pulse" 
                @click="showPasswordDialog = true"
                dark
                elevation="4"
              >
                <v-icon left>mdi-key-change</v-icon>
                Cambiar Contraseña
              </v-btn>
            </v-slide-y-transition>

            <!-- Diálogo de cambio de contraseña -->
            <v-dialog 
              v-model="showPasswordDialog" 
              max-width="500" 
              transition="scale-transition"
            >
              <v-card class="rounded-xl pa-6 password-dialog">
                <v-card-title class="text-h5 primary--text mb-4 slide-in">
                  <v-icon color="primary" class="mr-2">mdi-lock-reset</v-icon>
                  Cambiar Contraseña
                </v-card-title>

                <v-card-text>
                  <v-form @submit.prevent="changePassword">
                    <v-text-field
                      v-model="newPassword"
                      :type="showPassword ? 'password' : 'text'"
                      label="Nueva Contraseña"
                      outlined
                      color="blue"
                      class="mb-4"
                      :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                      @click:append="showPassword = !showPassword"
                    ></v-text-field>

                    <v-text-field
                      v-model="confirmPassword"
                      type="password"
                      label="Confirmar Contraseña"
                      outlined
                      color="blue"
                      class="mb-4"
                      :error-messages="passwordError"
                    ></v-text-field>

                    <v-btn 
                      block 
                      color="primary" 
                      type="submit" 
                      :disabled="!passwordsMatch"
                      class="elevation-4 pulse"
                    >
                      <v-icon left>mdi-check-circle</v-icon>
                      Confirmar Cambio
                    </v-btn>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-dialog>

            <!-- Contenido principal -->
            <v-card-text>
              <!-- Información principal con animaciones escalonadas -->
              <v-row class="mb-6 info-section">
                <v-col cols="12" md="6">
                  <v-slide-x-transition>
                    <div class="d-flex align-center mb-4 info-item glow-on-hover">
                      <v-icon color="indigo" large class="mr-3 pulse">mdi-identifier</v-icon>
                      <div>
                        <div class="text-caption text-uppercase text-indigo">ID de usuario</div>
                        <div class="text-body-1 font-weight-medium">{{ id }}</div>
                      </div>
                    </div>
                  </v-slide-x-transition>

                  <v-slide-x-transition>
                    <div class="d-flex align-center mb-4 info-item glow-on-hover">
                      <v-icon 
                        :color="isMale ? 'indigo' : 'pink'" 
                        large 
                        class="mr-3 pulse"
                      >
                        {{ isMale ? 'mdi-gender-male' : 'mdi-gender-female' }}
                      </v-icon>
                      <div>
                        <div class="text-caption text-uppercase">Género</div>
                        <div class="text-body-1 font-weight-medium">
                          {{ isMale ? 'Masculino' : 'Femenino' }}
                        </div>
                      </div>
                    </div>
                  </v-slide-x-transition>
                </v-col>

                <v-col cols="12" md="6">
                  <v-slide-x-reverse-transition>
                    <div class="d-flex align-center mb-4 info-item glow-on-hover">
                      <v-icon color="teal" large class="mr-3 pulse">mdi-cog</v-icon>
                      <div>
                        <div class="text-caption text-uppercase text-teal">Configuración</div>
                        <div class="text-body-1 font-weight-medium">{{ configurationName }}</div>
                      </div>
                    </div>
                  </v-slide-x-reverse-transition>

                  <!-- Sección Lead con animación especial -->
                  <v-fade-transition>
                    <v-card 
                      v-if="hasLead"
                      class="mt-4 pa-4 rounded-lg lead-section neon-border"
                    >
                      <div class="d-flex align-center mb-2">
                        <v-icon color="cyan" class="mr-2 pulse">mdi-account-supervisor</v-icon>
                        <h3 class="text-h6 cyan--text text--accent-3">Información de tu lider</h3>
                      </div>

                      <v-row dense>
                        <v-col cols="12" md="6">
                          <div class="d-flex align-center">
                            <v-icon color="cyan" class="mr-2">mdi-account</v-icon>
                            <div>
                              <div class="text-caption cyan--text">Nombre completo</div>
                              <div class="text-body-1 font-weight-medium cyan--text text--darken-1">
                                {{ leadFirstname }} {{ leadLastName }}
                              </div>
                            </div>
                          </div>
                        </v-col>

                        <v-col cols="12" md="6">
                          <div class="d-flex align-center">
                            <v-icon 
                              :color="isMaleLead ? 'cyan' : 'pink'" 
                              class="mr-2"
                            >
                              {{ isMaleLead ? 'mdi-gender-male' : 'mdi-gender-female' }}
                            </v-icon>
                            <div>
                              <div class="text-caption cyan--text">Género</div>
                              <div class="text-body-1 font-weight-medium cyan--text text--darken-1">
                                {{ isMaleLead ? 'Masculino' : 'Femenino' }}
                              </div>
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-fade-transition>
                </v-col>
              </v-row>

              <!-- Estadísticas con animación de escalado -->
              <v-row class="mb-6 stats-container">
                <v-col cols="12" md="4">
                    <v-card elevation="3"
                      class="stat-card primary-gradient pa-4 rounded-lg scale-in"
                    >
                      <div class="text-h5 white--text">Tarjetas creadas por ti</div>
                      <div class="text-h2 font-weight-bold white--text">{{ totalCardsCreated }}</div>
                    </v-card>
                </v-col>
                
                <v-col cols="12" md="4" v-if="totalCardsReported > 0">
                    <v-card elevation="3"
                      class="stat-card error-gradient pa-4 rounded-lg scale-in-delay"
                    >
                      <div class="text-h5 white--text">Tarjetas de tus ovejas</div>
                      <div class="text-h2 font-weight-bold white--text">{{ totalCardsReported }}</div>
                    </v-card>
                </v-col>
              </v-row>

              <!-- Sección de Favoritos -->
              <section v-if="showFavorites" class="mb-8">
              <h2 class="text-h4 mb-4 primary--text slide-in-left">⭐ Tarjetas Favoritas</h2>
                  <v-icon color="primary">mdi-information-outline</v-icon>
                  <span class="ml-2">Para ver los ultimos cambios vuelve a iniciar la sesion</span>
              <v-row>
                  <v-col 
                  v-for="(card, index) in favoriteCards" 
                  :key="card.id" 
                  cols="12" 
                  md="6"
                  >
                  <v-slide-y-transition :delay="index * 100">
                      <v-card 
                      class="custom-card hover-3d"
                      :style="{
                          backgroundColor: card.primaryColor,
                          color: card.letterColor
                      }"
                      >
                      <div class="card-header">
                          <div class="date-badge">
                          <div class="month" :style="{ color: card.letterDateColor }">
                              {{ card.monthCreated + `-` + card.createDate }}
                          </div>
                          <div 
                              class="day"
                              :style="{
                              backgroundColor: card.primaryColorDate,
                              color: card.letterDateColor
                              }"
                          >
                              {{ card.dayCreated }}
                          </div>
                          </div>
                      </div>

                      <div class="card-content">
                          <div class="card-title">
                          <span class="title-text" :style="{ color: card.titleColor }">
                              {{ card.title }}
                          </span>
                          </div>
                          
                          <div class="content">
                          {{ card.content }}
                          </div>

                          <div v-if="card.versicle" class="versicle">
                          <v-icon small :color="card.titleColor">mdi-book</v-icon>
                          <span>{{ card.versicle }}</span>
                          </div>
                      </div>
                      </v-card>
                  </v-slide-y-transition>
                  </v-col>
              </v-row>
              </section>

              <!-- Sección de Peticiones -->
              <section v-if="showPetitions" class="mb-8">
                <h2 class="text-h4 mb-4 primary--text slide-in-left-delay">📋 Peticiones Reportadas</h2>
                <v-slide-y-transition group>
                  <v-card
                    v-for="petition in petitionsReported"
                    :key="petition.id"
                    class="mb-4 pt-3 petition-card floating-card mx-auto"
                    :class="{
                      'active-card': petition.isPraying,
                      'inactive-card': !petition.isPraying
                    }"
                    elevation="6"
                  >
                    <v-card-item>
                      <template v-slot:prepend>
                        <v-avatar :color="getPetitionColor(petition)" size="56">
                          <v-icon size="x-large" :icon="getPetitionIcon(petition)" color="white"></v-icon>
                        </v-avatar>
                      </template>

                      <v-card-title class="text-h6 font-weight-bold">
                        Oró por {{ petition.prayFor }}
                      </v-card-title>

                      <v-tooltip text="Tooltip" location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon
                            @click="togglePraying(petition)"
                            class="floating pray-btn"
                            :color="petition.isPraying ? 'teal-darken-2' : 'grey'"
                            size="x-large"
                          >
                            <v-icon>{{ petition.isPraying ? 'mdi-hand-heart' : 'mdi-hand' }}</v-icon>
                          </v-btn>
                        </template>
                        <span v-if="petition.isPraying">Dejar de orar</span>
                        <span v-else>Empieza a orar</span>
                    </v-tooltip>
                    </v-card-item>

                    <v-card-text class="text-body-1 content-text">
                      {{ petition.content }}
                      <div class="mt-4 d-flex align-center">
                        <span class="text-caption cyan--text date-text">
                          {{ petition.originalUser }} -
                          {{ formattedDate(petition.createdDate) }}
                        </span>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-slide-y-transition>

                <div v-if="petitionsReported.length === 0" class="text-center mt-4 text-body-1">
                  <v-icon color="primary">mdi-information-outline</v-icon>
                  <span class="ml-2">No tienes peticiones activas en este momento</span>
                </div>
              </section>
            </v-card-text>
          </v-card>
        </v-fade-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { useNotification } from "@kyvg/vue3-notification";
import api from '@/plugins/axios';

export default {
  name: 'ProfileView',
  data() {
    return {
      profileDetails: null,
      showPasswordDialog: false,
      newPassword: '',
      confirmPassword: '',
      showPassword: true
    }
  },
  setup() {
    const { notify } = useNotification();
    return { notify };
  },
  async created() {
    try {
      const response = await api.get(`/api/Login/${this.user.id}`);
      this.profileDetails = response.data.data;
    } catch (error) {
      if (error.response?.status === 401) {
        this.logout();
      }
      else{
        this.notify({
          title: 'Error',
          text: 'Error al cargar el perfil',
          type: 'error',
          duration: 5000
        });
      }
    }
  },
  computed: {
    ...mapState(['user']),
    fullName() {
      return `${this.profileDetails?.firstName || ''} ${this.profileDetails?.lastName || ''}`.trim();
    },
    username() {
      return this.profileDetails?.username || '';
    },
    id() {
      return this.profileDetails?.id || '';
    },
    isMale() {
      return this.profileDetails?.isMale || false;
    },
    configurationName() {
      return this.profileDetails?.configurationName || '';
    },
    hasLead() {
      return this.profileDetails?.hasLead || false;
    },
    leadFirstname() {
      return this.profileDetails?.leadFirstname || '';
    },
    leadLastName() {
      return this.profileDetails?.leadLastName || '';
    },
    isMaleLead() {
      return this.profileDetails?.isMaleLead || false;
    },
    totalCardsCreated() {
      return this.profileDetails?.totalCardsCreated || 0;
    },
    totalCardsReported() {
      return this.profileDetails?.totalCardsReported || 0;
    },
    showFavorites() {
      return this.profileDetails?.showFavorites || false;
    },
    favoriteCards() {
      const orderCards = this.profileDetails?.favoriteCards;
      return orderCards.sort((a, b) => new Date(a.created) - new Date(b.created)) || [];
    },
    showPetitions() {
      return this.profileDetails?.showPetitions || false;
    },
    passwordsMatch() {
      return this.newPassword === this.confirmPassword && this.newPassword.length >= 6
    },
    passwordError() {
      if (this.confirmPassword && !this.passwordsMatch) {
        return 'Las contraseñas deben coincidir y tener al menos 6 caracteres'
      }
      return ''
    },
    petitionsReported() {
      return this.profileDetails?.petitionsReported || [];
    },
    petitionTypes() {
      return this.profileDetails?.petitionTypes || [];
    },
  },
  methods: {
    ...mapActions(['logout']),
    async changePassword() {
      try {
        const payload = {
          newPassword: this.newPassword,
          userId: this.user.id
        };
        
        const response = await api.post('/api/Password', payload);
        this.notify({
            title: 'Success',
            text: response.data?.message || '',
            type: 'success',
            duration: 5000
          });      
      } catch (error) {
        if (error.response?.status === 401) {
          this.logout();
        } else {
          this.notify({
            title: 'Error',
            text: error.response?.data?.Message || 'Error al guardar',
            type: 'error',
            duration: 5000
          });
        }
      }

      this.showPasswordDialog = false
      this.newPassword = ''
      this.confirmPassword = ''
    },
    getPetitionColor(petition) {
      const type = this.petitionTypes.find(t => t.id === petition.petitionTypeId);
      return type?.color || '#2196F3';
    },
    
    getPetitionIcon(petition) {
      const type = this.petitionTypes.find(t => t.id === petition.petitionTypeId);
      return type?.icon || 'mdi-help-circle';
    },

    formattedDate(date) {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    async togglePraying(petition) {
      const originalState = petition.isPraying;
      try {
        petition.isPraying = !petition.isPraying;
        const response = await api.patch(`/api/petitions?petitionId=${petition.id}`);
        this.notify({
          title: 'Éxito',
          text: 'Estado de oración actualizada',
          type: 'success',
          duration: 3000
        });
        
        return response.data;
      } catch (error) {
        petition.isPraying = originalState;
        if (error.response?.status === 401) {
          this.logout();
        }else{
          this.notify({
            title: 'Error',
            text: 'No se pudo actualizar el estado de oración',
            type: 'error',
            duration: 5000
          });
        }
        console.error('Error actualizando estado:', error);
        throw error;
      }
    }
  }
};
</script>
  
<style scoped>
  .profile-card {
    background: #FFFFFF;
    box-shadow: 
      0 12px 24px rgba(30, 144, 255, 0.15),
      0 0 40px rgba(30, 144, 255, 0.05) !important;
    transform: translateY(0);
    transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  
  .profile-card:hover {
    box-shadow: 
      0 20px 40px rgba(30, 144, 255, 0.2),
      0 0 60px rgba(30, 144, 255, 0.1) !important;
  }
  
  .header-gradient {
    background: linear-gradient(
      135deg,
      rgba(30, 144, 255, 1) 0%,
      rgba(75, 0, 130, 0.9) 100%
    ) !important;
    position: relative;
    overflow: hidden;
    color: #FFFFFF;
    padding-left: 10px;
    padding-right: 10px;
  }
  
  .header-gradient::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 25%,
      rgba(255,255,255,0.1) 50%,
      transparent 75%
    );
    animation: wave 8s infinite linear;
    opacity: 0.3;
  }
  
  @keyframes wave {
    0% { transform: rotate(0deg) translate(-50%, -50%); }
    100% { transform: rotate(360deg) translate(-50%, -50%); }
  }
  
  .neon-border {
    border: 2px solid rgba(0, 255, 255, 0.3);
    box-shadow: 
      0 0 15px rgba(0, 255, 255, 0.2),
      inset 0 0 10px rgba(0, 255, 255, 0.1);
    animation: neon-pulse 2s infinite alternate;
  }
  
  @keyframes neon-pulse {
    from { box-shadow: 0 0 10px rgba(0, 255, 255, 0.2); }
    to { box-shadow: 0 0 20px rgba(0, 255, 255, 0.4); }
  }
  
  .hover-3d {
    transition: 
      transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
      box-shadow 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  
  .hover-3d:hover {
    transform: 
      translateY(-5px)
      rotateX(2deg)
      rotateY(2deg)
      perspective(1000px);
    box-shadow: 
      0 15px 30px rgba(0,0,0,0.2),
      0 0 40px rgba(30, 144, 255, 0.1) !important;
  }
  
  .floating {
    animation: float 4s ease-in-out infinite;
  }
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  
  .pulse {
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .glow-on-hover:hover {
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 0 15px rgba(30, 144, 255, 0.2);
  }
  
  .scale-in {
    animation: scaleIn 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  }
  
  .scale-in-delay {
    animation: scaleIn 0.6s 0.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
    opacity: 0;
  }
  
  @keyframes scaleIn {
    from { 
      transform: scale(0.9);
      opacity: 0;
    }
    to { 
      transform: scale(1);
      opacity: 1;
    }
  }
  
  .slide-in {
    animation: slideIn 0.8s ease-out;
  }
  
  @keyframes slideIn {
    from { 
      transform: translateX(-50px);
      opacity: 0;
    }
    to { 
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .fade-in-delay {
    animation: fadeIn 1s 0.3s forwards;
    opacity: 0;
  }
  
  @keyframes fadeIn {
    to { opacity: 1; }
  }
  
  .slide-in-left {
    animation: slideInLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  @keyframes slideInLeft {
    from { 
      transform: translateX(-100px);
      opacity: 0;
    }
    to { 
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .slide-in-left-delay {
    animation: slideInLeft 0.8s 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    opacity: 0;
  }

  .daily-logo {
    width: 80px;
    height: 85px;
    position: fixed;
    top: -3px;
  }

.password-dialog {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 
    0 12px 24px rgba(30, 144, 255, 0.15),
    0 0 40px rgba(30, 144, 255, 0.05) !important;
  border: 2px solid rgba(30, 144, 255, 0.1);
}

.password-dialog .v-card__title {
  border-bottom: 2px solid rgba(30, 144, 255, 0.2);
}

.password-dialog .v-input__slot {
  transition: all 0.3s ease;
}

.password-dialog .v-input__slot:hover {
  transform: translateY(-2px);
}

.petition-card {
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.active-card {
    border-left: 4px solid #1DE9B6;
    background: #1de9b628;
  }
  
  &.inactive-card {
    border-left: 4px solid #9E9E9E;
    background: rgba(158, 158, 158, 0.05);
  }
}

.floating-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 12px 24px rgba(30, 144, 255, 0.15);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(30, 144, 255, 0.2) !important;
  }
}

.hover-3d {
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  &:hover {
    transform: perspective(6000px) rotateX(2deg) rotateY(2deg);
  }
}

.floating-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 12px 24px rgba(30, 144, 255, 0.15);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(30, 144, 255, 0.2) !important;
  }
}

.date-text {
  position: absolute;
  right: 25px;
}

.hover-3d {
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  &:hover {
    transform: perspective(6000px) rotateX(2deg) rotateY(2deg);
  }
}

.pray-btn {
  position: absolute;
    right: 12px;
    top: 15px;
}
  </style>