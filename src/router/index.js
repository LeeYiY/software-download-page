import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SoftwareDetail from '@/views/SoftwareDetail.vue'
import Login from '@/views/Login.vue'
import Admin from '@/views/Admin.vue'
import AddSoftware from '@/views/AddSoftware.vue'
import EditSoftware from '@/views/EditSoftware.vue'
import { api } from '@/utils/api'

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
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { public: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requireAuth: true }
  },
  {
    path: '/admin/add',
    name: 'AddSoftware',
    component: AddSoftware,
    meta: { requireAuth: true }
  },
  {
    path: '/admin/edit/:id',
    name: 'EditSoftware',
    component: EditSoftware,
    props: true,
    meta: { requireAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫：管理页面需要登录
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth && !api.isLoggedIn()) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
