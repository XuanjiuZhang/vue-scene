import sceneData from './scenedata2'
import Vuex from 'Vuex';
import Vue from 'vue'
import _ from 'underscore';
Vue.use(Vuex);

import { animationPlayer, changeElementCssAndClass, addElementLastPlayPromise, restoreElementStyle } from '../service/animationPlayer';
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
const execGoPage = (state, index) => {
  animationPlayer.stopPageAnimation(state.currentPageIndex);
  toggleElementVisible(state.sceneData.pages[state.currentPageIndex].elements);

  state.currentPageIndex = index;
  animationPlayer.playPageAnimation(state.currentPageIndex);
  toggleElementVisible(state.sceneData.pages[state.currentPageIndex].elements);
};

const store = new Vuex.Store({
  state,
  mutations: {
    nextPage (state) {
      if(state.currentPageIndex < state.sceneData.pages.length - 1){
        execGoPage(state, state.currentPageIndex + 1);
      }
    },
    prePage (state) {
      if(state.currentPageIndex > 0){
        execGoPage(state, state.currentPageIndex - 1);
      }
    },
    goPage (state, payload) {
      const { pageLink } = payload;
      if(0 <= pageLink && pageLink <= state.sceneData.pages.length - 1 && pageLink != state.currentPageIndex){
        execGoPage(state, pageLink);
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
    changeElementCssAndClass,
    addElementLastPlayPromise,
    restoreElementStyle,
    videoFrameOpen (state, payload){ 
      const { pageIndex, eleId } = payload;
      const element = state.sceneData.pages[pageIndex].elements.find((element) => {
        return element.id === eleId;
      });
      const heightStandard = document.body.offsetWidth * .75;
      const playingStyle = {
        height: heightStandard + 'px',
        width: document.body.offsetWidth + 'px',
        left: 0,
        top: (document.body.offsetHeight - heightStandard) / 2 + 'px',
        zIndex: 99999
      };
      element.__originCss = _.extend({}, element.css);
      _.extend(element.css, playingStyle);
    },
    videoFrameClose (state, payload){
      const { pageIndex, eleId } = payload;
      const element = state.sceneData.pages[pageIndex].elements.find((element) => {
        return element.id === eleId;
      });
      _.extend(element.css, element.__originCss);
    },
    toggleSelectOption (state, payload){
      const { optionIndex, pageIndex, eleId } = payload;
      const element = state.sceneData.pages[pageIndex].elements.find((element) => {
        return element.id === eleId;
      });
      const { properties } = element;
      if(properties.multiSelect){
        properties.options[optionIndex].selected = !properties.options[optionIndex].selected;
      }else{
        properties.options.forEach((opt, index) => {
          opt.selected = index === optionIndex;
        });
      }
    }
  },
  getters: {
    sceneData: state => {
      return state.sceneData
    },
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
    },
    buttonFormSubmit (context){
      
    }
  }
});

Object.assign(animationPlayer, { store });

export default store;