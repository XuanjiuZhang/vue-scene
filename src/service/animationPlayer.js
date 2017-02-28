import { inAnimation, emphasizeAnimation, outAnimation } from './animationTypes';
import Vue from 'vue';
import _ from 'underscore';

const animationPlayer = {
  store: undefined,

  playPageAnimation (pageIndex){
    if(!_.isNumber(pageIndex)){
      return false;
    }
    const { state: { sceneData: { pages } } } = this.store;
    const elementArray = pages[pageIndex].elements;
    elementArray.forEach((element, eleIndex) => {
      this.playElementAnimation(element, pageIndex, eleIndex, 0);
    });
  },

  stopPageAnimation (pageIndex){
    if(!_.isNumber(pageIndex)){
      return false;
    }
    const { state: { sceneData: { pages } } } = this.store;
    const elementArray = pages[pageIndex].elements;
    elementArray.forEach((element, eleIndex) => {
      if(element.__lastAnimationPromise){
        this.store.commit('restoreElementStyle', { eleIndex, pageIndex });
      }
    });
  },

  playElementAnimation (element, pageIndex, eleIndex, animationIndex) {
    const { animate: animateArray } = element;
    if(animateArray == undefined || animateArray.length == 0 || animateArray[animationIndex] == undefined){
      return false;
    }

    const animationData = animateArray[animationIndex];
    const { duration = 0, delay = 0, type, loop, countNum } = animationData;
    const durationSecond = duration + 's';
    const delaySecond = delay + 's';

    // 根据动画的type寻找动画的class信息
    const animationInfo = this.autoFindAnimation(type);
    const styleClass = animationInfo.animationClass.concat([]);
    const style = {};
    // 如果是循环播放则停留在当前动画
    if(loop){
      styleClass.push('infinite');
      Object.assign(style, {
        WebkitAnimationDuration: durationSecond,
        WebkitAnimationDelay: delaySecond,
        MozAnimationDuration: durationSecond,
        MozAnimationDelay: delaySecond
      });
      this.store.commit('changeElementCssAndClass', { style, styleClass, animationIndex, eleIndex, pageIndex });

    }else{
      Object.assign(style, {
        WebkitAnimationDuration: durationSecond,
        WebkitAnimationDelay: delaySecond,
        WebkitAnimationIterationCount: countNum,
        MozAnimationDuration: durationSecond,
        MozAnimationDelay: delaySecond,
        MozAnimationIterationCount: countNum
      });
      this.store.commit('changeElementCssAndClass', { style, styleClass, animationIndex, eleIndex, pageIndex });
      const playTime = duration * countNum * 1000 + delay * 1000;
      const elementLastAnimationPromise = setTimeout(() => {
        // 如果还有动画继续播放
        if (animateArray[animationIndex + 1]) {
          if(type === animateArray[animationIndex + 1].type){
            this.store.commit('restoreElementStyle', { eleIndex, pageIndex });
            setTimeout(() => {
              this.playElementAnimation(element, pageIndex, eleIndex, animationIndex + 1);
            });
          }else{
            this.store.commit('restoreElementStyle', { eleIndex, pageIndex });
            this.playElementAnimation(element,pageIndex, eleIndex, animationIndex + 1);
          }
        }else{
          this.store.commit('restoreElementStyle', { eleIndex, pageIndex });
        }
      }, playTime);
      this.store.commit('addElementLastPlayPromise', { elementLastAnimationPromise, eleIndex, pageIndex });  

    }

  },

  autoFindAnimation (type) {
    // 根据动画的type自动寻找动画的class信息
    const finder = (type, animationArray) => {
      return animationArray.find(info => {
          return info.type === type;
        });
    }
    const allAnimation = inAnimation.concat(emphasizeAnimation, outAnimation);
    return finder(type, allAnimation);
  },

  initAnimatedEle (sceneData){
    const { pages } = sceneData;
    pages.forEach(page => {
      page.elements.forEach(element => {
        if(_.isArray(element.animate) && element.animate.length != 0){
          element.visible = false;
        }else{
          element.visible = true;
        }
      });
    });
  }
};

const changeElementCssAndClass = (state, payload) => {
  const { style, styleClass, animationIndex, eleIndex, pageIndex } = payload;
  const element = state.sceneData.pages[pageIndex].elements[eleIndex];
  Vue.set(element, 'animationClass', styleClass);
  // Object.assign(element.animationClass, styleClass);
  _.extend(element.css, style);
};
const addElementLastPlayPromise = (state, payload) => {
  const { elementLastAnimationPromise, eleIndex, pageIndex } = payload;
  const element = state.sceneData.pages[pageIndex].elements[eleIndex];
  Object.assign(element, { __lastAnimationPromise: elementLastAnimationPromise });
};
const restoreElementStyle = (state, payload) => {
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
};

export { animationPlayer, changeElementCssAndClass, addElementLastPlayPromise, restoreElementStyle };