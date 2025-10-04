import { createRouter, createWebHistory } from 'vue-router'
import { store } from '@/lib/store'
import { useAdmin } from '@/composables/useAdmin'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { 
      path: '/', 
      component: () => import('../views/posts/AppPosts.vue'),
      meta: { requiresAuth: false }
    },
    { 
      path: '/explore', 
      component: () => import('../views/posts/AppPosts.vue'),
      meta: { requiresAuth: false }
    },
    { 
      path: '/trending', 
      component: () => import('../views/posts/AppPosts.vue'),
      meta: { requiresAuth: false }
    },
    { 
      path: '/login', 
      component: () => import('../views/sign/AppSignIn.vue'),
      meta: { requiresAuth: false, guestOnly: true }
    },
    { 
      path: '/register', 
      component: () => import('../views/sign/AppSignUp.vue'),
      meta: { requiresAuth: false, guestOnly: true }
    },
    { 
      path: '/user/detail/:nick_name', 
      component: () => import('../views/user/AppUserDetail.vue'), 
      props: true,
      meta: { requiresAuth: true }
    },
    { 
      path: '/user/:nick_name', 
      component: () => import('../views/user/AppUser.vue'), 
      props: true,
      meta: { requiresAuth: false }
    },
    { 
      path: '/admin', 
      component: () => import('../views/admin/AppAdmin.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
  ]
 })

export default router

// Guard de navegación para autenticación
router.beforeEach(async (to, from, next) => {
  // Inicializar autenticación si no se ha hecho
  if (!store.state.isAuthenticated && !store.state.isLoading) {
    await store.initializeAuth()
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const guestOnly = to.matched.some(record => record.meta.guestOnly)
  const isAuthenticated = store.state.isAuthenticated
  const currentUser = store.state.user

  // Si la ruta requiere autenticación y el usuario no está autenticado
  if (requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }

  // Si la ruta requiere admin y el usuario no es admin
  if (requiresAdmin) {
    const { isAdmin } = useAdmin()
    if (!isAdmin.value) {
      next('/')
      return
    }
  }

  // Si la ruta es solo para invitados y el usuario está autenticado
  if (guestOnly && isAuthenticated) {
    next('/')
    return
  }

  next()
})

