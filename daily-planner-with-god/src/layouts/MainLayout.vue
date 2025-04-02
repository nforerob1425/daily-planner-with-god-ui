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

export default {
  name: 'MainLayout',
  data() {
    return {
      menuVisible: false,
      drawer: true,
      fullName: '',
      menuItems: [
        { title: 'Inicio', icon: 'mdi-home', route: '/home' },
        { title: 'Mi R07', icon: 'mdi-book-variant', route: '/planner' },
        { title: 'Peticiones de oración', icon: 'mdi-clipboard-text', route: '/petitions' },
        { title: 'Perfil', icon: 'mdi-account', route: '/profile' },
        { title: 'Configuración', icon: 'mdi-cog', route: '/configuration' },
        { title: 'Solicitudes', icon: 'mdi-gmail', route: '/contact' },
        { title: 'Usuarios', icon: 'mdi-account-multiple-plus', route: '/users' },
        { title: 'Dashboard', icon: 'mdi-view-dashboard', route: '/dashboard' },
        { title: 'Admin. Aplicación', icon: 'mdi-application', route: '/application' },
      ],
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
    }
  },
  computed: {
    ...mapState(['user'])
  },
  mounted() {
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