import Vue from 'vue'
import Vuex from 'Vuex';
// import store from './vuex/store'
import sceneStore from './vuex/sceneStore'
// import App from './components/App.vue'
import Scene from './components/scene.vue'
// import VueRouter from 'vue-router'
// import router from './router'
import './style/element.less'
import './lib/hammer.min.js'

// Vue.use(VueRouter); 

new Vue({
  // router,
  store: sceneStore, // 注入到所有子组件1
  el: '#root',
  components: { Scene }
});

// new Vue({
//   sceneStore, // 注入到所有子组件2
//   el: '#scene',
//   components: { Scene }
// });