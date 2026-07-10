import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SoftwareDetail from '@/views/SoftwareDetail.vue'
import AddSoftware from '@/views/AddSoftware.vue'

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
  },
  {
    path: '/admin/add',
    name: 'AddSoftware',
    component: AddSoftware
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router