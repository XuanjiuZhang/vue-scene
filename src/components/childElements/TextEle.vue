<template>
  <div class="text-element">
    <div :style="eleData.properties.textStyle" v-html="eleData.content"></div>
  </div>
</template>

<script>
export default {
  props: ['eleData']
}
</script>
