import sceneData from './scenedata2'
import Vuex from 'Vuex';
import Vue from 'vue'
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    sceneData,
    editorWidth: 320,
    editorHeight: 486,
    currentPageIndex: 0
  },
  mutations: {
    nextPage (state) {
      if(state.currentPageIndex < state.sceneData.pages.length - 1){
        state.currentPageIndex++
      }
    },
    prePage (state) {
      if(state.currentPageIndex > 0){
        state.currentPageIndex--
      }
    }
  },
  getters: {
    pages: state => {
      return state.sceneData.pages
    },
    editorWidth: state => {
      return state.editorWidth;
    },
    editorHeight: state => {
      return state.editorHeight;
    },
    currentPageIndex: state => {
      return state.currentPageIndex;
    },
    activePage: state => {
      return state.sceneData.pages[state.currentPageIndex];
    },
  },
  actions: {
  }
});

export default store;