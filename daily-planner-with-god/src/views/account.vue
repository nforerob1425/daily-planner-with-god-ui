<template>
  <v-container>
    <!-- Botón para abrir el primer diálogo -->
    <v-btn @click="dialog1 = true">Abrir Primer Popup</v-btn>

    <!-- Primer Diálogo -->
    <v-dialog v-model="dialog1" max-width="400" fullscreen>
      <v-card>
        <v-card-title>Primer Popup</v-card-title>
        <v-card-text>
          Contenido del primer popup.
          <v-btn @click="dialog2 = true">Abrir Segundo Popup</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog1 = false">Cerrar</v-btn>
        </v-card-actions>

        <!-- Segundo Diálogo dentro del Primero -->
        <v-dialog v-model="dialog2" max-width="300" class="custom-dialog">
          <v-card>
            <v-card-title>Segundo Popup</v-card-title>
            <v-card-text>Contenido del segundo popup.</v-card-text>
            <v-card-actions>
              <v-btn @click="dialog2 = false">Cerrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'account-view',
  data: () => ({
    dialog1: false,
    dialog2: false,
  }),
};
</script>

<style scoped>
.custom-dialog {
  z-index: 3000 !important;
}
</style>