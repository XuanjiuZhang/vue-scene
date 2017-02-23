<template>
  <div class="phonePage" :style="pageStyle">
    <SceneEle v-for="ele in pageData.elements" :eleData="ele"></SceneEle>
  </div>
</template>

<style lang="less">
</style>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';
import SceneEle from './SceneEle.vue';

export default {
  props: ['pageData'], 
  data(){
    return {
      msg: 'hello!' 
    } 
  },
  computed: {
      pageStyle: function(){
          return {
              height: this.pageData.pageOption.longPage ? this.pageData.pageOption.pageSize + 'px' : '486px',
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
              transform: `translateY(0)`
          };
      }
  },
  components: { SceneEle }
}
</script>