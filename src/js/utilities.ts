import moment from 'moment';

// Internal functions
import { compact } from './array';
import { underscore } from './string';
import Page from './page';
import Mixin from './mixin';

declare global {
  interface Window { Honeybadger: any; CustomEvent: any; }
}

const entityMap: { [s: string]: string } = {
  '"': '&quot;',
  '&': '&amp;',
  '\'': '&#39;',
  '/': '&#x2F;',
  '<': '&lt;',
  '=': '&#x3D;',
  '>': '&gt;',
  '`': '&#x60;',
};

const hrefFor = (href: any) => {
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

const toggleElement = (element: HTMLElement, makeVisible: boolean): void => {
  element.style.display = makeVisible ? '' : 'none';

  if (makeVisible) {
    element.classList.remove('js-hide');
  }
};

// Exported functions

export const animate = (
  element: HTMLElement,
  animation: string,
  callback?: () => void,
  delay?: number,
  speed?: string,
): void => {
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

export const debounce = (func: (...args: any[]) => void, delay: number = 250): (...args: any[]) => void => {
  let timeout: number | null;

  // eslint-disable-next-line func-names
  return function (this: any, ...args: any[]) {
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
};

export const elementFromString = <T extends HTMLElement = HTMLElement>(str: string): T => {
  const template = document.createElement('template');

  template.innerHTML = str.trim();

  return template.content.firstChild as T;
};

export const escapeHTML = (str: string): string => {
  if (str === null || str === undefined) {
    return '';
  }

  return String(str).replace(/[&<>'"`=/\\]/g, entity => entityMap[entity]);
};

export function hms(seconds: number, zero?: string): string {
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

type FontAwesomeStyles = 'regular' | 'thin' | 'solid' | 'brands';

export const icon = (types: string, style: FontAwesomeStyles = 'regular'): string => {
  const classes = types.split(' ')
    .map(thing => `fa-${thing}`)
    .join(' ');

  return `<i class='fa${style[0]} ${classes}'></i>`;
};

export const label = (text: string, type?: string): string => {
  const classes = underscore(compact(['label', type, text.replace(/\s+/g, '-')]).join(' '))
    .toLowerCase()
    .split(' ');

  const span = document.createElement('span');
  span.textContent = text;
  span.classList.add(...classes);

  return span.outerHTML;
};

export const multilineEscapeHTML = (str?: string): string => {
  if (typeof str !== 'string') {
    return '';
  }

  return str
    .split(/\r?\n/)
    .map(line => escapeHTML(line))
    .join('<br />');
};

export const linkTo = (text: string, href: any, options?: { [s: string]: string }): string => {
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

export const redirectTo = (href: any): void => {
  window.setTimeout(() => {
    window.location.href = href.path ? href.path() : href;
  }, 750);
};

export const triggerEvent = (element: Element, name: string, data = {}): void => {
  let event;

  if (window.CustomEvent) {
    event = new CustomEvent(name, { detail: data });
  } else {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(name, true, true, data);
  }

  element.dispatchEvent(event);
};

export const isVisible = (elem: HTMLElement): boolean => !!(
  elem.offsetWidth
  || elem.offsetHeight
  || elem.getClientRects().length
);

export const toggle = (element: NodeListOf<HTMLElement> | HTMLElement, showOrHide: boolean | undefined): void => {
  if (element instanceof NodeList) {
    element.forEach((elem) => {
      toggleElement(elem, showOrHide !== undefined ? showOrHide : !isVisible(elem));
    });
  } else {
    toggleElement(element, showOrHide !== undefined ? showOrHide : !isVisible(element));
  }
};

export const show = (element: HTMLElement): void => {
  toggle(element, true);
};

export const hide = (element: HTMLElement): void => {
  toggle(element, false);
};

export const toHumanDate = (momentObject: moment.Moment, time: boolean = false) => {
  // use Date#getFullYear so that we don't have to pull in the moment library
  const year = momentObject.year() !== (new Date()).getFullYear() ? '/YY' : '';

  return momentObject.format(`M/D${year}${(time ? ' h:mm A' : '')}`);
};

export { delegate } from './rails/utils/event';
