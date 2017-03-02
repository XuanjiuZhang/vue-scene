<template>
  <div class="video-wrap" ref="videoWrap">
    <svg class="e-play-video" @click="togglePlayVideo" v-show="!isPlay" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
        preserveAspectRatio="xMidYMid" width="44px" height="44px" viewBox="0 0 44 44">
      <g>
        <circle cx="22" cy="22" r="22" :fill="eleData.properties.iconBackColor"/>
        <path d="M22.000,44.000 C9.850,44.000 -0.000,34.150 -0.000,22.000 C-0.000,9.850 9.850,-0.000 22.000,-0.000 C34.150,-0.000 44.000,9.850 44.000,22.000 C44.000,34.150 34.150,44.000 22.000,44.000 ZM22.000,1.000 C10.402,1.000 1.000,10.402 1.000,22.000 C1.000,33.598 10.402,43.000 22.000,43.000 C33.598,43.000 43.000,33.598 43.000,22.000 C43.000,10.402 33.598,1.000 22.000,1.000 ZM18.292,30.847 C18.018,31.027 17.705,31.027 17.431,30.847 C17.156,30.668 17.000,30.362 17.000,30.003 L17.000,13.966 C17.000,13.607 17.156,13.302 17.431,13.122 C17.705,12.943 18.018,12.943 18.292,13.122 L30.569,21.141 C30.844,21.320 31.000,21.626 31.000,21.985 C31.000,22.344 30.844,22.649 30.569,22.829 L18.292,30.847 Z" :fill="eleData.properties.iconColor" fill-rule="evenodd"/>
      </g>
    </svg>
    <a v-show="isPlay" style="position:absolute; float: left" @click="togglePlayVideo" class="close_mask">×</a>
  </div>
</template>

<style lang="less">

</style>

<script>
  import {
    mapMutations
  } from 'vuex';
  export default {
    props: ['eleData', 'pageIndex'],
    data() {
      return {
        isPlay: false,
        iframe: undefined
      }
    },
    mounted() {},
    methods: {
      ...mapMutations(['videoFrameOpen', 'videoFrameClose']),
      togglePlayVideo() {
        const iframeCode = this.eleData.properties.iframe;
        this.isPlay = !this.isPlay;
        if (this.isPlay) {
          this.videoFrameOpen({
            pageIndex: this.pageIndex,
            eleId: this.eleData.id
          });
          this.createIframe(this.$refs.videoWrap, iframeCode, () => {
            console.log('createdIframe')
          });
        } else {
          this.videoFrameClose({
            pageIndex: this.pageIndex,
            eleId: this.eleData.id
          });
          this.destroyIframe();
        }
      },
      /**
       * 动态创建iframe
       * @param dom 创建iframe的容器，即在dom中创建iframe。dom可以是div、span或者其他标签。
       * @param code iframeCode代码
       * @param onload iframe加载完后触发该事件，可以为空
       * @return 返回创建的iframe对象
       */
      createIframe(dom, code, onload) {
        //在document中创建iframe
        this.iframe = document.createElement('iframe');

        const srcPattern = /src='?\"?([^']*)\"?'?/;

        const heightStandard = document.body.offsetWidth * .75;
        //设置iframe的样式
        this.iframe.style.width = '100%';
        this.iframe.style.height = '100%';
        this.iframe.style.margin = '0';
        this.iframe.style.padding = '0';
        this.iframe.style.overflow = 'hidden';
        this.iframe.style.border = 'none';

        //绑定iframe的onload事件
        if (_.isFunction(onload)) {
          if (this.iframe.attachEvent) {
            this.iframe.attachEvent('onload', onload);
          } else if (this.iframe.addEventListener) {
            this.iframe.addEventListener('load', onload);
          } else {
            this.iframe.onload = onload;
          }
        }

        if (!code.match(srcPattern)) {
          this.iframe.src = 'about:blank';
        } else {
          this.iframe.src = code.match(srcPattern)[1];
        }
        //把iframe加载到dom下面
        dom.append(this.iframe);
      },
      /**
       * 销毁iframe，释放iframe所占用的内存。
       * @param iframe 需要销毁的iframe对象
       */
      destroyIframe() {
        //把iframe指向空白页面，这样可以释放大部分内存。
        this.iframe.src = 'about:blank';
        try {
          this.iframe.contentWindow.document.write('');
          this.iframe.contentWindow.document.clear();
        } catch (e) {}
        //把iframe从页面移除
        this.iframe.parentNode.removeChild(this.iframe);
      }
    },
  }
</script>