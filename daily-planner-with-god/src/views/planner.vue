<template>
  <v-container fluid class="fill-height d-flex align-center justify-center">
    <v-card class="pa-5 mx-auto text-center sunken-card">
      <v-card-title class="text-h4 font-weight-bold"></v-card-title>
      <v-card-text class="text-h6">
        <v-container>
          <!-- Libros Propios -->
          <v-row>
            <v-col cols="12">
              <h2 class="text-h4 font-weight-bold">Tus R07's</h2>
            </v-col>
            <v-col 
              v-for="item in ownItems" 
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
          <v-row>
            <v-col cols="12">
              <h2 class="text-h4 font-weight-bold">Los R07's de tus ovejas</h2>
            </v-col>
            <v-col 
              v-for="item in reportedItems" 
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
    <v-dialog v-model="dialog" fullscreen>
      <v-card class="dialog-card">
        <v-btn icon="mdi-close" variant="flat" size="large" color="error" class="close-btn"
          @click="dialog = false"></v-btn>
        <v-container fluid class="pa-5 dialog-container">
          <div v-for="month in groupedByMonth" :key="month.name" class="month-section">
            <v-row class="month-header sticky-header">
              <v-col cols="12">
                <h2 class="text-h4 font-weight-bold month-title">
                  {{ month.name }}
                  <v-chip class="ml-2" color="primary">
                    {{ month.items.length }}
                  </v-chip>
                </h2>
              </v-col>
            </v-row>
            <v-row class="month-content pt-9">
              <v-col v-for="item in month.items" :key="item.id" cols="12" sm="6" md="4" lg="3" xl="2">
                <v-card elevation="8" :color="item.primaryColor" class="custom-card flex-grow-1">

                  <div class="user-label" v-if="reportedItems.some(agenda => agenda.id === item.agendaId)"
                    :style="{ background: item.letterColor, color: item.primaryColor }">
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

              <!-- Placeholder para meses vacíos -->
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
  </v-container>
</template>


<script>
import api from '@/plugins/axios';

const MONTHS_ORDER = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default {
  name: "planner-view",
  data() {
    return {
      dialog: false,
      selectedAgendaId: null,
      filteredItems: [],
      items: [],
      colors: [],
      data: [
        {
          id: "9656ec88-b900-4117-984f-74d2868a2a7c",
          year: 2024,
          title: "R07 - 2024",
          content: "Esta agenda contiene tus cards del año 2024",
          imageBackgroundSrc: "/assets/backgrounds/R07-2024.png",
          isReported: true,
        },
        {
          id: "9656ec88-b900-4117-984f-74d2868a2i9b",
          year: 2024,
          title: "R07 - 2024",
          content: "Esta agenda contiene tus cards del año 2024",
          imageBackgroundSrc: "/assets/backgrounds/R07-2024.png",
          isReported: false,
        },
        {
          id: "9656ec88-b900-4117-984f-74d2868a2i9p",
          year: 2025,
          title: "R07 - 2025",
          content: "Esta agenda contiene tus cards del año 2025",
          imageBackgroundSrc: "/assets/backgrounds/R07-2025.png",
          isReported: false,
        }
      ],
    };
  },
  computed: {
    ownItems() {
      return this.data.filter(item => !item.isReported);
    },
    reportedItems() {
      return this.data.filter(item => item.isReported);
    },
    groupedByMonth() {
      const grouped = this.filteredItems.reduce((acc, item) => {
        const month = item.monthCreated;
        if (!acc[month]) acc[month] = [];
        acc[month].push(item);
        return acc;
      }, {});

      return MONTHS_ORDER.map(month => ({
        name: month,
        items: grouped[month] || [],
        spanishName: this.getSpanishMonth(month)
      }));
    }
  },
  methods: {
    openDialog(agendaId) {
      this.selectedAgendaId = agendaId;
      this.filteredItems = this.items.filter(item => item.agendaId === agendaId);
      this.dialog = true;
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
    fetchItems() {
      api.get('/api/Cards')
        .then(response => {
          this.items = response.data.data;
        })
        .catch(error => {
          console.error('Error fetching items:', error);
        });
    },
    fetchColors() {
      api.get('/api/ColorPaletts')
        .then(response => {
          this.colors = response.data.data;
        })
        .catch(error => {
          console.error('Error fetching colors:', error);
        });
    },
  },
  mounted() {
    this.fetchItems();
    this.fetchColors();
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
  transition: all 0.4s ease;
  opacity: 0;
  left: 15px;
  top: 5px;
  border-right: 2px solid #d0d0d0;
  transform-origin: left center;
  z-index: 2;
}

/* Posición inicial hojas */
.book-leaf:nth-child(1) {
  transform: rotateY(-5deg) translateX(-8px);
  transition-delay: 0.1s;
}

.book-leaf:nth-child(2) {
  transform: rotateY(-10deg) translateX(-16px);
  transition-delay: 0.2s;
}

.book-leaf:nth-child(3) {
  transform: rotateY(-15deg) translateX(-24px);
  transition-delay: 0.3s;
}

/* Animación hover hojas */
.book-wrapper:hover .book-leaf {
  opacity: 0.8;
}

.book-wrapper:hover .book-leaf:nth-child(1) {
  transform: rotateY(-5deg) translateX(5px);
}

.book-wrapper:hover .book-leaf:nth-child(2) {
  transform: rotateY(-10deg) translateX(10px);
}

.book-wrapper:hover .book-leaf:nth-child(3) {
  transform: rotateY(-15deg) translateX(15px);
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