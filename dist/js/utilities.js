"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Internal functions
const lodash_1 = require("lodash");
const string_1 = require("./string");
// TODO: Remove this and use lodash directly in projects
exports.escapeHTML = lodash_1.escape;
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
const toggleElement = (element, makeVisible) => {
    element.style.display = makeVisible ? '' : 'none';
    if (makeVisible) {
        element.classList.remove('js-hide');
    }
};
// Exported functions
exports.animate = (element, animation, callback, delay, speed) => {
    const classes = ['animated', animation];
    if (delay) {
        classes.push(`delay-${delay}s`);
    }
    // slow, slower, fast, faster
    if (speed) {
        classes.push(speed);
    }
    function handleAnimationEnd() {
        element.classList.remove('animated', animation);
        element.removeEventListener('animationend', handleAnimationEnd);
        if (typeof callback === 'function') {
            callback();
        }
    }
    element.addEventListener('animationend', handleAnimationEnd);
    element.classList.add(...classes);
};
// export const applyMixin = (target: typeof Page, mixin: typeof Mixin, options?: { [s: string]: any }): void => {
//   // eslint-disable-next-line new-cap
//   const instance: Mixin = new mixin();
//   const mixinPrototype = Object.getPrototypeOf(instance) as typeof Mixin;
//   const targetPrototype = Object.getPrototypeOf(target) as typeof Page;
//   if (options) {
//     Object.keys(options).forEach((key) => {
//       Object.defineProperty(target.constructor, key, { value: options[key] });
//     });
//   }
//   const existingTargetPrototypePropertyNames = Object.getOwnPropertyNames(targetPrototype);
//   // Assign properties to the prototype
//   Object.getOwnPropertyNames(mixinPrototype).forEach((key) => {
//     // Mixins can define their own `initialize` and `addEventListeners` methods, which will be
//     // added with their mixin name appended, and called at the same time as the original methods.
//     const newKey = ['initialize', 'addEventListeners'].includes(key) ? `${key}${mixin.name}` : key;
//     if (!existingTargetPrototypePropertyNames.includes(newKey)) {
//       Object.defineProperty(
//         targetPrototype,
//         newKey,
//         Object.getOwnPropertyDescriptor(mixinPrototype, key) as PropertyDescriptor,
//       );
//     }
//   });
//   // Assign properties to the prototype
//   Object.getOwnPropertyNames(mixinPrototype.constructor).forEach((key) => {
//     if (['length', 'name', 'prototype'].includes(key)) {
//       return;
//     }
//     if (!target[key]) {
//       target[key] = mixinPrototype.constructor[key];
//     }
//   });
// };
function debounce(func, delay = 250) {
    let timeout;
    // eslint-disable-next-line func-names
    return function (...args) {
        const context = this;
        const delayedFunc = () => {
            func.apply(context, args);
            timeout = null;
        };
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = window.setTimeout(delayedFunc, delay);
    };
}
exports.debounce = debounce;
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
    const classes = types.split(' ')
        .map(thing => `fa-${thing}`)
        .join(' ');
    return `<i class='fa${style[0]} ${classes}'></i>`;
};
exports.label = (text, type) => {
    const classes = string_1.underscore(lodash_1.compact(['label', type, text.replace(/\s+/g, '-')]).join(' '))
        .toLowerCase()
        .split(' ');
    const span = document.createElement('span');
    span.textContent = text;
    span.classList.add(...classes);
    return span.outerHTML;
};
exports.multilineEscapeHTML = (str) => {
    if (typeof str !== 'string') {
        return '';
    }
    return str
        .split(/\r?\n/)
        .map(line => lodash_1.escape(line))
        .join('<br />');
};
exports.linkTo = (text, href, options) => {
    const element = document.createElement('a');
    if (href === undefined && window.Honeybadger) {
        window.Honeybadger.notify('Invalid href', {
            context: { text, href, options },
            fingerprint: 'undefinedHrefInHrefFor',
        });
    }
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
exports.triggerEvent = (element, name, data = {}) => {
    let event;
    if (window.CustomEvent) {
        event = new CustomEvent(name, { detail: data });
    }
    else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(name, true, true, data);
    }
    element.dispatchEvent(event);
};
exports.isVisible = (elem) => !!(elem.offsetWidth
    || elem.offsetHeight
    || elem.getClientRects().length);
exports.toggle = (element, showOrHide) => {
    if (element instanceof NodeList) {
        element.forEach((elem) => {
            toggleElement(elem, showOrHide !== undefined ? showOrHide : !exports.isVisible(elem));
        });
    }
    else {
        toggleElement(element, showOrHide !== undefined ? showOrHide : !exports.isVisible(element));
    }
};
exports.show = (element) => {
    exports.toggle(element, true);
};
exports.hide = (element) => {
    exports.toggle(element, false);
};
exports.toHumanDate = (momentObject, time = false) => {
    // use Date#getFullYear so that we don't have to pull in the moment library
    const year = momentObject.year() !== (new Date()).getFullYear() ? '/YY' : '';
    return momentObject.format(`M/D${year}${(time ? ' h:mm A' : '')}`);
};
var event_1 = require("./rails/utils/event");
exports.delegate = event_1.delegate;
