// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import './styles/index.scss'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/base.css'
import VueParticles from 'vue-particles'
Vue.use(VueParticles)

Vue.use(ElementUI)
Vue.config.productionTip = false
// 增加导航守卫
router.beforeEach((to, from, next) => {
  // console.log(to)
  // 获取token
  var token = localStorage.getItem('mytoken')
  // 判断token是否存在
  if (token) {
  // 存在token 继续下一步
    next()
  } else {
    if (to.path === '/login') {
      // 如果本身要跳转去login，则继续
      next()
    }
    // 没有token,跳回login页面
    next({path: '/login'})
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
