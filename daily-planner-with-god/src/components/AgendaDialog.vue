<template>
  <v-dialog :value="value" fullscreen>
    <v-card class="dialog-card">
      <v-btn 
        icon="mdi-close" 
        variant="flat" 
        size="large" 
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

export default {
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
  }
},
methods: {
  shouldShowUserLabel(item) {
    return this.processedReportedItems?.some(agenda => agenda.id === item.agendaId) && 
            this.currentUserFullName !== item.originalUserFullName;
  },
  getSpanishMonth(month) {
    const months = {
      'January': 'Enero', 'February': 'Febrero', 'March': 'Marzo',
      'April': 'Abril', 'May': 'Mayo', 'June': 'Junio',
      'July': 'Julio', 'August': 'Agosto', 'September': 'Septiembre',
      'October': 'Octubre', 'November': 'Noviembre', 'December': 'Diciembre'
    };
    return months[month] || month;
  }
}
};
</script>

<style scoped>
/* Mantener los estilos existentes */
.dialog-card {
position: relative;
}

.close-btn {
position: fixed;
top: 20px;
right: 20px;
z-index: 1000;
}

.month-header {
background: white;
z-index: 100;
}

.sticky-header {
position: sticky;
top: 0;
padding-top: 20px;
background: inherit;
}
</style>