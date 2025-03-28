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
        <div v-if="user" class="text-body-1">
          ¿Estás seguro que deseas eliminar al usuario:
          <span class="font-weight-bold">{{ user.firstName }} {{ user.lastName }}</span>?
        </div>
        <div v-else class="text-body-1">
          ¿Estás seguro que deseas realizar esta eliminación?
        </div>

        <v-alert
          v-if="user"
          type="warning"
          variant="tonal"
          class="mt-4"
          icon="mdi-alert"
        >
          Esta acción eliminará permanentemente todos los datos asociados al usuario.
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
    user: {
      type: Object,
      default: null
    }
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
