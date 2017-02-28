<template>
  <input class="basic-input" type="text"
      :placeholder="eleData.properties.name"
      v-model.trim="eleData.properties.data"
      maxlength="200"
      :style="eleData.properties.style"
      :required="eleData.properties.required" />
</template>

<script>
export default {
  props: ['eleData']
}
</script>