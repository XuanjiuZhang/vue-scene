<template>
  <div>
    <a class="pre-page hover" @click="handlePrePage"><i class="e-icon e-triangle-top"></i></a>
    <p>{{currentPageIndex + 1}} / {{pages.length}}</p>
    <a class="next-page hover" @click="handleNextPage"><i class="e-icon e-triangle-bottom"></i></a>
  </div>
</template>

<style lang="less" scoped>
</style>

<script>
import {
    mapGetters
  } from 'vuex';

export default {
  computed: {
    ...mapGetters(['VueEventBus', 'currentPageIndex', 'pages']),
    handlePrePage(){
      return _.throttle(() => {
        this.VueEventBus.$emit('btnTurnPage', { opt: 'pre' });
      }, 500);
    },
    handleNextPage(){
      return _.throttle(() => {
        this.VueEventBus.$emit('btnTurnPage', { opt: 'next' });
      }, 500);
    },
  }
}
</script>
