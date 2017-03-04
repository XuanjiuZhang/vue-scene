<template>
  <div v-html="eleData.properties.svg">
  </div>
</template>

<script>
export default { 
  props: ['eleData']
}
</script>
