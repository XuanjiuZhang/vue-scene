<template>
  <div>
    {{ eleData.id }}
  </div>
</template>

<style lang="less">
</style>

<script>
import { mapMutations, mapGetters,mapActions } from 'vuex';

export default {
  props: ['eleData'], 
  data(){
    return {
      msg: 'hello!',
      iconType: 'default'
    } 
  }
}
</script>