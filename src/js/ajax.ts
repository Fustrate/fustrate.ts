import axios from 'axios';

import { ErrorFlash } from './components/Flash';

const metaElement = document.querySelector<HTMLMetaElement>('[name="csrf-token"]');

const token = metaElement?.content ?? 'no-csrf-token';

const instance = axios.create({
  headers: {
    common: {
      'X-CSRF-Token': token,
    },
  },
  responseType: 'json',
});

instance.interceptors.response.use((response) => response, (error) => {
  const { data, status } = error.response;

  if (status === 401) {
    // eslint-disable-next-line no-alert
    window.alert(`
      You are not currently logged in. Please refresh the page and try performing this action again.
      To prevent this in the future, check the 'Remember Me' box when logging in.`);
  } else if (data?.errors) {
    data.errors.forEach((message: string) => {
      ErrorFlash.show(message);
    });
  } else {
    // eslint-disable-next-line no-console
    console.log('Unhandled interception', error.response);
  }

  return Promise.reject(error);
});

export const when = (...requests: Promise<any>[]): Promise<any> => new Promise((resolve: (value?: any) => void) => {
  axios.all(requests).then(axios.spread((...responses: any[]) => {
    resolve(...responses);
  }));
});

export const getCurrentPageJson = (): Promise<any> => {
  let pathname = window.location.pathname.replace(/\/+$/, '');
  let { search } = window.location;

  if (pathname === '') {
    search = search === '' ? '?format=json' : `${search}&format=json`;
  } else {
    pathname = `${pathname}.json`;
  }

  return instance.get(`${pathname}${search}`);
};

export default instance;
