<template>
  <a class="submit-btn" href="" :style="eleData.properties.buttonStyle" @click.prevent="submit">{{eleData.properties.buttonName}}</a>
</template>

<script>
  import {
    mapMutations,
    mapActions
  } from 'vuex';
  export default {
    props: ['eleData', 'pageIndex'],
    data() {
      return {
        hasSubmitted: false,
        inSubmitting: false
      }
    },
    mounted() { },
    methods: {
      ...mapMutations(['loadElementSuccess']),
      ...mapActions(['buttonFormSubmit']),
      submit() {
        if (this.hasSubmitted) {
          console.log('只能提交一次！');
          return '只能提交一次！';
        }
        if (this.inSubmitting) {
          console.log('正在提交中。。。');
          return '正在提交中。。';
        }
        if (!this.hasSubmitted && !this.inSubmitting) {
          // TODO
          console.log('submit');
          console.log(this.getQueryString());
          const payload = {
            query: this.getQueryString(),
            pageIndex: this.pageIndex
          };
          this.inSubmitting = true;
          this.buttonFormSubmit(payload).then(response => {
            console.log(response);
            this.inSubmitting = false;
            if (response.ok) {
              this.hasSubmitted = true;
              let { properties: { info, outLink } } = this.eleData;
              _.isString(info) && alert(info);
              _.isString(outLink) && window.open(outLink);
            } else {
              this.hasSubmitted = false;
              alert('error');
            }
          }, (reject) => {
            this.hasSubmitted = false;
            this.inSubmitting = false;
            console.log('submit fail');
            console.log(reject);
          });
        }
      },
      getQueryString() {
        var qs = location.search.substr(1), // 获取url中"?"符后的字串
          args = {}, // 保存参数数据的对象
          items = qs.length ? qs.split('&') : [], // 取得每一个参数项,
          item = null,
          len = items.length;

        for (var i = 0; i < len; i++) {
          item = items[i].split('=');
          var name = decodeURIComponent(item[0]),
            value = decodeURIComponent(item[1]);
          if (name) {
            args[name] = value;
          }
        }
        return args;
      }
    },
  }

</script>
