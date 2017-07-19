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

### 主要细节
1. 编辑器是用px进行的绝对定位,手机区域是320 * 486.元素坐标原点是手机的左上角.
2. 有长页面功能,页面高度可以超过486px.
3. 有左右滑动翻页和上下滑动翻页的设置.
4. 显示场景的加载进度,以圆环显示,另外可以设置密码访问和不允许访问.


### 一些关键点
1. 预览的时候, 把每个元素的样式进行了换算, 变成了百分比布局. 场景的宽度和手机屏幕对齐, 高度等比缩放. 例如iphone6上,375 * 667. 场景本身是320 * 486,缩放比为 375 / 320 = 1.171875. 则高度 1.171875 * 486 = 569 < 667 不足一个屏幕高度时,高度取屏幕高度. 元素的高度不使用百分比,按照1.171875 * 元素本身的px高度取值(保持元素原本的宽高比,否则图片会拉伸).
2. 资源加载,默认只加载和渲染前三页.翻页过程中会按照每次5页的速度向后渲染(若设置循环翻页第一页往上则一次性加载完).

### 已知问题
1. 设置了密码访问还未通过密码时,应该禁用翻页按钮,完全屏蔽场景数据.(已解决, 翻页按钮可以被点击但是不会被渲染)
