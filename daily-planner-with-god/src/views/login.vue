<template>
  <v-container class="fill-height" fluid>
    <v-card class="login-card" elevation="12">
      <v-row no-gutters>
        <v-col cols="12" md="6" class="hidden-sm-and-down">
          <v-img
            src="/assets/backgrounds/login.jpg"
            height="100% !important"
            cover
            class="img-animate"
          ></v-img>
        </v-col>

        <v-col cols="12" md="6" class="form-col">
          <v-form @submit.prevent="handleLogin" ref="loginForm" class="pa-8">
            <div class="text-center mb-8">
              <v-card-title class="text-h3 text-primary mb-2">Bienvenido</v-card-title>
              <v-card-subtitle class="text-body-1">Ingresa tus credenciales</v-card-subtitle>
            </div>

            <v-text-field
              v-model="username"
              label="Usuario"
              variant="outlined"
              prepend-inner-icon="mdi-account"
              density="comfortable"
              color="primary"
              class="mb-4"
              :rules="usernameRules"
              :error="authError"
              :error-messages="authError ? 'Credenciales incorrectas' : ''"
              @input="clearErrors"
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Contraseña"
              :type="showPassword ? 'text' : 'password'"
              variant="outlined"
              prepend-inner-icon="mdi-lock"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              density="comfortable"
              color="primary"
              class="mb-4"
              :rules="passwordRules"
              :error="authError"
              :error-messages="authError ? 'Credenciales incorrectas' : ''"
              @click:append-inner="showPassword = !showPassword"
              @input="clearErrors"
            ></v-text-field>

            <v-checkbox
              v-model="rememberUser"
              label="Recordar usuario"
              color="primary"
              density="comfortable"
              hide-details
            ></v-checkbox>

            <v-btn
              type="submit"
              color="primary"
              block
              class="mt-8"
              variant="flat"
              size="x-large"
              :loading="loading"
            >
              Ingresar
            </v-btn>

            <v-snackbar
              v-model="showError"
              color="error"
              location="top"
              timeout="4000"
            >
              Credenciales incorrectas. Por favor verifica tus datos
            </v-snackbar>
          </v-form>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { useCookies } from "vue3-cookies";
import { mapActions } from 'vuex';

export default {
  name: 'login-view',
  
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },

  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
      rememberUser: false,
      loading: false,
      authError: false,
      showError: false,
      usernameRules: [
        v => !!v || 'El usuario es requerido'
      ],
      passwordRules: [
        v => !!v || 'La contraseña es requerida'
      ]
    };
  },

  created() {
    const savedUser = this.cookies.get('rememberedUser');
    if (savedUser) {
      this.username = savedUser;
      this.rememberUser = true;
    }
  },

  methods: {
    ...mapActions(['login']),
    
    clearErrors() {
      this.authError = false;
      this.showError = false;
      this.$refs.loginForm.validate();
    },
    
    async handleLogin() {
      this.authError = false;
      this.showError = false;
      
      if (!this.$refs.loginForm.validate()) return;

      this.loading = true;
      
      try {
        await this.login({
          username: this.username,
          password: this.password
        });

        if (this.rememberUser) {
          this.cookies.set('rememberedUser', this.username, '30d');
        } else {
          this.cookies.remove('rememberedUser');
        }
        
        this.$router.push('/');
      } catch (error) {
        if (error.response?.status === 401) {
          this.authError = true;
          this.showError = true;
          this.$refs.loginForm.validate();
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
  background: linear-gradient(45deg, rgb(var(--v-theme-surface)), rgb(var(--v-theme-background)));
}

.login-card {
  width: 100%;
  max-width: 1200px;
  border-radius: 24px !important;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.login-card-hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

.form-col {
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.img-animate {
  transition: transform 0.4s ease;
}

.img-animate:hover {
  transform: scale(1.03);
}

.field-animate {
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}

.field-animate:focus-within {
  transform: translateY(-2px);
}

.checkbox-animate {
  transition: transform 0.2s ease;
}

.checkbox-animate:hover {
  transform: scale(1.05);
}

.btn-animate {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.05em;
}

.btn-animate:hover {
  letter-spacing: 0.1em;
  transform: translateY(-2px);
}

@media (max-width: 960px) {
  .form-col {
    padding: 32px;
    min-height: 100vh;
  }

  .login-card {
    border-radius: 0 !important;
    box-shadow: none !important;
  }
}

@media (max-width: 600px) {
  .form-col {
    padding: 24px;
  }

  .text-h3 {
    font-size: 2rem !important;
  }
}
</style>