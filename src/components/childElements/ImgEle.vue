<template>
  <div>
    <img :style="imgStyle" :src="eleData.properties.src" :alt="eleData.name" draggable="false" ref="img">
  </div>
</template>

<style lang="less">
</style>

<script>
import { mapMutations, mapGetters } from 'vuex';
export default {
  props: ['eleData'],
  mounted(){
    this.$refs.img.onload = () => {
      // console.log(this.eleData.properties.src, '图片加载成功!');
      this.loadElementSuccess();
    };
    this.$refs.img.onerror = () => {
      this.loadElementSuccess();
      // console.log(this.eleData.id, '图片加载失败!');
    };
    // setTimeout(() => {
    //   this.loadElementSuccess();
    // }, Math.random() * 800);
  },
  methods: {
    ...mapMutations(['loadElementSuccess'])
  },
  computed: {
    ...mapGetters(['screenWidth', 'screenHeight', 'editorWidth', 'editorHeight']),
    imgStyle() {
      const editorWh = this.editorWidth / this.editorHeight;
      const screenWh = this.screenWidth / this.screenHeight;
      return {
          width: '100%',
          height: '100%'
        }
      /*if(screenWh > editorWh){
        return {
          width: '100%',
          height: '100%'
        }
      }else{
        return {
          width: '100%',
        }
      }*/
    }
  }
}
</script>
