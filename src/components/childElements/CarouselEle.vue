<template>
  <div>
    {{ eleData.id }}
  </div>
</template>

<style lang="less">
</style>

<script>
import { mapMutations } from 'vuex';

export default {
  props: ['eleData'], 
  mounted(){
    this.loadElementSuccess();
  },
  methods: {
    ...mapMutations(['loadElementSuccess'])
  },
}
</script>