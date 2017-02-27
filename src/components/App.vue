<template>
  <div id="app" @click.self="increment">
    {{ msg }}
    this is app divvv!
    {{ countNumber }}
    <div @click.stop="add">action</div>
    <ScoreEle testVal="thiss"></ScoreEle>
  </div>
</template>

<style lang="less">
  /*#app {
    color: aquamarine
  }*/ 
</style>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';
import ScoreEle from './ScoreEle.vue';

export default {
  data(){
    return {
      msg: 'hello!' 
    } 
  },
  methods: {
    ...mapMutations([ 'increment' // map this.increment() to this.$store.commit('increment')
    ]),
    ...mapActions({
      add: 'increment' // 映射 this.add() 为 this.$store.dispatch('increment')
    })
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'countNumber',
      // ...
    ])
  },
  components: { ScoreEle }
}
</script>