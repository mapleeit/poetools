import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/craft',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/CraftPage.vue') }]
  },
  {
    path: '/saver',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SaverPage.vue') }]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
