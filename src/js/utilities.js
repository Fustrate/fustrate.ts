// Internal functions
import { compact } from './array';

const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

const hrefFor = (href) => {
  if (href.path) {
    return href.path();
  }

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

export const applyMixin = (target, mixin, options) => {
  // eslint-disable-next-line new-cap
  const instance = new mixin();
  const prototype = Object.getPrototypeOf(instance);

  if (options) {
    Object.getOwnPropertyNames(options).forEach((key) => {
      target[key] = options[key];
    });
  }

  // Assign properties to the prototype
  Object.getOwnPropertyNames(prototype).forEach((key) => {
    // Mixins can define their own `initialize` and `addEventListeners` methods, which will be
    // added with their mixin name appended, and called at the same time as the original methods.
    const newKey = ['initialize', 'addEventListeners'].includes(key) ? `${key}${mixin.name}` : key;

    if (!target.prototype[newKey]) {
      target.prototype[newKey] = prototype[key];
    }
  }, this);

  // Assign properties to the prototype
  Object.getOwnPropertyNames(prototype.constructor).forEach((key) => {
    if (['length', 'name', 'prototype'].includes(key)) {
      return;
    }

    if (!target[key]) {
      target[key] = prototype.constructor[key];
    }
  }, this);

  return target;
};

export const debounce = (func, delay = 250) => {
  let timeout = null;

  return (...args) => {
    const context = this;

    const delayedFunc = () => {
      func.apply(context, args);

      timeout = null;
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(delayedFunc, delay);
  };
};

export const elementFromString = (string) => {
  const template = document.createElement('template');

  template.innerHTML = string.trim();

  return template.content.firstChild;
};

export const escapeHTML = (string) => {
  if (string === null || string === undefined) {
    return '';
  }

  return String(string).replace(/[&<>"'`=/]/g, entity => entityMap[entity]);
};

export function hms(seconds, zero) {
  if (zero && (seconds === 0 || seconds === undefined)) {
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

export const icon = (types, style = 'regular') => {
  const classes = types.split(' ')
    .map(thing => `fa-${thing}`)
    .join(' ');

  return `<i class="fa${style[0]} ${classes}"></i>`;
};

export const label = (text, type) => {
  const classes = compact(['label', type, text.replace(/\s+/g, '-')])
    .join(' ')
    .toLowerCase()
    .dasherize()
    .split(' ');

  const span = document.createElement('span');
  span.textContent = text;
  span.classList.add(...classes);

  return span.outerHTML;
};

export const multilineEscapeHTML = (string) => {
  if (string === null || string === undefined) {
    return '';
  }

  return String(string)
    .split(/\r?\n/)
    .map(line => escapeHTML(line))
    .join('<br />');
};

export const linkTo = (text, href, options = {}) => {
  const element = document.createElement('a');

  element.href = hrefFor(href);
  element.innerHTML = text;

  Object.keys(options).forEach((key) => {
    element.setAttribute(key, options[key]);
  });

  return element.outerHTML;
};

export const redirectTo = (href) => {
  window.setTimeout(() => {
    window.location.href = href.path ? href.path() : href;
  }, 750);
};

export const triggerEvent = (element, name, data = {}) => {
  let event;

  if (window.CustomEvent) {
    event = new CustomEvent(name, { detail: data });
  } else {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(name, true, true, data);
  }

  element.dispatchEvent(event);
};

export const isVisible = elem => !!(
  elem.offsetWidth
  || elem.offsetHeight
  || elem.getClientRects().length
);

export const toggle = (element, showOrHide) => {
  if (element instanceof NodeList) {
    element.forEach((elem) => {
      toggleElement(elem, showOrHide !== undefined ? showOrHide : !isVisible(elem));
    });
  } else {
    toggleElement(element, showOrHide !== undefined ? showOrHide : !isVisible(element));
  }
};

export const show = (element) => {
  toggle(element, true);
};

export const hide = (element) => {
  toggle(element, false);
};
