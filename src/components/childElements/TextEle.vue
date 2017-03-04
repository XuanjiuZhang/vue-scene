<template>
  <div class="text-element" :style="eleData.properties.textStyle" v-html="eleData.content">
  </div>
</template>

<script>
export default {
  props: ['eleData']
}
</script>
