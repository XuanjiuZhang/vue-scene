<template>
  <div class="tel-wrap" style="width: 100%; height: 100%;">
    <div class="tel-item" v-show="eleData.properties.telType === 0">
      <button class="tel-btn" :style="computedBtnStyle">{{eleData.properties.buttonText}}</button>
      <a class="tel-link" :href="'tel:' + eleData.properties.telNumber"></a>
    </div>
    <div class="tel-item" v-show="eleData.properties.telType === 1">
      <i><a :href="'tel:' + eleData.properties.telNumber">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" width="100%" height="100%" viewBox="0 0 44 44">
          <g>
            <circle v-show="eleData.properties.iconType === 1" cx="22" cy="22" r="21" :stroke="eleData.properties.iconColor" stroke-width="1" :fill="eleData.properties.iconBackColor"/>
            <circle cx="22" cy="22" r="21" :fill="eleData.properties.iconBackColor"/>
            <path d="M19.844,23.586 C18.126,21.147 16.611,18.426 17.973,17.781 C19.924,16.858 21.517,16.375 19.701,12.996 C17.884,9.618 15.370,11.354 13.480,12.248 C11.300,13.280 11.211,18.893 15.847,25.478 C20.485,32.063 26.457,34.807 28.639,33.774 C30.528,32.879 33.618,31.962 30.958,28.983 C28.299,26.004 26.991,26.894 25.041,27.817 C23.679,28.462 21.562,26.026 19.844,23.586 Z" :fill="eleData.properties.iconColor" fill-rule="evenodd"/>
          </g>
        </svg>
        </a></i>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['eleData', 'finalScale'],
    computed: {
      computedBtnStyle() {
        const { properties } = this.eleData;
        const { buttonStyle } = properties;
        return Object.assign({}, buttonStyle, { 'fontSize' : `${parseInt(buttonStyle.fontSize) * this.finalScale}px` });
      }
    },
  }

</script>
