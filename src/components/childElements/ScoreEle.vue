<template>
  <div>
    <div class="rating-title" :style="rateItemColor">{{iconTitle}}</div>
    <div class="rating-icons-wrap center-middle"> 
      <div class="rating-item">
        <div v-for="(ratingItem, index) in ratingItemArray" :key="index" :style="rateItemStyle"
         class="rating-icon" @click="score(index)">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 32 27.313" xml:space="preserve" preserveAspectRatio="xMidYMid">
              <path :d="ratingItem.rateItemPathData" :fill="rateItemColor" fill-rule="evenodd"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  props: ['eleData', 'pageIndex', 'finalScale'],
  data() {
    const maxRateNumber = 5;
    const ratingItem = {
      hasScored: false,
      rateItemPathData: ''
    };
    const ratingItemArray = _.range(maxRateNumber).map(() => {
        const copyRatingItem = Object.assign({}, ratingItem);
        return copyRatingItem;
      });
    return {
      currentScore: 0,
      ratingItemArray
    }
  },
  mounted() {
    this.ratingItemArray.forEach(item => {
      this.emptyStar(item);
    }); 
  },
  computed: {
    iconTitle: function(){
      return this.eleData.properties.title;
    },
    iconType: function(){
      return this.eleData.properties.iconType;
    },
    rateItemStyle: function () {
      const { properties = {
        iconType: 0,
        title: '评分标题',
        iconStyle: {
          color: '#ffba01',
          iconSize: 0
        }
      } } = this.eleData;
      const style = {
        width: '',
        height: ''
      }
      switch (properties.iconStyle.iconSize) {
        case 0:
          style.width = 28 * this.finalScale + 'px';
          style.height = 28 * this.finalScale + 'px';
          break;
        case 1:
          style.width = 22 * this.finalScale + 'px';
          style.height = 22 * this.finalScale + 'px';
          break;
        case 2:
          style.width = 14 * this.finalScale + 'px';
          style.height = 14 * this.finalScale + 'px';
          break;
      }
      return style;
    },
    rateItemColor: function(){
      const { properties = {
        iconStyle: {
          color: '#ffba01',
          iconSize: 0
        }
      } } = this.eleData;
      const { color = '#ffba01' } = properties.iconStyle;
      return color;
    },
  },
  methods: {
    ...mapMutations(['scoreChange']),
    emptyStar(ratingItem) {
      switch(this.iconType){
          case 0: ratingItem.rateItemPathData = 'M22.887,17.994 L24.270,28.002 L15.000,23.619 L5.730,28.002 L7.113,17.994 L0.001,10.696 L10.125,8.894 L15.000,-0.000 L19.875,8.894 L29.999,10.696 L22.887,17.994 ZM18.575,10.670 L15.000,4.000 L11.425,10.670 L4.001,12.022 L9.216,17.496 L8.202,25.001 L15.000,21.714 L21.798,25.001 L20.784,17.496 L25.999,12.022 L18.575,10.670 Z';
          break;
          case 1: ratingItem.rateItemPathData = 'M23.984,2.000 C25.587,2.000 27.094,2.624 28.227,3.757 C30.566,6.097 30.566,9.903 28.227,12.243 L15.984,24.485 L3.742,12.243 C1.402,9.903 1.402,6.097 3.742,3.757 C4.875,2.624 6.382,2.000 7.984,2.000 C9.587,2.000 11.094,2.624 12.227,3.757 L14.570,6.100 L15.984,7.515 L17.399,6.100 L19.742,3.757 C20.875,2.624 22.382,2.000 23.984,2.000 M23.984,0.000 C21.937,0.000 19.890,0.781 18.327,2.343 L15.984,4.686 L13.641,2.343 C12.079,0.781 10.032,0.000 7.984,0.000 C5.937,0.000 3.890,0.781 2.327,2.343 C-0.797,5.467 -0.797,10.533 2.327,13.657 L15.984,27.314 L29.641,13.657 C32.765,10.533 32.765,5.467 29.641,2.343 C28.079,0.781 26.032,0.000 23.984,0.000 L23.984,0.000 Z';
          break;
          case 2: ratingItem.rateItemPathData = 'M28.996,13.243 L27.662,25.043 C27.537,26.157 26.579,27.000 25.439,27.000 L20.120,27.000 C16.459,27.000 14.629,25.200 12.798,25.200 C10.968,25.200 9.138,25.200 9.138,25.200 L9.138,10.800 C9.138,10.800 10.968,10.800 12.798,10.800 C16.459,10.800 16.459,2.700 16.459,2.700 C16.459,1.209 17.688,0.000 19.205,0.000 C20.721,0.000 21.950,1.209 21.950,2.700 C21.950,8.100 21.950,10.800 21.950,10.800 L26.772,10.800 C28.106,10.800 29.143,11.940 28.996,13.243 ZM27.075,12.733 C27.020,12.672 26.922,12.600 26.772,12.600 L21.950,12.600 L20.120,12.600 L20.120,10.800 L20.120,2.700 C20.120,2.204 19.709,1.800 19.205,1.800 C18.700,1.800 18.289,2.204 18.289,2.700 C18.289,2.791 18.284,4.948 17.788,7.140 C16.769,11.653 14.512,12.600 12.798,12.600 L10.968,12.600 L10.968,23.400 L12.798,23.400 C13.921,23.400 14.884,23.792 15.903,24.208 C17.101,24.695 18.340,25.200 20.120,25.200 L25.439,25.200 C25.647,25.200 25.820,25.047 25.843,24.844 L27.177,13.044 C27.193,12.897 27.131,12.794 27.075,12.733 ZM5.070,27.000 L-0.014,27.000 L-0.014,9.000 L5.070,9.000 C6.306,9.000 7.307,9.985 7.307,11.200 L7.307,24.800 C7.307,26.015 6.306,27.000 5.070,27.000 ZM5.477,11.200 C5.477,10.979 5.294,10.800 5.070,10.800 L1.816,10.800 L1.816,25.200 L5.070,25.200 C5.294,25.200 5.477,25.021 5.477,24.800 L5.477,11.200 Z';
          break;
        }
    },
    fillStar(ratingItem) {
      switch(this.iconType){
        case 0: ratingItem.rateItemPathData = 'M15.000,-0.000 L10.125,8.894 L0.001,10.696 L7.113,17.994 L5.730,28.002 L15.000,23.619 L24.270,28.002 L22.887,17.994 L29.999,10.696 L19.875,8.894 L15.000,-0.000 Z';
        break;
        case 1: ratingItem.rateItemPathData = 'M23.984,0.000 C21.937,0.000 19.890,0.781 18.327,2.343 L15.984,4.686 L13.641,2.343 C12.079,0.781 10.032,0.000 7.984,0.000 C5.937,0.000 3.890,0.781 2.327,2.343 C-0.797,5.467 -0.797,10.533 2.327,13.657 L15.984,27.314 L29.641,13.657 C32.765,10.533 32.765,5.467 29.641,2.343 C28.079,0.781 26.032,0.000 23.984,0.000 L23.984,0.000 Z';
        break;
        case 2: ratingItem.rateItemPathData = 'M28.996,13.243 L27.663,25.043 C27.537,26.157 26.579,27.000 25.439,27.000 L20.120,27.000 C16.459,27.000 14.629,25.200 12.798,25.200 C10.968,25.200 9.138,25.200 9.138,25.200 L9.138,10.800 C9.138,10.800 10.968,10.800 12.798,10.800 C16.459,10.800 16.459,2.700 16.459,2.700 C16.459,1.209 17.688,0.000 19.205,0.000 C20.721,0.000 21.950,1.209 21.950,2.700 C21.950,8.100 21.950,10.800 21.950,10.800 L26.772,10.800 C28.106,10.800 29.143,11.940 28.996,13.243 ZM5.070,27.000 L-0.014,27.000 L-0.014,9.000 L5.070,9.000 C6.306,9.000 7.307,9.985 7.307,11.200 L7.307,24.800 C7.307,26.015 6.306,27.000 5.070,27.000 Z';
        break;
      }
    },
    score: function (index) {
      if(this.currentScore === index + 1){
        this.currentScore = 0;
        this.scoreChange({ pageIndex: this.pageIndex, eleId: this.eleData.id, currentScore: this.currentScore });
        this.ratingItemArray.forEach((item, itemIndex) => {
          item.hasScored = false;
          this.emptyStar(item);
        });
      }else{
        this.currentScore = index + 1;
        this.scoreChange({ pageIndex: this.pageIndex, eleId: this.eleData.id, currentScore: this.currentScore });
        this.ratingItemArray.forEach((item, itemIndex) => {
          item.hasScored = itemIndex <= index;
          item.hasScored ? this.fillStar(item) : this.emptyStar(item);
        });
      }
      console.log(this.ratingItemArray);
    }
  }
}

</script>
