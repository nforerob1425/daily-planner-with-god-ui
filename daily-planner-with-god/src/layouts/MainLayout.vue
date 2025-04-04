<template>
  <v-app>
    <!-- Barra superior -->
    <v-app-bar color="primary" app class="custom-app-bar">
      <v-app-bar-title>Bienvenido {{ this.fullName }} </v-app-bar-title>
    </v-app-bar>

    <!-- Panel desplegable -->
    <v-navigation-drawer v-model="drawer" app expand-on-hover rail class="mr-2 pr-2">
      <v-list>
        <v-list-item v-for="(item, index) in menuItems" :key="index" :to="item.route"  active-class="active-item">
          <template v-slot:prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="cerrarSesion()">
          <template v-slot:prepend>
            <v-icon>mdi-logout</v-icon>
          </template>
          <v-list-item-title>Cerrar sesion</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view></router-view>
      <notifications position="top right" class="notification-card"/>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import api from '@/plugins/axios';

export default {
  name: 'MainLayout',
  data() {
    return {
      menuVisible: false,
      drawer: true,
      fullName: '',
      menuItems: [],
    };
  },
  methods: {
    ...mapActions(['logout']),
    async cerrarSesion() {
      try {
        await this.logout();
        this.$router.push({ path: '/login', query: { redirected: true } });
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Ocurrió un error al cerrar la sesión');
      }
    },
    fetchMenu() {
      api.get('/api/Home')
        .then(response => {
          this.menuItems = response.data?.data || [];
        })
        .catch(error => {
          console.error('Error fetching menu:', error);
          if (error.response.status === 401) {
            this.logout();
          }
        });
    }
  },
  computed: {
    ...mapState(['user'])
  },
  mounted() {
    this.fetchMenu();
    this.fullName = `${this.user?.firstName || ''} ${this.user?.lastName || ''}`.trim();
  }
};
</script>

<style scoped>
.notification-card {
  width: 500px !important;
  top: 10px !important;
  right: 10px !important;
  font-size: 20px !important;
}
.custom-app-bar {
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)) 0%, transparent 250%) !important;
}
</style>