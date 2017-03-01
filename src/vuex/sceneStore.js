import sceneData from './scenedata2'
import Vuex from 'Vuex';
import Vue from 'vue'
import _ from 'underscore';
Vue.use(Vuex);

import sceneDataPrepare from '../service/sceneDataPrepare';
import { animationPlayer, changeElementCssAndClass, addElementLastPlayPromise, restoreElementStyle } from '../service/animationPlayer';
const preMsg = sceneDataPrepare(sceneData);
console.log(preMsg);
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
    if (_.isArray(element.animate) && element.animate.length != 0) {
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
const genPageFormData = (page) => {
  const formData = page.elements.filter(element => {
    const { type } = element;
    return type === 7 || type === 9 || type === 10 || type === 11;
  }).map(element => {
    switch (element.type) {
      // input
      case 7:
        return {
          fieldname: element.properties.name,
          value: element.properties.data
        };
        break;
        // contact
      case 9:
        return element.properties.formData.map(row => {
          if(row.required && row.data === ''){
            return {
              fail: true,
              msg: `contact form : ( ${element.name} ) field ( ${row.fieldName} ) required`
            };
          }else{
            return {
              fieldname: row.fieldName,
              value: row.data
            };
          }
        });
        break;
        // select
      case 10:
        return element.properties.options.map(option => {
          return {
            fieldname: option.text,
            value: option.selected
          };
        });
        break;
        // score
      case 11:
        return {
          fieldname: element.properties.title || '未命名评分表单 ' + Math.round(Math.random() * 1000),
          value: element.currentScore
        }
        break;
    }
  });

  return _.flatten(formData);
};

const store = new Vuex.Store({
  state,
  mutations: {
    nextPage(state) {
      if (state.currentPageIndex < state.sceneData.pages.length - 1) {
        execGoPage(state, state.currentPageIndex + 1);
      }
    },
    prePage(state) {
      if (state.currentPageIndex > 0) {
        execGoPage(state, state.currentPageIndex - 1);
      }
    },
    goPage(state, payload) {
      const { pageLink } = payload;
      if (0 <= pageLink && pageLink <= state.sceneData.pages.length - 1 && pageLink != state.currentPageIndex) {
        execGoPage(state, pageLink);
      }
    },
    loadElementSuccess(state) {
      state.loadedElementCount++;
      var elementCount = 0;
      state.sceneData.pages.forEach((page, index) => {
        elementCount += page.elements.length;
      });
      if (state.loadedElementCount === elementCount) {
        animationPlayer.playPageAnimation(state.currentPageIndex);
        toggleElementVisible(state.sceneData.pages[state.currentPageIndex].elements);
      }
    },
    changeElementCssAndClass,
    addElementLastPlayPromise,
    restoreElementStyle,
    videoFrameOpen(state, payload) {
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
    videoFrameClose(state, payload) {
      const { pageIndex, eleId } = payload;
      const element = state.sceneData.pages[pageIndex].elements.find((element) => {
        return element.id === eleId;
      });
      _.extend(element.css, element.__originCss);
    },
    toggleSelectOption(state, payload) {
      const { optionIndex, pageIndex, eleId } = payload;
      const element = state.sceneData.pages[pageIndex].elements.find((element) => {
        return element.id === eleId;
      });
      const { properties } = element;
      if (properties.multiSelect) {
        properties.options[optionIndex].selected = !properties.options[optionIndex].selected;
      } else {
        properties.options.forEach((opt, index) => {
          opt.selected = index === optionIndex;
        });
      }
    },
    mutateLike(state, payload) {
      const { pageIndex, eleId, liked } = payload;
      const element = state.sceneData.pages[pageIndex].elements.find((element) => {
        return element.id === eleId;
      });
      liked ? element.properties.count++ : element.properties.count--;
    },
    scoreChange(state, payload){
      const { pageIndex, eleId, currentScore } = payload;
      const element = state.sceneData.pages[pageIndex].elements.find((element) => {
        return element.id === eleId;
      });
      element.currentScore = currentScore;
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
    loadBmap(context) {
      if (!global.BMap && !global._initBaiduMap) {
        global._BMapPromise = new Promise((resolve, reject) => {
          const $script = document.createElement('script');
          global.document.body.appendChild($script);

          global._initBaiduMap = function() {
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
    buttonFormSubmit(context, payload) {
      const { query, pageIndex } = payload;
      const formData = genPageFormData(context.state.sceneData.pages[pageIndex]);
      console.log(formData);
      const failArray = formData.filter(data => {
        return _.has(data, 'fail') && data.fail === true;
      });
      if(failArray.length){
        return new Promise((resolve, reject) => {
          reject(failArray);
        });
      }else{
        return new Promise((resolve, reject) => {
        setTimeout(function() {
          resolve(0);
        }, 1000);
      });
      }
      
    },
    toggleLike(context, payload) {
      const { pageIndex, eleId, liked } = payload;
      return new Promise((resolve, reject) => {
        setTimeout(function() {
          resolve(0);
        }, 1000);
      });
    }
  }
});

Object.assign(animationPlayer, { store });

export default store;