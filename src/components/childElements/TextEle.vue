<template>
  <div class="text-element">
    <div :style="parsedTextStyle" v-html="parsedContent"></div>
  </div>
</template>

<script>
export default {
  props: ['eleData', 'finalScale'],
  mounted(){
    console.log(this.eleData.content);
    console.log(this.finalScale);
  },
  computed: {
    parsedContent() {
      const fontPattern = /font-size:\s*[\d]+px;/g;
      const numPattern = /[\d]+/g;
      if(this.finalScale > 1){
        let fontGroup = this.eleData.content.match(fontPattern);
        let showContent = this.eleData.content;
        fontGroup.forEach(ft => {
          let size = ft.match(numPattern)[0];
          showContent = showContent.replace(size, Math.floor(parseInt(size) * this.finalScale));
        });
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
