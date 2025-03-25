<template>
    <v-dialog v-model="showDialog" max-width="1000" persistent>
      <v-card class="dialog-card">

        <v-btn 
        icon="mdi-close" 
        variant="flat" 
        size="x-small" 
        color="error" 
        class="close-btn-dialog"
        @click="closeDialog"
      ></v-btn>

        <v-stepper v-model="step" :items="['Colores', 'Contenido']">
          
          <!-- Paso 1 - Selección de colores -->
          <template #[`item.1`]>
            <v-form v-model="valid" @submit.prevent>
              <v-card :title="title" flat class="pa-4 scroll-container">
                <div class="color-grid">
                  <!-- Primary Date Background -->
                  <div class="color-picker-container">
                    <v-combobox
                      v-model="localCard.primaryColorDateId"
                      :items="filterColors('Title Date Background')"
                      item-value="colorId"
                      label="Fondo de fecha"
                      outlined
                      clearable
                      class="combobox-field"
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
                        :style="{ backgroundColor: localCard.primaryColorDateId || '#e0e0e0' }"
                      />
                    </div>
                  </div>
  
                  <!-- Letter Date Color -->
                  <div class="color-picker-container">
                    <v-combobox
                      v-model="localCard.letterDateColorId"
                      :items="filterColors('Primary Letter')"
                      item-value="colorId"
                      label="Texto de fecha"
                      outlined
                      clearable
                      class="combobox-field"
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
                        :style="{ backgroundColor: localCard.letterDateColorId || '#e0e0e0' }"
                      />
                    </div>
                  </div>
  
                  <!-- Primary Background -->
                  <div class="color-picker-container">
                    <v-combobox
                      v-model="localCard.primaryColorId"
                      :items="filterColors('Primary Background')"
                      item-value="colorId"
                      label="Fondo principal"
                      outlined
                      clearable
                      class="combobox-field"
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
                        :style="{ backgroundColor: localCard.primaryColorId || '#e0e0e0' }"
                      />
                    </div>
                  </div>
  
                  <!-- Letter Color -->
                  <div class="color-picker-container">
                    <v-combobox
                      v-model="localCard.letterColorId"
                      :items="filterColors('Primary Letter')"
                      item-value="colorId"
                      label="Texto principal"
                      outlined
                      clearable
                      class="combobox-field"
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
                        :style="{ backgroundColor: localCard.letterColorId || '#e0e0e0' }"
                      />
                    </div>
                  </div>
  
                  <!-- Title Color -->
                  <div class="color-picker-container">
                    <v-combobox
                      v-model="localCard.titleColorId"
                      :items="filterColors('Title')"
                      item-value="colorId"
                      label="Color del título"
                      outlined
                      clearable
                      class="combobox-field"
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
                        :style="{ backgroundColor: localCard.titleColorId || '#e0e0e0' }"
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
                  v-model="localCard.title"
                  label="Título"
                  outlined
                  clearable
                  class="mb-4"
                  :rules="[v => !!v || 'El título es requerido']"
                ></v-text-field>
  
                <v-textarea
                  v-model="localCard.content"
                  label="Contenido principal"
                  outlined
                  clearable
                  rows="4"
                  auto-grow
                  class="mb-4"
                  :rules="[v => !!v || 'El contenido es requerido']"
                ></v-textarea>
  
                <v-text-field
                  v-model="localCard.versicle"
                  label="Versículo relacionado"
                  outlined
                  clearable
                  class="mb-6"
                ></v-text-field>
  
                <div class="dialog-actions">
                  <v-btn
                    color="primary"
                    @click="handleSave"
                    size="large"
                    rounded="lg"
                    :loading="isLoading"
                  >
                    <v-icon start>mdi-check</v-icon>
                    {{ mode === 'create' ? 'Crear' : 'Guardar' }}
                  </v-btn>
                </div>
              </v-card>
            </v-form>
          </template>
        </v-stepper>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import { useNotification } from "@kyvg/vue3-notification";
  
  export default {
    name: 'CardDialog',
    props: {
      show: Boolean,
      colors: Array,
      initialData: Object,
      mode: {
        type: String,
        default: 'create',
        validator: value => ['create', 'edit'].includes(value)
      }
    },
    emits: ['save', 'close'],
    setup() {
      const { notify } = useNotification();
      return { notify };
    },
    data() {
      return {
        valid: false,
        isLoading: false,
        step: 1,
        showDialog: this.show,
        localCard: this.initialData || this.getDefaultCard()
      };
    },
    computed: {
      title() {
        return this.mode === 'create' 
          ? 'Configuración de colores' 
          : 'Editar configuración de colores';
      }
    },
    watch: {
      show(val) {
        this.showDialog = val;
        if (val) this.resetForm();
      }
    },
    methods: {
      getDefaultCard() {
        return {
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
      
      filterColors(typeName) {
        return this.colors
          .filter(color => color.typeName === typeName)
          .map(color => color.color)
          .filter((color, index, self) => self.indexOf(color) === index);
      },
  
      updateColor(field, value) {
        this.localCard[field] = value;
      },
  
      getColorId(hex, typeName) {
        const color = this.colors.find(c => 
          c.color === hex && 
          c.typeName === typeName
        );
        return color?.colorId || null;
      },
  
      resetForm() {
        this.localCard = this.initialData || this.getDefaultCard();
        this.step = 1;
      },
  
      closeDialog() {
        this.showDialog = false;
        this.$emit('close');
      },
  
      async handleSave() {
        const colorFields = [
          'primaryColorDateId',
          'letterDateColorId',
          'primaryColorId',
          'letterColorId',
          'titleColorId'
        ];
        
        const missingColors = colorFields.filter(field => !this.localCard[field]);
        
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
        
        if (!this.localCard.title || !this.localCard.content) {
          this.step = 2;        
          this.notify({
            title: 'Campos incompletos',
            text: 'Por favor completa el título y el contenido',
            type: 'error',
            position: 'bottom right'
          });
          return;
        }
  
        this.isLoading = true;
        this.$emit('save', this.preparePayload());
        this.isLoading = false;
      },
  
      preparePayload() {
        return {
          ...this.localCard,
          primaryColorDateId: this.getColorId(this.localCard.primaryColorDateId, 'Title Date Background'),
          letterDateColorId: this.getColorId(this.localCard.letterDateColorId, 'Primary Letter'),
          primaryColorId: this.getColorId(this.localCard.primaryColorId, 'Primary Background'),
          letterColorId: this.getColorId(this.localCard.letterColorId, 'Primary Letter'),
          titleColorId: this.getColorId(this.localCard.titleColorId, 'Title'),
          createDate: this.mode === 'create' ? new Date().toISOString() : undefined,
        };
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

  .close-btn-dialog {
    position: fixed !important;
    top: -15px;
    right: -15px;
    z-index: 100;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
    transition: opacity 0.3s ease, transform 0.3s ease;

    &:hover {
        transform: scale(1.1);
    }
  }
  </style>