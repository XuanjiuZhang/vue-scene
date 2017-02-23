
<style lang="less">
  .element{
    position: absolute;
  }
</style>

<script>
import { mapMutations, mapGetters,mapActions } from 'vuex';
import elementType from '../const/elementType';
import ScoreEle from './childElements/ScoreEle.vue';
import ImgEle from './childElements/ImgEle.vue';
import ShapeEle from './childElements/ShapeEle.vue';
import CarouselEle from './childElements/CarouselEle.vue';

export default {
  props: ['eleData'], 
  data(){
    return {
      msg: 'hello!'
    } 
  },
  render (h) {
    const childrenInfo = elementType.find((type) => {
      return type.typeID === this.eleData.type;
    });
    const childEle = h(childrenInfo.tag, 
    {
      props: {eleData: this.eleData},
      class: {'child-element': true},
      style: this.eleData.contentCss
    });
    return h('div', {class: {'element': true}, style: this.eleData.css}, [childEle]);
  },
  components: {
    'score-form-element': ScoreEle,
    'image-element': ImgEle,
    'shape-element': ShapeEle,
    'carousel-element': CarouselEle
  }
}
</script>