import { useUserStore } from '../stores/user'

const requireAuth = async (to, from, next) => {
  const userStore = useUserStore();
  userStore.loadingSession = true;
  userStore.user = await userStore.currentUser()
  // const user = await userStore.currentUser();
  if (userStore.user) {
    next()
  } else {
    next('/login')
  }
  userStore.loadingSession = false;
}

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/login', component: () => import('pages/LoginPage.vue') },
      { path: '/torneos', component: () => import('pages/TorneosPage.vue') },
      { path: '/multimedia', component: () => import('pages/MultimediaPage.vue') },
      { path: '/nosotros', component: () => import('pages/AboutPage.vue') },
      { path: '/contacto', component: () => import('pages/ContactPage.vue'), beforeEnter: requireAuth}
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
