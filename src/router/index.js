import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SoftwareDetail from '@/views/SoftwareDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/category/:cat',
    name: 'Category',
    component: HomeView
  },
  {
    path: '/software/:id',
    name: 'SoftwareDetail',
    component: SoftwareDetail,
    props: true
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router