
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/torneos', component: () => import('pages/TorneosPage.vue') },
      { path: '/multimedia', component: () => import('pages/MultimediaPage.vue') },
      { path: '/nosotros', component: () => import('pages/AboutPage.vue') },
      { path: '/contacto', component: () => import('pages/ContactPage.vue') }
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
