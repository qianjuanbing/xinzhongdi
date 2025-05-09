import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import User from '../views/User.vue'
import Category from '../views/Category.vue'
import Article from '../views/Article.vue'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/user', component: User },
  { path: '/category', component: Category },
  { path: '/article', component: Article },
  // 访问其他路由path
  { path: '/:pathMatch(.*)*', component: Dashboard }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
