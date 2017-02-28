<template>
  <form name="contactForm" class="contact-form">
    <div class="contact-input" v-for="formField in eleData.properties.formData">
      <input v-model.trim="formField.data"
      type="text" :required="formField.required"
      :style="eleData.properties.inputStyle" :placeholder="formField.fieldName">
    </div>
  </form>
</template>

<script>
export default {
  props: ['eleData']
}
</script>