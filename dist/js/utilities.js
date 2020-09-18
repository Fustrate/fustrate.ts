"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toHumanDate = exports.redirectTo = exports.linkTo = exports.multilineEscapeHTML = exports.label = exports.icon = exports.hms = exports.elementFromString = exports.animate = void 0;
const compact_1 = __importDefault(require("lodash/compact"));
const escape_1 = __importDefault(require("lodash/escape"));
const string_1 = require("./string");
const hrefFor = (href) => {
    if (href === undefined) {
        return '#';
    }
    // A plain string is fine.
    if (typeof href === 'string') {
        return href;
    }
    // Models have a `path` function.
    if (href.path) {
        return href.path();
    }
    // I should've commented this. What is this for?
    if (!(href.type && href.id)) {
        return href;
    }
    throw new Error(`Invalid href: ${href}`);
};
// Exported functions
exports.animate = (element, animation, callback, delay, speed) => {
    const classes = ['animated', ...animation.split(' ')];
    if (delay) {
        classes.push(`delay-${delay}s`);
    }
    // slow, slower, fast, faster
    if (speed) {
        classes.push(speed);
    }
    const scopedClasses = classes.map((name) => `animate__${name}`);
    function handleAnimationEnd() {
        element.classList.remove(...scopedClasses);
        element.removeEventListener('animationend', handleAnimationEnd);
        if (typeof callback === 'function') {
            callback();
        }
    }
    element.addEventListener('animationend', handleAnimationEnd);
    element.classList.add(...scopedClasses);
};
function elementFromString(str) {
    const template = document.createElement('template');
    template.innerHTML = str.trim();
    return template.content.firstChild;
}
exports.elementFromString = elementFromString;
function hms(seconds, zero) {
    if (zero && seconds === 0) {
        return zero;
    }
    const absolute = Math.abs(seconds);
    const parts = [
        Math.floor(absolute / 3600),
        `0${Math.floor((absolute % 3600) / 60)}`.slice(-2),
        `0${Math.floor(absolute % 60)}`.slice(-2),
    ];
    return `${seconds < 0 ? '-' : ''}${parts.join(':')}`;
}
exports.hms = hms;
exports.icon = (types, style = 'regular') => {
    const classes = types.split(' ').map((thing) => `fa-${thing}`).join(' ');
    return `<i class='fa${style[0]} ${classes}'></i>`;
};
exports.label = (text, type) => {
    const classes = string_1.underscore(compact_1.default(['label', type, text.replace(/\s+/g, '-')]).join(' '))
        .toLowerCase()
        .split(' ');
    const span = document.createElement('span');
    span.textContent = text;
    span.classList.add(...classes);
    return span.outerHTML;
};
exports.multilineEscapeHTML = (str) => {
    if (str == null) {
        return '';
    }
    return str
        .split(/\r?\n/)
        .map((line) => escape_1.default(line))
        .join('<br />');
};
exports.linkTo = (text, href, options) => {
    const element = document.createElement('a');
    element.href = hrefFor(href);
    element.innerHTML = text;
    if (options) {
        Object.keys(options).forEach((key) => {
            element.setAttribute(key, options[key]);
        });
    }
    return element.outerHTML;
};
exports.redirectTo = (href) => {
    window.setTimeout(() => {
        window.location.href = href.path ? href.path() : href;
    }, 750);
};
exports.toHumanDate = (momentObject, time = false) => {
    // use Date#getFullYear so that we don't have to pull in the moment library
    const year = momentObject.year() !== (new Date()).getFullYear() ? '/YY' : '';
    return momentObject.format(`M/D${year}${(time ? ' h:mm A' : '')}`);
};
