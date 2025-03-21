<template>
  <v-container fluid class="fill-height d-flex align-center justify-center">
    <v-card class="pa-5 mx-auto text-center sunken-card">
      <v-card-title class="text-h4 font-weight-bold">Lista de R07</v-card-title>
      <v-card-text class="text-h6">
        <v-container>
          <v-row>
            <v-col cols="12">
              <h2 class="text-h5 font-weight-bold">Tus R07's</h2>
            </v-col>
            <v-col v-for="item in ownItems" :key="item.id" cols="12" sm="6" md="4">
              <v-card class="card" @click="openDialog(item.id)">
                <v-img :src="item.imageBackgroundSrc" height="200px" cover>
                  <v-avatar class="year-badge" color="primary" size="50">
                    <span class="year-text">{{ item.year }}</span>
                  </v-avatar>
                </v-img>
                <v-card-title>{{ item.title }}</v-card-title>
                <v-card-text>{{ item.content }}</v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <h2 class="text-h5 font-weight-bold">Los R07's de tus ovejas</h2>
            </v-col>
            <v-col v-for="item in reportedItems" :key="item.id" cols="12" sm="6" md="4">
              <v-card class="card reported-card" @click="openDialog(item.id)">
                <v-img :src="item.imageBackgroundSrc" height="200px" cover>
                  <v-avatar class="year-badge" color="primary" size="50">
                    <span class="year-text">{{ item.year }}</span>
                  </v-avatar>
                </v-img>
                <v-card-title>{{ item.title }}</v-card-title>
                <v-card-text>{{ item.content }}</v-card-text>
              </v-card>
            </v-col>
          </v-row>

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
      </v-card-text>
    </v-card>
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
          year: 2025,
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
.v-img {
    flex-shrink: 0;
    height: 200px !important;
    min-height: 200px;
}

.date-circle {
    width: 100px !important;
    height: 100px !important;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: 600px) {
        width: 80px !important;
        height: 80px !important;
    }
}


.year-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: #2196f3;
    color: white;
    font-weight: bold;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}
</style>
