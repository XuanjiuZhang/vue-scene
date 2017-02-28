<template>
  <div class="statistic-wrap center-middle">
    <div class="statistic-item" :style="computedStyle.statisticStyle" v-show="eleData.properties.iconType === 0">
      <div class="statistic-icon" :style="computedStyle.statisticStyle">
        <i :style="computedStyle.iconStyle">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 29 20" preserveAspectRatio="xMidYMid">
            <path d="M14.500,20.000 C6.492,20.000 -0.000,9.971 -0.000,9.971 C-0.000,9.971 6.492,-0.000 14.500,-0.000 C22.508,-0.000 29.000,9.971 29.000,9.971 C29.000,9.971 22.508,20.000 14.500,20.000 ZM14.500,4.501 C11.297,4.501 8.700,6.950 8.700,9.971 C8.700,12.992 11.297,15.441 14.500,15.441 C17.703,15.441 20.300,12.992 20.300,9.971 C20.300,6.950 17.703,4.501 14.500,4.501 ZM14.500,13.618 C12.364,13.618 10.633,11.985 10.633,9.971 C10.633,7.957 12.364,6.325 14.500,6.325 C16.635,6.325 18.367,7.957 18.367,9.971 C18.367,11.985 16.635,13.618 14.500,13.618 ZM15.466,8.262 C14.933,8.262 14.621,8.556 14.621,9.060 C14.621,9.563 14.933,9.857 15.466,9.857 C16.000,9.857 16.312,9.563 16.312,9.060 C16.312,8.556 16.000,8.262 15.466,8.262 Z" :fill="computedStyle.statisticStyle.color" fill-rule="evenodd"/>
          </svg>
        </i>
      </div>
      <div class="item-text" :style="computedStyle.statisticStyle">{{readCount}}</div>
    </div>
    <div class="statistic-item" :style="computedStyle.statisticStyle" v-show="eleData.properties.iconType === 1">
      <div class="statistic-icon" :style="computedStyle.statisticStyle">
        <i :style="computedStyle.iconStyle">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 29 24" preserveAspectRatio="xMidYMid">
            <path d="M20.431,21.416 C16.192,21.416 15.159,23.997 15.159,23.997 C15.159,23.997 15.159,23.080 15.159,21.648 C16.233,20.454 18.327,20.127 19.113,20.127 C20.189,20.127 27.681,20.127 27.681,20.127 L27.681,1.420 C28.477,1.420 29.000,1.420 29.000,1.420 L29.000,21.416 C29.000,21.416 24.044,21.416 20.431,21.416 ZM15.159,20.127 L15.159,2.063 C20.560,-1.639 26.363,0.772 26.363,0.772 L26.363,18.839 C16.501,17.756 15.159,20.127 15.159,20.127 ZM2.637,18.839 L2.637,0.772 C2.637,0.772 8.440,-1.639 13.841,2.063 L13.843,2.063 L13.843,20.127 C13.843,20.127 12.502,17.756 2.637,18.839 ZM13.841,21.651 C13.841,23.080 13.841,24.000 13.838,24.000 C13.838,24.000 12.805,21.418 8.566,21.418 C4.956,21.418 0.000,21.418 0.000,21.418 L0.000,1.420 C0.000,1.420 0.525,1.420 1.319,1.420 L1.319,20.130 C1.319,20.130 8.811,20.130 9.885,20.130 C10.670,20.130 12.764,20.454 13.841,21.651 Z"  :fill="computedStyle.statisticStyle.color" fill-rule="evenodd"/>
          </svg>
        </i>
      </div>
      <div class="item-text" :style="computedStyle.statisticStyle">{{readCount}}</div>
    </div>
    <div class="statistic-item" :style="computedStyle.statisticStyle" v-show="eleData.properties.iconType === 2">
      <div class="statistic-icon" :style="computedStyle.statisticStyle">
        <i :style="computedStyle.iconStyle">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 28 24" preserveAspectRatio="none">
            <path d="M26.000,24.000 L17.000,24.000 C15.343,24.000 14.000,22.657 14.000,21.000 C14.000,22.657 12.657,24.000 11.000,24.000 L2.000,24.000 C0.895,24.000 -0.000,23.105 -0.000,22.000 L-0.000,2.000 C-0.000,0.895 0.895,-0.000 2.000,-0.000 L11.000,-0.000 C12.657,-0.000 14.000,1.343 14.000,3.000 C14.000,1.343 15.343,-0.000 17.000,-0.000 L26.000,-0.000 C27.105,-0.000 28.000,0.895 28.000,2.000 L28.000,22.000 C28.000,23.105 27.105,24.000 26.000,24.000 ZM13.000,4.000 C13.000,2.895 12.105,2.000 11.000,2.000 L2.000,2.000 L2.000,22.000 L11.000,22.000 C12.105,22.000 13.000,21.105 13.000,20.000 L13.000,4.000 ZM26.000,2.000 L17.000,2.000 C15.895,2.000 15.000,2.895 15.000,4.000 L15.000,20.000 C15.000,21.105 15.895,22.000 17.000,22.000 L26.000,22.000 L26.000,2.000 ZM17.000,10.000 L25.000,10.000 L25.000,12.000 L17.000,12.000 L17.000,10.000 ZM22.000,6.000 L25.000,6.000 L25.000,8.000 L22.000,8.000 L22.000,6.000 ZM3.000,14.000 L11.000,14.000 L11.000,16.000 L3.000,16.000 L3.000,14.000 ZM3.000,6.000 L10.000,6.000 L10.000,8.000 L3.000,8.000 L3.000,6.000 ZM8.000,12.000 L3.000,12.000 L3.000,10.000 L8.000,10.000 L8.000,12.000 Z"  :fill="computedStyle.statisticStyle.color" fill-rule="evenodd"/>
          </svg>
        </i>
      </div>
      <div class="item-text" :style="computedStyle.statisticStyle">{{readCount}}</div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
export default {
  props: ['eleData', 'pageIndex'],
  data(){
    return {
      readCount: 0
    };
  },
  mounted(){
  },
  computed: {
    computedStyle(){
      const { properties: { iconStyle: rowIconStyle } } = this.eleData;
      const  statisticStyle = {
        float: rowIconStyle.layout === 0 ? 'left' : '',
        color: rowIconStyle.color,
        height: '',
        fontSize: ''
      };
      const iconStyle = {
        width: '',
        height: ''
      }
      switch (rowIconStyle.fontSize) {
        case 0:
          iconStyle.width = '20px';
          iconStyle.height = '20px';
          statisticStyle.height = '20px';
          statisticStyle.fontSize = '18px';
          break;
        case 1:
          iconStyle.width = '16px';
          iconStyle.height = '16px';
          statisticStyle.height = '16px';
          statisticStyle.fontSize = '14px';
          break;
        case 2:
          iconStyle.width = '12px';
          iconStyle.height = '12px';
          statisticStyle.height = '12px';
          statisticStyle.fontSize = '12px';
          break;
      }
      return { statisticStyle, iconStyle };
    }
  },
  methods: {
    ...mapActions(['toggleLike']),
    ...mapMutations(['mutateLike']),
    preToggleLike(){
      const payLoad = {
        pageIndex: this.pageIndex,
        eleId: this.eleData.id,
        liked: !this.liked
      };
      this.toggleLike(payLoad).then(() => {
        this.liked = !this.liked;
        this.mutateLike(payLoad);
      });
    }
  },
}
</script>