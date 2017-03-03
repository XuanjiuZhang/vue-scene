import Vue from 'vue'
import Vuex from 'Vuex';
import initStore from './vuex/sceneStorelib'
import Scene from './components/scene.vue'
import Pcbutton from './components/PCTurnPageBtn.vue'
import './style/element.less'
import './lib/hammer.min.js'
import qrcanvas from 'qrcanvas'

// test
import testSceneData from './vuex/scenedata2'
global.testSceneData = testSceneData;

(function () {
  global.previewScene = {
    init(sceneData, elementID) {
      const sceneStore = initStore(sceneData);
      const domEle = document.getElementById(elementID);
      domEle.innerHTML = '<Scene></Scene>';
      sceneStore.commit('measureOutterEl', { $el: domEle });
      const instance = new Vue({
        store: sceneStore, // 注入到所有子组件1
        components: { Scene }
      });
      instance.$mount('#' + elementID);
      return function (pcTurnPageElementID) {
        const domBtnEle = document.getElementById(pcTurnPageElementID);
        domBtnEle.innerHTML = '<Pcbutton></Pcbutton>';
        const instance = new Vue({
          store: sceneStore, // 注入到所有子组件1
          components: { Pcbutton }
        });
        const canvas = qrcanvas({
          data: 'hello, world',
          size: 232
          // cellSize: 11
        });
        document.getElementById('qrCode').appendChild(canvas);
        instance.$mount('#' + pcTurnPageElementID);
      };
    }
  };

}());
