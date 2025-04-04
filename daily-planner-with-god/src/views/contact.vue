<template>
  <v-container class="contact-container config-view" v-if="dataLoaded">
    <v-slide-y-transition>
      <v-card class="contact-card" elevation="24">
        <div class="card-background"></div>
        
        <v-card-title class="text-h3 text-center mb-6 white--text">
          <v-icon x-large class="mr-3 animate-icon" color="red-darken-3">mdi-gmail</v-icon>
          <span class="font-weight-bold">Envíanos tu solicitud</span>
        </v-card-title>

        <v-form @submit.prevent="sendEmail" class="pa-8" ref="formRef">
          <v-text-field
            v-model="formData.name"
            label="Tu nombre"
            prepend-icon="mdi-account-circle"
            color="blue-lighten-3"
            variant="outlined"
            :rules="[v => !!v || 'El nombre es requerido']"
            class="animate-field"
          ></v-text-field>

          <v-text-field
            v-model="formData.subject"
            label="Asunto"
            prepend-icon="mdi-form-textbox"
            color="blue-lighten-3"
            variant="outlined"
            :rules="[v => !!v || 'El asunto es requerido']"
            class="animate-field"
          ></v-text-field>

          <v-textarea
            v-model="formData.message"
            label="Mensaje"
            prepend-icon="mdi-message-alert"
            color="blue-lighten-3"
            counter
            variant="outlined"
            rows="5"
            no-resize
            :rules="[
              v => !!v || 'El mensaje es requerido',
              v => (v && v.length <= 500) || 'Máximo 500 caracteres'
            ]"
            class="animate-field"
          ></v-textarea>

          <v-btn 
            type="submit"
            color="light-blue-accent-4"
            x-large
            block
            class="mt-6 send-btn"
            :disabled="!formValid"
            depressed
          >
            <span class="btn-text mr-3">Enviar Mensaje</span>
            <v-icon right class="send-icon">mdi-send-clock</v-icon>
          </v-btn>
        </v-form>
      </v-card>
    </v-slide-y-transition>
  </v-container>
  <v-progress-circular
      v-else
      indeterminate
      color="primary"
      size="64"
      class="loading-spinner"
    />
</template>

<script>
import api from '@/plugins/axios';
import { mapActions, mapState } from 'vuex';
import { useNotification } from "@kyvg/vue3-notification";

export default {
  name: 'contact-view',
  data: () => ({
    dataLoaded: false,
    emailDestination: '',
    appConfigs:[],
    formData: {
      name: '',
      subject: '',
      message: ''
    },
  }),
  setup() {
    const { notify } = useNotification();
    return { notify };
  },
  computed: {
    ...mapState(['user']),
    formValid() {
      return (
        this.formData.name &&
        this.formData.subject &&
        this.formData.message
      )
    }
  },
  methods: {
    ...mapActions(['logout']),
    async sendEmail() {
      const { valid } = await this.$refs.formRef.validate();
      if (!valid) return; 

      const destinatario = this.emailDestination;
      const asunto = encodeURIComponent(this.formData.subject)
      const cuerpo = encodeURIComponent(
        `Buen día,\n Mi nombre es: ${this.formData.name}\n Mi solicitud es:\n\n${this.formData.message}`
      )

      const mailtoLink = `mailto:${destinatario}?subject=${asunto}&body=${cuerpo}`
      
      window.open(mailtoLink, '_blank', 'noopener,noreferrer')
      this.notify({
          title: 'Éxito',
          text: 'Cliente de correo abierto correctamente.',
          type: 'success',
          duration: 2000
        });
      this.resetForm();
      
    },

    resetForm() {
      this.$refs.formRef.reset();
      this.$refs.formRef.resetValidation();
      this.formData = {
        name: '',
        subject: '',
        message: ''
      };
    },
    async fetchConfigs() {
      try {
        const response = await api.get('/api/AppAdministration/appConfigs');

        if(!response.data.success) {
          this.notify({
            title: 'Error',
            text: 'Error al cargar las configuraciones del sistema.',
            type: 'error',
            duration: 2000
          });
          console.error(response.data?.message);
        }
        else{
          this.appConfigs = response.data?.data || [];
          const result = this.appConfigs.find(item => item.name === "SupportEmail");
          this.emailDestination = result?.value
        }
      } catch (error) {
        if (error.status === 401) {
          this.logout();
        }
        this.notify({
          title: 'Error',
          text: error.message ||'Error al procesar la peticion.',
          type: 'error',
          duration: 2000
        });
      }
    },
  },
  async mounted() {
    if(!this.user.permissions.includes('CSEV')){
      this.logout();
    }
    await this.fetchConfigs();
    this.dataLoaded = true;
  }
}
</script>

<style scoped>
.contact-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
}

.contact-card {
  width: 90%;
  max-width: 800px;
  border-radius: 25px;
  position: relative;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.95);
}

.contact-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.animate-icon {
  animation: icon-float 3s ease-in-out infinite;
}

.animate-field {
  transition: all 0.3s ease;
  transform: translateY(0);
}

.animate-field:hover {
  transform: translateY(-2px);
}

.send-btn {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 1.5px;
  position: relative;
  overflow: hidden;
}

.send-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: 0.5s;
}

.send-btn:hover::before {
  left: 100%;
}

.send-btn:hover .send-icon {
  transform: translateX(5px) rotate(360deg);
}

.send-icon {
  transition: all 0.4s ease;
}

@keyframes icon-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.v-text-field:deep() .v-input__control {
  margin: 16px 0;
}

.v-card__title {
  z-index: 1;
  padding: 40px 0 20px !important;
}

</style>