// 进入动画
const inAnimation = [
  /*{
    name: '弹跳进入',
    type: 1,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'bounce'] }
  , */
  {
    name: '弹入',
    type: 2,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'bounceIn']
  }, {
    name: '上方弹入',
    type: 3,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'bounceInDown']
  }, {
    name: '左方弹入',
    type: 4,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'bounceInLeft']
  }, {
    name: '右方弹入',
    type: 5,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'bounceInRight']
  }, {
    name: '下方弹入',
    type: 6,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'bounceInUp']
  }, {
    name: '淡入',
    type: 26,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'fadeIn']
  }, {
    name: '上方淡入',
    type: 27,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'fadeInDown']
  }, {
    name: '上方淡入2',
    type: 28,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'fadeInDownBig']
  }, {
    name: '左方淡入',
    type: 29,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'fadeInLeft']
  }, {
    name: '左方淡入2',
    type: 30,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'fadeInLeftBig']
  }, {
    name: '右方淡入',
    type: 31,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'fadeInRight']
  }, {
    name: '右方淡入2',
    type: 32,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'fadeInRightBig']
  }, {
    name: '下方淡入',
    type: 33,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'fadeInUp']
  }, {
    name: '下方淡入2',
    type: 34,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'fadeInUpBig']
  }, {
    name: '光速进入',
    type: 48,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'lightSpeedIn']
  }, {
    name: '旋转进入',
    type: 50,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'rotateIn']
  }, {
    name: '右上旋入',
    type: 52,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'rotateInDownRight']
  }, {
    name: '右下旋入',
    type: 53,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'rotateInUpLeft']
  }, {
    name: '左下旋入',
    type: 54,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'rotateInUpRight']
  },
  {
    name: '转入',
    type: 61,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'rollIn']
  }, {
    name: '放大进入',
    type: 63,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'zoomIn']
  }, {
    name: '上方放大',
    type: 64,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'zoomInDown']
  }, {
    name: '左方放大',
    type: 65,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'zoomInLeft']
  }, {
    name: '右方放大',
    type: 66,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'zoomInRight']
  }, {
    name: '下方放大',
    type: 67,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'zoomInUp']
  }, {
    name: '上方滑入',
    type: 73,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'slideInDown']
  }, {
    name: '左方滑入',
    type: 74,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'slideInLeft']
  }, {
    name: '右方滑入',
    type: 75,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'slideInRight']
  }, {
    name: '下方滑入',
    type: 76,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'slideInUp']
  }, {
    name: '上方滑出',
    type: 77,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'slideOutDown']
  }, {
    name: 'X翻入',
    type: 44,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'flipInX']
  }, {
    name: 'Y翻入',
    type: 45,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'flipInY']
  }
];
// 强调动画
const emphasizeAnimation = [
  {
    name: '弹跳',
    type: 1,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'bounce']
  },
  {
    name: '闪烁',
    type: 7,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'flash']
  }, {
    name: '跳跃',
    type: 8,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'pulse']
  }, {
    name: '橡皮筋',
    type: 9,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'rubberBand']
  }, {
    name: '摇动',
    type: 10,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'shake']
  }, {
    name: '摇头',
    type: 11,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'headShake']
  }, {
    name: '摇摆',
    type: 12,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'swing']
  }, {
    name: '波幅',
    type: 13,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'tada']
  }, {
    name: '颤动',
    type: 14,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'wobble']
  }, {
    name: '果冻',
    type: 15,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'jello']
  }, {
    name: '旋转',
    type: 81,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'simple360Rotate']
  }
];
// 退出动画
const outAnimation = [
  {
    name: '中心弹出',
    type: 16,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'bounceOut']
  }, {
    name: '下方弹出',
    type: 22,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'bounceOutDown']
  }, {
    name: '左方弹出',
    type: 23,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'bounceOutLeft']
  }, {
    name: '右方弹出',
    type: 24,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'bounceOutRight']
  }, {
    name: '上方弹出',
    type: 25,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'bounceOutUp']
  }, {
    name: '淡出',
    type: 35,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'fadeOut']
  }, {
    name: '下方淡出',
    type: 36,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'fadeOutDown']
  }, {
    name: '下方淡出2',
    type: 37,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'fadeOutDownBig']
  }, {
    name: '左方淡出',
    type: 38,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'fadeOutLeft']
  }, {
    name: '左方淡出2',
    type: 39,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'fadeOutLeftBig']
  }, {
    name: '右方淡出',
    type: 40,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'fadeOutRight']
  }, {
    name: '右方淡出2',
    type: 41,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'fadeOutRightBig']
  }, {
    name: '上方淡出',
    type: 42,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'fadeOutUp']
  }, {
    name: '上方淡出2',
    type: 43,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'fadeOutUpBig']
  }, {
    name: 'X翻出',
    type: 46,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'flipOutX']
  }, {
    name: 'Y翻出',
    type: 47,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'flipOutY']
  }, {
    name: '光速退出',
    type: 49,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'lightSpeedOut']
  }, {
    name: '左下旋入',
    type: 51,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'rotateInDownLeft']
  }, {
    name: '旋出',
    type: 55,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'rotateOut']
  }, {
    name: '左下旋出',
    type: 56,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'rotateOutDownLeft']
  }, {
    name: '右下旋出',
    type: 57,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'rotateOutDownRight']
  }, {
    name: '左上旋出',
    type: 58,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'rotateOutUpLeft']
  }, {
    name: '右上旋出',
    type: 59,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'rotateOutUpRight']
  }, {
    name: '铰链',
    type: 60,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'hinge']
  }, {
    name: '中心远离',
    type: 68,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'zoomOut']
  }, {
    name: '上方远离',
    type: 69,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'zoomOutDown']
  }, {
    name: '左方远离',
    type: 70,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'zoomOutLeft']
  }, {
    name: '右方远离',
    type: 71,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'zoomOutRight']
  }, {
    name: '下方远离',
    type: 72,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'zoomOutUp']
  }, {
    name: '左方滑出',
    type: 78,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'slideOutLeft']
  }, {
    name: '右方滑出',
    type: 79,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'slideOutRight']
  }, {
    name: '下方滑出',
    type: 80,
    iconClass: 'bounce-in',
    animationClass: ['animated', 'slideOutUp']
  }
];

export { inAnimation, emphasizeAnimation, outAnimation };
