<template>
  <div>
    <input class="basic-input" type="text"
      :placeholder="eleData.properties.name"
      v-model.trim="eleData.properties.data"
      maxlength="200"
      style="font-size: 100%"
      @focus="handleFocus"
      @blur="handleBlur"
      :style="this.eleData.properties.style"
      :required="eleData.properties.required" />
  </div>
</template>

<script>
import {
  mapMutations,
} from 'vuex';
export default {
  props: ['eleData'],
  methods: {
    ...mapMutations(['visualInput']),
    handleFocus() {
      // this.visualInput({eleData: this.eleData, focused: true});
    },
    handleBlur() {
      // this.visualInput({eleData: this.eleData, focused: false});
    }
  },
  beforeDestroy(){
    this.handleBlur();
  }
}
</script>
