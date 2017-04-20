<template>
  <div>
    <div class="full-screen" :id="eleData.id + '-innerMap'"></div>
  </div>
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
    this.loadBmap().then(BMap => {
      if(this.sceneLoadedPercentage === 100){
        this.initMap();
      }else{
        this.$watch('sceneLoadedPercentage', (newValue, oldValue) => {
          if(newValue === 100){
            this.initMap();
            this.$off('sceneLoadedPercentage');
          }
        });
      }
    });
  },
  computed: {
    ...mapGetters(['sceneLoadedPercentage'])
  },
  /*watch: {
    sceneLoadedPercentage(curVal) {
      if(curVal === 100){
        this.initMap();
        this.$off('sceneLoadedPercentage');
      }
    }
  },*/
  methods: {
    ...mapActions(['loadBmap']),
    ...mapMutations(['loadElementSuccess']),
    initMap(){
      const { properties: { currentCity, currentAddress} } = this.eleData;
      this.mapInstance = new BMap.Map(this.eleData.id + '-innerMap');
      // 禁用地图拖拽
      this.mapInstance.disableDragging();
      // 禁用双击放大
      this.mapInstance.enableDoubleClickZoom();
      // 禁用双指操作缩放
      this.mapInstance.disablePinchToZoom();

      
      this.mapInstance.clearOverlays();
      if(currentAddress){
        let {lat, lng, level, title} = currentAddress;
        let BMapPoint = new BMap.Point(lng, lat);
        let opts = {
          position : BMapPoint,   // 指定文本标注所在的地理位置
          offset   : new BMap.Size(10, -30)    //设置文本偏移量
        }; 
        if(title){
          let label = new BMap.Label(title, opts);
          this.mapInstance.addOverlay(label);
        } 
        let marker = new BMap.Marker(BMapPoint);
        this.mapInstance.addOverlay(marker);
        this.mapInstance.centerAndZoom(BMapPoint, currentCity.level);
      }else if(currentCity){
        let {center, level} = currentCity;
        let BMapPoint = new BMap.Point(center.lng, center.lat);
        let marker = new BMap.Marker(BMapPoint);
        this.mapInstance.addOverlay(marker);
        this.mapInstance.centerAndZoom(BMapPoint, level);
      } 
      this.loadElementSuccess();
    }
  },
}
</script>
