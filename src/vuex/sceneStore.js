import sceneData from './scenedata2'
import Vuex from 'Vuex';
import Vue from 'vue'
import _ from 'underscore';
Vue.use(Vuex);

import animationPlayer from '../service/animationPlayer';
animationPlayer.initAnimatedEle(sceneData);

const state = {
  sceneData,
  editorWidth: 320,
  editorHeight: 486,
  currentPageIndex: 0,
  loadedElementCount: 0,
  BmapAk: 'KOrgR0r0RM4xotCjVoAhA9kUFoubHSVv'
};

const toggleElementVisible = (elements) => {
  elements.forEach(element => {
    if(_.isArray(element.animate) && element.animate.length != 0){
      element.visible = !element.visible;
    }
  });
};

const store = new Vuex.Store({
  state,
  mutations: {
    nextPage (state) {
      if(state.currentPageIndex < state.sceneData.pages.length - 1){
        animationPlayer.stopPageAnimation(state.currentPageIndex);
        toggleElementVisible(state.sceneData.pages[state.currentPageIndex].elements);

        state.currentPageIndex++;
        animationPlayer.playPageAnimation(state.currentPageIndex);
        toggleElementVisible(state.sceneData.pages[state.currentPageIndex].elements);
      }
    },
    prePage (state) {
      if(state.currentPageIndex > 0){
        const currentPage = state.sceneData.pages[state.currentPageIndex];
        animationPlayer.stopPageAnimation(state.currentPageIndex);
        toggleElementVisible(state.sceneData.pages[state.currentPageIndex].elements);

        state.currentPageIndex--;
        animationPlayer.playPageAnimation(state.currentPageIndex);
        toggleElementVisible(state.sceneData.pages[state.currentPageIndex].elements);
      }
    },
    loadElementSuccess (state){
      state.loadedElementCount++;
      var elementCount = 0;
      state.sceneData.pages.forEach((page, index) => {
        elementCount += page.elements.length;
      });
      if(state.loadedElementCount === elementCount){
        animationPlayer.playPageAnimation(state.currentPageIndex);
        toggleElementVisible(state.sceneData.pages[state.currentPageIndex].elements);
      }
    },
    changeElementCssAndClass (state, payload){
      const { style, styleClass, animationIndex, eleIndex, pageIndex } = payload;
      const element = state.sceneData.pages[pageIndex].elements[eleIndex];
      Vue.set(element, 'animationClass', styleClass);
      // Object.assign(element.animationClass, styleClass);
      _.extend(element.css, style);
    },
    addElementLastPlayPromise (state, payload){
      const { elementLastAnimationPromise, eleIndex, pageIndex } = payload;
      const element = state.sceneData.pages[pageIndex].elements[eleIndex];
      Object.assign(element, { __lastAnimationPromise: elementLastAnimationPromise });
    },
    restoreElementStyle (state, payload){
      const { eleIndex, pageIndex } = payload;
      const element = state.sceneData.pages[pageIndex].elements[eleIndex];
      const emptyStyle = {
        WebkitAnimationDuration: '',
        WebkitAnimationDelay: '',
        WebkitAnimationIterationCount: '',
        MozAnimationDuration: '',
        MozAnimationDelay: '',
        MozAnimationIterationCount: ''
      };
      if(element.__lastAnimationPromise){
        clearTimeout(element.__lastAnimationPromise);
      }
      Vue.set(element, 'animationClass', []);
      // Vue.set(element, 'css', emptyStyle);
      // Object.assign(element.animationClass, []);
      Object.assign(element.__lastAnimationPromise, null);
      _.extend(element.css, emptyStyle);
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
    sceneLoadedPercentage: state => {
      var elementCount = 0;
      state.sceneData.pages.forEach((page, index) => {
        elementCount += page.elements.length;
      });
      const result = Math.floor(state.loadedElementCount / elementCount * 100);
      return result;
    }
  },
  actions: {
    loadBmap (context) {
      if(!global.BMap && !global._initBaiduMap){
        global._BMapPromise = new Promise((resolve, reject) => {
          const $script = document.createElement('script');
          global.document.body.appendChild($script);

          global._initBaiduMap = function () {
            resolve(global.BMap);
            global.document.body.removeChild($script);
            global._initBaiduMap = null;
            global._BMapPromise = null;
          };
          $script.src = `//api.map.baidu.com/api?v=2.0&ak=${context.state.BmapAk}&callback=_initBaiduMap`;
        });
      }
      return global._BMapPromise;

    }
  }
});

Object.assign(animationPlayer, { store });

export default store;