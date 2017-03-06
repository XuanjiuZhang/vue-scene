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
import testSceneData from './vuex/newScene.json'
global.testSceneData = testSceneData;
// import testSceneData from './vuex/scenedata2';
// global.testSceneData = testSceneData;

(function () {
  const initCanvas = (ids, config) => {
    const { url, size, cellSize } = config;
    if(_.isArray(ids)){
      ids.forEach(id => {
        let qrCodeDomEle = document.getElementById(id);
        if(qrCodeDomEle){
          let canvas = qrcanvas({
            data: url,
            size,
            cellSize
          });
          qrCodeDomEle.appendChild(canvas);
        }
      });
    }else if(_.isString(ids)){
      let qrCodeDomEle = document.getElementById(ids);
      if(qrCodeDomEle){
        let canvas = qrcanvas({
          data: url,
          size,
          cellSize
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
        if(pcTurnPageElementID == undefined){
          return initCanvas;
        }
        const domBtnEle = document.getElementById(pcTurnPageElementID);
        // domBtnEle.innerHTML = `<Pcbutton></Pcbutton>`;
        domBtnEle.innerHTML = `<component is="${templateName}"></component>`;
        const instanceBtn = new Vue({
          store: sceneStore, // 注入到所有子组件1
          components: { Pcbutton, EtBtn }
        });
        instanceBtn.$mount('#' + pcTurnPageElementID);
        return initCanvas;
      };
    },
    initBySceneCode(sceneinfo, elementID) {
      return sceneApi.getSceneByCode(sceneinfo);
    },
  };

  window.onload = function(){
    const { code, qrc, src, isMobile, autoLoad } = window;
    const sceneInfo = { code, qrc, src };
    if(autoLoad){
      global.previewScene.initBySceneCode(sceneInfo).then(response => {
        console.log(response);
        if(!response.ok){
          return;
        }
        return response.json();
      }).then(sceneData => {
        if(isMobile === 'true'){
          global.previewScene.init(sceneData, 'root');
        }else{
          global.previewScene.init(sceneData, 'root')('phoneBtn')(['qrCode'], { url: window.location.href, size: 232 });
        }
      });
    }
  };
}());
