<template>
    <v-app>
         <!-- Barra superior -->
        <v-app-bar color="primary" dark app>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>Mi Aplicación</v-toolbar-title>
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
            <v-list-item
                v-for="(item, index) in menuItems"
                :key="index"
                :to="item.route"
            >
                <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            </v-list>
        </v-navigation-drawer>
    
        <!-- Área de contenido dinámico -->
        <v-main>
            <router-view></router-view>
        </v-main>
    </v-app>
  </template>
  
  <script>
  export default {
    name: 'MainLayout',
    data() {
      return {
        menuVisible: false,
        drawer: false, // Controla la visibilidad del drawer
        menuItems: [
          { title: 'Cuenta', icon: 'mdi-account', route: '/account' },
          { title: 'R07', icon: 'mdi-file-document', route: '/planner' },
          { title: 'Configuración', icon: 'mdi-cog', route: '/configuration' },
          { title: 'Contactar', icon: 'mdi-email', route: '/contact' },
        ],
      };
    },
    methods: {
      cambiarContraseña() {
        alert('Cambiar contraseña');
        // Aquí puedes redirigir a una vista o abrir un diálogo
      },
      cerrarSesion() {
        alert('Cerrar sesión');
        // Aquí puedes implementar la lógica para cerrar sesión
      },
    },
  };
  </script>
  
  <style scoped>
  /* Asegúrate de que el menú esté por encima de otros elementos */
  .v-menu__content {
    z-index: 1000;
  }
  </style>