<template>
  <div class="text-element">
    <div :style="parsedTextStyle" v-html="parsedContent"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  props: ['eleData', 'finalScale'],
  mounted(){
    console.log(this.eleData.content);
    console.log(this.finalScale);
  },
  computed: {
    ...mapGetters(['screenWidth', 'screenHeight', 'editorWidth', 'editorHeight']),
    parsedContent() {
      const hScale = this.screenHeight / this.editorHeight;
      const actualScale = Math.min(hScale, this.finalScale);
      console.log(actualScale);
      const fontPattern = /font-size:\s*[\d]+px;/g;
      const numPattern = /[\d]+/g;
      if(actualScale > 1){
        let fontGroup = this.eleData.content.match(fontPattern);
        let showContent = this.eleData.content;
        if(fontGroup){
          fontGroup.forEach(ft => {
            let size = ft.match(numPattern)[0];
            showContent = showContent.replace(size, Math.floor(parseInt(size) * actualScale));
          });
        }
        return showContent;
      }else{
        return this.eleData.content;
      }
    },
    parsedTextStyle() {
      if(this.finalScale > 1){
        return Object.assign({}, this.eleData.properties.textStyle,{
          fontSize: Math.floor(parseInt(this.eleData.properties.textStyle.fontSize) * this.finalScale) + 'px'
        });
      }else{
        return this.eleData.properties.textStyle;
      }
    }
  }
}
</script>
