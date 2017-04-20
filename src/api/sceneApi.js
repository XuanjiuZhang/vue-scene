import 'whatwg-fetch';
import URLSearchParams from 'url-search-params';
global.URLSearchParams = URLSearchParams;
import appConfig from '../../appconfig';
import queryString from 'query-string';

const api = {
  updateEleCount(data) {
    const { sceneid, pageid, elementid, op } = data;
    const url = `${appConfig.h5Service}scene/${sceneid}/count`;
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pageid, elementid, op })
    });
  },
  formSubmit(data) {
    const { formData, sceneid, pageid, qrc, src } = data;
    const url = `${appConfig.h5Service}preview/${sceneid}/form`;
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: formData, pageid, qrc, src })
    });
  },
  getSceneByCode(sceneinfo) {
    const paramsString = queryString.stringify(sceneinfo);
    const searchParams = new global.URLSearchParams(paramsString);
    const url = `${appConfig.h5Service}preview?${searchParams}`;
    // const url = `http://10.41.13.189/h5/service/v1/preview?${searchParams}`;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      // mode: 'no-cors'
      // body: searchParams
    });
  },
  sendPassword(data) {
    const url = `${appConfig.h5Service}preview/encrypt`;
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  },
  queryStatisticCount(sceneId){
    const url = `${appConfig.h5Service}scene/${sceneId}/view`;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
  }
};

export default api;
