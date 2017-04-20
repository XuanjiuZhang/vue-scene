<template>
  <form name="contactForm" class="contact-form">
    <div v-for="(formField, index) in eleData.properties.formData" :key="index"
     class="contact-input" :style="contactDivStyle">
      <input v-model.trim="formField.data" type="text" :required="formField.required"
       :style="contactStyle" :placeholder="formField.fieldName"
        @focus="handleFocus" @blur="handleBlur">
    </div>
  </form>
</template>

<script>
  import {
    mapMutations,
  } from 'vuex';
  export default {
    props: ['eleData', 'finalScale'],
    methods: {
      ...mapMutations(['visualInput']),
      handleFocus() {
        // this.visualInput({eleData: this.eleData, focused: true});
      },
      handleBlur() {
        // this.visualInput({eleData: this.eleData, focused: false});
      }
    },
    computed: {
      contactStyle() {
        const { properties } = this.eleData;
        const { inputStyle } = properties;
        return Object.assign({}, inputStyle, { 'height': `${parseInt(inputStyle.height) * this.finalScale * .8}px` });
        // if(this.finalScale >= 1.1){
        //   return Object.assign({}, inputStyle, { 'height': `${parseInt(inputStyle.height) * this.finalScale * .8}px` });
        // }else{
        //   return Object.assign({}, inputStyle, { 'height': `${parseInt(inputStyle.height) * this.finalScale}px` });
        // }
      },
      contactDivStyle() {
        const { properties } = this.eleData;
        const { inputStyle } = properties;
        return Object.assign({}, inputStyle,
           { 'height': `${parseInt(inputStyle.height) * this.finalScale * .8}px`, 'border': undefined });
        // if(this.finalScale >= 1.1){
        //   return Object.assign({}, inputStyle,
        //    { 'height': `${parseInt(inputStyle.height) * this.finalScale * .8}px`, 'border': undefined });
        // }else{
        //   return Object.assign({}, inputStyle,
        //    { 'height': `${parseInt(inputStyle.height) * this.finalScale}px`, 'border': undefined });
        // }
      }
    },
    beforeDestroy(){
      this.handleBlur();
    }
  }

</script>
