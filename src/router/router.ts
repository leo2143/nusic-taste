import { createRouter, createWebHashHistory } from 'vue-router'
import AppSignIn from '@/views/sign/AppSignIn.vue'
import AppSignUp from '@/views/sign/AppSignUp.vue'
import AppUserDetail from '@/views/user/AppUserDetail.vue'
import AppPosts from '@/views/posts/AppPosts.vue'



const routes = [

  { path: '/login', component: AppSignIn },
  { path: '/register', component: AppSignUp },
  { path: '/user/:id', component: AppUserDetail, props: true },
  { path: '/posts', component: AppPosts, props: true },
]

const router = createRouter({
  routes,
  history: createWebHashHistory()
})

export default router
