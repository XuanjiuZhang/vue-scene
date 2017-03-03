import Vue from 'vue'
import Vuex from 'Vuex';
import initStore from './vuex/sceneStorelib'
import Scene from './components/scene.vue'
import './style/element.less'
import './lib/hammer.min.js'

// test
import testSceneData from './vuex/scenedata2'
global.testSceneData = testSceneData;

(function() {
  global.previewScene = function(sceneData, elementID) {
    const sceneStore = initStore(sceneData);
    sceneStore.commit('measureOutterEl', { $el: document.getElementById(elementID) });
    const instance = new Vue({
      store: sceneStore, // 注入到所有子组件1
      components: { Scene }
    });
    instance.$mount('#' + elementID);
  }
}());
