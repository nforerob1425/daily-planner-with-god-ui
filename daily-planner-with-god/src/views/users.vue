<template>
  <v-container fluid class="animated-container config-view">
    <!-- Sección de Listado -->
    <v-row>
      <v-col cols="12" class="ml-9 mr-9 mt-9">
        <v-card elevation="4" class="rounded-lg mb-4 floating-card">
          <v-card-title class="bg-primary pa-4 header-gradient">
            <v-icon color="white" class="mr-3 pb-3">mdi-account-multiple</v-icon>
            <span class="text-h4 text-white">Listado de Usuarios</span>            
          </v-card-title>

          <v-card-text>
            <v-row class="mb-4 mt-4">
              <v-col cols="12" >
                <v-text-field
                  v-model="searchTerm"
                  label="Buscar por nombre"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  clearable
                  color="primary"
                  class="ml-4"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn
                  color="secondary"
                  prepend-icon="mdi-plus"
                  variant="tonal"
                  @click="handleNewUser"
                  class="ml-4"
                >
                  Nuevo Usuario
                </v-btn>
              </v-col>
            </v-row>

            <v-list lines="two" class="user-list">
              <transition-group name="slide-y-transition" tag="div">
                <template v-if="isLoading">
                  <v-skeleton-loader
                    v-for="n in itemsPerPage"
                    :key="n"
                    type="list-item-avatar-two-line"
                    class="mb-4"
                  ></v-skeleton-loader>
                </template>

                <template v-else>
                  <div v-for="user in paginatedUsers" :key="user.id">
                    <v-hover v-slot="{ isHovering, props }">
                      <v-list-item
                        v-bind="props"
                        :class="{ 'bg-grey-lighten-3': isHovering }"
                        @click="selectUser(user)"
                        class="mb-2 user-item"
                      >
                        <template v-slot:prepend>
                          <v-avatar :color="user.isMale ? 'blue' : 'pink'" size="48">
                            <span class="text-h6">{{ user.firstName?.charAt(0) }}{{ user.lastName?.charAt(0) }}</span>
                          </v-avatar>
                        </template>

                        <v-list-item-title class="text-h6">
                          {{ user.firstName }} {{ user.lastName }}
                          <v-chip
                            size="small"
                            class="ml-2"
                            :color="getRoleColor(user.roleId)"
                          >
                            {{ getUserRole(user.roleId) }}
                          </v-chip>
                        </v-list-item-title>
                        <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>

                        <template v-slot:append>
                          <v-btn
                            icon
                            color="error"
                            variant="text"
                            @click.stop="confirmDelete(user)"
                            class="delete-btn"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </template>
                      </v-list-item>
                    </v-hover>
                    <v-divider class="my-2"></v-divider>
                  </div>
                </template>
              </transition-group>
            </v-list>

            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              :total-visible="5"
              rounded="circle"
              color="primary"
              class="mt-4"
            ></v-pagination>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Sección de Formulario -->
    <v-row>
      <v-col cols="12" class="ml-9 mr-9 mb-9">
        <v-slide-y-transition>
          <v-card elevation="4" class="rounded-lg floating-card" ref="formCard">
            <v-card-title class="bg-primary pa-4 header-gradient">
              <v-icon color="white" class="mr-3 pb-3">mdi-account-edit</v-icon>
              <span class="text-h4 text-white">
                {{ isEditing ? 'Editar Usuario' : 'Nuevo Usuario' }}
              </span>
              
            </v-card-title>

            <v-card-text>
              <v-form @submit.prevent="saveUser" ref="form" lazy-validation>
                <v-container>
                  <v-row v-if="isEditing">
                    <v-col cols="12" class="mt-4">
                      <v-text-field
                        v-model="form.id"
                        label="ID"
                        variant="outlined"
                        readonly
                        disabled 
                        density="compact"
                        color="primary"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" class="mt-4">
                      <v-text-field
                        v-model="form.firstName"
                        label="Nombre"
                        :rules="[required]"
                        variant="outlined"
                        density="comfortable"
                        color="primary"
                        validate-on="blur"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <v-text-field
                        v-model="form.lastName"
                        label="Apellido"
                        :rules="[required]"
                        variant="outlined"
                        density="comfortable"
                        color="primary"
                        validate-on="blur"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <v-text-field
                        v-model="form.email"
                        label="Email"
                        :rules="[required, emailRule]"
                        variant="outlined"
                        density="comfortable"
                        color="primary"
                        validate-on="blur"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <v-text-field
                        v-model="form.username"
                        label="Nombre de usuario"
                        :rules="[required, usernameRule, uniqueUsername]"
                        variant="outlined"
                        density="comfortable"
                        :readonly="isEditing"
                        color="primary"
                        validate-on="blur"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <v-radio-group
                        v-model="form.isMale"
                        label="Género"
                        inline
                        @update:model-value="this.form.leadId = null"
                      >
                        <v-radio
                          label="Masculino"
                          :value="true"
                          color="blue"
                        ></v-radio>
                        <v-radio
                          label="Femenino"
                          :value="false"
                          color="pink"
                        ></v-radio>
                      </v-radio-group>
                    </v-col>

                    <v-col cols="12">
                      <v-select
                        v-model="form.roleId"
                        :items="roles"
                        item-title="name"
                        item-value="id"
                        label="Rol"
                        :rules="[required]"
                        variant="outlined"
                        color="primary"
                        @update:model-value="handleRoleChange"
                        validate-on="blur"
                      >
                        <template v-slot:item="{ props, item }">
                          <v-list-item
                            v-bind="props"
                            :title="item.raw.name"
                            :subtitle="`Escala: ${item.raw.scale}`"
                          ></v-list-item>
                        </template>
                      </v-select>
                    </v-col>

                    <v-col cols="12">
                      <v-autocomplete
                        v-model="form.leadId"
                        :items="leadSearchResults"
                        item-title="combinedName"
                        item-value="id"
                        label="Líder"
                        :loading="leadLoading"
                        variant="outlined"
                        clearable
                        :disabled="!selectedRoleScale"
                        color="primary"
                        @update:search="searchLeads"
                      >
                        <template v-slot:item="{ props, item }">
                          <v-list-item
                            v-bind="props"
                            :title="item.raw.combinedName"
                            :subtitle="`${item.raw.role?.name} (Escala ${item.raw.role?.scale})`"
                          ></v-list-item>
                        </template>
                      </v-autocomplete>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" class="text-right">
                      <v-btn
                        color="secondary"
                        variant="tonal"
                        class="mr-2"
                        @click="clearForm"
                      >
                        Cancelar
                      </v-btn>
                      <v-btn
                        type="submit"
                        color="primary"
                        variant="tonal"
                        :loading="isSaving"
                      >
                        {{ isEditing ? 'Guardar' : 'Crear' }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>
          </v-card>
        </v-slide-y-transition>
      </v-col>
    </v-row>

    <!-- Diálogo de Confirmación -->
    <delete-confirmation-dialog
      v-model:show="deleteDialog"
      :user="selectedUser"
      @confirm="deleteUser"
    ></delete-confirmation-dialog>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="bottom right"
      :timeout="3000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script>
import api from '@/plugins/axios';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog.vue';

export default {
  name: 'users-view',
  components: { DeleteConfirmationDialog },
  data() {
    return {
      searchTerm: '',
      currentPage: 1,
      itemsPerPage: 10,
      isLoading: false,
      deleteDialog: false,
      selectedUser: null,
      leadSearchTerm: '',
      leadLoading: false,
      leadSearchResults: [],
      selectedRoleScale: null,

      users: [],
      roles: [],
      isEditing: false,
      isSaving: false,
      form: {
        id: null,
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        roleId: null,
        leadId: null,
        isMale: true,
      },
      snackbar: {
        show: false,
        message: '',
        color: 'success',
      },
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => 
        `${user.firstName} ${user.lastName} ${user.username}`.toLowerCase().includes(this.searchTerm.toLowerCase()))
    },
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.itemsPerPage)
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredUsers.slice(start, end)
    },
    required() {
      return v => !!v || 'Campo requerido'
    },
    emailRule() {
      return v => /.+@.+\..+/.test(v) || 'Email inválido'
    },
    usernameRule() {
      return v => !/\s/.test(v) || 'El nombre de usuario no puede contener espacios';
    },
    
    uniqueUsername() {
      return v => {
        const existingUser = this.users.find(user => 
          user.username.toLowerCase() === v.toLowerCase() && 
          user.id !== this.form.id
        );
        return !existingUser || 'Este nombre de usuario ya está en uso';
      };
    }
  },
  async mounted() {
    await this.initializeData();
  },
  methods: {
    async initializeData() {
      this.isLoading = true;
      try {
        await this.fetchRoles();
        await this.fetchUsers();
      } finally {
        this.isLoading = false;
      }
    },

    async fetchUsers() {
      try {
        const response = await api.get('/api/Users');
        this.users = response.data.data.map(user => ({
          ...user,
          role: this.roles.find(r => r.id === user.roleId),
          combinedName: `${user.firstName} ${user.lastName}` // Nueva propiedad
        }));
      } catch (error) {
        console.error('Error fetching items:', error);
        if (error.response.status === 401) {
          this.logout();
        }
       }
    },

    async fetchRoles() {
      try {
        const response = await api.get('/api/Rol');
        this.roles = response.data.data.sort((a, b) => a.scale - b.scale);
      } catch (error) {
        console.error('Error fetching items:', error);
        if (error.response.status === 401) {
          this.logout();
        }
       }
    },

    getRoleColor(roleId) {
      const role = this.roles.find(r => r.id === roleId);
      if (!role) return 'grey';
      return role.scale === 100 ? 'red' : 'teal';
    },

    getUserRole(roleId) {
      return this.roles.find(r => r.id === roleId)?.name || 'Sin rol';
    },

    handleRoleChange(roleId) {
      const selectedRole = this.roles.find(r => r.id === roleId);
      this.selectedRoleScale = selectedRole?.scale;
      this.form.leadId = null;
      this.leadSearchTerm = '';

      const targetScale = this.selectedRoleScale + 1;
      const filteredUsers = this.users.filter(user => {
        const userRole = this.roles.find(r => r.id === user.roleId);
        return userRole?.scale === targetScale && 
              user.id !== this.form.id &&
              user.isMale === this.form.isMale;
      });

      const sortedUsers = filteredUsers.sort((a, b) => {
        const nameA = a.combinedName.toUpperCase();
        const nameB = b.combinedName.toUpperCase();
        return nameA.localeCompare(nameB);
      });

      this.leadSearchResults = sortedUsers.map(u => ({
        ...u,
        combinedName: `${u.firstName} ${u.lastName}`
      }));
    },

    searchLeads(search) {
      if (!this.selectedRoleScale) {
        this.leadSearchResults = [];
        return;
      }
      
      this.leadLoading = true;
      const targetScale = this.selectedRoleScale + 1;
      const searchTerm = (search || '').toLowerCase().trim();

      const filteredUsers = this.users.filter(user => {
        const userRole = this.roles.find(r => r.id === user.roleId);
        return userRole?.scale === targetScale && 
              user.combinedName.toLowerCase().includes(searchTerm) &&
              user.id !== this.form.id &&
              user.isMale === this.form.isMale;
      });

      const sortedUsers = filteredUsers.sort((a, b) => {
        const nameA = a.combinedName.toUpperCase();
        const nameB = b.combinedName.toUpperCase();
        return nameA.localeCompare(nameB);
      });

      this.leadSearchResults = sortedUsers.map(u => ({
        ...u,
        combinedName: `${u.firstName} ${u.lastName}`
      }));
      
      this.leadLoading = false;
    },

    selectUser(user) {
      this.isEditing = true;
      this.form = { 
        ...user, 
        isMale: user.isMale 
      };
      
      const selectedRole = this.roles.find(r => r.id === user.roleId);
      this.selectedRoleScale = selectedRole?.scale;


      const targetScale = this.selectedRoleScale + 1;

      const filteredUsers = this.users.filter(user => {
        const userRole = this.roles.find(r => r.id === user.roleId);
        return userRole?.scale === targetScale && 
              user.id !== this.form.id &&
              user.isMale === this.form.isMale;
      });

      const sortedUsers = filteredUsers.sort((a, b) => {
        const nameA = a.combinedName.toUpperCase();
        const nameB = b.combinedName.toUpperCase();
        return nameA.localeCompare(nameB);
      });

      this.leadSearchResults = sortedUsers.map(u => ({
        ...u,
        combinedName: `${u.firstName} ${u.lastName}`
      }));

      this.$refs.form.resetValidation();
    },

    handleNewUser() {
      this.clearForm();
      this.$nextTick(() => {
        if (this.$refs.formCard?.$el) {
          this.$refs.formCard.$el.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    },

    confirmDelete(user) {
      this.selectedUser = user;
      this.deleteDialog = true;
    },

    async deleteUser() {
      try {
        await api.delete(`/api/Users/${this.selectedUser.id}`);
        this.showSuccess('Usuario eliminado exitosamente');
        await this.fetchUsers();
      } catch (error) {
        console.error('Error fetching items:', error);
        if (error.response.status === 401) {
          this.logout();
        }
       } finally {
        this.deleteDialog = false;
        this.selectedUser = null;
      }
    },

    async saveUser() {
      if (!this.$refs.form.validate()) return;
      
      this.isSaving = true;
      try {
        const payload = {
          ...this.form,
        };

        this.isEditing 
          ? await api.put(`/api/Users/${this.form.id}`, payload)
          : await api.post('/api/Users', payload);
        await this.fetchUsers();
        this.clearForm();
      } catch (error) {
        console.error('Error fetching items:', error);
        if (error.response.status === 401) {
          this.logout();
        }
       } finally {
        this.isSaving = false;
      }
    },

    clearForm() {
      this.form = {
        id: '',
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        roleId: null,
        leadId: null,
        isMale: true,
      };
      this.isEditing = false;
      this.selectedRoleScale = null;
      this.$refs.form.resetValidation();
    },

    showSuccess(message) {
      this.snackbar = {
        show: true,
        message,
        color: 'success'
      };
    },

    showError(message) {
      this.snackbar = {
        show: true,
        message,
        color: 'error'
      };
    }
  }
};
</script>

<style scoped>
.animated-container {
  animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
}

@keyframes slideIn {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.header-gradient {
  background: linear-gradient(135deg, rgba(30, 144, 255, 1) 0%, rgba(75, 0, 130, 0.9) 100%);
}

.floating-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 12px 24px rgba(30, 144, 255, 0.15);
}

.floating-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(30, 144, 255, 0.2);
}

.user-item {
  transition: all 0.3s ease;
  border-radius: 8px;
}

.user-item:hover {
  background-color: rgba(30, 144, 255, 0.05);
  transform: translateX(5px);
}

.delete-btn {
  transition: transform 0.2s ease;
}

.delete-btn:hover {
  transform: scale(1.2);
}

.user-list {
  max-height: 70vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.v-chip {
  font-size: 0.75rem;
  height: 22px;
}

.slide-y-transition-enter-active,
.slide-y-transition-leave-active {
  transition: all 0.3s ease;
}

.slide-y-transition-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-y-transition-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.v-col-12 {
    flex: 0 1 100%;
    max-width: 100%;
}
</style>