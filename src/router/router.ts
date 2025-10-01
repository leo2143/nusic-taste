import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [
  // { path: '/', component: Home },
  // { path: '/chat', component: Chat },
  // { path: '/iniciar-sesion', component: Login },
  // { path: '/registro', component: Register }
]

const router = createRouter({
  routes,
  history: createWebHashHistory()
})

export default router
