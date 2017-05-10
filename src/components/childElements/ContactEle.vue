<template>
  <div>
    <form name="contactForm" class="contact-form">
      <div v-for="(formField, index) in eleData.properties.formData" :key="index"
      class="contact-input" :style="contactDivStyle">
        <input v-model.trim="formField.data" type="text" :required="formField.required"
        :style="contactStyle" :placeholder="formField.fieldName"
          @focus="handleFocus" @blur="handleBlur">
      </div>
    </form>
  </div>
</template>

<script>
  import {
    mapMutations,
  } from 'vuex';
  export default {
    props: ['eleData', 'finalScale'],
    methods: {
      ...mapMutations(['visualInput']),
      handleFocus(e) {
        setTimeout(() => {
          this.visualInput({eleData: this.eleData, domTarget: e.target, focused: true});
        });
      },
      handleBlur() {
        this.visualInput({focused: false});
      }
    },
    computed: {
      contactStyle() {
        const { properties } = this.eleData;
        const { inputStyle } = properties;
        return Object.assign({}, inputStyle, { 'height': `${parseInt(inputStyle.height) * this.finalScale}px` });
      },
      contactDivStyle() {
        const { properties } = this.eleData;
        const { inputStyle } = properties;
        return Object.assign({}, inputStyle,
           { 'height': `${parseInt(inputStyle.height) * this.finalScale}px`, 'border': undefined });
      }
    },
    beforeDestroy(){
      this.handleBlur();
    }
  }

</script>
