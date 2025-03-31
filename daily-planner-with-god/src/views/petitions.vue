<template>
  <v-container class="fill-height config-view" fluid>
    <v-card class="pa-6 main-card" elevation="12">
      <!-- Encabezado con gradiente -->
      <div class="header-gradient py-4 rounded-t-lg mb-6">
        <h1 class="text-h3 font-weight-bold white-text slide-in pl-2 pr-2">
          <v-icon color="white" class="mr-3">mdi-clipboard-text</v-icon>
           Peticiones de Oración
        </h1>
      </div>

      <!-- Sección de peticiones activas -->
      <section v-if="activePetitions.length > 0" class="mb-8">
        <h2 class="text-h5 primary--text mb-4 slide-in">
          <v-icon color="cyan" class="mr-2">mdi-hand-heart</v-icon>
          Peticiones Activas ({{ activePetitions.length }})
        </h2>
        <v-slide-y-transition group>
          <v-card
            v-for="petition in activePetitions"
            :key="petition.id"
            class="mb-4 petition-card floating-card active-card hover-3d"
            elevation="6"
          >
              <template v-slot:prepend>
                <v-avatar :color="getColorIcon(petition)" size="56" class="floating">
                  <v-icon size="x-large" :icon="petitionTypeIcon(petition)" color="white"></v-icon>
                </v-avatar>
              </template>

              <v-card-title class="text-h6 font-weight-bold">
                Oró por {{ petition.prayFor }}
              </v-card-title>

              <v-card-text class="text-body-1 content-text">
                {{ petition.content }}
                <div class="mt-4 d-flex align-center">
                  <span class="text-caption cyan--text date-text">
                    {{ formattedDate(petition.createdDate) }}
                  </span>
                </div>
              </v-card-text>
            
          </v-card>
        </v-slide-y-transition>
      </section>

      <!-- Sección de peticiones inactivas -->
      <section v-if="inactivePetitions.length > 0">
        <h2 class="text-h5 grey--text mb-4 slide-in">
          <v-icon color="blue" class="mr-2">mdi-sleep</v-icon>
          Peticiones Pendientes ({{ inactivePetitions.length }})
        </h2>
        <v-slide-y-transition group>
          <v-card
            v-for="petition in inactivePetitions"
            :key="petition.id"
            class="mb-4 pt-3 petition-card floating-card inactive-card hover-3d"
            elevation="6"
          >
              <v-card-title class="text-h6 font-weight-bold grey--text">
                Oró por {{ petition.prayFor }}
              </v-card-title>

              <template v-slot:prepend>
                <v-avatar :color="getColorIcon(petition)" size="56" class="floating">
                  <v-icon size="x-large" :icon="petitionTypeIcon(petition)" color="white"></v-icon>
                </v-avatar>
              </template>

              <template v-slot:append>
                <v-btn
                  icon
                  @click="confirmDelete(petition)"
                  class="floating"
                  color="error"
                  size="x-large"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>

              <v-card-text class="text-body-1 content-text grey--text">
                {{ petition.content }}
                <div class="mt-4 d-flex align-center">
                  <span class="text-caption grey--text date-text">
                    {{ formattedDate(petition.createdDate) }}
                  </span>
                </div>
              </v-card-text>
            
          </v-card>
        </v-slide-y-transition>
      </section>

      <!-- Botón flotante de creación -->
      <v-tooltip text="Pidele ayuda a tu lider a orar" location="left" v-if="this.user.hasLead">
        <template v-slot:activator="{ props }">
          <v-btn 
            v-bind="props"
            icon="mdi-plus"
            fab
            dark
            color="primary"
            class="floating-add-btn pulse"
            @click="showDialog = true"
          />
        </template>
      </v-tooltip>

      <!-- Diálogo de creación -->
      <v-dialog v-model="showDialog" max-width="800" transition="scale-transition">
        <v-card class="dialog-form pa-8">
          <div class="header-gradient py-4 rounded-t-lg">
            <v-card-title class="text-h4 white-text mb-6 slide-in">
              <v-icon color="white" class="mr-3">mdi-plus-circle</v-icon>
              Nueva Petición
            </v-card-title>
          </div>
          <v-card-text>
            <v-form @submit.prevent="createPetition">
              <v-autocomplete
                v-model="newPetition.petitionTypeId"
                :items="petitionTypes"
                item-title="name"
                item-value="id"
                label="Tipo de Petición"
                required
                outlined
                color="primary"
                class="mb-6"
                density="comfortable"
              ></v-autocomplete>

              <v-text-field
                v-model="newPetition.prayFor"
                label="Orar por"
                outlined
                color="primary"
                required
                density="comfortable"
                class="mb-6"
              ></v-text-field>

              <v-textarea
                v-model="newPetition.content"
                label="Contenido"
                rows="4"
                outlined
                color="primary"
                required
                density="comfortable"
                class="mb-6"
              ></v-textarea>

              <v-btn 
                type="submit" 
                color="primary" 
                block
                class="elevation-4 pulse py-6"
                :disabled="!formValid"
              >
                <v-icon left size="x-large">mdi-check-circle</v-icon>
                <span class="text-h6">Crear Petición</span>
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- Diálogo de confirmación -->
      <v-dialog v-model="showDeleteDialog" max-width="400">
        <v-card rounded="lg">
          <div class="header-gradient py-4 rounded-t-lg">
            <v-card-title class="white-text">
              <v-icon color="white" class="mr-2">mdi-alert-circle</v-icon>
              Confirmar Eliminación
            </v-card-title>
          </div>
          <v-card-text class="pt-4">
            ¿Seguro que deseas eliminar esta petición?
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-btn @click="showDeleteDialog = false" class="mr-2">Cancelar</v-btn>
            <v-btn color="error" @click="deletePetition" class="elevation-2 pulse">
              <v-icon left>mdi-delete</v-icon>
              Eliminar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import api from '@/plugins/axios';

export default {
  name: 'petitions-view',
  data: () => ({
    petitions: [],
    petitionTypes: [],
    newPetition: {
      prayFor: '',
      content: '',
      isPraying: false,
      petitionTypeId: null
    },
    showDialog: false,
    showDeleteDialog: false,
    selectedPetition: null
  }),
  computed: {
    ...mapState(['user']),
    sortedPetitions() {
      return [...this.petitions].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
    },
    activePetitions() {
      return this.sortedPetitions.filter(p => p.isPraying)
    },
    inactivePetitions() {
      return this.sortedPetitions.filter(p => !p.isPraying)
    },
    formValid() {
      return (
        this.newPetition.prayFor.trim() &&
        this.newPetition.content.trim() &&
        this.newPetition.petitionTypeId
      )
    }
  },
  async created() {
    await this.fetchPetitions()
    await this.fetchPetitionTypes()
  },
  methods: {
    ...mapActions(['logout']),
    async fetchPetitions() {
      try {
        const response = await api.get(`/api/petitions?userId=${this.user.id}`)
        this.petitions = response.data?.data || []
      } catch (error) {
        console.error('Error fetching petitions:', error)
        if (error.response?.status === 401) this.logout()
      }
    },
    async fetchPetitionTypes() {
      try {
        const response = await api.get('/api/petitiontypes')
        this.petitionTypes = response.data?.data || []
      } catch (error) {
        console.error('Error fetching petition types:', error)
        if (error.response?.status === 401) this.logout()
      }
    },
    getColorIcon(petition) {
      const type = this.petitionTypes.find(t => t.id === petition.petitionTypeId)
      return type?.color || '#2196F3'
    },
    petitionTypeIcon(petition) {
      const type = this.petitionTypes.find(t => t.id === petition.petitionTypeId)
      return type?.icon || 'mdi-help-circle'
    },
    formattedDate(date) {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    confirmDelete(petition) {
      this.selectedPetition = petition
      this.showDeleteDialog = true
    },
    async deletePetition() {
      try {
        await api.delete(`/api/petitions/${this.selectedPetition.id}`)
        this.petitions = this.petitions.filter(p => p.id !== this.selectedPetition.id)
      } catch (error) {
        console.error('Error deleting petition:', error)
        if (error.response?.status === 401) this.logout()
      }
      this.showDeleteDialog = false
    },
    async createPetition() {
      try {
        const newPetition = {
          ...this.newPetition,
          userId: this.user.id,
          createdDate: new Date().toISOString()
        }
        const response = await api.post('/api/petitions', newPetition)
        this.petitions.unshift(response.data?.data)
        this.showDialog = false
        this.resetForm()
      } catch (error) {
        console.error('Error creating petition:', error)
        if (error.response?.status === 401) this.logout()
      }
    },
    resetForm() {
      this.newPetition = {
        prayFor: '',
        content: '',
        isPraying: false,
        petitionTypeId: null
      }
    },
    async togglePraying(petition) {
      try {
        const newState = !petition.isPraying
        await api.patch(`/api/petitions/${petition.id}`, { isPraying: newState })
        petition.isPraying = newState
      } catch (error) {
        console.error('Error updating prayer status:', error)
        if (error.response?.status === 401) this.logout()
        petition.isPraying = !petition.isPraying
      }
    }
  }
}
</script>

<style scoped>
.main-card {
  border-radius: 24px;
  width: 100%;
  min-height: 80vh;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1) !important;
}

.header-gradient {
  background: linear-gradient(135deg, rgba(30, 144, 255, 1) 0%, rgba(75, 0, 130, 0.9) 100%) !important;
}

.petition-card {
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.active-card {
    border-left: 4px solid #4CAF50;
    background: rgba(76, 175, 80, 0.05);
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

.neon-border {
  border: 2px solid rgba(0, 255, 255, 0.3);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.2),
              inset 0 0 10px rgba(0, 255, 255, 0.1);
  animation: neon-pulse 2s infinite alternate;
}

@keyframes neon-pulse {
  from { box-shadow: 0 0 10px rgba(0, 255, 255, 0.2); }
  to { box-shadow: 0 0 20px rgba(0, 255, 255, 0.4); }
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

.scale-in {
  animation: scaleIn 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

@keyframes scaleIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.slide-in {
  animation: slideIn 0.6s ease-out;
}

@keyframes slideIn {
  from { transform: translateX(-30px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.floating-add-btn {
  position: fixed !important;
  bottom: 40px;
  right: 25px;
  z-index: 100;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
  transition: opacity 0.3s ease, transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
}

.white-text{
  color: white;
}

.date-text {
  position: absolute;
  right: 25px;
}
</style>