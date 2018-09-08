import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import User from '@/views/user/User.vue'
import Role from '@/views/right/Role.vue'
import Right from '@/views/right/Right.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {name: 'user', path: '/user', component: User},
        {name: 'right', path: '/right', component: Right},
        {name: 'role', path: '/role', component: Role}
      ]
    }
  ]
})
