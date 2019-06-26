import axios from 'axios';
import { ErrorFlash } from './components/flash';

// IE11 Polyfill
require('es6-promise').polyfill();

const metaElement: HTMLMetaElement = document.querySelector('[name="csrf-token"]');

const token = metaElement && metaElement.content ? metaElement.content : 'no-csrf-token';

const instance = axios.create({
  headers: {
    common: {
      'X-CSRF-Token': token,
    },
  },
  responseType: 'json',
});

instance.interceptors.response.use(response => response, (error) => {
  const { data, status } = error.response;

  if (status === 401) {
    // eslint-disable-next-line no-alert
    window.alert(`
      You are not currently logged in. Please refresh the page and try performing this action again.
      To prevent this in the future, check the 'Remember Me' box when logging in.`);
  } else if (data && data.errors) {
    data.errors.forEach((message) => {
      ErrorFlash.show(message);
    });
  } else {
    // eslint-disable-next-line no-console
    console.log('Unhandled interception', error.response);
  }

  return Promise.reject(error);
});

// A wrapper to allow us to ignore boring errors
export const get = (url, config = {}, raise: boolean = false): Promise<any> => {
  if (raise) {
    return instance.get(url, config);
  }

  return instance.get(url, config).catch(() => {});
};

export const post = (url, data, config = {}, raise: boolean = false): Promise<any> => {
  if (raise) {
    return instance.post(url, data, config);
  }

  return instance.post(url, data, config).catch(() => {});
};

export const patch = (url, data, config = {}, raise: boolean = false): Promise<any> => {
  if (raise) {
    return instance.patch(url, data, config);
  }

  return instance.patch(url, data, config).catch(() => {});
};

export const when = (...requests): Promise<any> => new Promise((resolve) => {
  axios.all(requests).then(axios.spread((...responses) => {
    resolve(...responses);
  }));
});

export const getCurrentPageJson = (): Promise<any> => {
  const pathname = window.location.pathname.replace(/\/+$/, '');

  return get(`${pathname}.json${window.location.search}`);
};

export default instance;
