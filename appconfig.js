/**
 * 配置
 * 2016/9/5
 */
// 生产环境
const config = {
  debug: false,
  env: 'production',
  port: 3000,
  title: '小蜜蜂场景秀',
  apiURL: 'http://10.41.13.189/h5/service/v1/', //用于后端访问接口
  resourceURL: 'http://10.41.13.189/cms/resource/v1/', // 用于后端访问接口,

  h5Service: '/h5/service/v1/', // H5接口
  resourceService: '/cms/resource/v1/', // 资源接口,
  templateMall: '/h5/service/v1/', // 选版平台
  loginURL: '/', //，没授权，调转到登录地址
  labelLink: 'http://www.xmfshow.com', // 底标默认样式

  browseURL: 'http://www.xmfshow.com/', // 浏览器本应用网址
  previewUrl: '/previewUrl/'
};

// 本机开发环境
if(process.env.NODE_ENV === 'development'){
  Object.assign(config, {
    debug: true,
    env: 'development',
    port: 3000,
    title: '小蜜蜂场景秀',
    apiURL: 'http://10.41.13.189/h5/service/v1/', // 用于后端访问接口,
    resourceURL: 'http://10.41.13.189/cms/resource/v1/', // 用于后端访问接口,

    h5Service: '/h5/service/v1/', // H5接口
    resourceService: '/cms/resource/v1/', // 资源接口,
    templateMall: '/h5/service/v1/', // 选版平台
    loginURL : '/', //，没授权，调转到登录地址
    labelLink: 'http://www.xmfshow.com', // 底标默认样式

    browseURL: 'http://localhost:8081/', // 浏览器本应用网址
    previewUrl: '/previewUrl/'
  });
}

// 测试环境
if(process.env.NODE_ENV === 'staging'){
  Object.assign(config, {
    debug: false,
    env: 'staging',
    port: 80,
    title: '小蜜蜂场景秀',
    apiURL: 'http://h5/v1/', //用于后端访问接口
    resourceURL: 'http://10.41.13.189/cms/resource/v1/', // 用于后端访问接口,

    h5Service: '/h5/service/v1/', // H5接口
    resourceService: '/cms/resource/v1/', // 资源接口,
    templateMall: '/h5/service/v1/', // 选版平台
    loginURL : '/', //，没授权，调转到登录地址
    labelLink: 'http://www.xmfshow.com', // 底标默认样式

    browseURL: 'http://10.41.13.189/h5/', // 浏览器本应用网址
    previewUrl: '/previewUrl/'
  });
}

export default config;
