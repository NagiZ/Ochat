import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
// import Home from '@/components/Home'
import Room from '@/components/Room'
import Login from '@/components/Login'
import Userinfo from '@/components/Userinfo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/room',
      name: 'Room',
      component: Room
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/userinfo/:name',
      name: 'Userinfo',
      component: Userinfo
    }
  ]
})
