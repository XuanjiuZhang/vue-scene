<template>
  <div class="phonePage" :style="pageStyle">
    <SceneEle v-for="ele in pageData.elements" :key="ele.id" v-bind="{eleData: ele, pageIndex: index, finalScale}"></SceneEle>

    <div class="page-number" ng-show="scene.showPageNo" style="display: block; z-index: 100;">
      <!--<slot name="pageNumber"></slot>-->
      <em class="page-tip">{{index + 1}} / {{sceneData.pages.length}}</em>
    </div>

    <div class="trailer-label">
      <slot name="trailerLabel"></slot>
    </div>

    <div v-if="showArrow" :class="arrowClass" style="position: fixed">
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

<style lang="less">

</style>

<script>
    import {
        mapMutations,
        mapGetters,
        mapActions
    } from 'vuex';
    import SceneEle from './SceneEle.vue';

    export default {
        props: ['pageData', 'index'],
        created() {},
        data() {
            return {
                screenHeight: document.body.offsetHeight,
                screenWidth: document.body.offsetWidth
            }
        },
        computed: {
            ...mapGetters(['editorWidth', 'editorHeight', 'sceneData']),
            showArrow() {
                var show = true;
                if (this.pageData.pageOption.banTurnPage) {
                    show = false;
                } else if (this.index === this.sceneData.pages.length - 1) {
                    show = this.sceneData.play.loop ? true : false;
                }
                return show;
            },
            arrowClass() {
                var horizontal = false;
                if (this.pageData.pageOption.turnPageMode === 0) {
                    this.sceneData.pageMode === 1 ? horizontal = false : horizontal = true;
                } else {
                    console.log(this.pageData.pageOption.turnPageMode);
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
                    }
                } = this.pageData;
                return {
                    height: pageOption.longPage && (pageOption.pageSize > this.screenHeight) ? pageOption.pageSize + 'px' : '100%',
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    transform: `translateY(0)`
                };
            },
            finalScale: function() {
                const hScale = this.screenHeight / this.editorHeight;
                const wScale = this.screenWidth / this.editorWidth;
                return Math.min(hScale, wScale);
            }
        },
        components: {
            SceneEle
        }
    }
</script>