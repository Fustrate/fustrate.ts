import $ from 'jquery';

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

const ajaxUpload = (url, data) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  return $.ajax({
    url,
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    dataType: 'script',
  });
};

const applyMixin = (target, mixin, options) => {
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
};

const elementFromString = (string) => {
  const template = document.createElement('template');

  template.innerHTML = string.trim();

  return template.content.firstChild;
};

const escapeHTML = (string) => {
  if (string === null || string === undefined) {
    return '';
  }

  return String(string).replace(/[&<>"'`=/]/g, entity => entityMap[entity]);
};

const getCurrentPageJson = () => {
  const pathname = window.location.pathname.replace(/\/+$/, '');

  return $.get(`${pathname}.json${window.location.search}`);
};

function hms(seconds, zero) {
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

const hrefFor = (href) => {
  if (href.path) {
    return href.path();
  }

  if (!(href.type && href.id)) {
    return href;
  }

  throw new Error(`Invalid href: ${href}`);
};

const icon = (types, style = 'regular') => {
  const classes = types.split(' ')
    .map(thing => `fa-${thing}`)
    .join(' ');

  return `<i class="fa${style[0]} ${classes}"></i>`;
};

const label = (text, type) => {
  const classes = ['label', type, text.replace(/\s+/g, '-')]
    .compact()
    .join(' ')
    .toLowerCase()
    .dasherize()
    .split(' ');

  const span = document.createElement('span');
  span.textContent = text;
  span.classList.add(...classes);

  return span.outerHTML;
};

const multilineEscapeHTML = (string) => {
  if (string === null || string === undefined) {
    return '';
  }

  return String(string)
    .split(/\r?\n/)
    .map(line => escapeHTML(line))
    .join('<br />');
};

const linkTo = (text, href, options = {}) => {
  const element = document.createElement('a');

  element.href = hrefFor(href);
  element.innerHTML = text;

  Object.keys(options).forEach((key) => {
    element.setAttribute(key, options[key]);
  });

  return element.outerHTML;
};

const redirectTo = (href) => {
  window.setTimeout(() => {
    window.location.href = href.path ? href.path() : href;
  }, 750);
};

const triggerEvent = (element, name, data = {}) => {
  let event;

  if (window.CustomEvent) {
    event = new CustomEvent(name, { detail: data });
  } else {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(name, true, true, data);
  }

  element.dispatchEvent(event);
};

const toggle = (element, showOrHide) => {
  const value = showOrHide ? '' : 'none';
  
  if (element instanceof NodeList) {
    element.forEach((elem) => { elem.style.display = value; });
  } else {
    element.style.display = value;
  }
};

const show = (element) => {
  toggle(element, true);
};

const hide = (element) => {
  toggle(element, false);
};

export {
  ajaxUpload,
  applyMixin,
  elementFromString,
  escapeHTML,
  getCurrentPageJson,
  hide,
  hms,
  icon,
  label,
  linkTo,
  multilineEscapeHTML,
  redirectTo,
  show,
  toggle,
  triggerEvent,
};
