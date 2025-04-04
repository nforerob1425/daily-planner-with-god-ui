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
import { useNotification } from "@kyvg/vue3-notification";

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
  setup() {
    const { notify } = useNotification();
    return { notify };
  },
  methods: {
    ...mapActions(['logout']),
    async cerrarSesion() {
      try {
        await this.logout();
        this.notify({
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión correctamente.',
          type: 'success',
          duration: 2000
        });
        this.$router.push({ path: '/login', query: { redirected: true } });
      } catch (error) {
        this.notify({
          title: 'Error',
          text: 'Error al cerrar sesión.',
          type: 'error',
          duration: 2000
        });
      }
    },
    fetchMenu() {
      api.get('/api/Home')
        .then(response => {
          this.menuItems = response.data?.data || [];
          if(!response.data.success) {
            this.notify({
              title: 'Error',
              text: response.data?.message ||'Error al cargar el menú.',
              type: 'error',
              duration: 2000
            });
          }
        })
        .catch(error => {
          console.error('Error fetching menu:', error);
          if (error.status === 401) {
            this.logout();
          }
          else {
            this.notify({
              title: 'Error',
              text: error.data?.message ||'Error al cargar el menú.',
              type: 'error',
              duration: 2000
            });
          }
        });
    }
  },
  computed: {
    ...mapState(['user'])
  },
  mounted() {
    if(!this.user.permissions.includes("CSHV")){
      this.logout();
    }
    this.fetchMenu();
    this.fullName = `${this.user?.firstName || ''} ${this.user?.lastName || ''}`.trim();
  }
};
</script>

<style scoped>
.custom-app-bar {
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)) 0%, transparent 250%) !important;
}
</style>