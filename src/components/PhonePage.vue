<style lang="less">
  .trailer-label-level {
    z-index: 999999
  }
</style>
<template>
    <div class="phonePage" :style="pageStyle" ref="phonePage">
        <SceneEle v-for="ele in pageData.elements" :key="ele.id"
         v-bind="{eleData: ele, pageIndex: index, finalScale, pageData}"></SceneEle>

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
    created() {},
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
      
      const panUp = (event) => {
        if (this.inTouch) {
          const {
            deltaY
          } = event;
          this.deltaY = Math.min(0, Math.max(this.startData.deltaY + deltaY, this.screenHeight - this.pageData.pageOption.pageSize));
        }
      };
      const panDown = (event) => {
        if (this.inTouch) {
          const {
            deltaY
          } = event;
          this.deltaY = Math.min(0, Math.max(this.startData.deltaY + deltaY, this.screenHeight - this.pageData.pageOption.pageSize));
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
      if (this.pageData.pageOption.longPage && this.pageData.pageOption.pageSize > this.screenHeight) {
        initHammer();
      }

      const defineUpDown = () => {
        if (this.currentPageIndex === this.index) {
          // 不是长页面 或者页面高度小于一个屏幕的高度, 可以翻页
          if (!this.pageData.pageOption.longPage || this.pageData.pageOption.pageSize <= this.screenHeight) {
            this.activePageCanUpDown({
              down: true,
              up: true
            });
          } else {
            let down = this.deltaY === 0;
            let up = this.deltaY === this.screenHeight - this.pageData.pageOption.pageSize;
            this.changeCurrentPageDeltaY({currentPageDeltaY: this.deltaY});
            this.activePageCanUpDown({ down, up });
          }
        }
      };

      this.$watch('currentPageIndex', (newValue) => {
        defineUpDown();
      });

      defineUpDown();
    },
    methods: {
      ...mapMutations(['activePageCanUpDown', 'changeCurrentPageDeltaY'])
    },
    data() {
      return {
        deltaY: 0
      }
    },
    computed: {
      ...mapGetters(['sceneData', 'screenWidth', 'screenHeight', 'currentPageIndex']),
      showArrow() {
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
      pageStyle: function() {
        const {
          pageOption = {
              longPage: false,
              pageSize: 486
            },
            pageBackground = {
              image: '',
              color: ''
            }
        } = this.pageData;
        return {
          height: pageOption.longPage && (pageOption.pageSize > this.screenHeight) ? pageOption.pageSize + 'px' : '100%',
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
        if(outLink.indexOf('http://') < 0 && outLink.indexOf('https://') < 0 && outLink.indexOf('ftp://') < 0 && outLink.indexOf('rtsp://') < 0 && outLink.indexOf('mms://') < 0){
          return 'http://' + outLink;
        }else{
          return outLink;
        }
      },
      parsedTrademarkInfoSite() {
        const outLink = this.sceneData.trailerLabel.trademarkInfoSite;
        if(outLink.indexOf('http://') < 0 && outLink.indexOf('https://') < 0 && outLink.indexOf('ftp://') < 0 && outLink.indexOf('rtsp://') < 0 && outLink.indexOf('mms://') < 0){
          return 'http://' + outLink;
        }else{
          return outLink;
        }
      }
    },
    components: {
      SceneEle
    }
  }
</script>
