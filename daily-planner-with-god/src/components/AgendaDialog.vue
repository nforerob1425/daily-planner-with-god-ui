<template>
  <v-dialog :value="value" fullscreen persistent>
    <v-card class="dialog-card">
      <v-tooltip text="Tooltip" location="left">
        <template v-slot:activator="{ props }">
          <v-btn 
            v-bind="props"
            icon="mdi-plus"
            fab
            dark
            color="primary"
            class="floating-add-btn"
            @click="openCreateDialog"
          />
        </template>
        <span>Registra lo que Dios te dice hoy</span>
      </v-tooltip>

      
      <card-dialog
        :show="showCreateDialog"
        :colors="colors"
        :initial-data="selectedCard"
        :mode="editMode ? 'edit' : 'create'"
        @close="closeCreateDialog"
        @save="handleCardSave"
      />

      <v-tooltip text="Tooltip" location="left"  v-if="this.user.hasLead && this.hasItemsReported">
        <template v-slot:activator="{ props }">
          <v-btn 
            v-bind="props"
            v-if="this.user.hasLead"
            icon="mdi-clipboard-text"
            fab
            dark
            color="green"
            class="floating-reported-btn"
            @click="reportPlanner"
          />
        </template>
        <span>Reporta tu R07 a tu lider</span>
      </v-tooltip>

      <v-btn 
        icon="mdi-close" 
        variant="flat" 
        color="error" 
        class="close-btn"
        @click="$emit('close')"
      ></v-btn>
      
      <v-container fluid class="pa-5 dialog-container">
        <div 
          v-for="month in groupedByMonth" 
          :key="month.name" 
          :id="'month-' + month.name" 
          class="month-section"
        >
          <v-row class="month-header sticky-header">
            <v-col cols="12">
              <h2 class="text-h4 font-weight-bold month-title">
                {{ getSpanishMonth(month.name) }}
                <v-chip class="ml-2" color="primary">
                  {{ month.items.length }}
                </v-chip>
                <v-btn 
                  v-if="month.items.length > 0"
                  @click="generateMonthPDF(month.name)"
                  color="secondary"
                  class="ml-2"
                  size="small"
                >
                  <v-icon left>mdi-download</v-icon>
                  PDF
                </v-btn>
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
                  <div v-if="!item.reported" class="edit-btn" @click.stop="openEditDialog(item)">
                    <v-icon>mdi-pencil</v-icon>
                  </div>

                  <div v-if="!item.reported" class="delete-btn" @click="deleteCard(item)">
                    <v-icon>mdi-delete</v-icon>
                  </div>

                  <v-tooltip text="Tooltip" location="top"  v-if="item.reported && !shouldShowUserLabel(item)">
                    <template v-slot:activator="{ props }">
                      <div class="report-ok-btn">
                        <v-icon v-bind="props">mdi-bookmark-check</v-icon>
                      </div>
                    </template>
                    <span>Ya esta reportada a tu lider</span>
                  </v-tooltip>

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

                  <v-btn 
                      icon="mdi-star"
                      variant="text"
                      v-if="!shouldShowUserLabel(item)"
                      class="favorite-icon"
                      :color="item.favorite ? 'yellow' : 'grey'"
                      @click="setFavorite(item.id); item.favorite = !item.favorite"
                    >
                    </v-btn>

                </div>

                <div class="card-content">
                  <v-card-title class="card-title">
                    <span 
                      class="title-text" 
                      :style="{ color: item.titleColor }"
                    >
                      {{ item.title }}
                    </span>
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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default {
  components: { CardDialog },
  name: 'AgendaDialog',
  props: {
    value: Boolean,
    groupedByMonth: Array,
    processedReportedItems: Array,
    currentUserFullName: String,
    colors: Array,
    selectedAgendaId: String,
    hasItemsReported: Boolean
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

    async generateMonthPDF(monthName) {
      try {
        const element = document.getElementById(`month-${monthName}`);
        console.log(element);
        if (!element) return;

        // Mostrar carga
        this.notify({
          title: 'Generando PDF',
          text: 'Por favor espere...',
          type: 'info',
          duration: 2000
        });

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: true,
          backgroundColor: null
        });

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const ratio = canvas.width / canvas.height;
        
        let imgWidth = pageWidth;
        let imgHeight = pageWidth / ratio;

        if (imgHeight > pageHeight) {
          imgHeight = pageHeight;
          imgWidth = pageHeight * ratio;
        }

        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        pdf.addImage(canvas, 'PNG', x, y, imgWidth, imgHeight);
        pdf.save(`${this.getSpanishMonth(monthName)}.pdf`);

      } catch (error) {
        console.error('Error generating PDF:', error);
        this.notify({
          title: 'Error',
          text: 'No se pudo generar el PDF',
          type: 'error'
        });
      }
    },

    async setFavorite(cardId){
      try {
        await api.patch(`/api/Cards?cardId=${cardId}`);
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
    
    openEditDialog(card) {
      this.selectedCard = card;
      this.editMode = true;
      this.showCreateDialog = true;
    },

    async deleteCard(card){
      try {
        await api.delete(`/api/Cards/${card.id}`);
        this.$emit('card-deleted', card);
      } catch (error) {
        console.error('Error delete card:', error);
        if (error.response.status === 401) {
          this.logout();
        }
       } 
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

    async reportPlanner(){
      this.notify({
          title: 'Reportando',
          text: 'Estamos reportando tu R07 a tu lider',
          type: 'info',
          duration: 2000
        });

        try {
          await api.patch(`/api/Planner?userId=${this.user.id}`);
          this.$emit('planner-reported');
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
        } finally {
            this.notify({
            title: 'Reportado',
            text: 'R07 reportado',
            type: 'success',
            duration: 2000
          });
        }
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

.favorite-icon {
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
  position: absolute;
  left: 0px;
  top: 0px;
}

.month-section {
  position: relative;
  background: white;
  margin-bottom: 2rem;
  page-break-inside: avoid; /* Para mejor renderizado en PDF */
}

.pdf-btn {
  position: relative;
  z-index: 2;
}

/* Mejora la renderización para html2canvas */
.custom-card {
  transform: translateZ(0);
  backface-visibility: hidden;
}

.border-effect {
  display: none; /* Opcional: si causa problemas en el PDF */
}
</style>