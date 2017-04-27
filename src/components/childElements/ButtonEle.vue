<template>
  <div>
    <a class="submit-btn" href="" :style="computedBtnStyle" @click.prevent="submit">{{eleData.properties.buttonName}}</a>
  </div>
</template>

<script>
  import {
    mapMutations,
    mapActions
  } from 'vuex';
  export default {
    props: ['eleData', 'pageIndex', 'finalScale'],
    data() {
      return {
        hasSubmitted: false,
        inSubmitting: false
      }
    },
    computed: {
      computedBtnStyle() {
        const { properties } = this.eleData;
        const { buttonStyle } = properties;
        return Object.assign({}, buttonStyle, { 'fontSize': `${parseInt(buttonStyle.fontSize) * this.finalScale}px` });
      }
    },
    methods: {
      ...mapMutations(['loadElementSuccess']),
      ...mapActions(['buttonFormSubmit']),
      shouldAppendHttp(outLink) {
        return outLink.indexOf('http://') < 0 && outLink.indexOf('https://') < 0 && outLink.indexOf('ftp://') < 0 && outLink.indexOf('rtsp://') < 0 && outLink.indexOf('mms://') < 0;
      },
      doFormDataSubmit(payload, callback) {
        console.log(payload);
        this.inSubmitting = true;
        this.buttonFormSubmit(payload).then(response => {
          console.log(response);
          this.inSubmitting = false;
          if (response.ok && _.isFunction(callback)) {
            callback();
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
      },
      submit() {
        if (this.hasSubmitted) {
          return '只能提交一次！';
        }
        if (this.inSubmitting) {
          return '正在提交中...';
        }

        const payload = {
          query: this.getQueryString(),
          pageIndex: this.pageIndex
        };
        
        const afterSubmit = () => {
          this.hasSubmitted = true;
          let { properties: { info, outLink } } = this.eleData;
          _.isString(info) && alert(info);
          if (this.shouldAppendHttp(outLink)) {
            window.open(`https://${outLink}`);
          } else {
            window.open(outLink);
          }
          return;
        };

        if (!_.isUndefined(window.userAgent) && /iphone|ipad|mac/i.test(window.userAgent.toLowerCase())) {
          console.log('ios');
          this.buttonFormSubmit(Object.assign({
            isValidate: true
          }, payload)).then(result => {
            afterSubmit();
            this.doFormDataSubmit(payload, () => {});
          }, reject => {
            console.log(reject);
          }); 
        }else{
          this.doFormDataSubmit(payload, afterSubmit);
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
