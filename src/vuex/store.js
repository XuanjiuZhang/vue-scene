import Vuex from 'Vuex';
import Vue from 'vue'
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  getters: {
    countNumber: state => {
      return state.count
    }
  },
  actions: {
    increment (context) {
      setTimeout(() => {
        context.commit('increment', {amount: 10})
      }, 1000);
    }
  }
});

export default store;