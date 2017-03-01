<style lang="less">
  /*@phone-width:320px;  
  @phone-height:486px;*/
  .full-screen{
    width: 100%;
    height: 100%;
    &.loading{
      position: absolute;
      left: 0;
      top: 0;
    }
  }
  .phone-ul{
    overflow: hidden;
  }
  .phone-li{
    /*overflow-y: auto;*/
    position: absolute;
    left: 0;
    top: 0;
    &.animated-page{
        transition: .5s transform;
    }
    &.animated-page-fast{
        transition: .2s transform;
    }
  }
</style>

<template>
  <div class="full-screen">
    <ul v-show="sceneLoadedPercentage === 100" class="full-screen phone-ul" ref="phoneul">
      <li v-for="(page, index) in sceneData.pages" class="full-screen phone-li"
        :key="page.id" :style="getPhoneLiStyle(index)" :class="phonePageClass">
        <PhonePage v-bind="{'page-data': page, index}"></PhonePage>
      </li>
    </ul>
    <div v-show="sceneLoadedPercentage < 100" class="full-screen loading">
      <Loading :sceneLoadedPercentage="sceneLoadedPercentage"></Loading>
    </div>
    <!--背景音乐-->
    <div class="bg-audio-element" v-show="sceneData.bgAudio" @click="toggleBgMusic">
      <audio ref="bgmusic" class="bg-music" autoplay="true" v-bind="{'loop': sceneData.bgAudio.loop, 'src': sceneData.bgAudio.url}">
      </audio>
      <div class="audio-icon" :class="{rotate: bgMusicPlaying}"></div>
    </div>
    <!-- / 背景音乐-->
  </div>
</template>

<script>
import Vue from 'vue';
import { mapMutations, mapGetters,mapActions } from 'vuex';
import PhonePage from './PhonePage.vue';
import Loading from './Loading.vue';
// // 编辑器样式
// import '../style/editor.min.css';
// 引入eleUI控件
import 'element-ui/lib/theme-default/index.css';
import { Carousel, CarouselItem } from 'element-ui';
Vue.component(Carousel.name, Carousel); 
Vue.component(CarouselItem.name, CarouselItem); 

export default {
  created(){
  },
  mounted(){
    const initHammer = () => {
      this.HammerManager = new Hammer.Manager(this.$refs.phoneul);
      this.HammerManager.on('panstart', panstart);
      this.HammerManager.on('panend', panEnd);
      this.HammerManager.on('panup', panUp);
      this.HammerManager.on('pandown', panDown);
      this.HammerManager.on('panleft', panleft);
      this.HammerManager.on('panright', panRight);
      this.Pan = new Hammer.Pan({
        event: 'pan',
        pointers: 0,
        threshold: 5,
        direction: Hammer.DIRECTION_ALL
      });
      this.HammerManager.add(this.Pan);
    };

    const panstart = (event) => {
      this.inTouch = true;
      this.startData = Object.assign({}, {deltaY: this.deltaY, deltaX: this.deltaX});
    };
    const panEnd = (event) => {
      this.HammerManager.remove(this.Pan);
      const { deltaY, deltaX, additionalEvent } = event;
      this.startData = Object.assign({}, {deltaY: this.deltaY, deltaX: this.deltaX});
      if(this.activePage.pageOption.turnPageMode === 1){
        // 第一页继续往下滑
        let firstPageDown = this.currentPageIndex === 0 && (additionalEvent === 'pandown' || deltaY > 0);
        // 最后一页往上滑
        let lastPageUp = this.currentPageIndex === this.sceneData.pages.length - 1
          && (additionalEvent === 'panup' || deltaY < 0);
        // 距离太小
        let tooNear = Math.abs(deltaY) <= 40;

        // 不翻页
        if(firstPageDown || lastPageUp || tooNear){
          console.log('不翻页!');
          this.deltaY = 0;
          this.deltaX = 0;
          this.fastTurnPage = true;
          setTimeout(() => {
            this.inTouch = false;
            this.fastTurnPage = false;
            setTimeout(() => {
              this.HammerManager.add(this.Pan);
            }, this.addPanTime);
          }, this.fastTurnPageTime);
          return;
        }

        // 往下滑翻页
        if(additionalEvent === 'panup' || deltaY < 0){
          console.log('往下滑翻页!');
          this.deltaY = -this.screenHeight;
          this.normalTurnPage = true;
          setTimeout(() => {
            this.inTouch = false;
            this.normalTurnPage = false;
            this.deltaY = 0;
            this.deltaX = 0;
            setTimeout(() => {
              this.HammerManager.add(this.Pan);
            }, this.addPanTime);
            this.nextPage();
          }, this.normalTurnPageTime);
          return;
        }
        // 往上滑翻页
        if(additionalEvent === 'pandown' || deltaY > 0){
          console.log('往上滑翻页!');
          this.deltaY = this.screenHeight;
          this.normalTurnPage = true;
          setTimeout(() => {
            this.inTouch = false;
            this.normalTurnPage = false;
            this.deltaY = 0;
            this.deltaX = 0;
            setTimeout(() => {
              this.HammerManager.add(this.Pan);
            }, this.addPanTime);
            this.prePage();
          }, this.normalTurnPageTime);
          return;
        }

      }else{
        // 第一页继续往右滑
        let firstPageRight = this.currentPageIndex === 0 && (additionalEvent === 'panright' || deltaX > 0);
        // 最后一页往左滑
        let lastPageLeft = this.currentPageIndex === this.sceneData.pages.length - 1
          && (additionalEvent === 'panleft' || deltaX < 0);
        // 距离太小
        let tooNear = Math.abs(deltaX) <= 40;
        
        // 不翻页
        if(firstPageRight || lastPageLeft || tooNear){
          console.log('不翻页!');
          this.deltaY = 0;
          this.deltaX = 0;
          this.fastTurnPage = true;
          setTimeout(() => {
            this.inTouch = false;
            this.fastTurnPage = false;
            setTimeout(() => {
              this.HammerManager.add(this.Pan);
            }, this.addPanTime);
          }, this.fastTurnPageTime);
          return;
        }
        // 往左滑翻页
        if(additionalEvent === 'panleft' || deltaX < 0){
          console.log('往左滑翻页!');
          // 暂时移除hammer, 置delta为屏幕大小, 开启翻页动画, 完成以后恢复
          this.deltaX = -this.screenWidth;
          this.normalTurnPage = true;
          setTimeout(() => {
            this.inTouch = false;
            this.normalTurnPage = false;
            this.deltaY = 0;
            this.deltaX = 0;
            setTimeout(() => {
              this.HammerManager.add(this.Pan);
            }, this.addPanTime);
            this.nextPage();
          }, this.normalTurnPageTime);
          return;
        }

        // 往右滑翻页
        if(additionalEvent === 'panright' || deltaX > 0){
          console.log('往右滑翻页!');
          this.deltaX = this.screenWidth;
          this.normalTurnPage = true;
          setTimeout(() => {
            this.inTouch = false;
            this.normalTurnPage = false;
            this.deltaY = 0;
            this.deltaX = 0;
            setTimeout(() => {
              this.HammerManager.add(this.Pan);
            }, this.addPanTime);
            this.prePage();
          }, this.normalTurnPageTime);
          return;
        }
      }
    };
    const panleft = (event) => {
      const { deltaX } = event;
      this.deltaX = this.startData.deltaX + deltaX;
    };
    const panRight = (event) => {
      const { deltaX } = event;
      this.deltaX = this.startData.deltaX + deltaX;
    };
    const panUp = (event) => {
      const { deltaY } = event;
      this.deltaY = this.startData.deltaY + deltaY;
    };
    const panDown = (event) => {
      const { deltaY } = event;
      this.deltaY = this.startData.deltaY + deltaY;
    };

    initHammer();    
  },
  data(){
    return {
      screenHeight: document.body.offsetHeight,
      screenWidth: document.body.offsetWidth,
      deltaY: 0,
      deltaX: 0,
      inTouch: false,
      fastTurnPage: false,
      normalTurnPage: false,
      fastTurnPageTime: 200,
      normalTurnPageTime: 500,
      addPanTime: 50,
      bgMusicPlaying: true
    } 
  },
  methods: {
    ...mapMutations(['nextPage', 'prePage']),
    toggleBgMusic (){
      this.bgMusicPlaying = !this.bgMusicPlaying;
      this.bgMusicPlaying ? this.$refs.bgmusic.play() : this.$refs.bgmusic.pause()
    },
    getPhoneLiStyle (index){
      switch(index){
        case this.currentPageIndex - 1:
          return this.prePageStyle;
        case this.currentPageIndex:
          return this.activePageStyle;
        case this.currentPageIndex + 1:
          return this.nextPageStyle;
        default:
          return this.hidePageStyle;
      }
    }
  },
  computed: {
    ...mapGetters(['sceneData', 'currentPageIndex', 'activePage', 'sceneLoadedPercentage']),
    phonePageClass(){
      return {
        'animated-page': this.fastTurnPage,
        'animated-page-fast': this.normalTurnPage
      }
    },
    prePageStyle(){
      const style = {
        transform: this.activePage.pageOption.turnPageMode === 1 ? `translateY(-${this.screenHeight - this.deltaY}px)`
        : `translateX(-${this.screenWidth - this.deltaX}px)`,
        display: this.inTouch ? '' : 'none'
      };
      return style;
    },
    activePageStyle(){
      const style = {
        transform: this.activePage.pageOption.turnPageMode === 1 ? `translateY(${this.deltaY}px)`
        : `translateX(${this.deltaX}px)`
      };
      return style;
    },
    nextPageStyle(){
      const style = {
        transform: this.activePage.pageOption.turnPageMode === 1 ? `translateY(${this.screenHeight + this.deltaY}px)`
        : `translateX(${this.screenWidth + this.deltaX}px)`,
        display: this.inTouch ? '' : 'none'
      };
      return style;
    },
    hidePageStyle(){
      return {display: 'none'};
    },
  },
  components: { PhonePage, Loading }
}
</script>