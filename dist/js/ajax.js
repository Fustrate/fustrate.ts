"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentPageJson = exports.when = void 0;
const axios_1 = __importDefault(require("axios"));
const Flash_1 = require("./components/Flash");
const metaElement = document.querySelector('[name="csrf-token"]');
const token = (_a = metaElement === null || metaElement === void 0 ? void 0 : metaElement.content) !== null && _a !== void 0 ? _a : 'no-csrf-token';
const instance = axios_1.default.create({
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
    }
    else if (data === null || data === void 0 ? void 0 : data.errors) {
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
