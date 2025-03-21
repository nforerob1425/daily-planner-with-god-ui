import { createApp } from 'vue'
import App from './App.vue'
import store from './store';
import router from './router';
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import "@/assets/styles.scss";

loadFonts();

const authData = localStorage.getItem('authData');
if (authData) {
  const parsedData = JSON.parse(authData);
  store.commit('SET_USER_DATA', parsedData);
}

createApp(App)
  .use(vuetify)
  .use(router)
  .use(store)
  .mount('#app');