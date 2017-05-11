import _ from 'underscore';

class SceneEditor{
  constructor(editorWidth, editorHeight, screenWidth, screenHeight){
    this.editorWidth = editorWidth;
    this.editorHeight = editorHeight;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.scale = screenWidth / editorWidth;
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
    const pLeft = parseInt(left) / this.editorWidth * 100 + '%';
    const pWidth = parseInt(width) / this.editorWidth * 100 + '%';

    const pHeight = Math.ceil(parseInt(height) * this.scale) + 2 + 'px';

    var pTop = '';
    if(longPage){
      pTop = parseInt(top) / parseInt(pageSize) * 100 + '%';
      // pHeight = parseInt(transHeight) / parseInt(pageSize) * 100 + '%';
    }else{
      pTop = parseInt(top) / this.editorHeight * 100 + '%';
      // pHeight = parseInt(transHeight) / this.editorHeight * 100 + '%';
    }
    // const pHeight = parseInt(editorHeight) / this.editorHeight * 100 + '%';
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
