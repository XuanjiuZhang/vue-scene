<template>
  <div class="sound-wrap" style="width: 100%; height: 100%">
    <div @click="playMusic" class="sound-item"
     v-show="eleData.properties.musicType === 0">
      <button class="sound-btn" type="button" :style="eleData.properties.buttonStyle">
        {{eleData.properties.buttonText}}
      </button>
    </div>
    <div @click="playMusic" class="sound-item"
     v-show="eleData.properties.musicType === 1">
      <i v-if="eleData.properties.iconType === 0">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" width="100%" height="100%" viewBox="0 0 44 44">
          <g>
            <circle cx="22" cy="22" r="22" :fill="eleData.properties.iconBackColor"/>
            <path d="M24.106,8.994 L21.314,8.994 L21.314,28.145 C17.682,26.569 13.767,28.678 13.061,31.806 C12.831,32.824 13.307,33.926 13.748,34.431 C16.235,37.260 21.769,35.942 24.262,32.900 C25.367,31.550 25.275,30.373 25.275,27.481 L25.275,15.894 C26.807,16.978 28.421,17.989 29.040,19.927 C29.424,21.131 28.912,23.133 28.505,24.156 C28.382,24.463 28.043,24.721 28.200,25.029 C29.274,25.789 29.802,24.175 30.111,23.499 C30.444,22.768 30.764,21.863 30.876,21.239 C32.075,14.555 24.735,14.083 24.106,8.994 " :fill="eleData.properties.iconColor" fill-rule="evenodd"/>
          </g>
        </svg>
      </i>
      <i v-if="eleData.properties.iconType === 1">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" width="100%" height="100%" viewBox="0 0 44 44">
            <g>
              <circle cx="22" cy="22" r="22" :fill="eleData.properties.iconBackColor"/>
              <path d="M22.000,44.000 C9.850,44.000 -0.000,34.150 -0.000,22.000 C-0.000,9.850 9.850,-0.000 22.000,-0.000 C34.150,-0.000 44.000,9.850 44.000,22.000 C44.000,34.150 34.150,44.000 22.000,44.000 ZM22.000,1.000 C10.402,1.000 1.000,10.402 1.000,22.000 C1.000,33.598 10.402,43.000 22.000,43.000 C33.598,43.000 43.000,33.598 43.000,22.000 C43.000,10.402 33.598,1.000 22.000,1.000 ZM30.111,23.499 C29.802,24.175 29.274,25.789 28.200,25.029 C28.043,24.721 28.382,24.463 28.505,24.156 C28.912,23.133 29.424,21.131 29.040,19.927 C28.421,17.989 26.807,16.978 25.275,15.894 L25.275,27.481 C25.275,30.373 25.367,31.550 24.262,32.900 C21.769,35.942 16.235,37.260 13.748,34.431 C13.307,33.926 12.831,32.824 13.061,31.806 C13.767,28.678 17.682,26.569 21.314,28.145 L21.314,8.994 L24.106,8.994 C24.735,14.083 32.075,14.555 30.876,21.239 C30.764,21.863 30.444,22.768 30.111,23.499 Z" :fill="eleData.properties.iconColor" fill-rule="evenodd"/>
            </g>
        </svg>
      </i>
      <i v-if="eleData.properties.iconType === 2">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
          preserveAspectRatio="xMidYMid" width="100%" height="100%" viewBox="0 0 44 44">
            <g>
              <circle cx="22" cy="22" r="22" :fill="eleData.properties.iconBackColor"/>
              <path d="M30.569,21.141 C30.844,21.320 31.000,21.626 31.000,21.985 C31.000,22.344 30.844,22.649 30.569,22.829 L18.292,30.847 C18.018,31.027 17.705,31.027 17.431,30.847 C17.156,30.668 17.000,30.362 17.000,30.003 L17.000,13.966 C17.000,13.607 17.156,13.302 17.431,13.122 C17.705,12.943 18.018,12.943 18.292,13.122 L30.569,21.141 Z" :fill="eleData.properties.iconColor" fill-rule="evenodd"/>
            </g>
        </svg>
      </i>
      <i v-if="eleData.properties.iconType === 3">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            preserveAspectRatio="xMidYMid" width="100%" height="100%" viewBox="0 0 44 44">
          <g>
            <circle cx="22" cy="22" r="22" :fill="eleData.properties.iconBackColor"/>
            <path d="M22.000,44.000 C9.850,44.000 -0.000,34.150 -0.000,22.000 C-0.000,9.850 9.850,-0.000 22.000,-0.000 C34.150,-0.000 44.000,9.850 44.000,22.000 C44.000,34.150 34.150,44.000 22.000,44.000 ZM22.000,1.000 C10.402,1.000 1.000,10.402 1.000,22.000 C1.000,33.598 10.402,43.000 22.000,43.000 C33.598,43.000 43.000,33.598 43.000,22.000 C43.000,10.402 33.598,1.000 22.000,1.000 ZM18.292,30.847 C18.018,31.027 17.705,31.027 17.431,30.847 C17.156,30.668 17.000,30.362 17.000,30.003 L17.000,13.966 C17.000,13.607 17.156,13.302 17.431,13.122 C17.705,12.943 18.018,12.943 18.292,13.122 L30.569,21.141 C30.844,21.320 31.000,21.626 31.000,21.985 C31.000,22.344 30.844,22.649 30.569,22.829 L18.292,30.847 Z" :fill="eleData.properties.iconColor" fill-rule="evenodd"/>
          </g>
        </svg>
      </i>
    </div>
    <audio ref="audio" :src="eleData.properties.musicSrc" preload="auto" style="display: none"></audio>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  props: ['eleData', 'pageIndex'],
  data(){
    return {
      playStarted: false
    }
  },
  mounted(){
    // this.$refs.audio.oncanplay = () => {
    //   console.log(this.eleData.properties.musicSrc, 'Audio canplay 加载成功');
    //   this.loadElementSuccess();
    // };
    this.$refs.audio.onerror = () => {
      console.log(this.eleData.properties.musicSrc, 'Audio加载失败');
    };

    this.loadElementSuccess();
  },
  methods: {
    ...mapMutations(['loadElementSuccess']),
    playMusic(){
      if(!this.playStarted){
        this.$refs.audio.play();
        this.playStarted = true;
      }else{
        if(this.$refs.audio.ended){
          this.$refs.audio.play();
        }else{
          if(!this.$refs.audio.paused){
            this.$refs.audio.pause();
          }else{
            this.$refs.audio.play();
          }
        }
      }
    }
  }
}
</script>