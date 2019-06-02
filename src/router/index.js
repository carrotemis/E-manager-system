import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home/Home'
import Login from '@/components/login/Login'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import User from '../components/user/user'
Vue.use(Router)
Vue.use(ElementUI);

axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

const Authorization = window.sessionStorage.getItem('token')
axios.defaults.headers.common['Authorization'] = Authorization;
Vue.prototype.$http = axios
const router = new Router({
  routes: [
    {
      redirect: '/login',
      path: "/"
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/user',
          name: 'User',
          component: User,

        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

router.beforeEach((to, from, next) => {
  // ...
  const token = sessionStorage.getItem('token')
  // 1. 如果访问的是登录页，则直接放行；
  // 2. 如果访问的不是登录页，则 判断是否有token
  // 3. 如果有 token，直接放行
  // 4. 如果没有 token， 则强制跳转到 登录页
  if (to.path === '/login') return next()
  if (token) return next()
  next('/login')
})
export default router