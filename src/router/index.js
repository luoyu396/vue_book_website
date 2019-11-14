import Vue from 'vue'
import Router from 'vue-router'
import login from '@/view/login'
import index from '@/view/index'
import home from '@/view/home'
import book from '@/view/book'
Vue.use(Router)

export default new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      path: '*',
      redirect: '/index'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/index',
      name: 'index',
      component: index,
      redirect: '/index/home',
      children: [
        {
          path: 'home',
          name: 'home',
          component: home,
        },
        {
          path: 'book',
          name: 'book',
          component: book,
        },
      ]
    }
  ]
})
