<template>
  <div class="scene-loading">
    <div class="loading-bee">
        <div class="progress-cont">
        <div class="load-pie1"></div>
        <div class="load-pie2" :style="loadPie2Style">
        </div>
        <div class="load-pie3" :style="loadPie3Style">
        </div>
        <div class="bee-img"></div>
        </div>
        <p class="progress-discribe">{{ sceneLoadedPercentage }}</p>
    </div>
  </div>
</template>

<style lang="less">
</style>

<script>
export default {
  props: ['sceneLoadedPercentage'],
  computed: {
    loadPie2Style(){
      const ratateDeg = Math.round(360 * this.sceneLoadedPercentage / 100 - 180);
      return {
        transform: `rotate(${ratateDeg}deg)`,
        display: this.sceneLoadedPercentage < 50 ? 'none' : ''
      }
    },
    loadPie3Style(){
      const ratateDeg = Math.round(360 * this.sceneLoadedPercentage / 100);
      return {
        transform: `rotate(${ratateDeg}deg)`,
        display: this.sceneLoadedPercentage >= 50 ? 'none' : ''
      }
    }
  }
}
</script>