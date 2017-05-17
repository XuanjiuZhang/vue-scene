import Vue from 'vue'
import _ from 'underscore';
window._ = _;
import {MessageBox} from 'element-ui';
import sceneApi from './api/sceneApi';
import initStore from './vuex/sceneStorelib'
import Scene from './components/scene.vue'
import Pcbutton from './components/PCTurnPageBtn.vue'
import EtBtn from './components/EditorTurnPageBtn.vue'
import BsBtn from './components/BackstageTurnPageBtn.vue'
import BsBtnB from './components/BackstageTurnPageBtnStyleB.vue'
import './style/element.less'
import './lib/hammer.min.js'
import qrcanvas from 'qrcanvas'

// test
/*import testSceneData from './test/map.json' ;
global.testSceneData = testSceneData;*/

(function () {
  const initCanvas = (ids, config) => {
    const { url, size, cellSize } = config;
    if (_.isArray(ids)) {
      ids.forEach(id => {
        let qrCodeDomEle = document.getElementById(id);
        if (qrCodeDomEle) {
          let canvas = qrcanvas({
            data: url,
            size,
            cellSize
          });
          qrCodeDomEle.appendChild(canvas);
        }
      });
    } else if (_.isString(ids)) {
      let qrCodeDomEle = document.getElementById(ids);
      if (qrCodeDomEle) {
        let canvas = qrcanvas({
          data: url,
          size,
          cellSize
        });
        qrCodeDomEle.appendChild(canvas);
      }
    }
  };
  const loadFonts = (sceneData) => {
    const { fonts = []} = sceneData;
    if (fonts.length === 0) {
      return
    }
    const nod = document.createElement('style');
    var str = '';
    nod.type = 'text/css';
    fonts.forEach(font => {
      str += `@font-face{font-family:'${font.name}';src:url('${font.url}');}`
    });
    console.log(str);
    nod.appendChild(document.createTextNode(str));
    /*if (nod.styleSheet) { //ie下  
      nod.styleSheet.cssText = str;
    } else {
      nod.appendChild(document.createTextNode(str));
      // 或者写成 nod.appendChild(document.createTextNode(str))  
      // nod.innerHTML = str;       
    }*/
    document.getElementsByTagName('head')[0].appendChild(nod);
  };

  const GetQueryString = (name) => {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  };

  const weixinOauth = (sceneData) => {
    const {application, createUser} = sceneData;
    const { self, top, userAgent, weixinoauth } = window;
    if(self != top || _.isUndefined(userAgent) || !/micromessenger/i.test(userAgent.toLowerCase()) 
     || application != 'meeting' || !_.isUndefined(weixinoauth)){
      return new Promise((resolve, reject) => {
        resolve({notOauth: true});
      });
    }
    return sceneApi.getWeixinOauth({createuserid: createUser, shareUrl: window.location.href});
  };

  const loadWeixinApi = (sceneData) => {
    const { self, top, userAgent } = window;
    if (self != top || _.isUndefined(userAgent) || !/micromessenger/i.test(userAgent.toLowerCase())) {
      return;
    }
    console.log('loadWeixinApi!');
    const script = document.createElement("script");
    script.type = 'text/javascript';
    script.src = 'https://res.wx.qq.com/open/js/jweixin-1.0.0.js';
    script.onload = () => {
      // 获取 config
      const wxConfig = sceneApi.getWeixinConfig(window.location.href).then(res => {
        if (!res.ok) {
          return {};
        }
        return res.json();
      }).then(data => {
        console.log(data);
        window.wx.config(data.data);
        window.wx.ready(() => {
          console.log('wx ready');
          document.getElementById('bgmusic').play();
          const { name, description, image } = sceneData;
          const shareObj = {
            title: name, // 分享标题
            desc: description, // 分享描述
            link: window.location.href.replace('&v=second', ''), // 分享链接
            imgUrl: `http://v.xmfshow.com${image}`, // 分享图标`
            //type: 'link', // 分享类型,music、video或link，不填默认为link
            //dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success() {
              console.log('share success');
            },
            cancel() {
              console.log('share cancel');
            }
          };
          //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
          window.wx.onMenuShareTimeline(shareObj);
          //获取“分享给朋友”按钮点击状态及自定义分享内容接口
          window.wx.onMenuShareAppMessage(shareObj);
          //获取“分享到QQ”按钮点击状态及自定义分享内容接口
          window.wx.onMenuShareQQ(shareObj);
          //获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
          window.wx.onMenuShareWeibo(shareObj);
          //获取“分享到QQ空间”按钮点击状态及自定义分享内容接口
          window.wx.onMenuShareQZone(shareObj);
        });
      });
    };
    document.getElementsByTagName('head')[0].appendChild(script);

  };

  global.previewScene = {
    init(sceneData, elementID) {
      const sceneStore = initStore(sceneData, elementID);
      weixinOauth(sceneData).then(res => {
        if(res.notOauth){
          return {};
        }
        if(!res.ok){
          return {error: true};
        }
        return res.json();
      }).then(resData => {
        const {error, data} = resData;
        if(!error && !_.isUndefined(data)){
          window.location.href = data;
          return;
        }
        if (_.isString(sceneData.name)) {
          document.title = sceneData.name;
        }
        loadFonts(sceneData);
        global.sceneStore = sceneStore;
        const instance = new Vue({
          store: sceneStore, // 注入到所有子组件1
          components: { Scene }
        });
        instance.$mount('#' + elementID);
        loadWeixinApi(sceneData);
        global.previewScene.initedInstance = instance;
      });
      return function (pcTurnPageElementID, templateName = 'Pcbutton') {
        if (pcTurnPageElementID == undefined) {
          return initCanvas;
        }
        const domBtnEle = document.getElementById(pcTurnPageElementID);
        // domBtnEle.innerHTML = `<Pcbutton></Pcbutton>`;
        domBtnEle.innerHTML = `<component is="${templateName}"></component>`;
        const instanceBtn = new Vue({
          store: sceneStore, // 注入到所有子组件1
          components: { Pcbutton, EtBtn, BsBtn, BsBtnB }
        });
        instanceBtn.$mount('#' + pcTurnPageElementID);
        return initCanvas;
      };
    },
    initBySceneCode(sceneinfo, elementID) {
      return sceneApi.getSceneByCode(sceneinfo);
    },
  };

  window.onload = function () {
    // window.previewScene.init(testSceneData, 'root');
    const { code, qrc, src, isMobile, autoLoad } = window;
    const sceneInfo = { code, qrc, src };
    if (autoLoad) {
      global.previewScene.initBySceneCode(sceneInfo).then(response => {
        console.log(response);
        if (!response.ok) {
          MessageBox({
              title: '错误',
              message: '该场景不存在',
              type: 'warning',
              duration: 5000,
              showConfirmButton: true
            });
          return;
        }
        return response.json();
      }, error => {
        MessageBox({
              title: '错误',
              message: '该场景不存在',
              type: 'warning',
              duration: 5000,
              showConfirmButton: true
            });
        return ;
      }).then(sceneData => {
        if (isMobile === 'true') {
          global.previewScene.init(sceneData, 'root');
        } else {
          global.previewScene.init(sceneData, 'root')('phoneBtn')(['qrCode'], { url: window.location.href.replace('v=second', ''), size: 232 });
        }
      });
    }
  };
  
}());
