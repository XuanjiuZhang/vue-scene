<template>
  <div>
    {{eleData.name}}
  </div>
</template>

<style lang="less">
</style>

<script>
import { mapMutations } from 'vuex';
export default {
  props: ['eleData'],
  mounted(){
    setTimeout(() => {
      this.loadElementSuccess();
    }, Math.random() * 1000);
  },
  methods: {
    ...mapMutations(['loadElementSuccess'])
  },
}
</script>