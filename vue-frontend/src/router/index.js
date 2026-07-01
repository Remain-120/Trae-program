import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../views/layout/MainLayout.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/Register.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: MainLayout,
    redirect: '/home',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('../views/Home.vue')
      },
      {
        path: 'knowledge/list',
        name: 'KnowledgeList',
        component: () => import('../views/knowledge/KnowledgeList.vue')
      },
      {
        path: 'knowledge/detail/:id',
        name: 'KnowledgeDetail',
        component: () => import('../views/knowledge/KnowledgeDetail.vue')
      },
      {
        path: 'knowledge/create',
        name: 'KnowledgeCreate',
        component: () => import('../views/knowledge/KnowledgeEdit.vue')
      },
      {
        path: 'knowledge/edit/:id',
        name: 'KnowledgeEdit',
        component: () => import('../views/knowledge/KnowledgeEdit.vue')
      },
      {
        path: 'import',
        name: 'Import',
        component: () => import('../views/Import.vue')
      },
      {
        path: 'graph',
        name: 'Graph',
        component: () => import('../views/graph/Graph.vue')
      },
      {
        path: 'search',
        name: 'Search',
        component: () => import('../views/search/Search.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/settings/Settings.vue')
      },
      {
        path: 'category/manage',
        name: 'CategoryManage',
        component: () => import('../views/category/CategoryManage.vue')
      },
      {
        path: 'tag/manage',
        name: 'TagManage',
        component: () => import('../views/tag/TagManage.vue')
      },
      {
        path: 'help',
        name: 'Help',
        component: () => import('../views/help/Help.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth !== false && !token) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && token) {
    next('/home')
  } else {
    next()
  }
})

export default router
