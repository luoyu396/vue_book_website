import Vue from 'vue'
import Router from 'vue-router'
import index from '@/view/index'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '*',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: index,
    },
  ]
})
