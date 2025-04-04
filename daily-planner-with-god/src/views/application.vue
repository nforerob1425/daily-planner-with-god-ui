<template>
  <v-container fluid class="app-container config-view" v-if="dataLoaded">
    <v-card class="mb-8 animate__animated animate__fadeIn">
      <v-card-title class="card-header">
        <v-icon large color="white" class="mr-2">mdi-notebook-multiple</v-icon>
        Gestión de Agendas
        <v-btn 
          v-if="this.user.permissions.includes('CCAG')"
          color="secondary" 
          @click="openAgendaDialog(null)"
          class="btn-add ml-5"
          prepend-icon="mdi-plus"
        >
          Nueva Agenda
        </v-btn>
      </v-card-title>
      
      <v-list class="agenda-list" lines="two" v-if="this.user.permissions.includes('CSAG')">
        <transition-group name="list">
          <v-list-item 
            v-for="agenda in agendas" 
            :key="agenda.id"
            class="list-item-hover"
            @click="openAgendaDialog(agenda)"
          >
            <template #prepend>
              <v-icon class="icon-agenda">mdi-notebook</v-icon>
            </template>
            <v-list-item-title class="d-flex align-center">
              <span class="agenda-title">{{ agenda.title }}</span>
              <span class="agenda-year">({{ agenda.year }})</span>
              <v-icon 
                :color="agenda.isMale ? 'indigo' : 'pink'" 
                large 
                class="mr-3 pulse"
              >
                {{ agenda.isMale ? 'mdi-gender-male' : 'mdi-gender-female' }}
              </v-icon>
            </v-list-item-title>
            <v-list-item-subtitle class="agenda-content">{{ agenda.content }}</v-list-item-subtitle>
            
            <template #append>
              <v-btn 
                v-if="this.user.permissions.includes('CDAG')"
                icon 
                @click.stop="confirmDeleteAgenda(agenda)"
              >
                <v-icon color="error">mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </transition-group>
      </v-list>
    </v-card>

    <!-- Sección de Colores -->
    <v-row class="color-section mb-8" v-if="this.user.permissions.includes('CSCO','CSTC')">
      <v-col 
        cols="12" 
        md="6" 
        lg="4" 
        v-for="type in types" 
        :key="type.id"
        class="animate__animated animate__fadeInUp"
      >
        <v-card class="color-card" elevation="4">
          <v-card-title class="color-header">
            <v-icon class="mr-2">mdi-palette</v-icon>
            {{ type.name }}
            <v-btn 
              icon 
              v-if="this.user.permissions.includes('CCCO')"
              @click="openColorDialog(type)" 
              size="small"
              class="btn-add-color ml-2"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="d-flex flex-wrap gap-2 pa-4">
            <div 
              v-for="color in getColorsByType(type.id)" 
              :key="color.id" 
              class="color-item position-relative"
              @click="openColorDialog(type, color)"
            >
              <v-sheet 
                :color="color.color" 
                width="60" 
                height="60" 
                rounded="lg"
                class="elevation-2 cursor-pointer color-square"
              ></v-sheet>
              <v-btn 
                v-if="this.user.permissions.includes('CDCO')"
                icon 
                size="x-small" 
                class="delete-btn"
                @click.stop="confirmDeleteColor(color)"
              >
                <v-icon color="error">mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" 
        md="6" 
        lg="4"
        class="animate__animated animate__fadeInUp">

        <!-- Sección de Configuraciones -->
        <v-card class="color-card" elevation="4" v-if="this.user.permissions.includes('CSAP')">
          <v-card-title class="card-header">
            <v-icon large color="white" class="mr-2">mdi-cog-outline</v-icon>
            Configuraciones Generales
          </v-card-title>
          
          <v-list class="config-list" lines="two">
            <transition-group name="list">
              <v-list-item 
                v-for="config in appConfigs" 
                :key="config.id" 
                class="list-item-hover ml-5 mr-5"
              >
                <template #prepend>
                  <v-icon class="icon-config">mdi-tune</v-icon>
                </template>
                
                <v-list-item-title class="d-flex align-center">
                  <span class="config-name">{{ config.name }}</span>
                  <v-spacer></v-spacer>
                  <span class="config-value">{{ config.value }}</span>
                </v-list-item-title>

                <template #append>
                  <v-btn 
                    v-if="this.user.permissions.includes('CUAP')"
                    icon 
                    @click.stop="openConfigDialog(config)"
                    class="btn-edit"
                  >
                    <v-icon color="primary">mdi-pencil</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </transition-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="agendaDialog" max-width="600">
      <v-card class="dialog-card">
        <v-card-title class="dialog-header">
          {{ isEditAgenda ? '✏️ Editar Agenda' : '🆕 Nueva Agenda' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="agendaForm">
            <v-text-field 
              v-model="selectedAgenda.title" 
              label="Título" 
              required 
              :rules="requiredRule"
              color="primary"
              variant="outlined"
            ></v-text-field>

            <v-text-field 
              v-model="selectedAgenda.year" 
              label="Año" 
              type="number" 
              :rules="numberRule"
              color="primary"
              variant="outlined"
            ></v-text-field>

            <v-text-field 
              v-model="selectedAgenda.imageBackgroundSrc" 
              label="URL de la imagen de fondo"
              placeholder="Ej: /assets/backgrounds/R07-2025.png"
              color="primary"
              variant="outlined"
            ></v-text-field>

            <v-textarea 
              v-model="selectedAgenda.content" 
              label="Contenido"
              rows="3"
              color="primary"
              variant="outlined"
            ></v-textarea>

            <div class="d-flex align-center mb-4">
              <v-checkbox
                v-model="selectedAgenda.isMale"
                :label="selectedAgenda.isMale ? 'Hombre' : 'Mujer'"
                hide-details
                color="primary"
              ></v-checkbox>
              <v-icon 
                :color="selectedAgenda.isMale ? 'indigo' : 'pink'" 
                large 
                class="mr-3 pulse"
                @click="selectedAgenda.isMale = !selectedAgenda.isMale"
              >
                {{ selectedAgenda.isMale ? 'mdi-gender-male' : 'mdi-gender-female' }}
              </v-icon>
            </div>

            <v-checkbox 
              v-model="selectedAgenda.isReported" 
              label="Reportado"
              color="primary"
            ></v-checkbox>
          </v-form>
        </v-card-text>
        <v-card-actions class="dialog-actions">
          <v-btn 
            @click="agendaDialog = false" 
            variant="outlined"
            color="grey-darken-2"
          >
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn 
            v-if="isEditAgenda ? this.user.permissions.includes('CUAG') : this.user.permissions.includes('CCAG')"
            color="primary" 
            @click="saveAgenda"
            variant="flat"
          >
            <v-icon left>mdi-content-save</v-icon>
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="colorDialog" max-width="400">
      <v-card class="dialog-card">
        <v-card-title class="dialog-header">
          {{ isEditColor ? '✏️ Editar Color' : '🎨 Nuevo Color' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="colorForm">
            <v-select 
              v-model="selectedColor.typeId" 
              :items="types" 
              item-title="name" 
              item-value="id" 
              label="Tipo" 
              :rules="requiredRule" 
              :disabled="isEditColor"
              color="primary"
              variant="outlined"
            ></v-select>
            
            <v-color-picker 
              v-model="selectedColor.color" 
              mode="hexa" 
              show-swatches
              class="mt-4"
              dot-size="28"
            ></v-color-picker>
          </v-form>
        </v-card-text>
        <v-card-actions class="dialog-actions">
          <v-btn 
            @click="colorDialog = false" 
            variant="outlined"
            color="grey-darken-2"
          >
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn 
            v-if="isEditColor ? this.user.permissions.includes('CUCO') : this.user.permissions.includes('CCCO')"
            color="primary" 
            @click="saveColor"
            variant="flat"
          >
            <v-icon left>mdi-palette</v-icon>
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="configDialog" max-width="600">
      <v-card class="dialog-card">
        <v-card-title class="dialog-header">
          ✏️ Editar Configuración
        </v-card-title>
        <v-card-text>
          <v-form ref="configForm">
            <v-text-field
              v-model="selectedConfig.name"
              label="Nombre"
              readonly
              disabled
              variant="outlined"
              color="primary"
            ></v-text-field>

            <v-textarea
              v-model="selectedConfig.value"
              label="Valor"
              :rules="requiredRule"
              rows="3"
              variant="outlined"
              color="primary"
              auto-grow
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions class="dialog-actions">
          <v-btn 
            @click="configDialog = false" 
            variant="outlined"
            color="grey-darken-2"
          >
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn 
            v-if="this.user.permissions.includes('CUAP')"
            color="primary" 
            @click="saveConfig"
            variant="flat"
          >
            <v-icon left>mdi-content-save</v-icon>
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <delete-confirmation-dialog
      v-model:show="deleteAgendaDialog"
      :entity="selectedAgenda"
      :entity-name="'de la agenda'"
      @confirm="deleteAgenda(selectedAgenda.id)"
    ></delete-confirmation-dialog>

    <delete-confirmation-dialog
      v-model:show="deleteColorDialog"
      :entity="selectedColor"
      :entity-name="'del color'"
      @confirm="deleteColor(selectedColor.id)"
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
  name: 'application-view',
  components: { DeleteConfirmationDialog },
  data() {
    return {
      agendas: [],
      colors: [],
      types: [],
      appConfigs: [],
      agendaDialog: false,
      colorDialog: false,
      configDialog: false,
      isEditAgenda: false,
      isEditColor: false,
      dataLoaded: false,
      deleteAgendaDialog: false,
      deleteColorDialog: false,
      selectedAgenda: this.emptyAgenda(),
      selectedColor: this.emptyColor(),
      selectedConfig: this.emptyConfig(),
      requiredRule: [v => !!v || 'Campo requerido'],
      numberRule: [
        v => !!v || 'Campo requerido',
        v => Number.isInteger(Number(v)) || 'Debe ser un número válido'
      ]
    }
  },
  setup() {
    const { notify } = useNotification();
    return { notify };
  },
  computed: {
    ...mapState(['user']),
    getColorsByType() {
      return (typeId) => this.colors.filter(c => c.typeId === typeId);
    }
  },
  methods: {
    ...mapActions(['logout']),
    confirmDeleteAgenda(agenda){
      this.selectedAgenda = agenda;
      this.deleteAgendaDialog = true;
    },
    confirmDeleteColor(color){
      this.selectedColor = color;
      this.deleteColorDialog = true;
    },
    emptyAgenda() {
      return {
        id: null,
        year: new Date().getFullYear(),
        title: '',
        content: '',
        imageBackgroundSrc: '',
        isReported: false,
        isMale: false,
        originalAgendaId: null
      }
    },
    emptyColor() {
      return {
        id: null,
        typeId: null,
        color: '#FFFFFF'
      }
    },
    emptyConfig() {
      return {
        id: null,
        name: '',
        value: ''
      }
    },
    openAgendaDialog(agenda) {
      if(this.user.permissions.includes('CUAG')){
        this.isEditAgenda = !!agenda;
        this.selectedAgenda = agenda ? {...agenda} : this.emptyAgenda();
        this.agendaDialog = true;
      }
      else{
        this.agendaDialog = false;
      }
    },
    openColorDialog(type, color) {
      if(this.user.permissions.includes('CUCO')){
        this.isEditColor = !!color;
        this.selectedColor = color ? {...color} : {...this.emptyColor(), typeId: type.id};
        this.colorDialog = true;
      }
      else{
        this.colorDialog = false;
      }
    },
    openConfigDialog(config) {
      this.selectedConfig = { ...config };
      this.configDialog = true;
    },

    async saveConfig() {
      if (!this.$refs.configForm.validate()) return;
      
      try {
        const response = await api.post('/api/AppAdministration/appConfigs', this.selectedConfig);
        if(!response.data.success) {
            this.notify({
              title: 'Error',
              text: 'Error al actualizar las configuraciones del sistema.',
              type: 'error',
              duration: 2000
            });
            console.error(response.data?.message);
        }
        else{
          this.notify({
              title: 'Éxito',
              text: 'Configuración actualizada correctamente.',
              type: 'success',
              duration: 2000
          });
          await this.fetchConfigs();
          this.configDialog = false;
        }
      } catch (error) {
        console.error('Error saving config:', error);
        this.handleError(error);
      }
    },
    async saveAgenda() {
      if (!this.$refs.agendaForm.validate()) return;
      let response = '';

      try {
        if (this.isEditAgenda) {
          response = await api.post('/api/AppAdministration/agendas', this.selectedAgenda);
          if(!response.data.success) {
            this.notify({
              title: 'Error',
              text: 'Error al editar la agenda.',
              type: 'error',
              duration: 2000
            });
            console.error(response.data?.message);
          }
          else{
            this.notify({
              title: 'Éxito',
              text: 'Agenda editada correctamente.',
              type: 'success',
              duration: 2000
            });
          }
        } else {
          response = await api.put('/api/AppAdministration/agendas', this.selectedAgenda);
          if(!response.data.success) {
            this.notify({
              title: 'Error',
              text: 'Error al crear la agenda.',
              type: 'error',
              duration: 2000
            });
            console.error(response.data?.message);
          }
          else{
            this.notify({
              title: 'Éxito',
              text: 'Agenda creada correctamente.',
              type: 'success',
              duration: 2000
            });
          }
        }
        this.fetchAgendas();
        this.agendaDialog = false;
      } catch (error) {
        console.error('Error saving agenda:', error);
        this.handleError(error);
      }
    },
    async saveColor() {
      if (!this.$refs.colorForm.validate()) return;
      let response = '';

      try {
        if (this.isEditColor) {
          response = await api.post('/api/AppAdministration/colors', this.selectedColor);
          if(!response.data.success) {
            this.notify({
              title: 'Error',
              text: 'Error al editar el color.',
              type: 'error',
              duration: 2000
            });
            console.error(response.data?.message);
          }
          else{
            this.notify({
              title: 'Éxito',
              text: 'Color editado correctamente.',
              type: 'success',
              duration: 2000
            });
          }
        } else {
          response = await api.put('/api/AppAdministration/colors', this.selectedColor);
          if(!response.data.success) {
            this.notify({
              title: 'Error',
              text: 'Error al crear el color.',
              type: 'error',
              duration: 2000
            });
            console.error(response.data?.message);
          }
          else{
            this.notify({
              title: 'Éxito',
              text: 'Color creado correctamente.',
              type: 'success',
              duration: 2000
            });
          }
        }
        this.fetchColors();
        this.colorDialog = false;
      } catch (error) {
        console.error('Error saving color:', error);
        this.handleError(error);
      }
    },
    async deleteAgenda(id) {
      try {
        const response = await api.delete(`/api/AppAdministration/agendas?agendaId=${id}`);
        if(!response.data.success) {
          this.notify({
            title: 'Error',
            text: 'Error al eliminar la agenda. posiblemente tenga datos asociados.',
            type: 'error',
            duration: 5000
          });
          console.error(response.data?.message);
        }
        else{
          this.notify({
            title: 'Éxito',
            text: 'Agenda eliminada correctamente.',
            type: 'success',
            duration: 2000
          });
        }
        this.fetchAgendas();
      } catch (error) {
        console.error('Error deleting agenda:', error);
        this.handleError(error);
      }
    },
    async deleteColor(id) {
      try {
        const response = await api.delete(`/api/AppAdministration/colors?colorPaletteId=${id}`);
        if(!response.data.success) {
          this.notify({
            title: 'Error',
            text: 'Error al eliminar el color. posiblemente tenga datos asociados.',
            type: 'error',
            duration: 5000
          });
          console.error(response.data?.message);
        }
        else{
          this.notify({
            title: 'Éxito',
            text: 'Color eliminado correctamente.',
            type: 'success',
            duration: 2000
          });
        }
        this.fetchColors();
      } catch (error) {
        console.error('Error deleting color:', error);
        this.handleError(error);
      }
    },
    handleError(error) {
      if (error.status === 401) {
        this.logout();
      }
      this.notify({
        title: 'Error',
        text: error.message ||'Error al procesar la peticion.',
        type: 'error',
        duration: 2000
      });
    },
    async fetchAgendas() {
      try {
        const response = await api.get('/api/AppAdministration/agendas');
        if(!response.data.success) {
          this.notify({
            title: 'Error',
            text: 'Error al obtener las agendas.',
            type: 'error',
            duration: 2000
          });
          console.error(response.data?.message);
        }
        else{
          this.agendas = response.data?.data || [];
        }
      } catch (error) {
        console.error('Error fetching agendas:', error);
        this.handleError(error);
      }
    },
    async fetchColors() {
      try {
        const response = await api.get('/api/AppAdministration/colors');
        if(!response.data.success) {
          this.notify({
            title: 'Error',
            text: 'Error al obtener los colores.',
            type: 'error',
            duration: 2000
          });
          console.error(response.data?.message);
        }
        else{
          this.colors = response.data?.data || [];
        }
      } catch (error) {
        console.error('Error fetching colors:', error);
        this.handleError(error);
      }
    },
    async fetchColorTypes() {
      try {
        const response = await api.get('/api/AppAdministration/types');
        if(!response.data.success) {
          this.notify({
            title: 'Error',
            text: 'Error al obtener los tipo de colores.',
            type: 'error',
            duration: 2000
          });
          console.error(response.data?.message);
        }
        else{
          this.types = response.data?.data || [];
        }
      } catch (error) {
        console.error('Error fetching types:', error);
        this.handleError(error);
      }
    },
    async fetchConfigs() {
      try {
        const response = await api.get('/api/AppAdministration/appConfigs');
        if(!response.data.success) {
          this.notify({
            title: 'Error',
            text: 'Error al obtener las configuraciones del sistema.',
            type: 'error',
            duration: 2000
          });
          console.error(response.data?.message);
        }
        else{
          this.appConfigs = response.data?.data || [];
        }
      } catch (error) {
        console.error('Error fetching app configs:', error);
        this.handleError(error);
      }
    },
  },
  async mounted() {
    if(!this.user.permissions.includes('CSMAV')){
      this.logout();
    }
    await this.fetchAgendas();
    await this.fetchColors();
    await this.fetchColorTypes();
    await this.fetchConfigs();
    this.dataLoaded = true;
  }
};
</script>

<style scoped>
.app-container {
  background: linear-gradient(45deg, #f8f9fa, #e9ecef);
  min-height: 100vh;
  padding: 2rem;
}

.text-gradient {
  background: linear-gradient(45deg, #2196F3, #3F51B5);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 800;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-header {
  background: linear-gradient(45deg, #2196F3, #3F51B5);
  color: white !important;
  padding: 1rem !important;
  border-radius: 12px 12px 0 0 !important;
}

.agenda-list {
  padding: 1rem;
}

.list-item-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 0.5rem 0;
  border-radius: 8px;
}

.list-item-hover:hover {
  transform: translateX(10px);
  background: rgba(33, 150, 243, 0.05);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.icon-agenda {
  color: #2196F3 !important;
  margin-right: 1rem;
}

.agenda-title {
  font-weight: 600;
  color: #2c3e50;
}

.agenda-year {
  color: #7f8c8d;
  margin-left: 0.5rem;
}

.agenda-content {
  color: #7f8c8d !important;
}

.btn-add {
  background: linear-gradient(45deg, #4CAF50, #66BB6A) !important;
  color: white !important;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
}

.color-card {
  border: 2px solid transparent;
  transition: all 0.3s ease;
  border-radius: 12px !important;
  overflow: hidden;
}

.color-card:hover {
  border-color: #2196F3;
  box-shadow: 0 8px 25px rgba(33, 150, 243, 0.15);
}

.color-header {
  background: rgba(33, 150, 243, 0.1) !important;
  color: #2c3e50 !important;
  padding: 1rem !important;
}

.color-square {
  transition: all 0.3s ease;
}

.color-square:hover {
  transform: scale(1.08);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.delete-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: white !important;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  transition: all 0.2s ease;
}

.delete-btn:hover {
  transform: scale(1.15);
}

.dialog-card {
  border-radius: 16px !important;
  overflow: hidden;
  background: #ffffff;
}

.dialog-header {
  background: linear-gradient(45deg, #2196F3, #3F51B5);
  color: white !important;
  font-size: 1.5rem;
  padding: 1.5rem;
  font-weight: 600;
}

.dialog-actions {
  padding: 1rem;
}

.pulse {
  animation: pulse-animation 2s infinite;
  transition: all 0.3s;
}

.pulse:hover {
  filter: drop-shadow(0 0 8px currentColor);
}

@keyframes pulse-animation {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

@media (max-width: 768px) {
  .text-gradient {
    font-size: 2rem;
  }
  
  .btn-add {
    width: 100%;
    margin-top: 1rem;
  }
  
  .color-card {
    margin-bottom: 1.5rem;
  }
}

.config-name {
  font-weight: 600;
  color: #2c3e50;
  min-width: 200px;
}

.config-value {
  color: #7f8c8d;
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icon-config {
  color: #2196F3 !important;
  margin-right: 1rem;
}

.btn-edit {
  transition: all 0.2s ease;
}

.btn-edit:hover {
  transform: scale(1.15);
}

@media (max-width: 768px) {
  .config-value {
    max-width: 200px;
  }
}
</style>