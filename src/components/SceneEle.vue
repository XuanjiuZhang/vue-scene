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
import InputEle from './childElements/InputEle.vue';
import ButtonEle from './childElements/ButtonEle.vue';
import ContactEle from './childElements/ContactEle.vue';
import SelectEle from './childElements/SelectEle.vue';
import LinkEle from './childElements/LinkEle.vue';
import SoundEle from './childElements/SoundEle.vue';
import CountEle from './childElements/CountEle.vue';
import StatisticEle from './childElements/StatisticEle.vue';
import TelEle from './childElements/TelEle.vue';

export default {
  props: ['eleData', 'pageIndex', 'finalScale', 'pageData'], 
  created(){
  },
  data(){
    return {
    } 
  },
  computed: {
    ...mapGetters(['screenWidth', 'screenHeight', 'editorWidth', 'editorHeight']),
    eleStyle: function(){
      const { notOpacity, width, height, top, left, padding } = this.eleData.transCss;
      return Object.assign({}, this.eleData.transCss, {
        opacity: _.isUndefined(notOpacity) ? 1 : 1 - notOpacity / 100,
        padding: _.isUndefined(padding) ? 0 : padding,
        display: this.eleData.visible && this.eleData.animationVisible ? '' : 'none'
      });
    },

    eleContentStyle: function(){
      const { backgroundColor, borderStyle, borderColor, borderWidth, borderRadius,
         rotateZ, boxShadow, translate3d, fontSize, lineHeight }
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
        borderWidth: _.isUndefined(borderWidth) ? '1px' : `${Math.round(parseInt(borderWidth) * this.finalScale)}px`,
        borderRadius: _.isUndefined(borderRadius) ? 0 : `${Math.round(parseInt(borderRadius) * this.finalScale)}px`,
        rotateZ: _.isUndefined(rotateZ) ? 0 : rotateZ,
        boxShadow: boxShadowStr,
        // translate3d ... not use for now
        transform: _.isUndefined(rotateZ) ? '' : `rotateZ(${rotateZ}deg)`,
        WebkitTransform: _.isUndefined(rotateZ) ? '' : `rotateZ(${rotateZ}deg)`,
        fontSize: _.isUndefined(fontSize) ? undefined : `${Math.round(parseInt(fontSize) * this.finalScale)}px`,
        lineHeight: _.isUndefined(lineHeight) ? undefined : `${Math.round(parseInt(lineHeight) * this.finalScale)}px`
      });
    },
  },
  render (h) {
    // 根据元素的种类找到元素相关细节信息. 
    const childrenInfo = elementType.find(type => {
      return type.typeID === this.eleData.type;
    });
    const childEle = h(childrenInfo.tag, 
    {
      props: {eleData: this.eleData, pageIndex: this.pageIndex, finalScale: this.finalScale},
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
    // 这里保存了不需要额外请求网络资源的元素. 会立即加载完毕
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
    'video-element': VideoEle,
    'input-form-element': InputEle,
    'button-form-element': ButtonEle,
    'contact-form-element': ContactEle,
    'select-form-element': SelectEle,
    'link-element': LinkEle,
    'sound-element': SoundEle,
    'count-element': CountEle,
    'statistic-element': StatisticEle,
    'tel-element': TelEle
  }
}
</script>
