<template>
  <v-dialog :value="value" fullscreen>
    <v-card class="dialog-card">

      <v-btn icon="mdi-plus"
        fab
        dark
        color="primary"
        class="floating-add-btn"
        @click="openCreateDialog"
        size="x-large"
      >
        
      </v-btn>

      <!-- Diálogo de creación -->
      <v-dialog v-model="showCreateDialog" max-width="1000">
        <v-card class="dialog-card">
          <v-stepper v-model="step" :items="['Colores', 'Contenido']">
            
            <!-- Paso 1 - Selección de colores -->
            <template #[`item.1`]>
              <v-form v-model="valid" @submit.prevent>
                <v-card title="Configuración de colores" flat class="pa-4 scroll-container">
                  <div class="color-grid">
                    <!-- Primary Date Background -->
                    <div class="color-picker-container">
                      <v-combobox
                        v-model="newCard.primaryColorDateId"
                        :items="filterColors('Title Date Background')"
                        item-value="colorId"
                        label="Fondo de fecha"
                        outlined
                        clearable
                        class="combobox-field"
                        @update:modelValue="val => updateColor('primaryColorDateId', val)"
                      >
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props" @mouseover="updateColor('primaryColorDateId', item.value)">
                          <v-list-item-title>{{ item.raw.colorName }}</v-list-item-title>
                        </v-list-item>
                      </template>
                      </v-combobox>
                      
                      <div class="color-preview">
                        <v-avatar
                          size="32"
                          :style="{ backgroundColor: newCard.primaryColorDateId || '#e0e0e0' }"
                        />
                      </div>
                    </div>

                    <!-- Letter Date Color -->
                    <div class="color-picker-container">
                      <v-combobox
                        v-model="newCard.letterDateColorId"
                        :items="filterColors('Primary Letter')"
                        item-value="colorId"
                        label="Texto de fecha"
                        outlined
                        clearable
                        class="combobox-field"
                        @update:modelValue="val => updateColor('letterDateColorId', val)"
                      >
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props" @mouseover="updateColor('letterDateColorId', item.value)">
                          <v-list-item-title>{{ item.raw.colorName }}</v-list-item-title>
                        </v-list-item>
                      </template>
                      </v-combobox>
                      <div class="color-preview">
                        <v-avatar
                          size="36"
                          :style="{ backgroundColor: newCard.letterDateColorId || '#e0e0e0' }"
                        />
                      </div>
                    </div>

                    <!-- Primary Background -->
                    <div class="color-picker-container">
                      <v-combobox
                        v-model="newCard.primaryColorId"
                        :items="filterColors('Primary Background')"
                        item-value="colorId"
                        label="Fondo principal"
                        outlined
                        clearable
                        class="combobox-field"
                        @update:modelValue="val => updateColor('primaryColorId', val)"
                      >
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props" @mouseover="updateColor('primaryColorId', item.value)">
                          <v-list-item-title>{{ item.raw.colorName }}</v-list-item-title>
                        </v-list-item>
                      </template>
                      </v-combobox>
                      <div class="color-preview">
                        <v-avatar
                          size="36"
                          :style="{ backgroundColor: newCard.primaryColorId || '#e0e0e0' }"
                        />
                      </div>
                    </div>

                    <!-- Letter Color -->
                    <div class="color-picker-container">
                      <v-combobox
                        v-model="newCard.letterColorId"
                        :items="filterColors('Primary Letter')"
                        item-value="colorId"
                        label="Texto principal"
                        outlined
                        clearable
                        class="combobox-field"
                        @update:modelValue="val => updateColor('letterColorId', val)"
                      >
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props" @mouseover="updateColor('letterColorId', item.value)">
                          <v-list-item-title>{{ item.raw.colorName }}</v-list-item-title>
                        </v-list-item>
                      </template>
                      </v-combobox>
                      <div class="color-preview">
                        <v-avatar
                          size="36"
                          :style="{ backgroundColor: newCard.letterColorId || '#e0e0e0' }"
                        />
                      </div>
                    </div>

                    <!-- Title Color -->
                    <div class="color-picker-container">
                      <v-combobox
                        v-model="newCard.titleColorId"
                        :items="filterColors('Title')"
                        item-value="colorId"
                        label="Color del título"
                        outlined
                        clearable
                        class="combobox-field"
                        @update:modelValue="val => updateColor('titleColorId', val)"
                      >
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props" @mouseover="updateColor('titleColorId', item.value)">
                          <v-list-item-title>{{ item.raw.colorName }}</v-list-item-title>
                        </v-list-item>
                      </template>
                      </v-combobox>
                      <div class="color-preview">
                        <v-avatar
                          size="36"
                          :style="{ backgroundColor: newCard.titleColorId || '#e0e0e0' }"
                        />
                      </div>
                    </div>
                  </div>
                </v-card>
            </v-form>
            </template>

            <!-- Paso 2 - Contenido -->
            <template #[`item.2`]>
              <v-form v-model="valid" @submit.prevent>
                <v-card title="Contenido" flat class="pa-4 scroll-container">
                  <v-btn
                    color="secondary"
                    @click="step = 1"
                    variant="text"
                    class="mb-4"
                  >
                    <v-icon start>mdi-arrow-left</v-icon>
                    Volver a colores
                  </v-btn>

                  <v-text-field
                    v-model="newCard.title"
                    label="Título"
                    outlined
                    clearable
                    class="mb-4"
                    :rules="[v => !!v || 'El título es requerido']"
                  ></v-text-field>

                  <v-textarea
                    v-model="newCard.content"
                    label="Contenido principal"
                    outlined
                    clearable
                    rows="4"
                    auto-grow
                    class="mb-4"
                    :rules="[v => !!v || 'El contenido es requerido']"
                  ></v-textarea>

                  <v-text-field
                    v-model="newCard.versicle"
                    label="Versículo relacionado"
                    outlined
                    clearable
                    class="mb-6"
                  ></v-text-field>

                  <div class="dialog-actions">
                    <v-btn
                      color="error"
                      variant="outlined"
                      @click="closeCreateDialog"
                      size="large"
                    >
                      Cancelar
                    </v-btn>
                    
                    <v-btn
                      color="primary"
                      @click="createCard"
                      size="large"
                      :loading="isCreating"
                    >
                      <v-icon start>mdi-check</v-icon>
                      Crear Card
                    </v-btn>
                  </div>
                </v-card>
              </v-form>
            </template>
          </v-stepper>
        </v-card>
      </v-dialog>

      <v-btn 
        icon="mdi-close" 
        variant="flat" 
        size="x-large" 
        color="error" 
        class="close-btn"
        @click="$emit('close')"
      ></v-btn>
      
      <v-container fluid class="pa-5 dialog-container">
        <div v-for="month in groupedByMonth" :key="month.name" class="month-section">
          <v-row class="month-header sticky-header">
            <v-col cols="12">
              <h2 class="text-h4 font-weight-bold month-title">
                {{ getSpanishMonth(month.name) }}
                <v-chip class="ml-2" color="primary">
                  {{ month.items.length }}
                </v-chip>
              </h2>
            </v-col>
          </v-row>
          
          <v-row class="month-content pt-9">
            <v-col 
              v-for="item in month.items" 
              :key="item.id" 
              cols="12" 
              sm="6" 
              md="4" 
              lg="3" 
              xl="2"
            >
              <v-card elevation="8" :color="item.primaryColor" class="custom-card flex-grow-1">
                <div 
                  class="user-label" 
                   v-if="shouldShowUserLabel(item)"
                  :style="{ background: item.letterColor, color: item.primaryColor }"
                >
                  {{ item.originalUserFullName }}
                </div>

                <div class="date-container">
                  <v-avatar size="80" :color="item.primaryColorDate" class="date-circle">
                    <span class="date-text" :style="{ color: item.letterDateColor }">
                      {{ item.monthCreated }} <br> {{ item.dayCreated }}
                    </span>
                  </v-avatar>
                </div>

                <v-card-title class="card-title text-wrap" :style="{ color: item.titleColor }">
                  {{ item.title }}
                </v-card-title>

                <v-card-subtitle class="text-subtitle-1">
                  <div class="versicle-text" :style="{ color: item.letterColor }">
                    {{ item.versicle }}
                  </div>
                </v-card-subtitle>

                <v-card-text class="custom-text flex-grow-1" :style="{ color: item.letterColor }">
                  {{ item.content }}
                </v-card-text>

                <v-card-actions class="card-actions">
                  <v-icon :color="item.favorite ? 'yellow' : 'gray'">mdi-star</v-icon>
                </v-card-actions>
              </v-card>
            </v-col>

            <template v-if="month.items.length === 0">
              <v-col cols="12">
                <div class="empty-month text-body-1">
                  No hay cards para este mes
                </div>
              </v-col>
            </template>
          </v-row>
        </div>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { useNotification } from "@kyvg/vue3-notification";
import api from '@/plugins/axios';
import { mapState, mapActions } from 'vuex';

export default {
  setup() {
    const { notify } = useNotification();
    return { notify };
  },
  name: 'AgendaDialog',
  props: {
    value: Boolean,
    filteredItems: {
      type: Array,
      default: () => []
    },
    processedReportedItems: {
      type: Array,
      default: () => []
    },
    groupedByMonth: {
      type: Array,
      default: () => []
    },
    currentUserFullName: {
      type: String,
      default: ''
    },
    colors: {
      type: Array,
      default: () => []
    },
    selectedAgendaId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      valid: false,
      isCreating: false,
      showCreateDialog: false,
      step: 1,
      newCard: {
        title: '',
        content: '',
        versicle: '',
        primaryColorDateId: '',
        letterDateColorId: '',
        primaryColorId: '',
        letterColorId: '',
        titleColorId: ''
      },
    }
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    ...mapActions(['logout']),
    openCreateDialog() {
      this.showCreateDialog = true
      this.step = 1
      this.resetForm()
    },
    closeCreateDialog() {
      this.showCreateDialog = false;
      this.resetForm();
    },
    filterColors(typeName) {
      return this.colors
        .filter(color => color.typeName === typeName)
        .map(color => color.color)
        .filter((color, index, self) => self.indexOf(color) === index);
    },
    getColorId(hex, typeName) {
      const color = this.colors.find(c => 
        c.color === hex && 
        c.typeName === typeName
      );
      return color?.colorId || null;
    },
    prepareCardData() {
      return {
        createDate: new Date().toISOString(),
        primaryColorDateId: this.getColorId(this.newCard.primaryColorDateId, 'Title Date Background'),
        letterDateColorId: this.getColorId(this.newCard.letterDateColorId, 'Primary Letter'),
        primaryColorId: this.getColorId(this.newCard.primaryColorId, 'Primary Background'),
        letterColorId: this.getColorId(this.newCard.letterColorId, 'Primary Letter'),
        titleColorId: this.getColorId(this.newCard.titleColorId, 'Title'),
        title: this.newCard.title,
        content: this.newCard.content,
        versicle: this.newCard.versicle,
        favorite: false,
        agendaId: this.selectedAgendaId,
        userId: this.user.id
      };
    },
    getSelectedColor(colorId, typeName) {
      const color = this.colors.find(c => c.colorId === colorId && c.typeName === typeName);
      return color?.color || null;
    },
    updateColor(field, value) {
      this.newCard[field] = value;
      this.$forceUpdate();
    },
    
    resetForm() {
      this.newCard = {
        title: '',
        content: '',
        versicle: '',
        primaryColorDateId: '',
        letterDateColorId: '',
        primaryColorId: '',
        letterColorId: '',
        titleColorId: ''
      };
    },
    createCard() {
      // Validar campos del paso 1 (colores)
      const colorFields = [
        'primaryColorDateId',
        'letterDateColorId',
        'primaryColorId',
        'letterColorId',
        'titleColorId'
      ];
      
      const missingColors = colorFields.filter(field => !this.newCard[field]);
      
      if (missingColors.length > 0) {
        this.step = 1;        
        this.notify({
          title: 'Campos incompletos',
          text: 'Por favor completa todos los campos de colores',
          type: 'error',
          position: 'bottom right'
        });      
        return;
      }
      
      if (!this.newCard.title || !this.newCard.content) {
        this.step = 2;        
        this.notify({
          title: 'Campos incompletos',
          text: 'Por favor completa el título y el contenido',
          type: 'error',
          position: 'bottom right'
        });
        return;
      }

      
      this.isCreating = true;
      const payload = this.prepareCardData();
      // Llamada API
      api.post('/api/Cards', payload)
        .then(response => {
          this.notify({
            title: 'Éxito',
            text: 'Card creada correctamente',
            type: 'success',
            position: 'bottom right',
            duration: 4000
          });
          this.$emit('card-created', response.data?.data);
          this.closeCreateDialog();
        })
        .catch(error => {
          let errorMessage = 'Error al crear la card';
          
          if (error.response.status === 401) {
            this.logout();
          } 
          else {
            if (error.response) {
              errorMessage = error.response.data?.Message || error.response.data;
            }
            
            this.notify({
              title: 'Error',
              text: errorMessage,
              type: 'error',
              position: 'bottom right',
              duration: 5000
            });
          }
        })
        .finally(() => {
          this.isCreating = false;
        });
    },
    shouldShowUserLabel(item) {
      return this.processedReportedItems?.some(agenda => agenda.id === item.agendaId) && 
             this.currentUserFullName !== item.originalUserFullName
    },
    getSpanishMonth(month) {
      const months = {
        'January': 'Enero', 'February': 'Febrero', 'March': 'Marzo',
        'April': 'Abril', 'May': 'Mayo', 'June': 'Junio',
        'July': 'Julio', 'August': 'Agosto', 'September': 'Septiembre',
        'October': 'Octubre', 'November': 'Noviembre', 'December': 'Diciembre'
      }
      return months[month] || month
    }
  }
}
</script>

<style scoped>
.dialog-card {
  max-height: 90vh;
  overflow: hidden;
}

.scroll-container {
  overflow-y: auto;
  max-height: 70vh;
  padding-bottom: 20px;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding-right: 8px;
}

.color-picker-container {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}

.combobox-field {
  flex: 1;
  min-width: 200px;
}

.color-preview {
  flex-shrink: 0;
  position: absolute;
  right: 12px;
  top: 35%;
  transform: translateY(-50%);
}

.dialog-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  margin-top: 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

@media (max-width: 600px) {
  .dialog-card {
    max-height: 100vh;
    height: 100vh;
  }

  .scroll-container {
    max-height: calc(100vh - 120px);
    -webkit-overflow-scrolling: touch;
  }

  .color-picker-container {
    flex-direction: column;
  }

  .color-preview {
    position: static;
    transform: none;
    margin-top: 8px;
    align-self: flex-start;
  }
}

:deep(.v-combobox .v-field__input) {
  padding-right: 50px !important;
  font-family: 'Fira Code', monospace;
}

:deep(.v-list-item__content) {
  padding: 0 !important;
}

</style>