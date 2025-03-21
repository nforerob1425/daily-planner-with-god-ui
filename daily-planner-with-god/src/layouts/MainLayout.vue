<template>
  <v-app>
    <!-- Barra superior -->
    <v-app-bar color="primary" dark app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Mi tiempo con Dios</v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- Avatar y menú desplegable -->
      <v-menu v-model:open="menuVisible" offset-y>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar color="secondary" size="40">
              <v-icon dark>mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="cambiarContraseña">
              <v-list-item-title>Cambiar contraseña</v-list-item-title>
          </v-list-item>
          <v-list-item @click="cerrarSesion">
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
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'MainLayout',
  data() {
    return {
      menuVisible: false,
      drawer: false,
      menuItems: [
        { title: 'Cuenta', icon: 'mdi-account', route: '/account' },
        { title: 'R07', icon: 'mdi-file-document', route: '/planner' },
        { title: 'Configuración', icon: 'mdi-cog', route: '/configuration' },
        { title: 'Contactar', icon: 'mdi-email', route: '/contact' },
      ],
    };
  },
  methods: {
    ...mapActions(['logout']),
    
    cambiarContraseña() {
      alert('Cambiar contraseña');
    },
    
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
};
</script>

<style scoped>

</style>