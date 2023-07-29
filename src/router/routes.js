import { useUserStore } from '../stores/user'

const requireAuth = async (to, from, next) => {
  const userStore = useUserStore();
  userStore.loadingSession = true;
  userStore.user = await userStore.currentUserLog()

  if (!userStore.user) {
    next('/login')
  } else {
    await userStore.currentUserLog();
    next()
  }

  userStore.loadingSession = false;
}

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'multimedia', component: () => import('pages/MultimediaPage.vue') },
      { path: 'nosotros', component: () => import('pages/AboutPage.vue') },
      { path: 'contacto', component: () => import('pages/ContactPage.vue'), beforeEnter: requireAuth },
      { path: 'denuncias', component: () => import('pages/DenunciaPage.vue'), beforeEnter: requireAuth },
      { path: 'mi-cuenta', component: () => import('pages/MiCuentaPage.vue'), beforeEnter: requireAuth },
      { path: 'torneo/:id', name: 'torneo', component: () => import('pages/TorneoPage.vue') },
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
