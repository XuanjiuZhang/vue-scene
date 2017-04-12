<template>
  <div>
    <input class="basic-input" type="text"
      :placeholder="eleData.properties.name"
      v-model.trim="eleData.properties.data"
      maxlength="200"
      style="font-size: 100%"
      @focus="handleFocus"
      @blur="handleBlur"
      :style="inputStyle"
      :required="eleData.properties.required" />
  </div>
</template>

<script>
export default {
  props: ['eleData'],
  data() {
    return {
      focused: false
    }
  },
  methods: {
    handleFocus() {
      this.focused = true;
    },
    handleBlur() {
      this.focused = false;
    }
  },
  computed: {
    inputStyle() {
      if(this.focused){
        console.log('this.focused!');
        return this.eleData.properties.style;
      }else{
        return this.eleData.properties.style;
      }
    }
  }
}
</script>
