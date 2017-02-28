<template>
  <el-carousel indicator-position="none"
   :interval="eleData.properties.playInterval * 1000" :autoplay="eleData.properties.autoplay">
    <el-carousel-item v-for="(pic, index) in eleData.properties.pictures" :key="index">
      <img :src="pic" :alt="eleData.name" :ref="'img' + index">
    </el-carousel-item>
  </el-carousel>
</template>

<script>
  import {
    mapMutations
  } from 'vuex';

  export default {
    props: ['eleData'],
    data() {
      return {
        loadedImageNumber: 0,
        failedImageNumber: 0
      }
    },
    mounted() {
      const imgArray = _.flatten(_.values(this.$refs));
      console.log(imgArray);
      const load1ImageSuc = () => {
        this.loadedImageNumber++;
        if (this.loadedImageNumber === imgArray.length) {
          this.loadElementSuccess();
        }
      };
      const load1ImageFail = () => {
        this.failedImageNumber++;
        // console.log('load1ImageFail');
      };
      imgArray.forEach((image) => {
        image.onload = load1ImageSuc;
        image.onerror = load1ImageFail;
      });

      this.loadElementSuccess();
    },
    methods: {
      ...mapMutations(['loadElementSuccess'])
    }
  }
</script>