<template>
  <div class="phoneWrap">
    <ul class="full-screen">
      <li v-for="page in pages">
        <PhonePage :page-data="page"></PhonePage>
      </li>
    </ul>
  </div>
</template>

<style lang="less">
  .phoneWrap{
      height: 486px;
      width: 320px;
      overflow: hidden;
  }
  .full-screen{
    width: 100%;
    height: 100%
  }
</style>

<script>
import { mapMutations, mapGetters,mapActions } from 'vuex';
import PhonePage from './PhonePage.vue';

export default {
  data(){
    return {
      msg: 'hello!' 
    } 
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters(['pages'])
  },
  components: { PhonePage }
}
</script>