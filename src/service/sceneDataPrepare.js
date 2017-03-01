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


const pre = (sceneData) => {
  const { pages } = sceneData;
  const elementPreArray = [scoreEle];
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