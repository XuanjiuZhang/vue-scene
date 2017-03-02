<style lang="less">
  /*@phone-width:320px;  
  @phone-height:486px;*/
  
  .full-screen {
    width: 100%;
    height: 100%;
    overflow: hidden;
    &.loading {
      position: absolute;
      left: 0;
      top: 0;
    }
  }
  
  .phone-ul {
    overflow: hidden;
  }
  
  .phone-li {
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
    &.animated-page {
      transition: .5s transform;
    }
    &.animated-page-fast {
      transition: .2s transform;
    }
  }
</style>

<template>
  <div class="full-screen">
    <ul v-show="sceneLoadedPercentage === 100" class="full-screen phone-ul" ref="phoneul">
      <li v-for="(page, index) in maxPageArray" class="full-screen phone-li" 
       :key="page.id" :style="getPhoneLiStyle(index)"
        :class="phonePageClass">
        <PhonePage v-bind="{'pageData': page, index, finalScale}"></PhonePage>
        </li>
    </ul>
    <div v-show="sceneLoadedPercentage < 100" class="full-screen loading">
      <Loading :sceneLoadedPercentage="sceneLoadedPercentage"></Loading>
    </div>
    <!--背景音乐-->
    <div class="bg-audio-element" v-show="sceneData.bgAudio" @click="toggleBgMusic">
      <audio ref="bgmusic" class="bg-music" autoplay="true"
       v-bind="{'loop': sceneData.bgAudio.loop, 'src': sceneData.bgAudio.url}">
      </audio>
      <div class="audio-icon" :class="{rotate: bgMusicPlaying}"></div>
    </div>
    <!-- / 背景音乐-->
  </div>
</template>

<script>
  import Vue from 'vue';
  import {
    mapMutations,
    mapGetters,
    mapActions
  } from 'vuex';
  import PhonePage from './PhonePage.vue';
  import Loading from './Loading.vue';
  // // 编辑器样式
  // import '../style/editor.min.css';
  // 引入eleUI控件
  import 'element-ui/lib/theme-default/index.css';
  import {
    Carousel,
    CarouselItem
  } from 'element-ui';
  Vue.component(Carousel.name, Carousel);
  Vue.component(CarouselItem.name, CarouselItem);

  export default {
    created() {},
    mounted() {
      const initHammer = () => {
        this.HammerManager = new Hammer.Manager(this.$refs.phoneul);
        this.HammerManager.on('panstart', throttlePanstart);
        this.HammerManager.on('panend', throttlePanEnd);
        this.HammerManager.on('panup', panUp);
        this.HammerManager.on('pandown', panDown);
        this.HammerManager.on('panleft', panleft);
        this.HammerManager.on('panright', panRight);
        this.Pan = new Hammer.Pan({
          event: 'pan',
          pointers: 0,
          threshold: 50,
          direction: Hammer.DIRECTION_ALL
        });
        this.HammerManager.add(this.Pan);
      };

      const throttlePanstart = (event) => {
        _.throttle(panstart(event), 200);
      };
      const panstart = (event) => {
        this.inTouch = true;
        this.preNextVisible = true;
        this.startData = Object.assign({}, {
          deltaY: this.deltaY,
          deltaX: this.deltaX
        });
      };
      const throttlePanEnd = (event) => {
        _.throttle(panEnd(event), 200);
      };
      const panEnd = (event) => {
        this.inTouch = false;
        const {
          deltaY,
          deltaX,
          additionalEvent
        } = event;
        this.startData = Object.assign({}, {
          deltaY: this.deltaY,
          deltaX: this.deltaX
        });
        if (this.activePage.pageOption.turnPageMode === 1) {
          // 第一页继续往下滑
          let firstPageDown = this.currentPageIndex === 0 && (additionalEvent === 'pandown' || deltaY > 0);
          // 最后一页往上滑
          let lastPageUp = this.currentPageIndex === this.sceneData.pages.length - 1 &&
            (additionalEvent === 'panup' || deltaY < 0) && !this.sceneData.play.loop;
          // 距离太小
          let tooNear = Math.abs(deltaY) <= this.turnPageThreshold;

          // 不翻页
          if (firstPageDown || lastPageUp || tooNear) {
            this.HammerManager.remove(this.Pan);
            console.log('不翻页!');
            this.deltaY = 0;
            this.deltaX = 0;
            this.fastTurnPage = true;
            setTimeout(() => {
              this.HammerManager.add(this.Pan);
            }, this.addPanTime);
            setTimeout(() => {
              this.preNextVisible = false;
              this.fastTurnPage = false;
            }, this.fastTurnPageTime);
            return;
          }

          // 往下滑翻页
          if ((additionalEvent === 'panup' || deltaY < 0) && this.activePageCanUp) {
            this.HammerManager.remove(this.Pan);
            console.log('往下滑翻页!');
            this.deltaY = -this.screenHeight;
            this.normalTurnPage = true;
            setTimeout(() => {
              this.HammerManager.add(this.Pan);
            }, this.addPanTime);
            setTimeout(() => {
              this.preNextVisible = false;
              this.normalTurnPage = false;
              this.deltaY = 0;
              this.deltaX = 0;
              this.nextPage();
            }, this.normalTurnPageTime);
            return;
          }
          // 往上滑翻页
          if ((additionalEvent === 'pandown' || deltaY > 0) && this.activePageCanDown) {
            this.HammerManager.remove(this.Pan);
            console.log('往上滑翻页!');
            this.deltaY = this.screenHeight;
            this.normalTurnPage = true;
            setTimeout(() => {
              this.HammerManager.add(this.Pan);
            }, this.addPanTime);
            setTimeout(() => {
              this.preNextVisible = false;
              this.normalTurnPage = false;
              this.deltaY = 0;
              this.deltaX = 0;
              this.prePage();
            }, this.normalTurnPageTime);
            return;
          }

        } else {
          // 第一页继续往右滑
          let firstPageRight = this.currentPageIndex === 0 && (additionalEvent === 'panright' || deltaX > 0);
          // 最后一页往左滑
          let lastPageLeft = this.currentPageIndex === this.sceneData.pages.length - 1 &&
            (additionalEvent === 'panleft' || deltaX < 0);
          // 距离太小
          let tooNear = Math.abs(deltaX) <= this.turnPageThreshold;

          // 不翻页
          if (firstPageRight || lastPageLeft || tooNear) {
            console.log('不翻页!');
            this.deltaY = 0;
            this.deltaX = 0;
            this.fastTurnPage = true;
            setTimeout(() => {
              this.HammerManager.add(this.Pan);
            }, this.addPanTime);
            setTimeout(() => {
              this.preNextVisible = false;
              this.fastTurnPage = false;
            }, this.fastTurnPageTime);
            return;
          }
          // 往左滑翻页
          if (additionalEvent === 'panleft' || deltaX < 0) {
            console.log('往左滑翻页!');
            // 暂时移除hammer, 置delta为屏幕大小, 开启翻页动画, 完成以后恢复
            this.deltaX = -this.screenWidth;
            this.normalTurnPage = true;
            setTimeout(() => {
              this.HammerManager.add(this.Pan);
            }, this.addPanTime);
            setTimeout(() => {
              this.preNextVisible = false;
              this.normalTurnPage = false;
              this.deltaY = 0;
              this.deltaX = 0;
              this.nextPage();
            }, this.normalTurnPageTime);
            return;
          }

          // 往右滑翻页
          if (additionalEvent === 'panright' || deltaX > 0) {
            console.log('往右滑翻页!');
            this.deltaX = this.screenWidth;
            this.normalTurnPage = true;
            setTimeout(() => {
              this.HammerManager.add(this.Pan);
            }, this.addPanTime);
            setTimeout(() => {
              this.preNextVisible = false;
              this.normalTurnPage = false;
              this.deltaY = 0;
              this.deltaX = 0;
              this.prePage();
            }, this.normalTurnPageTime);
            return;
          }
        }
      };
      const panleft = (event) => {
        if (this.inTouch) {
          let {
            deltaX
          } = event;
          this.deltaX = this.startData.deltaX + deltaX;
        }
      };
      const panRight = (event) => {
        if (this.inTouch) {
          let {
            deltaX
          } = event;
          this.deltaX = this.startData.deltaX + deltaX;
        }
      };
      const panUp = (event) => {
        if (this.inTouch) {
          let {
            deltaY
          } = event;
          if (this.activePageCanUp || this.deltaY != 0) {
            this.deltaY = this.startData.deltaY + deltaY;
          }
        }
      };
      const panDown = (event) => {
        if (this.inTouch) {
          let {
            deltaY
          } = event;
          if (this.activePageCanDown || this.deltaY != 0) {
            this.deltaY = this.startData.deltaY + deltaY;
          }
        }
      };

      // this.$watch('inTouch', (newValue, oldValue) => {
      //   if (newValue === false && oldValue === true && !this.fastTurnPage && !this.normalTurnPage) {
      //     console.log('test');
      //   }
      // });

      initHammer();
    },
    data() {
      return {
        deltaY: 0,
        deltaX: 0,
        inTouch: false,
        preNextVisible: false,
        fastTurnPage: false,
        normalTurnPage: false,
        fastTurnPageTime: 400,
        normalTurnPageTime: 700,
        turnPageThreshold: 120,
        addPanTime: 700,
        bgMusicPlaying: true
      }
    },
    methods: {
      ...mapMutations(['nextPage', 'prePage']),
      toggleBgMusic() {
        this.bgMusicPlaying = !this.bgMusicPlaying;
        this.bgMusicPlaying ? this.$refs.bgmusic.play() : this.$refs.bgmusic.pause()
      },
      getPhoneLiStyle(index) {
        switch (index) {
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
      ...mapGetters(['sceneData', 'sceneLoadedPercentage', 'currentPageIndex', 'loadPageMaxIndex',
        'screenWidth', 'screenHeight', 'editorWidth', 'editorHeight',
        'activePage', 'activePageCanUp', 'activePageCanDown'
      ]),
      maxPageArray() {
        return this.sceneData.pages.slice(0, this.loadPageMaxIndex);
      },
      phonePageClass() {
        return {
          'animated-page': this.fastTurnPage,
          'animated-page-fast': this.normalTurnPage
        }
      },
      prePageStyle() {
        const style = {
          transform: this.activePage.pageOption.turnPageMode === 1 ? `translateY(-${this.screenHeight - this.deltaY}px)` : `translateX(-${this.screenWidth - this.deltaX}px)`,
          display: this.preNextVisible ? '' : 'none'
        };
        return style;
      },
      activePageStyle() {
        const style = {
          transform: this.activePage.pageOption.turnPageMode === 1 ? `translateY(${this.deltaY}px)` : `translateX(${this.deltaX}px)`
        };
        return style;
      },
      nextPageStyle() {
        const style = {
          transform: this.activePage.pageOption.turnPageMode === 1 ? `translateY(${this.screenHeight + this.deltaY}px)` : `translateX(${this.screenWidth + this.deltaX}px)`,
          display: this.preNextVisible ? '' : 'none'
        };
        return style;
      },
      hidePageStyle() {
        return {
          display: 'none'
        };
      },
      finalScale() {
        const hScale = this.screenHeight / this.editorHeight;
        const wScale = this.screenWidth / this.editorWidth;
        return Math.min(hScale, wScale);
      }
    },
    components: {
      PhonePage,
      Loading
    }
  }
</script>