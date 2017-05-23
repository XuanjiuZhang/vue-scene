<style lang="less">
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
    position: relative;
  }
  
  .phone-li {
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
    &.animated-page {
      transition: .35s transform;
    }
    &.animated-page-fast {
      transition: .2s transform;
    }
  }
  
  .component-fade-enter-active,
  .component-fade-leave-active {
    transition: opacity .5s ease;
  }
  
  .component-fade-enter,
  .component-fade-leave-active {
    opacity: 0;
  }
  
  .scene-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    user-select: none;
    background-color: #FFE35E;
  }
  
  .bee_loge_box {
    width: 88px;
    height: 88px;
    background-color: #FFFFFF;
    border-radius: 50%;
    text-align: center;
    margin: 20% auto 26.2%;
  }
  
  .bee_input_password {
    width: 208px;
    height: 40px;
    border-radius: 2px;
    border: 1px solid transparent;
    color: #BBBBBB;
    padding-left: 8px;
    font-size: 12px;
    outline: none;
    box-sizing: border-box;
    display: inline-block;
  }
  
  .bee_input_btn {
    cursor: pointer;
    width: 80px;
    height: 40px;
    background-color: #7266BA;
    color: #fff;
    font-size: 15px;
    line-height: 40px;
    text-align: center;
    border-radius: 3px;
    display: inline-block;
    position: relative;
    top: 1px;
  }
  
  .bee_input_password:focus {
    border: 1px solid #666;
  }
  
  .psd_err {
    color: #EF1E1E;
    position: absolute;
    top: 267px;
    left: 18px;
    font-size: 12px;
    position: absolute;
    top: 46px;
    left: 7px;
  }
</style>

<template>
  <div class="full-screen">
    <ul v-show="showSceneContent" class="full-screen phone-ul" ref="phoneul">
      <li v-for="(page, index) in maxPageArray" class="phone-li" :key="page.id" :style="getPhoneLiStyle(index)" :class="phonePageClass">
        <PhonePage v-bind="{'pageData': page, index, finalScale, 'sceneInTouch': inTouch}"></PhonePage>
      </li>
    </ul>
    <div class="scene-container" v-show="showPassword">
      <div class="bee_loge_box">
        <img :src="beeLogo" alt="" style="position: relative;top:13px;">
      </div>
      <div style="margin: auto;width:295px;position: relative;">
        <input type="text" v-model.trim="passwordInput" @keydown.enter="confirmPwd" maxlength="30"
         class="bee_input_password" placeholder="请输入访问密码">
        <div class="bee_input_btn" @click="confirmPwd">确定</div>
        <div class="psd_err" v-show="passwordSendCount > 0 && !passwordCorrect">密码错误</div>
      </div>
    </div>

    <div class="scene-container" v-show="showNoAccess">
      <div class="bee_loge_box">
        <img :src="beeLogo" alt="" style="position: relative;top:13px;">
      </div>
      <div style="margin: auto;width:295px;position: relative;">
        <p style="text-align: center;font-size: 16px;font-weight:bold;">该场景不允许访问！</p>
      </div>
    </div>

    <transition name="component-fade" tag="div" class="full-screen loading">
      <Loading v-show="!showPassword && !firstLoadComplete" :sceneLoadedPercentage="sceneLoadedPercentage"></Loading>
    </transition>

    <!--背景音乐-->
    <div class="bg-audio-element" v-show="showBgAudio" @click="toggleBgMusic">
      <audio id="bgmusic" ref="bgmusic" class="bg-music" autoplay="true" v-bind="{'loop': sceneData.bgAudio.loop, 'src': sceneData.bgAudio.url}">
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
    CarouselItem,
  } from 'element-ui';
  Vue.component(Carousel.name, Carousel);
  Vue.component(CarouselItem.name, CarouselItem);
  import beeLogo from '../img/bee_logo.js';

  export default {
    created() { },
    mounted() {
      const initHammer = () => {
        const panstart = (event) => {
          this.inTouch = true;
          this.preNextVisible = true;
          this.startData = Object.assign({}, {
            deltaY: this.deltaY,
            deltaX: this.deltaX
          });
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
          if (this.turnPageMode === 1) {
            // 第一页继续往下滑
            let firstPageDown = this.currentPageIndex === 0 && !this.sceneData.play.loop
             && (additionalEvent === 'pandown' || deltaY > 0);
            // 最后一页往上滑
            let lastPageUp = this.currentPageIndex === this.sceneData.pages.length - 1 &&
              (additionalEvent === 'panup' || deltaY < 0) && !this.sceneData.play.loop;
            // 距离太小
            let tooNear = Math.abs(deltaY) <= this.turnPageThreshold;

            // 不翻页
            if (firstPageDown || lastPageUp || tooNear) {
              this.notTurnPage();
              return;
            }

            // 往下滑翻页
            if ((additionalEvent === 'panup' || deltaY < 0) && this.activePageCanUp && !this.shouldStopPanUp) {
              this.downTurnPage();
              return;
            }
            // 往上滑翻页
            if ((additionalEvent === 'pandown' || deltaY > 0) && this.activePageCanDown) {
              this.upTurnPage();
              return;
            }

          } else {
            // 第一页继续往右滑
            let firstPageRight = this.currentPageIndex === 0 && !this.sceneData.play.loop
             && (additionalEvent === 'panright' || deltaX > 0);
            // 最后一页往左滑
            let lastPageLeft = this.currentPageIndex === this.sceneData.pages.length - 1 &&
              (additionalEvent === 'panleft' || deltaX < 0) && !this.sceneData.play.loop;
            // 距离太小
            let tooNear = Math.abs(deltaX) <= this.turnPageThreshold;

            // 不翻页
            if (firstPageRight || lastPageLeft || tooNear) {
              this.notTurnPage();
              return;
            }
            // 往左滑翻页
            if ((additionalEvent === 'panleft' || deltaX < 0) && !this.shouldStopPanLeft) {
              this.leftTurnPage();
              return;
            }

            // 往右滑翻页
            if (additionalEvent === 'panright' || deltaX > 0) {
              this.rightTurnPage();
              return;
            }
          }
        };
        const throttlePanstart = _.throttle(panstart, 200);
        const throttlePanEnd = _.throttle(panEnd, 200);

        const panleft = (event) => {
          if (this.inTouch) {
            let {
              deltaX
            } = event;
            if(this.shouldStopPanLeft){
              this.deltaX = Math.max(0, this.startData.deltaX + deltaX);
            }else{
              this.deltaX = this.startData.deltaX + deltaX;
            }
            
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
              if(this.shouldStopPanUp){
                this.deltaY = Math.max(0, this.startData.deltaY + deltaY);
              }else{
                this.deltaY = this.startData.deltaY + deltaY;
              }
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
          threshold: this.hammerThrehold,
          direction: Hammer.DIRECTION_ALL
        });
        this.HammerManager.add(this.Pan);
      };

      const initTurnPage = () => {
        this.downTurnPage = () => {
          this.HammerManager.remove(this.Pan);
          this.deltaY = -this.screenHeight;
          this.normalTurnPage = true;
          this.fastTurnPage = false;
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
        };
        this.upTurnPage = () => {
          this.HammerManager.remove(this.Pan);
          this.deltaY = this.screenHeight;
          this.normalTurnPage = true;
          this.fastTurnPage = false;
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
        };
        this.leftTurnPage = () => {
          // 暂时移除hammer, 置delta为屏幕大小, 开启翻页动画, 完成以后恢复
          this.deltaX = -this.screenWidth;
          this.normalTurnPage = true;
          this.fastTurnPage = false;
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
        };
        this.rightTurnPage = () => {
          this.deltaX = this.screenWidth;
          this.normalTurnPage = true;
          this.fastTurnPage = false;
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
        };
        this.notTurnPage = () => {
          this.HammerManager.remove(this.Pan);
          this.deltaY = 0;
          this.deltaX = 0;
          this.normalTurnPage = false;
          this.fastTurnPage = true;
          setTimeout(() => {
            this.HammerManager.add(this.Pan);
          }, this.addPanTime);
          setTimeout(() => {
            this.preNextVisible = false;
            this.fastTurnPage = false;
          }, this.fastTurnPageTime);
        };
        this.VueEventBus.$on('btnTurnPage', payload => {
          const { opt } = payload;
          if (opt === 'pre') {
            /*if (this.sceneData.pages[this.currentPageIndex].pageOption.banTurnPage) {
              return;
            }*/
            if (this.turnPageMode === 1) {
              this.preNextVisible = true;
              setTimeout(() => {
                this.upTurnPage();
              }, this.btnTurnPageThreshold);
            } else {
              this.preNextVisible = true;
              setTimeout(() => {
                this.rightTurnPage();
              }, this.btnTurnPageThreshold);
            }
          } else if (opt === 'next') {
            if (this.turnPageMode === 1) {
              this.preNextVisible = true;
              setTimeout(() => {
                this.downTurnPage();
              }, this.btnTurnPageThreshold);
            } else {
              this.preNextVisible = true;
              setTimeout(() => {
                this.leftTurnPage();
              }, this.btnTurnPageThreshold);
            }
          }
        });
      }

      // 计算场景当前需要展示的元素数量, loadPageMaxIndex是当前需要加载的最后一页的index. 
      let elementCount = 0;
      this.sceneData.pages.slice(0, this.loadPageMaxIndex).forEach((page, index) => {
        elementCount += page.elements.length;
      });
      // 如果没有元素,需要手动触发场景加载完成.
      if (elementCount === 0) {
        this.loadElementSuccess();
      }

      // 如果只有一页就不需要翻页了.
      if(this.sceneData.pages.length > 1){
        // 初始化翻页逻辑
        initTurnPage();
        // 初始化hammer, 用于页面的滑动. 长页面的内部滑动在PhonePage中.
        initHammer();
      } 
    },
    data() {
      return {
        beeLogo,
        deltaY: 0,
        deltaX: 0,
        inTouch: false,
        preNextVisible: false,
        fastTurnPage: false,
        normalTurnPage: false,
        fastTurnPageTime: 200,
        normalTurnPageTime: 360,
        hammerThrehold: 12,
        turnPageThreshold: 20,
        btnTurnPageThreshold: 20,
        addPanTime: 360,
        bgMusicPlaying: true,
        passwordInput: '',
        passwordSendCount: 0,
        passwordCorrect: false,
        autoplayInterval: undefined
      }
    },
    watch: {
      showSceneContent(curVal) {
        if(curVal){
          this.autoPlay();
        }
      },
      'sceneData.play.auto'(curVal) {
        this.autoPlay();
      },
      'sceneData.play.interval'(curVal) {
        this.autoPlay();
      }
    },
    methods: {
      ...mapMutations(['nextPage', 'prePage', 'loadElementSuccess']),
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
      },
      confirmPwd() {
        this.sceneApi.sendPassword({
          code: this.sceneData.code,
          pwd: this.passwordInput
        }).then(res => {
          if(!res.ok){
            return {code: 'fail'};
          }
          return res.json();
        }).then(data => {
          console.log(data);
          this.passwordSendCount++;
          this.passwordCorrect = data.code === 'success'
        });
      },
      autoPlay() {
        const { play: { loop, auto, interval } } = this.sceneData;
        if(!_.isUndefined(this.autoplayInterval)){
          window.clearInterval(this.autoplayInterval);
        }
        if(auto && interval > 0){
          // 模拟点击按钮翻页,实现自动播放
          this.autoplayInterval = setInterval(() => {
            this.VueEventBus.$emit('btnTurnPage', { opt: 'next' });
          }, interval * 1000);
        }
      }
    },
    computed: {
      ...mapGetters(['VueEventBus', 'sceneData', 'sceneLoadedPercentage', 'currentPageIndex', 'loadPageMaxIndex',
      'screenWidth', 'screenHeight', 'editorWidth', 'editorHeight',
      'activePage', 'activePageCanUp', 'activePageCanDown', 'firstLoadComplete', 'sceneApi'
      ]),
      showSceneContent() {
        return !this.showPassword && this.firstLoadComplete && !this.showNoAccess;
      },
      // 判断禁止访问
      showNoAccess() {
        if(this.sceneData.share.mode != 2){
          return false;
        }else{
          return this.firstLoadComplete && this.sceneData.share.mode === 2;
        }
      },
      showPassword() {
        if(this.sceneData.share.mode != 3){
          return false;
        }else{
          return !this.passwordCorrect && this.firstLoadComplete && this.sceneData.share.mode === 3;
        }
      },
      showBgAudio() {
        const { bgAudio } = this.sceneData;
        const { url } = bgAudio;
        return !_.isUndefined(url) && url != '';
      },
      maxPageArray() {
        // 如果还在输入密码状态或者禁止访问,返回空数组(更快的显示界面).
        if(this.showPassword || this.showNoAccess){
          return []
        }
        return this.sceneData.pages.slice(0, this.loadPageMaxIndex);
      },
      // 翻页和不翻页的时长有差异,故定义了两个不同的类.
      phonePageClass() {
        return {
          'animated-page': this.fastTurnPage,
          'animated-page-fast': this.normalTurnPage
        }
      },
      // 翻页模式, 目前有两种,左右和上下
      turnPageMode() {
        const pageMode = this.activePage.pageOption.turnPageMode;
        if (pageMode === 0) {
          return this.sceneData.pageMode;
        } else {
          return pageMode;
        }
      },
      // 前一页的样式, 控制显示的位置
      prePageStyle() {
        const style = {
          transform: this.turnPageMode === 1 ? `translateY(-${this.screenHeight - this.deltaY}px)` : `translateX(-${this.screenWidth - this.deltaX}px)`,
          display: this.preNextVisible ? '' : 'none',
          width: `${this.screenWidth}px`,
          height: `${this.screenHeight}px`
        };
        return style;
      },
      // 当前页的样式
      activePageStyle() {
        const style = {
          transform: this.turnPageMode === 1 ? `translateY(${this.deltaY}px)` : `translateX(${this.deltaX}px)`,
          width: `${this.screenWidth}px`,
          height: `${this.screenHeight}px`
        };
        return style;
      },
      // 后一页的样式
      nextPageStyle() {
        const style = {
          transform: this.turnPageMode === 1 ? `translateY(${this.screenHeight + this.deltaY}px)` : `translateX(${this.screenWidth + this.deltaX}px)`,
          display: this.preNextVisible ? '' : 'none',
          width: `${this.screenWidth}px`,
          height: `${this.screenHeight}px`
        };
        return style;
      },
      // 隐藏页的样式
      hidePageStyle() {
        return {
          display: 'none',
          width: `${this.screenWidth}px`,
          height: `${this.screenHeight}px`
        };
      },
      finalScale() {
        /*const hScale = this.screenHeight / this.editorHeight;
        const wScale = this.screenWidth / this.editorWidth;
        return Math.min(hScale, wScale);*/
        // 这里缩放比例都以宽度为准
        return this.screenWidth / this.editorWidth;
      },
      // 是否应停止panUp当前页, 禁止翻页只是禁止向下一页翻. 因此需要进行翻页模式的判断
      shouldStopPanUp(){
        const { pageOption: {banTurnPage, turnPageMode} } = this.activePage;
        const stopPanUp = banTurnPage && turnPageMode === 1 && this.activePageCanUp;
        return stopPanUp;
      },
      shouldStopPanLeft(){
        const { pageOption: {banTurnPage, turnPageMode} } = this.activePage;
        const stopPanLeft = banTurnPage && turnPageMode === 2;
        return stopPanLeft;
      }
    },
    components: {
      PhonePage,
      Loading
    }
  }

</script>
