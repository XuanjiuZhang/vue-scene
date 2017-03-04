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
import testSceneData from './vuex/newScene.json';
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
        const instance = new Vue({
          store: sceneStore, // 注入到所有子组件1
          components: { Pcbutton, EtBtn }
        });
        instance.$mount('#' + pcTurnPageElementID);
        return initCanvas;
      };
    },
    initBySceneCode(sceneinfo, elementID) {
      sceneApi.getSceneByCode(sceneinfo).then(response => {
        console.log(response);
        if(!response.ok){
          return
        }
        const sceneStore = initStore(response.data);
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
          const instance = new Vue({
            store: sceneStore, // 注入到所有子组件1
            components: { Pcbutton, EtBtn }
          });
          instance.$mount('#' + pcTurnPageElementID);
          return initCanvas;
        };
      });
    }
  };

}());
