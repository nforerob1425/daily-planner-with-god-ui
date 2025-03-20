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
                        {{ month.spanishName }}
                        <v-chip class="ml-2" color="primary">
                          {{ month.items.length }}
                        </v-chip>
                      </h2>
                    </v-col>
                  </v-row>
                  <v-row class="month-content pt-6">
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
      items: [
        {
          id: "93dc2864-32d3-4072-ac09-1a982ad6806d",
          createDate: "2025-03-20T02:11:08.732Z",
          monthCreated: "March",
          dayCreated: "20",
          title: "El amor de Dios",
          content: "Miren con cuánto amor nos ama nuestro Padre que nos llama sus hijos, ¡y eso es lo que somos! Pero la gente de este mundo no reconoce que somos hijos de Dios, porque no lo conocen a él.",
          favorite: false,
          versicle: "1 Juan 3:1",
          primaryColor: "#114D7A",
          letterColor: "#F4EDE4",
          titleColor: "#E58F65",
          primaryColorDate: "#2C3E50",
          letterDateColor: "#F9D371",
          userId: "bcf8df02-e302-489f-a801-0de13925185a",
          agendaId: "9656ec88-b900-4117-984f-74d2868a2i9b",
          originalUserFullName: "Nicolas Forero",
        },
        {
          id: "5c1db985-e93e-4756-b32c-6007674d651d",
          createDate: "2025-03-21T02:11:08.732Z",
          monthCreated: "March",
          dayCreated: "21",
          title: "Hagan siempre el bien",
          content: "Y no se olviden de hacer el bien ni de compartir lo que tienen con quienes pasan necesidad. Estos son los sacrificios que le agradan a Dios. -Señor guia mi camino el dia de hoy y ayudame a hacer el bien",
          favorite: true,
          versicle: "Hebreos 13:16",
          primaryColor: "#114D7A",
          letterColor: "#FAE1A0",
          titleColor: "#A0D3FA",
          primaryColorDate: "#7A3F11",
          letterDateColor: "#F9D371",
          userId: "945e80c3-f78d-4805-a4ff-22f26af39d5e",
          agendaId: "9656ec88-b900-4117-984f-74d2868a2a7c",
          originalUserFullName: "Nicolas Bustamante",
        },
        {
          id: "5c1db985-e93e-4756-b32c-6007674d651w",
          createDate: "2025-03-21T02:11:08.732Z",
          monthCreated: "April",
          dayCreated: "2",
          title: "El murio por mi",
          content: "pero Dios mostró el gran amor que nos tiene al enviar a Cristo a morir por nosotros cuando todavía éramos pecadores.",
          favorite: true,
          versicle: "Romanos 5:8",
          primaryColor: "#FF69B4",
          letterColor: "#e3e0e0",
          titleColor: "#FFD700",
          primaryColorDate: "#B03060",
          letterDateColor: "#FFDDFF",
          userId: "945e80c3-f78d-4805-a4ff-22f26af39d5r",
          agendaId: "9656ec88-b900-4117-984f-74d2868a2a7c",
          originalUserFullName: "Alexandra Guarnizo",
        },
        {
          "id": "1a2b3c4d-5678-9101-1121-314151617181",
          "createDate": "2025-04-10T08:30:15.123Z",
          "monthCreated": "April",
          "dayCreated": "10",
          "title": "El amor de Dios",
          "content": "Miren con cuánto amor nos ama nuestro Padre que nos llama sus hijos, ¡y eso es lo que somos! Pero la gente de este mundo no reconoce que somos hijos de Dios, porque no lo conocen a él.",
          "favorite": false,
          "versicle": "1 Juan 3:1",
          "primaryColor": "#D72638",
          "letterColor": "#FAF3DD",
          "titleColor": "#3F88C5",
          "primaryColorDate": "#4F4A41",
          "letterDateColor": "#F4A261",
          "userId": "bcf8df02-e302-489f-a801-0de13925185a",
          "agendaId": "9656ec88-b900-4117-984f-74d2868a2i9b",
          "originalUserFullName": "Nicolas Forero"
        },
        {
          "id": "2b3c4d5e-6789-0123-4567-891011121314",
          "createDate": "2025-05-15T12:45:32.987Z",
          "monthCreated": "May",
          "dayCreated": "15",
          "title": "El amor de Dios",
          "content": "Miren con cuánto amor nos ama nuestro Padre que nos llama sus hijos, ¡y eso es lo que somos! Pero la gente de este mundo no reconoce que somos hijos de Dios, porque no lo conocen a él.",
          "favorite": false,
          "versicle": "1 Juan 3:1",
          "primaryColor": "#26547C",
          "letterColor": "#E8F1F2",
          "titleColor": "#EF476F",
          "primaryColorDate": "#8D99AE",
          "letterDateColor": "#F3A712",
          "userId": "bcf8df02-e302-489f-a801-0de13925185a",
          "agendaId": "9656ec88-b900-4117-984f-74d2868a2i9b",
          "originalUserFullName": "Nicolas Forero"
        },
        {
          "id": "3c4d5e6f-7890-1234-5678-910111213141",
          "createDate": "2025-06-20T14:20:10.456Z",
          "monthCreated": "June",
          "dayCreated": "20",
          "title": "El amor de Dios",
          "content": "Miren con cuánto amor nos ama nuestro Padre que nos llama sus hijos, ¡y eso es lo que somos! Pero la gente de este mundo no reconoce que somos hijos de Dios, porque no lo conocen a él.",
          "favorite": false,
          "versicle": "1 Juan 3:1",
          "primaryColor": "#5C164E",
          "letterColor": "#FAE3E3",
          "titleColor": "#C72C41",
          "primaryColorDate": "#7F9183",
          "letterDateColor": "#F6D55C",
          "userId": "bcf8df02-e302-489f-a801-0de13925185a",
          "agendaId": "9656ec88-b900-4117-984f-74d2868a2i9b",
          "originalUserFullName": "Nicolas Forero"
        },
        {
          "id": "4d5e6f7g-8901-2345-6789-101112131415",
          "createDate": "2025-07-05T09:10:45.789Z",
          "monthCreated": "July",
          "dayCreated": "05",
          "title": "El amor de Dios",
          "content": "Miren con cuánto amor nos ama nuestro Padre que nos llama sus hijos, ¡y eso es lo que somos! Pero la gente de este mundo no reconoce que somos hijos de Dios, porque no lo conocen a él.",
          "favorite": false,
          "versicle": "1 Juan 3:1",
          "primaryColor": "#4A47A3",
          "letterColor": "#ECECEC",
          "titleColor": "#FF6F61",
          "primaryColorDate": "#2F4858",
          "letterDateColor": "#F7B801",
          "userId": "bcf8df02-e302-489f-a801-0de13925185a",
          "agendaId": "9656ec88-b900-4117-984f-74d2868a2i9b",
          "originalUserFullName": "Nicolas Forero"
        },
        {
          "id": "5e6f7g8h-9012-3456-7890-111213141516",
          "createDate": "2025-08-30T17:55:22.654Z",
          "monthCreated": "August",
          "dayCreated": "30",
          "title": "El amor de Dios",
          "content": "Miren con cuánto amor nos ama nuestro Padre que nos llama sus hijos, ¡y eso es lo que somos! Pero la gente de este mundo no reconoce que somos hijos de Dios, porque no lo conocen a él.",
          "favorite": false,
          "versicle": "1 Juan 3:1",
          "primaryColor": "#00296B",
          "letterColor": "#F8F9FA",
          "titleColor": "#F94144",
          "primaryColorDate": "#003F5C",
          "letterDateColor": "#FFBA08",
          "userId": "bcf8df02-e302-489f-a801-0de13925185a",
          "agendaId": "9656ec88-b900-4117-984f-74d2868a2i9b",
          "originalUserFullName": "Nicolas Forero"
        },
        {
          "id": "6f7g8h9i-0123-4567-8901-121314151617",
          "createDate": "2025-01-05T11:25:30.789Z",
          "monthCreated": "January",
          "dayCreated": "05",
          "title": "El amor de Dios",
          "content": "Miren con cuánto amor nos ama nuestro Padre que nos llama sus hijos, ¡y eso es lo que somos! Pero la gente de este mundo no reconoce que somos hijos de Dios, porque no lo conocen a él.",
          "favorite": false,
          "versicle": "1 Juan 3:1",
          "primaryColor": "#FF6F61",
          "letterColor": "#FFF5E1",
          "titleColor": "#6A0572",
          "primaryColorDate": "#1B3B6F",
          "letterDateColor": "#FFD166",
          "userId": "bcf8df02-e302-489f-a801-0de13925185a",
          "agendaId": "9656ec88-b900-4117-984f-74d2868a2i9b",
          "originalUserFullName": "Nicolas Forero"
        },
        {
          "id": "7g8h9i0j-1234-5678-9012-131415161718",
          "createDate": "2025-01-12T14:40:12.456Z",
          "monthCreated": "January",
          "dayCreated": "12",
          "title": "El amor de Dios",
          "content": "Miren con cuánto amor nos ama nuestro Padre que nos llama sus hijos, ¡y eso es lo que somos! Pero la gente de este mundo no reconoce que somos hijos de Dios, porque no lo conocen a él.",
          "favorite": false,
          "versicle": "1 Juan 3:1",
          "primaryColor": "#6A0572",
          "letterColor": "#F8E1F4",
          "titleColor": "#FF4081",
          "primaryColorDate": "#33313B",
          "letterDateColor": "#F1C40F",
          "userId": "bcf8df02-e302-489f-a801-0de13925185a",
          "agendaId": "9656ec88-b900-4117-984f-74d2868a2i9b",
          "originalUserFullName": "Nicolas Forero"
        },
        {
          "id": "8h9i0j1k-2345-6789-0123-141516171819",
          "createDate": "2025-01-18T09:55:50.123Z",
          "monthCreated": "January",
          "dayCreated": "18",
          "title": "El amor de Dios",
          "content": "Miren con cuánto amor nos ama nuestro Padre que nos llama sus hijos, ¡y eso es lo que somos! Pero la gente de este mundo no reconoce que somos hijos de Dios, porque no lo conocen a él.",
          "favorite": false,
          "versicle": "1 Juan 3:1",
          "primaryColor": "#FFD166",
          "letterColor": "#1B3B6F",
          "titleColor": "#FF6F61",
          "primaryColorDate": "#283D3B",
          "letterDateColor": "#F4A261",
          "userId": "bcf8df02-e302-489f-a801-0de13925185a",
          "agendaId": "9656ec88-b900-4117-984f-74d2868a2i9b",
          "originalUserFullName": "Nicolas Forero"
        },
        {
          "id": "9i0j1k2l-3456-7890-1234-151617181920",
          "createDate": "2025-01-25T16:30:25.567Z",
          "monthCreated": "January",
          "dayCreated": "25",
          "title": "El amor de Dios",
          "content": "Miren con cuánto amor nos ama nuestro Padre que nos llama sus hijos, ¡y eso es lo que somos! Pero la gente de este mundo no reconoce que somos hijos de Dios, porque no lo conocen a él.",
          "favorite": false,
          "versicle": "1 Juan 3:1",
          "primaryColor": "#F94144",
          "letterColor": "#F8F9FA",
          "titleColor": "#6A0572",
          "primaryColorDate": "#1D3557",
          "letterDateColor": "#F4A261",
          "userId": "bcf8df02-e302-489f-a801-0de13925185a",
          "agendaId": "9656ec88-b900-4117-984f-74d2868a2i9b",
          "originalUserFullName": "Nicolas Forero"
        },
        {
          "id": "0j1k2l3m-4567-8901-2345-161718192021",
          "createDate": "2025-01-30T21:15:40.890Z",
          "monthCreated": "January",
          "dayCreated": "30",
          "title": "El amor de Dios",
          "content": "Miren con cuánto amor nos ama nuestro Padre que nos llama sus hijos, ¡y eso es lo que somos! Pero la gente de este mundo no reconoce que somos hijos de Dios, porque no lo conocen a él.",
          "favorite": false,
          "versicle": "1 Juan 3:1",
          "primaryColor": "#F3722C",
          "letterColor": "#F8F1F1",
          "titleColor": "#C72C41",
          "primaryColorDate": "#264653",
          "letterDateColor": "#E9C46A",
          "userId": "bcf8df02-e302-489f-a801-0de13925185a",
          "agendaId": "9656ec88-b900-4117-984f-74d2868a2i9b",
          "originalUserFullName": "Nicolas Forero"
        },
        {
          "id": "1a2b3c4d-5678-9101-1121-314151617181",
          "createDate": "2025-01-03T08:30:10.123Z",
          "monthCreated": "January",
          "dayCreated": "03",
          "title": "Hagan siempre el bien",
          "content": "Y no se olviden de hacer el bien ni de compartir lo que tienen con quienes pasan necesidad. Estos son los sacrificios que le agradan a Dios. -Señor guia mi camino el dia de hoy y ayudame a hacer el bien",
          "favorite": true,
          "versicle": "Hebreos 13:16",
          "primaryColor": "#3E92CC",
          "letterColor": "#FFF8E3",
          "titleColor": "#A7D5F2",
          "primaryColorDate": "#7A5230",
          "letterDateColor": "#F4C95D",
          "userId": "945e80c3-f78d-4805-a4ff-22f26af39d5e",
          "agendaId": "9656ec88-b900-4117-984f-74d2868a2a7c",
          "originalUserFullName": "Nicolas Bustamante"
        },
        {
          "id": "2b3c4d5e-6789-0123-2232-415161718192",
          "createDate": "2025-01-07T11:45:22.456Z",
          "monthCreated": "January",
          "dayCreated": "07",
          "title": "El murio por mi",
          "content": "pero Dios mostró el gran amor que nos tiene al enviar a Cristo a morir por nosotros cuando todavía éramos pecadores.",
          "favorite": true,
          "versicle": "Romanos 5:8",
          "primaryColor": "#FF6F91",
          "letterColor": "#F8F1F1",
          "titleColor": "#FFD166",
          "primaryColorDate": "#B23A48",
          "letterDateColor": "#FFDDE1",
          "userId": "945e80c3-f78d-4805-a4ff-22f26af39d5r",
          "agendaId": "9656ec88-b900-4117-984f-74d2868a2a7c",
          "originalUserFullName": "Alexandra Guarnizo"
        },
        {
          "id": "3c4d5e6f-7890-1234-3343-516171819203",
          "createDate": "2025-01-15T14:20:33.789Z",
          "monthCreated": "January",
          "dayCreated": "15",
          "title": "Hagan siempre el bien",
          "content": "Y no se olviden de hacer el bien ni de compartir lo que tienen con quienes pasan necesidad. Estos son los sacrificios que le agradan a Dios. -Señor guia mi camino el dia de hoy y ayudame a hacer el bien",
          "favorite": true,
          "versicle": "Hebreos 13:16",
          "primaryColor": "#1B4965",
          "letterColor": "#F3E1DD",
          "titleColor": "#5FA8D3",
          "primaryColorDate": "#6B4226",
          "letterDateColor": "#F1A661",
          "userId": "945e80c3-f78d-4805-a4ff-22f26af39d5e",
          "agendaId": "9656ec88-b900-4117-984f-74d2868a2a7c",
          "originalUserFullName": "Nicolas Bustamante"
        },
        {
          "id": "4d5e6f7g-8901-2345-4454-617181920314",
          "createDate": "2025-01-22T19:10:45.345Z",
          "monthCreated": "January",
          "dayCreated": "22",
          "title": "El murio por mi",
          "content": "pero Dios mostró el gran amor que nos tiene al enviar a Cristo a morir por nosotros cuando todavía éramos pecadores.",
          "favorite": true,
          "versicle": "Romanos 5:8",
          "primaryColor": "#E63946",
          "letterColor": "#F8EDEB",
          "titleColor": "#F4A261",
          "primaryColorDate": "#9C1C31",
          "letterDateColor": "#FFC1C1",
          "userId": "945e80c3-f78d-4805-a4ff-22f26af39d5r",
          "agendaId": "9656ec88-b900-4117-984f-74d2868a2a7c",
          "originalUserFullName": "Alexandra Guarnizo"
        },
        {
          "id": "5e6f7g8h-9012-3456-5565-718192031425",
          "createDate": "2025-01-28T23:50:55.678Z",
          "monthCreated": "January",
          "dayCreated": "28",
          "title": "Hagan siempre el bien",
          "content": "Y no se olviden de hacer el bien ni de compartir lo que tienen con quienes pasan necesidad. Estos son los sacrificios que le agradan a Dios. -Señor guia mi camino el dia de hoy y ayudame a hacer el bien",
          "favorite": true,
          "versicle": "Hebreos 13:16",
          "primaryColor": "#457B9D",
          "letterColor": "#EAF4F4",
          "titleColor": "#A8DADC",
          "primaryColorDate": "#5A3E36",
          "letterDateColor": "#E9C46A",
          "userId": "945e80c3-f78d-4805-a4ff-22f26af39d5e",
          "agendaId": "9656ec88-b900-4117-984f-74d2868a2a7c",
          "originalUserFullName": "Nicolas Bustamante"
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
    }
  }
};
</script>

<style scoped></style>
