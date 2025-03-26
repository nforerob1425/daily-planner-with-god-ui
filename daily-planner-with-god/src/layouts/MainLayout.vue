<template>
  <v-app>
    <!-- Barra superior -->
    <v-app-bar color="primary" dark app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      
      <v-spacer></v-spacer>

      <!-- Avatar y menú desplegable -->
      <v-menu v-model:open="menuVisible" offset-y>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props">
            {{ this.fullName }}
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="cerrarSesion">
            <template v-slot:prepend>
              <v-icon>mdi-logout</v-icon>
            </template>
            <v-list-item-title>Cerrar sesión</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Panel desplegable -->
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item v-for="(item, index) in menuItems" :key="index" :to="item.route" active-class="active-item">
          <template v-slot:prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
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
      drawer: false,
      fullName: '',
      menuItems: [
        { title: 'R07', icon: 'mdi-file-document', route: '/planner' },
        { title: 'Ver perfil', icon: 'mdi-account', route: '/profile' },
        { title: 'Configuración', icon: 'mdi-cog', route: '/configuration' },
        { title: 'Dashboard', icon: 'mdi-view-dashboard', route: '/dashboard' },
        { title: 'Contactar', icon: 'mdi-email', route: '/contact' },
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
</style>