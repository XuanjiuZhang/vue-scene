import Vue from 'vue'
import Vuex from 'Vuex';
import _ from 'underscore';
import sceneApi from './api/sceneApi';
window._ = _;
import initStore from './vuex/sceneStorelib'
import Scene from './components/scene.vue'
import Pcbutton from './components/PCTurnPageBtn.vue'
import EtBtn from './components/EditorTurnPageBtn.vue'
import './style/element.less'
import './lib/hammer.min.js'
import qrcanvas from 'qrcanvas'

// test
// import testSceneData from './vuex/scenedata2'
// global.testSceneData = testSceneData;
import testSceneData from './vuex/scenedata2';
global.testSceneData = testSceneData;

(function () {
  const initCanvas = (ids) => {
    if(_.isArray(ids)){
      ids.forEach(id => {
        let qrCodeDomEle = document.getElementById(id);
        if(qrCodeDomEle){
          let canvas = qrcanvas({
            data: 'hello, world',
            size: 232
            // cellSize: 11
          });
          qrCodeDomEle.appendChild(canvas);
        }
      });
    }else if(_.isString(ids)){
      let qrCodeDomEle = document.getElementById(ids);
      if(qrCodeDomEle){
        let canvas = qrcanvas({
          data: 'hello, world',
          size: 232
          // cellSize: 11
        });
        qrCodeDomEle.appendChild(canvas);
      }
    }
  }
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
      return function (pcTurnPageElementID, templateName = 'Pcbutton') {
        const domBtnEle = document.getElementById(pcTurnPageElementID);
        // domBtnEle.innerHTML = `<Pcbutton></Pcbutton>`;
        domBtnEle.innerHTML = `<component is="${templateName}"></component>`;
        const instanceBtn1 = new Vue({
          store: sceneStore, // 注入到所有子组件1
          components: { Pcbutton, EtBtn }
        });
        instanceBtn1.$mount('#' + pcTurnPageElementID);
        return initCanvas;
      };
    },
    initBySceneCode(sceneinfo, elementID) {
      sceneApi.getSceneByCode(sceneinfo).then(response => {
        console.log(response);
        if(!response.ok){
          return
        }
        const sceneStoreCode = initStore(response.data);
        const domEleCode = document.getElementById(elementID);
        domEleCode.innerHTML = '<Scene></Scene>';
        sceneStoreCode.commit('measureOutterEl', { $el: domEleCode });
        const instanceCode = new Vue({
          store: sceneStoreCode, // 注入到所有子组件1
          components: { Scene }
        });
        instanceCode.$mount('#' + elementID);
        return function (pcTurnPageElementID, templateName = 'Pcbutton') {
          const domBtnEleCode = document.getElementById(pcTurnPageElementID);
          // domBtnEle.innerHTML = `<Pcbutton></Pcbutton>`;
          domBtnEleCode.innerHTML = `<component is="${templateName}"></component>`;
          const instanceBtn = new Vue({
            store: sceneStore2, // 注入到所有子组件1
            components: { Pcbutton, EtBtn }
          });
          instanceBtn.$mount('#' + pcTurnPageElementID);
          return initCanvas;
        };
      });
    }
  };

}());
