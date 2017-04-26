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
    shouldAppendHttp(outLink) {
      return outLink.indexOf('http://') < 0 && outLink.indexOf('https://') < 0 && outLink.indexOf('ftp://') < 0 && outLink.indexOf('rtsp://') < 0 &&   outLink.indexOf('mms://') < 0;
    },
    link(){
      // 0是跳转页面
      const { properties: { linkType, outLink, pageLink } } = this.eleData;
      if(linkType === 0){
        this.goPage({ index: pageLink });
      }else if(linkType === 1){
        if(this.shouldAppendHttp(outLink)){
          window.open(`https://${outLink}`, '_blank');
        }else{
          window.open(outLink, '_blank');
        }  
        
      }
    }
  }
}
</script>
