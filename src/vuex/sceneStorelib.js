import Vuex from 'vuex';
import Vue from 'vue'
Vue.use(Vuex);

import sceneApi from '../api/sceneApi';
import sceneDataPrepare from '../service/sceneDataPrepare';
import { animationPlayer, changeElementCssAndClass, addElementLastPlayPromise, restoreElementStyle } from '../service/animationPlayer';

const initStore = (sceneData) => {
  const preMsg = sceneDataPrepare(sceneData);
  console.log(preMsg);
  animationPlayer.initAnimatedEle(sceneData);

  const VueEventBus = new Vue();
  
  const state = {
    sceneData,
    sceneApi,
    VueEventBus,
    editorWidth: 320,
    editorHeight: 486,
    screenWidth: 0,
    screenHeight: 0,
    activePageCanUp: true,
    activePageCanDown: true,
    currentPageIndex: 0,
    firstLoadComplete: false,
    loadedElementCount: 0,
    loadPageMaxIndex: 3,
    BmapAk: 'KOrgR0r0RM4xotCjVoAhA9kUFoubHSVv' 
  };

  const initEventBus = _.once(() => {
    const firstLoad = _.once((state) => {
      state.firstLoadComplete = true;
      animationPlayer.playPageAnimation(state.currentPageIndex);
      toggleElementVisible(state.sceneData.pages[state.currentPageIndex].elements);
    });
    // const restLoad = _.after(2, execGoPage);
    VueEventBus.$on('LoadPagesComplete', (state) => {
      firstLoad(state);
      // restLoad(state, state.currentPageIndex + 1);
    });
  });

  const toggleElementVisible = (elements) => {
    elements.forEach(element => {
      if (_.isArray(element.animate) && element.animate.length != 0) {
        element.visible = !element.visible;
      }
    });
  };
  const execGoPage = (state, index) => {
    // var elementCount = 0;
    // state.sceneData.pages.slice(0, state.loadPageMaxIndex).forEach((page, index) => {
    //   elementCount += page.elements.length;
    // });
    // if(state.loadedElementCount != elementCount){
    //   return false;
    // }
    animationPlayer.stopPageAnimation(state.currentPageIndex);
    toggleElementVisible(state.sceneData.pages[state.currentPageIndex].elements);

    Object.assign(state, {
      currentPageIndex: index
    });
    animationPlayer.playPageAnimation(state.currentPageIndex);
    const currentPage = state.sceneData.pages[state.currentPageIndex];
    toggleElementVisible(currentPage.elements);
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
            if (row.required && row.data === '') {
              return {
                fail: true,
                msg: `contact form : ( ${element.name} ) field ( ${row.fieldName} ) required`
              };
            } else {
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
    measureOutterEl(state, payload) {
      const { $el } = payload;
      state.screenWidth = $el.offsetWidth;
      state.screenHeight = $el.offsetHeight;
    },
    nextPage(state) {
      if (state.currentPageIndex < state.sceneData.pages.length - 1) {
        if (state.currentPageIndex + 2 === state.loadPageMaxIndex &&
          state.currentPageIndex != state.sceneData.pages.length - 2) {
          state.loadPageMaxIndex = Math.min(state.sceneData.pages.length, state.loadPageMaxIndex + 5);
        }
        execGoPage(state, state.currentPageIndex + 1);
      } else if (state.sceneData.play.loop) {
        execGoPage(state, 0);
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
      state.sceneData.pages.slice(0, state.loadPageMaxIndex).forEach((page, index) => {
        elementCount += page.elements.length;
      });
      if (elementCount === 0 || state.loadedElementCount === elementCount) {
        initEventBus();
        state.VueEventBus.$emit('LoadPagesComplete', state);
        return 100;
      }else{
        return Math.floor(state.loadedElementCount / elementCount * 100);
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
      const heightStandard = state.screenHeight * .5;
      const playingStyle = {
        height: heightStandard + 'px',
        width: state.screenWidth + 'px',
        left: 0,
        top: state.screenHeight * .1 + 'px',
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
    scoreChange(state, payload) {
      const { pageIndex, eleId, currentScore } = payload;
      const element = state.sceneData.pages[pageIndex].elements.find((element) => {
        return element.id === eleId;
      });
      element.currentScore = currentScore;
    },
    activePageCanUpDown(state, payload) {
      const { up, down } = payload;
      state.activePageCanDown = down;
      state.activePageCanUp = up;
    },
    goPage(state, payload){
      execGoPage(state, payload.index);
    }
  },
  getters: {
    sceneData: state => {
      return state.sceneData;
    },
    pages: state => {
      return state.sceneData.pages;
    },
    screenWidth: state => {
      return state.screenWidth;
    },
    screenHeight: state => {
      return state.screenHeight;
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
      state.sceneData.pages.slice(0, state.loadPageMaxIndex).forEach((page, index) => {
        elementCount += page.elements.length;
      });
      if(elementCount === 0 || state.loadedElementCount >= elementCount){
        return 100;
      }else{
        return Math.floor(state.loadedElementCount / elementCount * 100);
      }
    },
    activePageCanUp: state => {
      return state.activePageCanUp;
    },
    activePageCanDown: state => {
      return state.activePageCanDown;
    },
    loadPageMaxIndex: state => {
      return state.loadPageMaxIndex;
    },
    VueEventBus: state => {
      return state.VueEventBus
    },
    firstLoadComplete: state => {
      return state.firstLoadComplete;
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
          $script.src = `https://api.map.baidu.com/api?v=2.0&ak=${context.state.BmapAk}&callback=_initBaiduMap`;
        });
      }
      return global._BMapPromise;
    },
    buttonFormSubmit(context, payload) {
      const { query: { qrc, src }, pageIndex } = payload;
      const formData = genPageFormData(context.state.sceneData.pages[pageIndex]);
      console.log(formData);
      const failArray = formData.filter(data => {
        return _.has(data, 'fail') && data.fail === true;
      });
      if (failArray.length) {
        return new Promise((resolve, reject) => {
          reject(failArray);
        });
      } else {
        let params = {
          formData,
          sceneid: context.state.sceneData.id,
          pageid: context.state.sceneData.pages[pageIndex].id,
          qrc,
          src
        };
        console.log(params);
        return context.state.sceneApi.formSubmit(params);
      }

    },
    toggleLike(context, payload) {
      const { pageIndex, eleId, liked } = payload;
      let params = {
        sceneid: context.state.sceneData.id,
        pageid: context.state.sceneData.pages[pageIndex].id,
        elementid: eleId,
        op: liked ? 'add' : 'minus'
      };
      return context.state.sceneApi.updateEleCount(params);
    }
  }
});

  Object.assign(animationPlayer, { store });

  return store;
}

export default initStore;
