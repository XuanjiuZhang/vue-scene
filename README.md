# vue-scene vue场景预览


### 简介
#### 由于之前小蜜蜂编辑器ng预览性能消耗大不适合在移动端进行预览,所以将预览的逻辑用vue重新编写.
---
    主要思路: 定义一个全局的对象,把整个场景数据传入到该对象的方法中,根据传入的数据和domId进行渲染.
   
    global.previewScene = {
      // init函数直接根据场景数据渲染
      init(sceneData, elementID) {
        // sceneData是场景数据, elementID是要进行渲染的domId
        });
        return function (pcTurnPageElementID, templateName = 'Pcbutton') {
          // 返回的这个函数用来初始化翻页button. pcTurnPageElementID是要放置按钮的domId, templateName是按钮组件的名称(因为有几种不同的按钮样式)
          // initCanvas是生成二维码的函数.
          return initCanvas;
        };
      },
      // initBySceneCode是根据场景的code先获得场景数据再进行渲染.
      initBySceneCode(sceneinfo, elementID) {
        return sceneApi.getSceneByCode(sceneinfo);
      },
    };

---

引用了部分elementUI组件并且进行过修改,请使用src/lib/element-ui包,复制到node_modules下,而不是npm install element-ui

运行方式 gulp dev 执行开发模式, 在build目录下testApp.html是只有预览不带手机边框和二维码的布局(用于移动端).testAppPc.html则是用于pc预览的页面.

gulp build 是执行打包, 打包后只有一个previewLib.min.js 文件,引用该文件即可. 目前是放置在小蜜蜂项目 fore_h5 的app.view/lib/ 文件夹下.

### 主要细节
1. 编辑器是用px进行的绝对定位,手机区域是320 * 486.元素坐标原点是手机的左上角.
2. 有长页面功能,页面高度可以超过486px.
3. 有左右滑动翻页和上下滑动翻页的设置.
4. 显示场景的加载进度,以圆环显示,另外可以设置密码访问和不允许访问.

### 目录结构说明
* /src 源码的根目录, applib.js是打包的入口文件. 以下目录都是以src为父目录.
* /api 场景预览所用到的api
* /components 所有的组件. ***TurnPageBtn.vue 组件均是PC端预览的上下翻页按钮(样式不同) loading.vue 为加载进度条.
* /components/Scene.vue 是场景预览的根组件, PhonePage.vue是单独一页的渲染组件. SceneEle.vue是元素组件,该组件还包含childElements下的各种组件(包含了具体元素特定功能的实现)
* /const/elementType.js 记录元素组件的细节描述和表示方法.
* /img 包含了静态图片资源
* /lib 包含第三方的库,目前有elementui和hammerjs
* /service 包含一些计算的逻辑, animationPlayer用于播放动画, animationType记录了元素动画的对应class. sceneDataPrepare对场景元素进行一些预处理.sceneLayout调整元素的布局属性(为了适应各种屏幕大小)
* /style 包含样式文件 element.less是元素的样式  editor.min.css是编辑器打包出的样式,不会被打包到preview.min.js文件中
* /test 下包含了各种场景的测试json数据
* /vuex 用于执行store的初始化

### 一些关键点
1. 预览的时候, 把每个元素的样式进行了换算, 变成了百分比布局. 场景的宽度和手机屏幕对齐, 高度等比缩放. 例如iphone6上,375 * 667. 场景本身是320 * 486,缩放比为 375 / 320 = 1.171875. 则高度 1.171875 * 486 = 569 < 667 不足一个屏幕高度时,高度取屏幕高度. 元素的高度不使用百分比,按照1.171875 * 元素本身的px高度取值(保持元素原本的宽高比,否则图片会拉伸). 
2. 资源加载,默认只加载和渲染前三页.翻页过程中会按照每次5页的速度向后渲染(若设置循环翻页第一页往上则一次性加载完).

----
* 增加了超宽屏的处理, 显示屏幕宽度大于编辑器的宽高比的时候, 元素高度会按照高度比例缩放.

### 已知问题
1. 设置了密码访问还未通过密码时,应该禁用翻页按钮,完全屏蔽场景数据.(已解决, 翻页按钮可以被点击但是不会被渲染)

