<template>
  <div>
    <img :src="eleData.properties.src" :alt="eleData.name" draggable="false" ref="img">
  </div>
</template>

<style lang="less">
</style>

<script>
import { mapMutations } from 'vuex';
export default {
  props: ['eleData'],
  mounted(){
    this.$refs.img.onload = () => {
      console.log(this.eleData.properties.src, '图片加载成功!');
      this.loadElementSuccess();
    };
    this.$refs.img.onerror = () => {
      this.loadElementSuccess();
      console.log(this.eleData.properties.src, '图片加载失败!');
    };
    // setTimeout(() => {
    //   this.loadElementSuccess();
    // }, Math.random() * 800);
  },
  methods: {
    ...mapMutations(['loadElementSuccess'])
  },
}
</script>
