import 'whatwg-fetch';
import appConfig from '../../appconfig';

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
  formSubmit (data) {
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
};

export default api;