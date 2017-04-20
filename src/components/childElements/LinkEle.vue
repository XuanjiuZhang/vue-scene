<template>
  <div class="link-wrap">
    <button :style="eleData.properties.buttonStyle" class="link-btn" @click="link">
      {{eleData.properties.buttonText}}
    </button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  props: ['eleData', 'pageIndex'],
  methods: {
    ...mapMutations(['goPage']),
    link(){
      // 0是跳转页面
      const { properties: { linkType, outLink, pageLink } } = this.eleData;
      if(linkType === 0){
        this.goPage({ index: pageLink });
      }else if(linkType === 1){
        window.open(outLink, '_blank');
      }
    }
  }
}
</script>
