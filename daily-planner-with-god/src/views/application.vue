<template>
  <v-container>
    <h1>Administra la aplicación</h1>
    
    <!-- Sección de Agendas -->
    <v-card class="mb-8">
      <v-card-title>
        Gestión de Agendas
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openAgendaDialog(null)">
          <v-icon left>mdi-plus</v-icon>
          Nueva Agenda
        </v-btn>
      </v-card-title>
      <v-list>
        <v-list-item v-for="agenda in agendas" :key="agenda.id" @click="openAgendaDialog(agenda)">
          <template #prepend>
            <v-icon>mdi-notebook</v-icon>
          </template>
          <v-list-item-title>{{ agenda.title }} ({{ agenda.year }}) 
            <v-icon 
                :color="agenda.isMale ? 'indigo' : 'pink'" 
                large 
                class="mr-3 pulse"
              >
                {{ agenda.isMale ? 'mdi-gender-male' : 'mdi-gender-female' }}
              </v-icon>
          </v-list-item-title>
          <v-list-item-subtitle>{{ agenda.content }}</v-list-item-subtitle>
          <template #append>
            <v-btn icon @click.stop="deleteAgenda(agenda.id)">
              <v-icon color="error">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-card>

    <!-- Sección de Colores -->
    <v-row>
      <v-col cols="12" md="6" lg="4" v-for="type in types" :key="type.id">
        <v-card class="mb-4">
          <v-card-title class="d-flex align-center">
            {{ type.name }}
            <v-spacer></v-spacer>
            <v-btn icon @click="openColorDialog(type)" size="small">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="d-flex flex-wrap gap-2">
            <div v-for="color in getColorsByType(type.id)" :key="color.id" 
                 class="color-item position-relative"
                 @click="openColorDialog(type, color)">
              <v-sheet 
                :color="color.color" 
                width="60" 
                height="60" 
                rounded="lg"
                class="elevation-2 cursor-pointer"
              ></v-sheet>
              <v-btn 
                icon 
                size="x-small" 
                class="delete-btn"
                @click.stop="deleteColor(color.id)"
              >
                <v-icon color="error">mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo para Agenda -->
    <v-dialog v-model="agendaDialog" max-width="600">
      <v-card>
        <v-card-title>{{ isEditAgenda ? 'Editar Agenda' : 'Nueva Agenda' }}</v-card-title>
        <v-card-text>
          <v-form ref="agendaForm">
            <v-text-field 
              v-model="selectedAgenda.title" 
              label="Título" 
              required 
              :rules="requiredRule"
            ></v-text-field>

            <v-text-field 
              v-model="selectedAgenda.year" 
              label="Año" 
              type="number" 
              :rules="numberRule"
            ></v-text-field>

            <v-text-field 
              v-model="selectedAgenda.imageBackgroundSrc" 
              label="URL de la imagen de fondo"
              placeholder="Ej: /assets/backgrounds/R07-2025.png"
            ></v-text-field>

            <v-textarea 
              v-model="selectedAgenda.content" 
              label="Contenido"
              rows="3"
            ></v-textarea>

            <div class="d-flex align-center mb-4">
              <v-checkbox
                v-model="selectedAgenda.isMale"
                :label="selectedAgenda.isMale ? 'Hombre' : 'Mujer'"
                hide-details
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
            ></v-checkbox>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="agendaDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveAgenda">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo para Color -->
    <v-dialog v-model="colorDialog" max-width="400">
      <v-card>
        <v-card-title>{{ isEditColor ? 'Editar Color' : 'Nuevo Color' }}</v-card-title>
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
            ></v-select>
            
            <v-color-picker 
              v-model="selectedColor.color" 
              mode="hexa" 
              show-swatches
              class="mt-4"
            ></v-color-picker>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="colorDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveColor">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import api from '@/plugins/axios';
import { mapActions } from 'vuex';

export default {
  name: 'application-view',
  data() {
    return {
      agendas: [],
      colors: [],
      types: [],
      agendaDialog: false,
      colorDialog: false,
      isEditAgenda: false,
      isEditColor: false,
      selectedAgenda: this.emptyAgenda(),
      selectedColor: this.emptyColor(),
      requiredRule: [v => !!v || 'Campo requerido'],
      numberRule: [
        v => !!v || 'Campo requerido',
        v => Number.isInteger(Number(v)) || 'Debe ser un número válido'
      ]
    }
  },
  computed: {
    getColorsByType() {
      return (typeId) => this.colors.filter(c => c.typeId === typeId);
    }
  },
  methods: {
    ...mapActions(['logout']),
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
    openAgendaDialog(agenda) {
      this.isEditAgenda = !!agenda;
      this.selectedAgenda = agenda ? {...agenda} : this.emptyAgenda();
      this.agendaDialog = true;
    },
    openColorDialog(type, color) {
      this.isEditColor = !!color;
      this.selectedColor = color ? {...color} : {...this.emptyColor(), typeId: type.id};
      this.colorDialog = true;
    },
    async saveAgenda() {
      if (!this.$refs.agendaForm.validate()) return;
      
      try {
        if (this.isEditAgenda) {
          await api.post('/api/AppAdministration/agendas', this.selectedAgenda);
        } else {
          await api.put('/api/AppAdministration/agendas', this.selectedAgenda);
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

      try {
        if (this.isEditColor) {
          await api.post('/api/AppAdministration/colors', this.selectedColor);
        } else {
          await api.put('/api/AppAdministration/colors', this.selectedColor);
        }
        this.fetchColors();
        this.colorDialog = false;
      } catch (error) {
        console.error('Error saving color:', error);
        this.handleError(error);
      }
    },
    async deleteAgenda(id) {
      if (!confirm('¿Estás seguro de eliminar esta agenda?')) return;
      
      try {
        await api.delete(`/api/AppAdministration/agendas?agendaId=${id}`);
        this.fetchAgendas();
      } catch (error) {
        console.error('Error deleting agenda:', error);
        this.handleError(error);
      }
    },
    async deleteColor(id) {
      if (!confirm('¿Estás seguro de eliminar este color?')) return;
      
      try {
        await api.delete(`/api/AppAdministration/colors?colorPaletteId=${id}`);
        this.fetchColors();
      } catch (error) {
        console.error('Error deleting color:', error);
        this.handleError(error);
      }
    },
    handleError(error) {
      if (error.response?.status === 401) {
        this.logout();
      }
    },
    async fetchAgendas() {
      try {
        const response = await api.get('/api/AppAdministration/agendas');
        this.agendas = response.data?.data || [];
      } catch (error) {
        console.error('Error fetching agendas:', error);
        this.handleError(error);
      }
    },
    async fetchColors() {
      try {
        const response = await api.get('/api/AppAdministration/colors');
        this.colors = response.data?.data || [];
      } catch (error) {
        console.error('Error fetching colors:', error);
        this.handleError(error);
      }
    },
    async fetchColorTypes() {
      try {
        const response = await api.get('/api/AppAdministration/types');
        this.types = response.data?.data || [];
      } catch (error) {
        console.error('Error fetching types:', error);
        this.handleError(error);
      }
    }
  },
  mounted() {
    this.fetchAgendas();
    this.fetchColors();
    this.fetchColorTypes();
  }
};
</script>

<style scoped>
.color-item {
  position: relative;
  margin: 4px;
}

.delete-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.gap-2 {
  gap: 8px;
}

.pulse {
  animation: pulse-animation 2s infinite;
  cursor: pointer;
}

@keyframes pulse-animation {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
</style>