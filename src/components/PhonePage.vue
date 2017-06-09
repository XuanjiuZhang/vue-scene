<style lang="less">
  .trailer-label-level {
    z-index: 999999
  }
  
  .input-transform {
    transition: .35s;
  }
</style>
<template>
  <div :style="pageStyle" ref="phonePage" :class="phonePageClass">
    <SceneEle v-for="ele in pageData.elements" :key="ele.id" v-bind="{eleData: ele, pageIndex: index, finalScale, pageData}"></SceneEle>

    <div class="page-number" v-show="sceneData.showPageNo" style="display: block; z-index: 999999;">
      <em class="page-tip">{{index + 1}} / {{sceneData.pages.length}}</em>
    </div>

    <div class="trailer-label trailer-label-level" v-if="index === sceneData.pages.length - 1
     && sceneData.trailerLabel && sceneData.trailerLabel.type != 3">
      <a v-if="sceneData.trailerLabel.type === 1" :href="parsedTrailerLink" :class="{
            'grey': sceneData.trailerLabel.style === 1,
            'red': sceneData.trailerLabel.style === 2,
            'green': sceneData.trailerLabel.style === 3
        }" target="_blank" class="label-link">
        [小蜜蜂]技术支持
        </a>
        <a v-if="sceneData.trailerLabel.type === 2" :href="parsedTrademarkInfoSite" :class="{
            'grey': sceneData.trailerLabel.style === 1,
            'red': sceneData.trailerLabel.style === 2,
            'green': sceneData.trailerLabel.style === 3
            }" target="_blank" class="label-link">
          {{sceneData.trailerLabel.trademarkInfoName}} | [小蜜蜂]技术支持
          </a>
  </div>

  <div v-show="showArrow" :class="arrowClass" style="position: fixed">
    <div class="arrow-wrap">
      <div class="arrow-part-1">
        <div class="part-1"></div>
      </div>
      <div class="arrow-part-2">
        <div class="part-2"></div>
      </div>
    </div>
  </div>

  </div>
</template>

<script>
  import {
    mapMutations,
    mapGetters,
    mapActions
  } from 'vuex';
  import SceneEle from './SceneEle.vue';

  export default {
    props: ['pageData', 'index', 'finalScale', 'sceneInTouch'],
    created() { },
    mounted() {
      const panstart = (event) => {
        this.inTouch = true;
        this.startData = Object.assign({}, {
          deltaY: this.deltaY
        });
      };
      const throttlePanstart = _.throttle(panstart, 200);
      const panEnd = (event) => {
        this.inTouch = false;
        setTimeout(() => {
          defineUpDown();
        }, 100);
      };
      const throttlePanEnd = _.throttle(panEnd, 200);

      const changeLongPageProgress = (percent) => {
        this.VueEventBus.$emit('changeLongPageProgress', percent);
      };

      const panUp = (event) => {
        if (this.inTouch) {
          const {
            deltaY
          } = event;
          const maxRange = this.screenHeight
            - this.pageData.pageOption.pageSize * this.finalScale;
          this.deltaY = Math.min(0, Math.max(this.startData.deltaY + deltaY, maxRange));
          const percent = Math.abs(this.deltaY) / Math.abs(maxRange) * 100
          changeLongPageProgress(percent);
        }
      };
      const panDown = (event) => {
        if (this.inTouch) {
          const {
            deltaY
          } = event;
          const maxRange = this.screenHeight
            - this.pageData.pageOption.pageSize * this.finalScale;
          this.deltaY = Math.min(0, Math.max(this.startData.deltaY + deltaY, maxRange));
          const percent = Math.abs(this.deltaY) / Math.abs(maxRange) * 100
          changeLongPageProgress(percent);
        }
      };
      const initHammer = () => {
        this.HammerManager = new Hammer.Manager(this.$refs.phonePage);
        this.HammerManager.on('panstart', throttlePanstart);
        this.HammerManager.on('panend', throttlePanEnd);
        this.HammerManager.on('panup', panUp);
        this.HammerManager.on('pandown', panDown);
        this.Pan = new Hammer.Pan({
          event: 'pan',
          pointers: 0,
          threshold: 5,
          direction: Hammer.DIRECTION_VERTICAL
        });
        this.HammerManager.add(this.Pan);
      };
      if (this.pageData.pageOption.longPage && this.pageData.pageOption.pageSize * this.finalScale > this.screenHeight) {
        initHammer();
      }

      const defineUpDown = () => {
        if (this.currentPageIndex === this.index) {
          // 不是长页面 或者页面高度小于一个屏幕的高度, 可以翻页
          if (!this.pageData.pageOption.longPage || this.pageData.pageOption.pageSize * this.finalScale <= this.screenHeight) {
            this.activePageCanUpDown({
              down: true,
              up: true
            });
          } else {
            let down = this.deltaY === 0;
            let up = this.deltaY === this.screenHeight - this.pageData.pageOption.pageSize * this.finalScale;
            this.changeCurrentPageDeltaY({ currentPageDeltaY: this.deltaY });
            this.activePageCanUpDown({ down, up });
          }
        }
      };

      this.$watch('currentPageIndex', (newValue) => {
        defineUpDown();
        if (newValue != this.index) {
          this.deltaY = 0;
          changeLongPageProgress(0);
        }
      });

      defineUpDown();
    },
    watch: {
      'currentFocusInput'(newVal) {
        console.log(window.isMobile);
        if (_.isUndefined(window.isMobile) || window.isMobile === 'false') {
          return;
        }
        if (!_.isUndefined(window.userAgent) && /iphone|ipad|mac/i.test(window.userAgent.toLowerCase())) {
          console.log('ios currentFocusInput');
          return;
        }
        console.log('android currentFocusInput');
        if (this.currentPageIndex === this.index && !_.isUndefined(newVal)) {
          // caculate screen position
          var pageSize = 0;
          const pageOption = this.pageData.pageOption;
          if (this.showPageProgress) {
            pageSize = pageOption.pageSize * this.finalScale;
          } else {
            pageSize = this.screenHeight;
          }
          const screenTop = (parseInt(this.currentFocusElement.transCss.top) / 100 * pageSize + newVal.offsetTop + this.deltaY) / this.screenHeight * 100;
          console.log('screenTop');
          console.log(screenTop);
          if (screenTop > this.maxInputScreenTop) {
            this.phonePageClass['input-transform'] = true;
            this.savedDeltaY = this.deltaY;
            let movePercent = Math.abs(screenTop - this.adjustInputScreenTop);
            this.deltaY -= movePercent / 100 * this.screenHeight;
            console.log('adjust!');
            setTimeout(() => {
              this.phonePageClass['input-transform'] = false;
            }, this.adjustTime);
          } else if (screenTop < this.minInputScreenTop) {
            this.phonePageClass['input-transform'] = true;
            this.savedDeltaY = this.deltaY;
            let movePercent = Math.abs(screenTop - this.adjustInputScreenTop);
            this.deltaY += movePercent / 100 * this.screenHeight;
            console.log('adjust!');
            setTimeout(() => {
              this.phonePageClass['input-transform'] = false;
            }, this.adjustTime);
          }
        } else if (this.currentPageIndex === this.index && _.isUndefined(newVal)) {
          // this.deltaY = this.savedDeltaY;
          if (!this.pageData.pageOption.longPage || this.pageData.pageOption.pageSize * this.finalScale <= this.screenHeight) {
            this.deltaY = this.savedDeltaY;
          }
          if (this.pageData.pageOption.longPage && this.pageData.pageOption.pageSize * this.finalScale > this.screenHeight) {
            if (this.deltaY > 0) {
              this.deltaY = 0;
            }
            if (this.deltaY < this.screenHeight - this.pageData.pageOption.pageSize * this.finalScale) {
              this.deltaY = this.screenHeight - this.pageData.pageOption.pageSize * this.finalScale;
            }
          }
          this.phonePageClass['input-transform'] = false;
        }
      }
    },
    methods: {
      ...mapMutations(['activePageCanUpDown', 'changeCurrentPageDeltaY'])
    },
    data() {
      return {
        deltaY: 0,
        savedDeltaY: 0,
        minInputScreenTop: 8,
        maxInputScreenTop: 28,
        adjustInputScreenTop: 20,
        adjustTime: 350,
        phonePageClass: {
          phonePage: true,
          'input-transform': false,
        }
      }
    },
    computed: {
      ...mapGetters(['sceneData', 'screenWidth', 'screenHeight', 'currentPageIndex', 'editorWidth', 'currentFocusInput', 'currentFocusElement', 'VueEventBus']),
      showArrow() {
        // 只有一页不显示翻页箭头
        if (this.sceneData.pages.length === 1) {
          return false;
        }
        var show = true;
        if (this.pageData.pageOption.banTurnPage) {
          show = false;
        } else if (this.index === this.sceneData.pages.length - 1) {
          show = this.sceneData.play.loop ? true : false;
        }
        // return this.sceneInTouch && show;
        return show;

      },
      arrowClass() {
        var horizontal = false;
        if (this.pageData.pageOption.turnPageMode === 0) {
          this.sceneData.pageMode === 1 ? horizontal = false : horizontal = true;
        } else {
          this.pageData.pageOption.turnPageMode === 1 ? horizontal = false : horizontal = true;
        }
        const classData = {
          'page-horizontal-arrow': horizontal,
          'page-arrow': !horizontal
        };
        return classData;
      },
      pageStyle: function () {
        const {
          pageOption = {
            longPage: false,
            pageSize: this.screenHeight
          },
          pageBackground = {
            image: '',
            color: ''
          }
        } = this.pageData;
        return {
          // height: pageOption.longPage && (pageOption.pageSize > this.screenHeight) ?
          //  pageOption.pageSize * this.finalScale + 'px' : '100%',
          // 如果页面是长页面且原始高度按比例缩放以后大于当前屏幕高度, 则使用缩放以后的高度; 否则采用100%屏幕高度.
          height: this.showPageProgress ?
            pageOption.pageSize * this.finalScale + 'px' : '100%',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          transform: `translateY(${this.deltaY}px)`,
          backgroundImage: pageBackground.image === '' ? '' : 'url(' + pageBackground.image + ')',
          backgroundColor: pageBackground.color,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          fontSize: this.finalScale * 100 + '%'
        };
      },
      parsedTrailerLink() {
        const outLink = this.sceneData.trailerLabel.labelLink;
        if (outLink && outLink.indexOf('http://') < 0 && outLink.indexOf('https://') < 0 && outLink.indexOf('ftp://') < 0 && outLink.indexOf('rtsp://') < 0 && outLink.indexOf('mms://') < 0) {
          return 'http://' + outLink;
        } else {
          return outLink;
        }
      },
      parsedTrademarkInfoSite() {
        const outLink = this.sceneData.trailerLabel.trademarkInfoSite;
        if (outLink && outLink.indexOf('http://') < 0 && outLink.indexOf('https://') < 0 && outLink.indexOf('ftp://') < 0 && outLink.indexOf('rtsp://') < 0 && outLink.indexOf('mms://') < 0) {
          return 'http://' + outLink;
        } else {
          return outLink;
        }
      },
      showPageProgress() {
        const {
          pageOption = {
            longPage: false,
            pageSize: this.screenHeight
          }
        } = this.pageData;
        return pageOption.longPage && (pageOption.pageSize * this.finalScale > this.screenHeight);
      }
    },
    components: {
      SceneEle
    }
  }

</script>
