import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SoftwareDetail from '@/views/SoftwareDetail.vue'
import Admin from '@/views/Admin.vue'
import AddSoftware from '@/views/AddSoftware.vue'
import EditSoftware from '@/views/EditSoftware.vue'

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
    path: '/admin',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/admin/add',
    name: 'AddSoftware',
    component: AddSoftware
  },
  {
    path: '/admin/edit/:id',
    name: 'EditSoftware',
    component: EditSoftware,
    props: true
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
