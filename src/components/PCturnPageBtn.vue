<template>
  <div>
    <div class="turn-page pre" @click="handlePrePage">上一页</div>
    <div class="turn-page next" @click="handleNextPage">下一页</div>
  </div>
</template>

<style lang="less" scoped>
  .turn-page {
    width: 100%;
    height: 75px;
    padding: 8px 10px 7px;
    background: #00d1e9;
    text-align: center;
    color: #fff;
    font-size: 16px;
    line-height: 20px;
    cursor: pointer;
    &.pre {
      margin-bottom: 10px;
    }
    &.next {
      margin-bottom: 0;
    }
  }
</style>

<script>
import {
    mapGetters
  } from 'vuex';

export default {
  computed: {
    ...mapGetters(['VueEventBus']),
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
