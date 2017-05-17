<template>
  <div>
    <div class="full-screen" :id="eleData.id + '-innerMap'"></div>
    <a v-show="full" style="position:fixed;bottom: 0;right: 10px;font-size: 30px" @click="closeFullScreen" class="close_mask">×</a>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapActions, mapMutations, mapGetters } from 'vuex';
export default {
  props: ['eleData', 'pageIndex'],
  data(){
    return {
      inited: false,
      mapInstance: undefined,
      full: false,
      BMapPoint: undefined,
    };
  },
  mounted(){
    this.loadElementSuccess();
    if(this.currentPageIndex === this.pageIndex) {
      this.preInit();
    }
  },
  computed: {
    ...mapGetters(['sceneLoadedPercentage', 'currentPageIndex'])
  },
  watch: {
    'currentPageIndex'(current) {
      if(this.pageIndex === current){
        this.preInit();
        this.$off('currentPageIndex');
      }
    }
  },
  methods: {
    ...mapActions(['loadBmap']),
    ...mapMutations(['loadElementSuccess', 'mapFullScreen']),
    preInit() {
      this.loadBmap().then(BMap => {
        console.log(this.sceneLoadedPercentage);
        if(this.sceneLoadedPercentage === 100){
          this.initMap(false);
        }else{
          this.$watch('sceneLoadedPercentage', (newValue, oldValue) => {
            if(newValue === 100){
              this.initMap(false);
              this.$off('sceneLoadedPercentage');
            }
          });
        }
      });
    },
    initMap(reload){
      if(this.inited && !reload) {
        return;
      }
      const { properties: { currentCity, currentAddress} } = this.eleData;
      this.mapInstance = new BMap.Map(this.eleData.id + '-innerMap');
      // 禁用地图拖拽
      // this.mapInstance.disableDragging();
      // 禁用双击放大
      this.mapInstance.enableDoubleClickZoom();
      // 禁用双指操作缩放
      // this.mapInstance.disablePinchToZoom();

      this.mapInstance.clearOverlays();
      console.log(this.eleData.properties);
      if(currentAddress){
        console.log('use currentAddress!');
        let {lat, lng, level, title} = currentAddress;
        this.BMapPoint = new BMap.Point(lng, lat);
        let opts = {
          position : this.BMapPoint,   // 指定文本标注所在的地理位置
          offset   : new BMap.Size(10, -30)    //设置文本偏移量
        }; 
        if(title){
          let label = new BMap.Label(title, opts);
          this.mapInstance.addOverlay(label);
        } 
        let marker = new BMap.Marker(this.BMapPoint);
        this.markerFullScreen(marker);
        this.mapInstance.addOverlay(marker);
        this.mapInstance.centerAndZoom(this.BMapPoint, level);
      }else if(currentCity){
        console.log('use currentCity!');
        let {center, level} = currentCity;
        this.BMapPoint = new BMap.Point(center.lng, center.lat);
        let marker = new BMap.Marker(this.BMapPoint);
        this.markerFullScreen(marker);
        this.mapInstance.addOverlay(marker);
        this.mapInstance.centerAndZoom(this.BMapPoint, level);
      } 
      this.inited = true;
    },
    closeFullScreen() {
      this.full = false;
      this.mapFullScreen({eleData: this.eleData, full: this.full});
      setTimeout(() => {
          this.initMap(true);
          this.mapInstance.centerAndZoom(this.BMapPoint, this.mapInstance.getZoom());
        }, 300);
    },
    markerFullScreen(marker) {
      marker.addEventListener('click', () => {
        if(this.full){
          return;
        }
        this.full = true;
        this.mapFullScreen({eleData: this.eleData, full: this.full});
        setTimeout(() => {
            this.initMap(true);
            this.mapInstance.centerAndZoom(this.BMapPoint, this.mapInstance.getZoom());
          }, 300);
      });
    }
  },
}
</script>
