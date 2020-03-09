"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const Flash_1 = require("./components/Flash");
const metaElement = document.querySelector('[name="csrf-token"]');
const token = metaElement && metaElement.content ? metaElement.content : 'no-csrf-token';
const instance = axios_1.default.create({
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
    }
    else if (data && data.errors) {
        data.errors.forEach((message) => {
            Flash_1.ErrorFlash.show(message);
        });
    }
    else {
        // eslint-disable-next-line no-console
        console.log('Unhandled interception', error.response);
    }
    return Promise.reject(error);
});
// A wrapper to allow us to ignore boring errors
exports.get = (url, config, raise) => {
    if (raise) {
        return instance.get(url, config);
    }
    return instance.get(url, config).catch(() => { });
};
exports.post = (url, data, config, raise) => {
    if (raise) {
        return instance.post(url, data, config);
    }
    return instance.post(url, data, config).catch(() => { });
};
exports.patch = (url, data, config, raise) => {
    if (raise) {
        return instance.patch(url, data, config);
    }
    return instance.patch(url, data, config).catch(() => { });
};
exports.when = (...requests) => new Promise((resolve) => {
    axios_1.default.all(requests).then(axios_1.default.spread((...responses) => {
        resolve(...responses);
    }));
});
exports.getCurrentPageJson = () => {
    let pathname = window.location.pathname.replace(/\/+$/, '');
    let { search } = window.location;
    if (pathname === '') {
        search = search === '' ? '?format=json' : `${search}&format=json`;
    }
    else {
        pathname = `${pathname}.json`;
    }
    return instance.get(`${pathname}${search}`);
};
exports.default = instance;
