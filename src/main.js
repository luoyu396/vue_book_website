// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'
import App from './App'
import router from './router'
import 'babel-polyfill'
import 'url-search-params-polyfill'
import axios from './axios/ajax.js'
Vue.prototype.$ajax = axios
Vue.prototype.$url = process.env.API_HOST
import './assets/css/common.scss'
Vue.use(ElementUI);
process.env.Mock && require('./mock/mock.js')

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
