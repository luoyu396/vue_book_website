import Vue from 'vue'
import Router from 'vue-router'
import login from '@/view/login'
import register from '@/view/register'
import index from '@/view/index'
import home from '@/view/home'
import book from '@/view/book'
import book_detail from '@/view/book-detail'
import user_info from '@/view/user-info'

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
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/user_info',
      name: 'user_info',
      component: user_info
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
        {
          path: 'book_detail/:bookId',
          name: 'book_detail',
          component: book_detail,
        }
      ]
    }
  ]
})
