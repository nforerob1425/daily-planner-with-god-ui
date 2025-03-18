import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import account from '@/views/account.vue';
import planner from '@/views/planner.vue';
import configuration from '@/views/configuration.vue';
import contact from '@/views/contact.vue';
import login from '@/views/login.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: 'account', component: account },
      { path: 'planner', component: planner },
      { path: 'configuration', component: configuration },
      { path: 'contact', component: contact },
    ],
  },
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: login,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;