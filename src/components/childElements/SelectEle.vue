<template>
  <div class="option-group" :style="eleData.properties.optionStyle">
    <div class="option-title" :style="optionTitleStyle">
      {{eleData.properties.title}}
    </div>
    <ul>
      <li v-for="(option, index) in eleData.properties.options"
       @click="toggle(index)" :style="optionItemStyle">
        <div class="check-radio" :style="{'border-color': eleData.properties.optionStyle.backgroundColor}">
          <span class="check-radio-dot" v-show="option.selected"
           :style="{'background-color': eleData.properties.optionStyle.backgroundColor}"></span>
        </div>
        {{option.text}}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  props: ['eleData', 'pageIndex', 'finalScale'],
  methods: {
    ...mapMutations(['toggleSelectOption']),
    toggle(optionIndex){
      const payLoad = {
        optionIndex,
        pageIndex: this.pageIndex,
        eleId: this.eleData.id
      };
      this.toggleSelectOption(payLoad);
    }
  },
  computed: {
    optionTitleStyle() {
      const { properties } = this.eleData;
      const { selectCssFileConfig } = properties;
      const { height, lineHeight, HorizontalPadding } = selectCssFileConfig;
      return { 
        'height': `${height * this.finalScale}px`, 
        'lineHeight': `${lineHeight * this.finalScale}px`,
        'padding': `0 ${HorizontalPadding * this.finalScale}px`,
        'color': properties.titleColor };
    },
    optionItemStyle() {
      const { properties } = this.eleData;
      const { selectCssFileConfig } = properties;
      const { height, lineHeight, HorizontalPadding } = selectCssFileConfig;
      return { 
        'height': `${height * this.finalScale}px`, 
        'lineHeight': `${lineHeight * this.finalScale}px`,
        'padding': `0 ${HorizontalPadding * this.finalScale}px`};
    }
  },
}
</script>
