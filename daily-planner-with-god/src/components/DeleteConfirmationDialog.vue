<template>
  <v-dialog
    :model-value="show"
    @update:modelValue="val => $emit('update:show', val)"
    max-width="500"
  >
    <v-card>
      <v-card-title class="bg-error pa-4">
        <v-icon icon="mdi-alert-circle-outline" class="mr-2"></v-icon>
        <span class="text-h5">Confirmar eliminación</span>
      </v-card-title>

      <v-card-text class="pa-6">
        <div class="text-body-1">
          ¿Estás seguro que deseas realizar esta eliminación?
        </div>

        <v-alert
          v-if="entity"
          type="warning"
          variant="tonal"
          class="mt-4"
          icon="mdi-alert"
        >
          <span v-if="entityName == 'usuario'">
            Esta acción eliminará permanentemente <b>TODOS</b> los datos asociados al usuario (Tarjetas, Notas, Anuncios) y si es lider se desacoplará de sus ovejas.
          </span>
          <span v-else>
            Esta accion eliminará permanentemente los datos {{ this.entityName }}.
          </span>
        </v-alert>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          color="secondary"
          variant="tonal"
          @click="$emit('update:show', false)"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          @click="confirmDelete"
          class="ml-4"
        >
          Eliminar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    entity: {
      type: Object,
      default: null
    },
    entityName: {
      type: String,
      default: ''
    },
  },
  
  emits: ['update:show', 'confirm'],
  
  methods: {
    confirmDelete() {
      this.$emit('confirm')
      this.$emit('update:show', false)
    }
  }
}
</script>

<style scoped>
.bg-error {
  background-color: rgb(var(--v-theme-error));
  color: white;
}

.v-card-text {
  line-height: 1.75;
}
</style>
