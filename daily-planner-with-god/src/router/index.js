import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true }, // Protección de rutas
    children: [
      { path: 'dashboard', component: () => import('@/views/dashboard.vue') },
      { path: 'planner', component: () => import('@/views/planner.vue') },
      { path: 'configuration', component: () => import('@/views/configuration.vue') },
      { path: 'contact', component: () => import('@/views/contact.vue') },
      { path: 'profile', component: () => import('@/views/profile.vue') },
      { path: 'home', component: () => import('@/views/home.vue') },
      { path: 'petitions', component: () => import('@/views/petitions.vue') },
      { path: 'users', component: () => import('@/views/users.vue') },
      { path: 'application', component: () => import('@/views/application.vue') },
    ],
  },
  {
    path: '/login',
    component: () => import('@/layouts/AuthLayout.vue'),
    meta: { guestOnly: true }, // Solo para no autenticados
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('@/views/login.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard de navegación
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.guestOnly && isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;