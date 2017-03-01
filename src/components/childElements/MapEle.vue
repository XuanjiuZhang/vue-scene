<template>
  <div :id="eleData.id + '-innerMap'"></div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
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
      this.mapInstance = new BMap.Map(this.eleData.id + '-innerMap');
      this.$watch('sceneLoadedPercentage', (newValue, oldValue) => {
        if(newValue === 100){
          this.initMap();
          this.$off('sceneLoadedPercentage');
        }
      });
    });
  },
  computed: {
    ...mapGetters(['sceneLoadedPercentage'])
  },
  methods: {
    ...mapActions(['loadBmap']),
    ...mapMutations(['loadElementSuccess']),
    initMap(){
      const { properties: { currentCity, currentAddress} } = this.eleData;
      // 禁用地图拖拽
      this.mapInstance.disableDragging();
      // // 禁用双击放大
      // this.mapInstance.enableDoubleClickZoom();
      // // 禁用双指操作缩放
      // this.mapInstance.disablePinchToZoom();
      const BMapPoint = new BMap.Point(currentCity.center.lng, currentCity.center.lat);

      this.mapInstance.clearOverlays();
      if(currentAddress && currentAddress.title){
        const opts = {
          position : BMapPoint,    // 指定文本标注所在的地理位置
          offset   : new BMap.Size(10, -30)    //设置文本偏移量
        }; 
        const label = new BMap.Label(currentAddress.title, opts);
        this.mapInstance.addOverlay(label);
      }
      const marker = new BMap.Marker(BMapPoint);
      this.mapInstance.addOverlay(marker);
      this.mapInstance.centerAndZoom(BMapPoint, currentCity.level);
    }
  },
}
</script>
