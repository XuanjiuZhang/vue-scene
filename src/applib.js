import Vue from 'vue'
import Vuex from 'Vuex';
import initStore from './vuex/sceneStorelib'
import Scene from './components/scene.vue'
import './style/element.less'
import './lib/hammer.min.js'

// test
import testSceneData from './vuex/scenedata2'
global.testSceneData = testSceneData;

(function () {
  global.previewScene = {
    init (sceneData, elementID) {
      const sceneStore = initStore(sceneData);
      const domEle = document.getElementById(elementID);
      domEle.innerHTML = '<Scene></Scene>';
      sceneStore.commit('measureOutterEl', { $el: domEle });
      const instance = new Vue({
        store: sceneStore, // 注入到所有子组件1
        components: { Scene }
      });
      instance.$mount('#' + elementID);
    }
  }
}());
