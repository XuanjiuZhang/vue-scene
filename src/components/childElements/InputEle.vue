<template>
  <div>
    <input class="basic-input" type="text"
      :placeholder="eleData.properties.name"
      v-model.trim="eleData.properties.data"
      maxlength="200"
      style="font-size: 100%"
      :style="eleData.properties.style"
      :required="eleData.properties.required" />
  </div>
</template>

<script>
export default {
  props: ['eleData']
}
</script>
