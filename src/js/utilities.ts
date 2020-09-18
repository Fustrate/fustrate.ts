import compact from 'lodash/compact';
import escape from 'lodash/escape';

import type { Moment } from 'moment';

import { underscore } from './string';

// Internal functions

declare global {
  interface Window {
    Honeybadger: any;
    CustomEvent: any;
  }
}

type FontAwesomeStyles = 'regular' | 'thin' | 'solid' | 'brands';

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

// Exported functions

export const animate = (
  element: HTMLElement,
  animation: string,
  callback?: () => void,
  delay?: number,
  speed?: string,
): void => {
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

export function elementFromString<T extends HTMLElement>(str: string): T {
  const template = document.createElement('template');

  template.innerHTML = str.trim();

  return template.content.firstChild as T;
}

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

export const icon = (types: string, style: FontAwesomeStyles = 'regular'): string => {
  const classes = types.split(' ').map((thing) => `fa-${thing}`).join(' ');

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
  if (str == null) {
    return '';
  }

  return str
    .split(/\r?\n/)
    .map((line) => escape(line))
    .join('<br />');
};

export const linkTo = (text: string, href: any, options?: { [s: string]: string }): string => {
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

export const redirectTo = (href: any): void => {
  window.setTimeout(() => {
    window.location.href = href.path ? href.path() : href;
  }, 750);
};

export const toHumanDate = (momentObject: Moment, time = false): string => {
  // use Date#getFullYear so that we don't have to pull in the moment library
  const year = momentObject.year() !== (new Date()).getFullYear() ? '/YY' : '';

  return momentObject.format(`M/D${year}${(time ? ' h:mm A' : '')}`);
};
