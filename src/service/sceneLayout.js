import _ from 'underscore';

class SceneEditor{
  constructor(width, height){
    this.width = width;
    this.height = height;
  }
  transCss(sceneData){
    if(_.isArray(sceneData.pages)){
      sceneData.pages.forEach(page => {
        page.elements.forEach(element => {
          this.transSigleElementCss(element, page);
        });
      });
    }
  }
  transSigleElementCss = (element, page) => {
    const { pageOption: { longPage, pageSize} } = page;
    const {left, top, height, width} = element.css;
    const pLeft = parseInt(left) / this.width * 100 + '%';
    var pTop = '';
    console.log(top);
    console.log(longPage);
    console.log(pageSize);
    if(longPage){
      pTop = parseInt(top) / parseInt(pageSize) * 100 + '%';
    }else{
      pTop = parseInt(top) / this.height * 100 + '%';
    }
    console.log(pTop);
    const pHeight = parseInt(height) / this.height * 100 + '%';
    const pWidth = parseInt(width) / this.width * 100 + '%';
    element.transCss = {};
    Object.assign(element.transCss, element.css, {
      left: pLeft,
      top: pTop,
      height: pHeight,
      width: pWidth
    });
  }
}

export default SceneEditor;
