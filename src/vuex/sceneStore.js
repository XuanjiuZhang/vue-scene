import sceneData from './scenedata2'
import Vuex from 'Vuex';
import Vue from 'vue'
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    sceneData
  },
  mutations: {
  },
  getters: {
    pages: state => {
      return state.sceneData.pages
    }
  },
  actions: {
  }
});

export default store;