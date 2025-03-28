``<template>
  <v-container fluid class="fill-height d-flex align-center justify-center ">
    <v-card class="pa-5 mx-auto text-center sunken-card config-view">
      <v-card-text class="text-h6">
        <v-container>
          <!-- Libros Propios -->
          <v-row v-if="processedOwnItems.length > 0">
            <v-col 
              v-for="item in processedOwnItems" 
              :key="item.id" 
              cols="12" 
              sm="6" 
              md="4"
              class="d-flex justify-center"
            >
              <div class="book-wrapper">
                <div class="book-title">{{ item.title }}</div>
                <div class="book-leaf"></div>
                <div class="book-leaf"></div>
                <div class="book-leaf"></div>
                
                <v-card class="book-card" @click="openDialog(item.id)">
                  <div class="book-cover">
                    <v-img 
                      :src="item.imageBackgroundSrc" 
                      height="450px" 
                      cover
                      class="book-image"
                    >
                      <v-avatar class="book-year" color="primary" size="50">
                        <span class="year-text">{{ item.year }}</span>
                      </v-avatar>
                    </v-img>
                  </div>
                </v-card>
              </div>
            </v-col>
          </v-row>

          <!-- Libros Reportados -->
          <v-row v-if="processedReportedItems.length > 0">
            <v-col cols="12">
              <h2 class="text-h5 font-weight-bold">Los R07's de tus ovejas</h2>
            </v-col>
            <v-col 
              v-for="item in processedReportedItems" 
              :key="item.id" 
              cols="12" 
              sm="6" 
              md="4"
              class="d-flex justify-center"
            >
              <div class="book-wrapper">
                <div class="book-title reported-title">{{ item.title }}</div>
                <div class="book-leaf"></div>
                <div class="book-leaf"></div>
                <div class="book-leaf"></div>
                
                <v-card class="book-card reported-card" @click="openDialog(item.id)">
                  <div class="book-cover">
                    <v-img 
                      :src="item.imageBackgroundSrc" 
                      height="450px" 
                      cover
                      class="book-image"
                    >
                      <v-avatar class="book-year" color="error" size="50">
                        <span class="year-text">{{ item.year }}</span>
                      </v-avatar>
                    </v-img>
                  </div>
                </v-card>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
    <AgendaDialog 
      v-model="dialog" 
      :filtered-items="filteredItems"
      :grouped-by-month="groupedByMonth"
      :processed-reported-items="processedReportedItems"
      :current-user-full-name="fullName"
      :colors="colors"
      :selected-agenda-id="selectedAgendaId"
      @close="dialog = false"
      @card-created="handleNewCard"
      @card-updated="handleCardUpdate"
    />
  </v-container>
</template>

<script>
import api from '@/plugins/axios';
import { mapState, mapActions } from 'vuex';
import AgendaDialog from '@/components/AgendaDialog.vue';

const MONTHS_ORDER = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default {
  name: "planner-view",
  components: {
    AgendaDialog
  },
  data() {
    return {
      currentYear: new Date().getFullYear(),
      dialog: false,
      selectedAgendaId: null,
      fullName: "",
      filteredItems: [],
      items: [],
      colors: [],
      data: [],
    };
  },
  computed: {
    ...mapState(['user']),
    ownItems() {
      return this.data?.filter(item => !item.isReported) || [];
    },
    reportedItems() {
      return this.data?.filter(item => item.isReported) || [];
    },
    processedOwnItems() {
      return this.ownItems.filter(agenda => 
        this.groupedCardsByAgenda[agenda.id]?.length || agenda.year === this.currentYear
      );
    },
    processedReportedItems() {
      return this.reportedItems.filter(agenda => 
        this.groupedCardsByAgenda[agenda.id]?.length
      );
    },
    groupedByMonth() {
      const grouped = this.filteredItems?.reduce((acc, item) => {
        const month = item.monthCreated;
        if (!acc[month]) acc[month] = [];
        acc[month].push(item);
        return acc;
      }, {}) || {};

      return MONTHS_ORDER.map(month => ({
        name: month,
        items: grouped[month] || [],
        spanishName: this.getSpanishMonth(month)
      }));
    },
    groupedCardsByAgenda() {
      return this.items?.reduce((acc, card) => {
        const agendaId = card.agendaId;
        if (!acc[agendaId]) acc[agendaId] = [];
        acc[agendaId].push(card);
        return acc;
      }, {}) || {};
    }
  },
  methods: {
    ...mapActions(['logout']),
    openDialog(agendaId) {
      this.selectedAgendaId = agendaId;
      this.filteredItems = this.groupedCardsByAgenda[agendaId] || [];
      if (this.dialog) {
        this.dialog = false;
        setTimeout(() => this.dialog = true, 50);
      } else {
        this.dialog = true;
      }
    },
    getSpanishMonth(month) {
      const months = {
        'January': 'Enero', 'February': 'Febrero', 'March': 'Marzo',
        'April': 'Abril', 'May': 'Mayo', 'June': 'Junio',
        'July': 'Julio', 'August': 'Agosto', 'September': 'Septiembre',
        'October': 'Octubre', 'November': 'Noviembre', 'December': 'Diciembre'
      };
      return months[month] || month;
    },
    async fetchItems() {
      try {
        const response = await api.get(`/api/Cards?userId=${this.user.id}`);
        this.items = response.data?.data || [];
        this.items.sort((a, b) => new Date(a.createDate) - new Date(b.createDate));
      } catch (error) {
        console.error('Error fetching items:', error);
        if (error.response.status === 401) {
          this.logout();
        }
      }
    },
    async fetchAgendas() {
      try {
        const response = await api.get(`/api/Agendas?isMale=${this.user.isMale}`);
        this.data = response.data?.data || [];
        await this.fetchItems();
      } catch (error) {
        console.error('Error fetching agendas:', error);
        if (error.response.status === 401) {
          this.logout();
        }
        
      }
    },
    fetchColors() {
      api.get('/api/ColorPaletts')
        .then(response => {
          this.colors = response.data?.data || [];
        })
        .catch(error => {
          console.error('Error fetching colors:', error);
          if (error.response.status === 401) {
            this.logout();
          }
        });
    },
    handleNewCard(newCard) {
      this.items.unshift(newCard);
      this.items.sort((a, b) => new Date(a.createDate) - new Date(b.createDate));
      this.filteredItems = this.groupedCardsByAgenda[this.selectedAgendaId] || [];
    },
    handleCardUpdate(updatedCard) {
      const index = this.items.findIndex(c => c.id === updatedCard.id);
      if (index >= 0) {
        this.items.splice(index, 1, updatedCard);
        this.filteredItems = this.groupedCardsByAgenda[this.selectedAgendaId] || [];
      }
    }
  },
  mounted() {
    this.fetchAgendas();
    this.fetchColors();
    this.fullName = `${this.user?.firstName || ''} ${this.user?.lastName || ''}`.trim();
  }
};
</script>

<style scoped>

/* Contenedor principal */
.book-wrapper {
  position: relative;
  min-height: 500px;
  margin: 100px 30px;
  perspective: 2000px;
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
</style>