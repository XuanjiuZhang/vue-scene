import _ from 'underscore';

const scoreEle = (element) => {
  const result = {
    msg: 'scoreEle',
    success: false
  };
  if(element.type === 11){
    element.currentScore = 0;
  }else{
    result.success = true;
  }
  return result;
};

const buttonEle = (element) => {
  const result = {
    msg: 'buttonEle',
    success: false
  };
  if(element.type === 8){
    // Object.assign(element.contentCss, {
    //   'fontSize': '',
    // });
  }else{
    result.success = true;
  }
  return result;
};

const soundEle = (element) => {
  const result = {
    msg: 'soundEle',
    success: false
  };
  if(element.type === 15){
    if(_.isUndefined(element.properties.buttonStyle)){
      element.properties.buttonStyle = {};
    }
    Object.assign(element.properties.buttonStyle, {
      'fontSize': '100%',
    });
  }else{
    result.success = true;
  }
  return result;
};

const ContactEle = (element) => {
  const result = {
    msg: 'ContactEle',
    success: false
  };
  if(element.type === 9){
    if(_.isUndefined(element.properties.inputStyle)){
      element.properties.inputStyle = {};
    }
    Object.assign(element.properties.inputStyle, {
      'fontSize': '100%',
      'height': '36px'
    });
  }else{
    result.success = true;
  }
  return result;
};

const SelectEle = (element) => {
  const result = {
    msg: 'SelectEle',
    success: false
  };
  if(element.type === 10){
    if(_.isUndefined(element.properties.inputStyle)){
      element.properties.selectCssFileConfig = {};
    }
    Object.assign(element.properties.selectCssFileConfig, {
      'height': 36,
      'lineHeight': 36,
      'HorizontalPadding': 6
    });
  }else{
    result.success = true;
  }
  return result;
};

const InputEle = (element) => {
  const result = {
    msg: 'InputEle',
    success: false
  };
  if(element.type === 7){
    
  }else{
    result.success = true;
  }
  return result;
};

const bgAudo = (sceneData) => {
  if(_.isUndefined(sceneData.bgAudio)){
    Object.assign(sceneData, {
      bgAudio: {
        url: '',
        name: '',
        id: ''
      }
    });
  }
};

const fonts = (sceneData) => {
  if(_.isUndefined(sceneData.fonts)){
    Object.assign(sceneData, {
      fonts: []
    });
  }
}

const play = (sceneData) => {
  if(_.isUndefined(sceneData.play)){
    Object.assign(sceneData, {
      play: {
        'loop': false,
        'auto': false,
        'interval': 3
      }
    });
  }
}

const pre = (sceneData) => {
  bgAudo(sceneData);
  fonts(sceneData);
  play(sceneData);
  const { pages } = sceneData;
  const elementPreArray = [scoreEle, buttonEle, soundEle, ContactEle, SelectEle, InputEle];
  const preMsg = [];
  pages.forEach(page => {
    page.elements.forEach(element => {
      elementPreArray.reduce((pre, current) => {
        const result = current(element);
        if(!result.success){
          pre.push(result.msg);
        }
        return pre;
      }, preMsg);
    });
  });
  return preMsg;
};

export default pre;
