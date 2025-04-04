<template>
  <v-container fluid class="main-container config-view"  v-if="dataLoaded">
    <v-row>
      <v-col>
        <v-card class="glass-card pa-6" v-if="this.user.permissions.includes('CSNW')">
          <div class="d-flex justify-space-between align-center mb-6">
            <h2 class="text-h3 gradient-text">Anuncios</h2>
            <v-btn 
              v-if="this.user.permissions.includes('CCNW')"
              icon
              color="primary" 
              class="animated-btn"
              x-large
              @click="openEditor()"
            >
              <v-icon left>mdi-plus</v-icon>
            </v-btn>
          </div>

          <v-row class="news-grid">
            <v-col
              v-for="(ad, index) in ads"
              :key="ad.id"
              cols="12"
              class="news-item"
              :style="{ 'animation-delay': `${index * 0.1}s` }"
            >
              <v-card class="glass-card news-card hover-3d" :class="ad.isGlobal ? 'global-new' : 'lead-new'" elevation="5">
                <v-card-title class="d-flex justify-space-between align-center">
                  <span class="text-h5">{{ ad.title }}</span>
                  <div>
                    <v-btn icon @click="openEditor(ad)" class="mr-2" v-if="this.user.permissions.includes('CUNW') && ad.userCreatedId === this.user.id">
                      <v-icon color="primary">mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon @click="confirmDeleteAd(ad)" v-if="this.user.permissions.includes('CDNW') && ad.userCreatedId === this.user.id">
                      <v-icon color="error">mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </v-card-title>
                <v-card-text>
                  <p class="text-body-1 mb-4">{{ ad.content }}</p>
                  <v-divider class="my-2 glass-divider"></v-divider>
                  <div class="text-caption text-grey-darker">
                    <div><strong>Publicado:</strong> {{ formatDate(ad.startDate) }}</div>
                    <div v-if="!ad.isGlobal"><strong>Creado por:</strong> {{ ad.userCreatedName }}</div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col>
        <v-card class="glass-card">
          <v-card-text style="text-align: -webkit-center;">
            <div class="youtube-container mt-4 mb-4">
              <iframe
                :src="safeYouTubeUrl"
                frameborder="0"
                allowfullscreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>

            <div class="book-wrapper mt-4 mb-4" @click="this.$router.push({ path: '/planner', query: { redirected: true } });" v-if="this.user.permissions.includes('CSPV')">
              <div class="book-title"></div>
              <div class="book-leaf"></div>
              <div class="book-leaf"></div>
              <div class="book-leaf"></div>
              
              <v-card class="book-card hover-3d">
                <div class="book-cover">
                  <v-img 
                    src="assets/backgrounds/Daily-planner-logo.webp" 
                    height="450px" 
                    cover
                    class="book-image"
                  ></v-img>
                </div>
              </v-card>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="800" transition="slide-y-transition">
      <v-card class="glass-dialog">
        <div class="dialog-header">
          <h2 class="dialog-title gradient-text">
            {{ editingAd ? '✏️ Editar Noticia' : '✨ Crear Noticia' }}
          </h2>
          <v-btn
            icon
            @click="dialog = false"
            class="close-btn"
          >
            <v-icon color="grey-darken-1">mdi-close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="dialog-content">
          <v-form ref="form" @submit.prevent="saveAd">
            <div class="form-grid">
              <!-- Columna Izquierda -->
              <div class="form-column">
                <v-text-field
                  v-model="formData.title"
                  label="Título"
                  :rules="[v => !!v || 'Campo requerido']"
                  required
                  outlined
                  color="primary"
                  class="mb-4 input-glass"
                  prepend-inner-icon="mdi-format-title"
                ></v-text-field>

                <v-textarea
                  v-model="formData.content"
                  label="Contenido"
                  rows="5"
                  :rules="[v => !!v || 'Campo requerido']"
                  required
                  outlined
                  color="primary"
                  class="mb-4 input-glass"
                  prepend-inner-icon="mdi-text-box"
                ></v-textarea>
              </div>

              <!-- Columna Derecha -->
              <div class="form-column">
                <div class="date-picker-container">
                  <v-menu
                    v-model="startDateMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        :model-value="formattedStartDate"
                        label="Fecha de inicio"
                        readonly
                        v-bind="props"
                        :rules="[v => !!v || 'Campo requerido']"
                        outlined
                        color="primary"
                        class="mb-4 input-glass"
                        prepend-inner-icon="mdi-calendar-start"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="formData.startDate"
                      @update:model-value="startDateMenu = false"
                      color="primary"
                      class="glass-date-picker"
                    ></v-date-picker>
                  </v-menu>

                  <v-menu
                    v-model="endDateMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        :model-value="formattedEndDate"
                        label="Fecha de fin"
                        readonly
                        v-bind="props"
                        :rules="[v => !!v || 'Campo requerido', validateEndDate]"
                        outlined
                        color="primary"
                        class="input-glass"
                        prepend-inner-icon="mdi-calendar-end"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="formData.endDate"
                      @update:model-value="endDateMenu = false"
                      color="primary"
                      class="glass-date-picker"
                    ></v-date-picker>
                  </v-menu>
                </div>
              </div>
            </div>

            <v-card-actions class="dialog-actions">
              <v-btn
                color="error"
                variant="text"
                @click="dialog = false"
                class="action-btn"
              >
                <v-icon left>mdi-close-circle</v-icon>
                Cancelar
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                @click="saveAd"
                class="action-btn"
                :loading="loading"
              >
                <v-icon left>mdi-content-save-check</v-icon>
                {{ editingAd ? 'Actualizar' : 'Crear' }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <delete-confirmation-dialog
      v-model:show="deleteAdDialog"
      :entity="selectedAd"
      :entity-name="'del anuncio'"
      @confirm="deleteAd(selectedAd.id)"
    ></delete-confirmation-dialog>
  </v-container>

  <v-progress-circular
      v-else
      indeterminate
      color="primary"
      size="64"
      class="loading-spinner"
    />
</template>

<script>
import api from '@/plugins/axios';
import { mapActions, mapState } from 'vuex';
import { useNotification } from "@kyvg/vue3-notification";
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog.vue';

export default {
  name: 'home-view',
  components: { DeleteConfirmationDialog },
  data() {
    return {
      ads: [],
      appConfigs: [],
      dialog: false,
      editingAd: null,
      startDateMenu: false,
      endDateMenu: false,
      loading: false,
      youtubeLink: '',
      dataLoaded: false,
      deleteAdDialog: false,
      selectedAd: null,
      formData: {
        title: '',
        content: '',
        startDate: new Date(),
        endDate: new Date(),
        isGlobal: false
      }
    }
  },
  setup() {
    const { notify } = useNotification();
    return { notify };
  },
  computed: {
    ...mapState(['user']),
    safeYouTubeUrl() {
      if (this.isPlaylist) {
        return `https://www.youtube-nocookie.com/embed/videoseries?list=${this.playlistId}`;
      }
      return `https://www.youtube-nocookie.com/embed/${this.videoId}`;
    },
    isPlaylist() {
      return this.youtubeLink.includes('list=');
    },
    videoId() {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = this.youtubeLink.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    },
    playlistId() {
      const regExp = /[?&]list=([^#&?]+)/;
      const match = this.youtubeLink.match(regExp);
      return match ? match[1] : null;
    },
    formattedStartDate() {
      return this.formatDateForDisplay(this.formData.startDate);
    },
    formattedEndDate() {
      return this.formatDateForDisplay(this.formData.endDate);
    }
  },
  methods: {
    ...mapActions(['logout']),
    confirmDeleteAd(Ad){
      this.selectedAd = Ad;
      this.deleteAdDialog = true;
    },

    validateEndDate(){
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const minDate = new Date(today);

      if (!this.formData.endDate) return 'Campo requerido';

      const selectedDate = new Date(this.formData.endDate);
      selectedDate.setHours(0, 0, 0, 0);

      return selectedDate > minDate || 'Debe ser al menos 1 día después de hoy';
    },

    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    },

    formatDateForDisplay(date) {
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    },

    openEditor(ad = null) {
      this.editingAd = ad;
      if (ad) {
        this.formData = { 
          ...ad,
          startDate: new Date(ad.startDate),
          endDate: new Date(ad.endDate)
        };
      } else {
        this.resetForm();
      }
      this.dialog = true;
    },

    resetForm() {
      this.formData = {
        title: '',
        content: '',
        startDate: new Date(),
        endDate: new Date(),
        isGlobal: false
      };
      if (this.$refs.form) this.$refs.form.resetValidation();
    },

    async fetchAds() {
      try {
        const response = await api.get('/api/Ads');
        if(!response.data.success) {
          this.notify({
            title: 'Error',
            text: 'Error al cargar los anuncios.',
            type: 'error',
            duration: 2000
          });
          console.error(response.data?.message);
        }
        else{
          this.ads = response.data?.data || [];
        }
      } 
      catch (error) {
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
    },

    async saveAd() {
      this.loading = true;
      const { valid } = await this.$refs.form.validate();
      if (!valid){ 
        this.loading = false;
        return; 
      }

      try {
        const payload = {
          ...this.formData,
          startDate: this.formData.startDate.toISOString(),
          endDate: this.formData.endDate.toISOString()
        };

        let response = '';
        if (this.editingAd) {
          response = await api.put(`/api/Ads/${this.editingAd.id}`, payload);
          if(!response.data.success) {
            this.notify({
              title: 'Error',
              text: 'Error al editar el anuncio.',
              type: 'error',
              duration: 2000
            });
            console.error(response.data?.message);
          }
          else{
            this.notify({
              title: 'Éxito',
              text: 'Anuncio actualizado correctamente.',
              type: 'success',
              duration: 2000
            });
          }

        } else {
          response = await api.post('/api/Ads', payload);
          if(!response.data.success) {
            this.notify({
              title: 'Error',
              text: 'Error al crear el anuncio.',
              type: 'error',
              duration: 2000
            });
            console.error(response.data?.message);
          }
          else{
            this.notify({
              title: 'Éxito',
              text: 'Anuncio creado correctamente.',
              type: 'success',
              duration: 2000
            });
          }
        }
        
        this.fetchAds();
        this.dialog = false;
      } catch (error) {
        console.error('Error saving ad:', error);
        alert('Error al guardar la noticia');
      } finally {
        this.loading = false;
      }
    },

    async deleteAd(id) {
      try {
        const response = await api.delete(`/api/Ads/${id}`);
        if(!response.data.success) {
          this.notify({
            title: 'Error',
            text: 'Error al eliminar el anuncio.',
            type: 'error',
            duration: 2000
          });
          console.error(response.data?.message);
        }
        else{
          this.notify({
            title: 'Éxito',
            text: 'Anuncio eliminado correctamente.',
            type: 'success',
            duration: 2000
          });
        }
        this.fetchAds();
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
    },
    async fetchConfigs() {
      try {
        const response = await api.get('/api/AppAdministration/appConfigs');
        if(!response.data.success) {
          this.notify({
            title: 'Error',
            text: 'Error al cargar las configuraciones del sistema.',
            type: 'error',
            duration: 2000
          });
          console.error(response.data?.message);
        }
        else{
          this.appConfigs = response.data?.data || [];
          const result = this.appConfigs.find(item => item.name === "HomeVideoUrl");
          this.youtubeLink = result?.value
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
    },
  },
  async mounted() {
    if(!this.user.permissions.includes('CSHV')){
      this.logout();
    }
    await this.fetchAds();
    await this.fetchConfigs();
    this.dataLoaded = true;
  }
};
</script>

<style scoped>
.main-container {
  background: linear-gradient(145deg, #f0f0f3, #ffffff);
  min-height: 100vh;
  padding: 2rem;
}

/* Glassmorphism */
.glass-card {
  background: rgba(255, 255, 255, 0.75) !important;
  border: 1px solid rgb(219 219 219) !important;
  border-radius: 24px !important;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.05),
    0 1px 3px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Neumorphism Moderno */
.neu-card {
  background: #f0f0f3 !important;
  border-radius: 32px !important;
  box-shadow: 
    20px 20px 60px #d9d9d9,
    -20px -20px 60px #ffffff !important;
}

.hover-3d:hover {
  transform: 
    perspective(1000px)
    translate3d(0, -5px, 10px);
}

.gradient-text {
  background: linear-gradient(45deg, #2196F3, #1976D2);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.animated-btn {
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(33, 150, 243, 0.1);
  &:hover {
    transform: translateY(-2px) rotate(2deg);
    box-shadow: 
      0 6px 12px rgba(33, 150, 243, 0.2),
      0 2px 4px rgba(33, 150, 243, 0.15) !important;
  }
}

.news-item {
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Contenedor principal */
.book-wrapper {
  position: relative;
  perspective: 2000px;
  width: min-content;
}

/* Estructura base del libro */
.book-card {
  position: relative;
  width: 350px;
  height: 450px;
  background: #fff;
  border-radius: 2px 12px 12px 2px;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transform-origin: left center;
  z-index: 2;
}

/* Lomo visible y destacado */
.book-card:before {
  content: '';
  position: absolute;
  left: -25px;
  top: 0;
  height: 100%;
  width: 25px;
  background: #616161;
  border-radius: 2px 0 0 2px;
  box-shadow: 
    inset -4px 0 8px rgba(0, 0, 0, 0.2),
    6px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 4;
  transition: transform 0.4s ease;
}

/* Año en esquina superior derecha */
.book-year {
  position: absolute;
  top: 15px !important;
  right: 15px !important;
  z-index: 5;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
  border: 2px solid white !important;
  background: linear-gradient(45deg, #2196F3, #1976D2);
}

/* Animación principal del libro */
.book-wrapper:hover .book-card {
  transform: rotateY(-15deg) translateX(10px);
  box-shadow: 15px 15px 30px rgba(0, 0, 0, 0.25);
}

.book-wrapper:hover .book-card:before {
  transform: translateZ(10px);
}

/* Hojas compactas */
.book-leaf {
  position: absolute;
  width: 348px;
  height: 448px;
  background: #f8f8f8;
  border-radius: 2px 12px 12px 2px;
  transition: all 0.2s ease;
  opacity: 0;
  left: 18px;
  top: 5px;
  border-right: 2px solid #d0d0d0;
  transform-origin: left center;
  z-index: 2;
}

/* Posición inicial hojas */
.book-leaf:nth-child(1) {
  transform: rotateY(-5deg) translateX(-10px);
  transition-delay: 0.1s;
}

.book-leaf:nth-child(2) {
  transform: rotateY(-5deg) translateX(-10px);
  transition-delay: 0.1s;
}

.book-leaf:nth-child(3) {
  transform: rotateY(-5deg) translateX(-10px);
  transition-delay: 0.1s;
}

/* Animación hover hojas */
.book-wrapper:hover .book-leaf {
  opacity: 0.8;
}

.book-wrapper:hover .book-leaf:nth-child(1) {
  transform: rotateY(-10deg) translateX(5px);
}

.book-wrapper:hover .book-leaf:nth-child(2) {
  transform: rotateY(-10deg) translateX(20px);
}

.book-wrapper:hover .book-leaf:nth-child(3) {
  transform: rotateY(-10deg) translateX(10px);
}

/* Título superior */
.book-title {
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 20px;
  border-radius: 4px;
  font-weight: 700;
  z-index: 5;
  transition: all 0.3s ease;
}


.book-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 2px 12px 12px 2px;
  position: relative;
  z-index: 2 !important;
}

/* Responsive Design */
@media (max-width: 600px) {
  .book-wrapper {
    margin: 80px 15px;
    min-height: 400px;
  }
  
  .book-card {
    width: 280px;
    height: 380px;
  }
  
  .book-card:before {
    left: -14px;
    width: 14px;
  }
  
  .book-leaf {
    width: 278px;
    height: 378px;
  }
  
  .book-year {
    top: 10px !important;
    right: 10px !important;
    width: 40px !important;
    height: 40px !important;
  }
  
  .book-year .year-text {
    font-size: 0.9rem;
  }
  
  .book-title {
    top: -60px;
    font-size: 0.9rem;
    padding: 6px 15px;
  }
  
  .book-wrapper:hover .book-leaf:nth-child(1) {
    transform: rotateY(-5deg) translateX(3px);
  }
  
  .book-wrapper:hover .book-leaf:nth-child(2) {
    transform: rotateY(-10deg) translateX(6px);
  }
  
  .book-wrapper:hover .book-leaf:nth-child(3) {
    transform: rotateY(-15deg) translateX(9px);
  }
}

.youtube-container {
  position: relative;
  padding-bottom: 400px;
  height: 0;
  overflow: hidden;
  border-radius: 24px;
  background: #000;
  width: 85%;
}

.youtube-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Responsive Design */
@media (max-width: 960px) {
  .main-container {
    padding: 1rem;
  }
  
  .book-wrapper {
    margin: 1rem;
  }
  
  .neu-card {
    border-radius: 24px !important;
  }
}

@media (max-width: 600px) {
  .book-card {
    width: 280px;
    height: 380px;
  }
  
  .gradient-text {
    font-size: 1.8rem;
  }
  
  .animated-btn {
    font-size: 0.9rem;
    padding: 12px 24px;
  }
}

/* Microinteracciones */
.v-icon {
  transition: all 0.2s ease;
  &:hover {
    transform: scale(1.15) rotate(8deg);
  }
}

.glass-divider {
  border-color: rgba(255, 255, 255, 0.3) !important;
}

.neumorphic-text {
  text-shadow: 
    2px 2px 4px rgba(0, 0, 0, 0.1),
    -2px -2px 4px rgba(255, 255, 255, 0.8);
}

.glass-dialog {
  background: rgba(255, 255, 255, 0.9) !important;
  border-radius: 24px !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.05) !important;
  overflow: hidden;
}

.dialog-header {
  padding: 1.5rem;
  background: linear-gradient(45deg, rgba(33, 150, 243, 0.1), rgba(25, 118, 210, 0.05));
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
}

.dialog-title {
  font-size: 1.8rem;
  font-weight: 600;
  letter-spacing: -0.5px;
  margin: 0;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  transition: all 0.3s ease;
  &:hover {
    transform: rotate(90deg) scale(1.1);
  }
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 1rem;
}

.input-glass {
  background: rgba(255, 255, 255, 0.7) !important;
  border-radius: 12px !important;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.9) !important;
    transform: translateY(-2px);
  }
}

.glass-date-picker {
  background: rgba(255, 255, 255, 0.8) !important;
  border-radius: 16px !important;
}

.checkbox-custom {
  margin-top: 1rem;
  .checkbox-label {
    font-weight: 500;
    color: #1976D2;
  }
}

.dialog-actions {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  margin-top: 1rem;
}

.action-btn {
  border-radius: 8px !important;
  padding: 12px 24px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  letter-spacing: 0.5px;
  
  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2) !important;
  }
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .dialog-title {
    font-size: 1.4rem;
  }
  
  .action-btn {
    width: 100%;
    margin: 8px 0;
  }
}

.global-new {
  border-left: 4px solid #00d26a !important;
}

.lead-new {
  border-left: 4px solid #0062d2 !important;
}
</style>