<template>
  <form name="contactForm" class="contact-form">
    <div v-for="(formField, index) in eleData.properties.formData" :key="index"
     class="contact-input" :style="contactStyle">
      <input v-model.trim="formField.data" type="text" :required="formField.required"
       :style="contactStyle" :placeholder="formField.fieldName">
    </div>
  </form>
</template>

<script>
  export default {
    props: ['eleData', 'finalScale'],
    computed: {
      contactStyle() {
        const { properties } = this.eleData;
        const { inputStyle } = properties;
        return Object.assign({}, inputStyle, { 'height': `${parseInt(inputStyle.height) * this.finalScale}px` });
      }
    },
  }

</script>
