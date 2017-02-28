<script>
import { mapMutations, mapGetters,mapActions } from 'vuex';
import elementType from '../const/elementType';
import ScoreEle from './childElements/ScoreEle.vue';
import ImgEle from './childElements/ImgEle.vue';
import ShapeEle from './childElements/ShapeEle.vue';
import CarouselEle from './childElements/CarouselEle.vue';
import MapEle from './childElements/MapEle.vue';
import TextEle from './childElements/TextEle.vue';
import VideoEle from './childElements/VideoEle.vue';

import _ from 'underscore';
window._ = _;

export default {
  props: ['eleData', 'pageIndex', 'finalScale'], 
  created(){
  },
  data(){
    return {
    } 
  },
  computed: {
    eleStyle: function(){
      const { notOpacity, width, height, top, left, padding } = this.eleData.css;
      const newWidth = parseInt(width) * this.finalScale;
      const newHeight = parseInt(height) * this.finalScale; 
      const newTop = parseInt(top) * this.finalScale;
      const newLeft = parseInt(left) * this.finalScale;

      return Object.assign({}, this.eleData.css, {
        opacity: _.isUndefined(notOpacity) ? 1 : 1 - output.notOpacity,
        width: _.isUndefined(width) ? '100px' : newWidth + 'px',
        height: _.isUndefined(height) ? '100px' : newHeight + 'px',
        top: _.isUndefined(top) ? 0 : newTop + 'px',
        left: _.isUndefined(left) ? 0 : newLeft + 'px',
        padding: _.isUndefined(padding) ? 0 : padding,
        display: this.eleData.visible ? '' : 'none'
      });
    },

    eleContentStyle: function(){
      const { backgroundColor, borderStyle, borderColor, borderWidth, borderRadius,
         rotateZ, boxShadow, translate3d }
       = this.eleData.contentCss;

      let boxShadowStr;
      if(_.isUndefined(boxShadow)){
        boxShadowStr = '';
      }else{
        let { x = 0, y = 0, vague = 0, extension = 0, color = 'rgba(85,85,85,1)', inset = false} = boxShadow;
        boxShadowStr = `${x}px ${y}px ${vague}px ${extension}px ${color}`;
        if(_.isBoolean(inset) && inset){
          boxShadowStr = boxShadowStr + 'inset' 
        }
      }

      return Object.assign({}, this.eleData.contentCss, {
        backgroundColor: _.isUndefined(backgroundColor) ? 'transparent' : backgroundColor,
        borderStyle: _.isUndefined(borderStyle) ? 'none' : borderStyle,
        borderColor: _.isUndefined(borderColor) ? 'rgba(85,85,85,1)' : borderColor,
        borderWidth: _.isUndefined(borderWidth) ? '1px' : borderWidth,
        borderRadius: _.isUndefined(borderRadius) ? 0 : borderRadius,
        rotateZ: _.isUndefined(rotateZ) ? 0 : rotateZ,
        boxShadow: boxShadowStr,
        // translate3d ... not use for now
        transform: _.isUndefined(rotateZ) ? '' : `rotateZ(${rotateZ}deg)`,
        WebkitTransform: _.isUndefined(rotateZ) ? '' : `rotateZ(${rotateZ}deg)`,
      });
    },
  },
  render (h) {
    const childrenInfo = elementType.find(type => {
      return type.typeID === this.eleData.type;
    });
    const childEle = h(childrenInfo.tag, 
    {
      props: {eleData: this.eleData, pageIndex: this.pageIndex},
      class: ['element-content'],
      style: this.eleContentStyle
    });
    const containerClassArray = this.eleData.animationClass ?
     this.eleData.animationClass.concat('element-container') : ['element-container'];
    const attrs = { id: this.eleData.id };
    return h('div', {class: containerClassArray, attrs, style: this.eleStyle}
    , [childEle]);
  },
  mounted(){
    const childrenInfo = elementType.find(type => {
      return type.typeID === this.eleData.type;
    });
    const immediateElementTypes = ['text-element', 'shape-element', 'input-form-element', 'button-form-element', 'contact-form-element',
      'select-form-element', 'score-form-element', 'link-element', 'tel-element', 'count-element', 'statistic-element', 'video-element'];
    const isImmediate = immediateElementTypes.find(type => {
      return childrenInfo.tag === type;
    });
    if(isImmediate){
      this.loadElementSuccess();
    } 
  },
  methods: {
    ...mapMutations(['loadElementSuccess'])
  },
  components: {
    'score-form-element': ScoreEle,
    'image-element': ImgEle,
    'shape-element': ShapeEle,
    'carousel-element': CarouselEle,
    'map-element': MapEle,
    'text-element': TextEle,
    'video-element': VideoEle
  }
}
</script>