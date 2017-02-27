<template>
  <div :id="eleData.id"></div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
export default {
  props: ['eleData'],
  data(){
    return {
      mapInstance: undefined
    };
  },
  mounted(){
    this.loadBmap().then((BMap) => {
      this.loadElementSuccess();
      const { properties } = this.eleData;
      const { currentCity } = properties;
      
      this.mapInstance = new BMap.Map(this.eleData.id + '');
      // 禁用地图拖拽
      this.mapInstance.disableDragging();
      // // 禁用双击放大
      // this.mapInstance.enableDoubleClickZoom();
      // // 禁用双指操作缩放
      // this.mapInstance.disablePinchToZoom();
      this.mapInstance.centerAndZoom(new BMap.Point(currentCity.center.lng, currentCity.center.lat), currentCity.level);
    });
  },
  methods: {
    ...mapActions(['loadBmap']),
    ...mapMutations(['loadElementSuccess'])
  },
}
</script>