import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
    setSysData (state, config) {
      Object.keys(config).forEach(key=>{
          state[key] = config[key];
      });
    }
  },
  getters:{
  },
  actions: {
  },
  modules: {
  }
})
