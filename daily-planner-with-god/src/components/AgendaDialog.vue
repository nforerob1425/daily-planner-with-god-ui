<template>
  <v-dialog :value="value" fullscreen persistent :key="dialogKey">
    <v-card class="dialog-card">
      
      <v-btn 
        icon="mdi-plus"
        fab
        dark
        color="primary"
        class="floating-add-btn"
        @click="openCreateDialog"
      />
      
      <card-dialog
      :show="showCreateDialog"
      :colors="colors"
      :initial-data="selectedCard"
      :mode="editMode ? 'edit' : 'create'"
      @close="closeCreateDialog"
      @save="handleCardSave"
      />

      <v-btn 
        icon="mdi-close" 
        variant="flat" 
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
              <v-card 
                elevation="8" 
                :color="item.primaryColor" 
                class="custom-card flex-grow-1"
                :style="{ '--title-color': item.titleColor }"
              >
                <div 
                  class="user-label" 
                  v-if="shouldShowUserLabel(item)"
                  :style="{ 
                    background: item.letterColor, 
                    color: item.primaryColor 
                  }"
                >
                  {{ item.originalUserFullName }}
                </div>

                <div class="card-header">
                  <div class="edit-btn" @click.stop="openEditDialog(item)">
                    <v-icon>mdi-pencil</v-icon>
                  </div>

                  <div class="date-badge">
                    <span 
                      class="month" 
                      :style="{ 
                        color: item.letterDateColor,
                        textShadow: `
                          0.05em 0.05em 0.1em ${getContrastShadow(item.primaryColorDate)},
                          -0.05em -0.05em 0.1em ${getLightShadow(item.primaryColorDate)}
                        `
                      }"
                    >
                      {{ getSpanishMonth(item.monthCreated) }}
                    </span>
                    <span 
                      class="day" 
                      :style="{ 
                        backgroundColor: item.primaryColorDate,
                        color: item.letterDateColor
                      }"
                    >
                      {{ item.dayCreated }}
                    </span>
                  </div>
                </div>

                <div class="card-content">
                  <v-card-title class="card-title">
                    <span 
                      class="title-text" 
                      :style="{ color: item.titleColor }"
                    >
                      {{ item.title }}
                    </span>
                    <v-icon 
                      :color="item.favorite ? 'yellow' : 'grey'"
                      class="favorite-icon"
                    >
                      mdi-star
                    </v-icon>
                  </v-card-title>

                  <v-card-subtitle class="versicle">
                    <v-icon small :color="item.titleColor">mdi-book-variant</v-icon>
                    <span :style="{ color: item.letterColor }">
                      {{ item.versicle }}
                    </span>
                  </v-card-subtitle>

                  <v-card-text 
                    class="content" 
                    :style="{ color: item.letterColor }"
                  >
                    {{ item.content }}
                  </v-card-text>
                </div>

                <div class="border-effect" :style="{ 
                  background: `linear-gradient(45deg, ${item.titleColor} 30%, transparent)`
                }"></div>
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
import { mapState, mapActions } from 'vuex';
import CardDialog from './CardDialog.vue';
import api from '@/plugins/axios';
import tinycolor from 'tinycolor2';
import { useNotification } from "@kyvg/vue3-notification";

export default {
  components: { CardDialog },
  name: 'AgendaDialog',
  props: {
    value: Boolean,
    groupedByMonth: Array,
    processedReportedItems: Array,
    currentUserFullName: String,
    colors: Array,
    selectedAgendaId: String
  },
  data() {
    return {
      showCreateDialog: false,
      selectedCard: null,
      editMode: false,
    };
  },
  setup() {
    const { notify } = useNotification();
    return { notify };
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    ...mapActions(['logout']),
    
    openEditDialog(card) {
      this.selectedCard = card;
      this.editMode = true;
      this.showCreateDialog = true;
    },

    handleCardSave(cardData) {
      if (this.editMode) {
        this.handleCardUpdate(cardData);
      } else {
        this.handleCardCreate(cardData);
      }
    },

    openCreateDialog() {
      this.showCreateDialog = true;
    },
    
    closeCreateDialog() {
      this.showCreateDialog = false;
      this.editMode = false;
      this.selectedCard = null;
      this.originalCard = null;
    },
    
    async handleCardCreate(cardData) {
      try {
        const payload = {
          ...cardData,
          agendaId: this.selectedAgendaId,
          userId: this.user.id
        };
        
        const response = await api.post('/api/Cards', payload);
        this.$emit('card-created', response.data?.data);
        this.closeCreateDialog();
        
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
    },

    async handleCardUpdate(cardData) {
      try {
        const payload = {
          ...cardData,
          id: this.selectedCard.id,
          agendaId: this.selectedAgendaId,
          userId: this.user.id
        };
        
        const response = await api.put('/api/Cards', payload);
        this.$emit('card-updated', response.data?.data);
        this.closeCreateDialog();
        
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
    },
    
    getContrastShadow(color) {
      return tinycolor(color).isLight() 
        ? 'rgba(0, 0, 0, 0.2)' 
        : 'rgba(255, 255, 255, 0.2)';
    },
    
    getLightShadow(color) {
      return tinycolor(color).isLight()
        ? 'rgba(255, 255, 255, 0.15)'
        : 'rgba(0, 0, 0, 0.15)';
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
</style>