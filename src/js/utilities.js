import $ from 'jquery';

import Rails from './components/rails';

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

function hms(seconds, zero) {
  if (zero && (seconds === 0 || seconds === undefined)) {
    return zero;
  }

  const absolute = Math.abs(seconds);
  const parts = [
    Math.floor(absolute / 3600),
    `0${Math.floor((absolute % 3600) / 60).slice(-2)}`,
    `0${Math.floor(absolute % 60).slice(-2)}`,
  ];

  return `${seconds < 0 ? '-' : ''}${parts.join(':')}`;
}

function postRedirectTo(href) {
  const { csrfToken, csrfParam } = Rails;

  const form = document.createElement('form');
  let formContent = "<input name='_method' value='post' type='hidden'>";

  if ((csrfParam != null) && (csrfToken != null) && !Rails.isCrossDomain(href)) {
    formContent += `<input name='${csrfParam}' value='${csrfToken}' type='hidden'>`;
  }

  // Must trigger submit by click on a button, else "submit" event handler
  // won't work!
  formContent += '<input type="submit">';
  form.method = 'post';
  form.action = href;
  form.innerHTML = formContent;
  form.style.display = 'none';
  document.body.appendChild(form);

  form.querySelector('[type="submit"]').click();
}

const elementFromString = (string) => {
  const template = document.createElement('template');

  template.innerHTML = string.trim();

  return template.content.firstChild;
};

const applyMixin = (target, mixin, options) => {
  // eslint-disable-next-line new-cap
  const instance = new mixin();
  const prototype = Object.getPrototypeOf(instance);

  if (!target.initializers) {
    target.initializers = [];
  }

  if (options) {
    Object.getOwnPropertyNames(options).forEach((key) => {
      target[key] = options[key];
    });
  }

  target.initializers.push(prototype.initialize);

  // Assign properties to the prototype
  Object.getOwnPropertyNames(prototype).forEach((key) => {
    if (['initialize'].includes(key)) {
      return;
    }

    if (!target.prototype[key]) {
      target.prototype[key] = prototype[key];
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

const hrefFor = (href) => {
  if (href.path) {
    return href.path();
  }

  if (!(href.type && href.id)) {
    return href;
  }

  throw new Error(`Invalid href: ${href}`);
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

const getCurrentPageJson = () => {
  const pathname = window.location.pathname.replace(/\/+$/, '');

  return $.get(`${pathname}.json${window.location.search}`);
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

const icon = (types, style = 'regular') => {
  const classes = types.split(' ')
    .map(thing => `fa-${thing}`)
    .join(' ');

  return `<i class="fa${style[0]} ${classes}"></i>`;
};

const escapeHTML = (string) => {
  if (string === null || string === undefined) {
    return '';
  }

  return String(string).replace(/[&<>"'`=/]/g, entity => entityMap[entity]);
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

const redirectTo = (href) => {
  window.setTimeout(() => {
    window.location.href = href.path ? href.path() : href;
  }, 750);
};

const triggerEvent = (element, name, data) => {
  let event;

  if (window.CustomEvent) {
    event = new CustomEvent(name, { detail: data });
  } else {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(name, true, true, data);
  }

  element.dispatchEvent(event);
};

export {
  ajaxUpload,
  applyMixin,
  elementFromString,
  escapeHTML,
  getCurrentPageJson,
  hms,
  icon,
  label,
  linkTo,
  multilineEscapeHTML,
  postRedirectTo,
  redirectTo,
  triggerEvent,
};
