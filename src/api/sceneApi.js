import 'whatwg-fetch';
import appConfig from '../../appconfig';

const api = {
  updateEleCount(data) {
    const { id, pageid, elementid, op } = data;
    const url = `${appConfig.h5Service}scene/${id}/count`;
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pageid, elementid, op })
    });
  },
};

export default api;