<template>
  <div class="phonePage" :style="pageStyle">
    <SceneEle v-for="ele in pageData.elements" :key="ele.id" v-bind="{eleData: ele, pageIndex: index, finalScale}"></SceneEle>
  </div>
</template>

<style lang="less">
</style>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';
import SceneEle from './SceneEle.vue';

export default {
  props: ['pageData', 'index'], 
  created(){
    // console.log(this.index);
    // this.defaultScreenHeight = '486px';
  },
  data(){
    return {
      screenHeight: document.body.offsetHeight,
      screenWidth: document.body.offsetWidth
    } 
  },
  computed: {
    ...mapGetters(['editorWidth', 'editorHeight']),
    pageStyle: function(){
      const { pageOption = {longPage: false, pageSize: 486} } = this.pageData;
      return {
        height: pageOption.longPage && (pageOption.pageSize > this.screenHeight) ? pageOption.pageSize + 'px' : '100%',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        transform: `translateY(0)`
      };
    },
    finalScale: function(){
      const hScale = this.screenHeight / this.editorHeight;
      const wScale = this.screenWidth / this.editorWidth;
      return Math.min(hScale, wScale);
    }
  },
  components: { SceneEle }
}
</script>