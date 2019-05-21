// Replicate a few common prototype methods on default objects
import moment from 'moment';
import BasicObject from './basic_object';

function arrayCompact(strings = true) {
  this.forEach((el, index) => {
    if (!(el === undefined || el === null || (strings && el === ''))) {
      return;
    }

    this.splice(index, 1);
  });

  return this;
}

function arrayFirst() {
  return this[0];
}

function arrayLast() {
  return this[this.length - 1];
}

function arrayRemove(object) {
  const index = this.indexOf(object);

  if (index !== -1) {
    this.splice(index, 1);
  }
}

function arrayToSentence() {
  switch (this.length) {
    case 0:
      return '';
    case 1:
      return this[0];
    case 2:
      return `${this[0]} and ${this[1]}`;
    default:
      return `${this.slice(0, -1).join(', ')}, and ${this[this.length - 1]}`;
  }
}

Object.defineProperties(Array.prototype, {
  compact: { value: arrayCompact },
  first: { value: arrayFirst },
  last: { value: arrayLast },
  peek: { value: arrayLast },
  remove: { value: arrayRemove },
  toSentence: { value: arrayToSentence },
});

// Used to define getters and setters
function functionDefine(name, methods) {
  Object.defineProperty(this.prototype, name, methods);
}

Object.defineProperties(Function.prototype, {
  define: { value: functionDefine },
});

function numberAccountingFormat() {
  if (this < 0) {
    return `($${(this * -1).toFixed(2)})`;
  }

  return `$${this.toFixed(2)}`;
}

function numberBytesToString() {
  if (this < 1000) {
    return `${this} B`;
  }
  if (this < 1000000) {
    return `${(this / 1000).truncate()} kB`;
  }
  if (this < 1000000000) {
    return `${(this / 1000000).truncate()} MB`;
  }
  return `${(this / 1000000000).truncate()} GB`;
}

function numberOrdinalize() {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = this % 100;

  return this + (s[(v - 20) % 10] || s[v] || 'th');
}

function numberTruncate(digits = 2) {
  return this.toFixed(digits).replace(/\.?0+$/, '');
}

Object.defineProperties(Number.prototype, {
  accountingFormat: { value: numberAccountingFormat },
  bytesToString: { value: numberBytesToString },
  ordinalize: { value: numberOrdinalize },
  truncate: { value: numberTruncate },
});

function isPlainObject(object) {
  // Do the inexpensive checks first.
  if (typeof object !== 'object' || Array.isArray(object) || object === null) {
    return false;
  }

  return Object.prototype.isPrototypeOf.call(BasicObject, object);
}

function objectDeepExtend(out, ...rest) {
  out = out || {};

  rest
    .filter(obj => obj)
    .forEach((obj) => {
      Object.getOwnPropertyNames(obj).forEach((key) => {
        if (Object.isPlainObject(obj[key])) {
          out[key] = objectDeepExtend(out[key], obj[key]);
        } else {
          out[key] = obj[key];
        }
      });
    });

  return out;
}

Object.defineProperties(Object.prototype, {
  isPlainObject: { value: isPlainObject },
  deepExtend: { value: objectDeepExtend },
});

function stringCapitalize() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

function stringDasherize() {
  return this.replace(/_/g, '-');
}

function stringHumanize() {
  return this
    .replace(/[a-z][A-Z]/, match => `${match[0]} ${match[1]}`)
    .replace('_', ' ')
    .toLowerCase();
}

function stringIsBlank() {
  return this.trim() === '';
}

// Turn unwanted chars into the separator,
// No more than one of the separator in a row,
// Remove leading/trailing separator.
function stringParameterize() {
  return this
    .replace(/[a-z][A-Z]/, match => `${match[0]}_${match[1]}`)
    .replace(/[^a-zA-Z0-9\-_]+/, '-')
    .replace(/-{2,}/, '-')
    .replace(/^-|-$/, '')
    .toLowerCase();
}

function stringPhoneFormat() {
  if (/^1?\d{10}$/.test(this)) {
    return this.replace(/1?(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }

  if (/^\d{7}$/.test(this)) {
    return this.replace(/(\d{3})(\d{4})/, '$1-$2');
  }

  return this;
}

// This is far too simple for most cases, but it works for the few things we need
function stringPluralize() {
  if (this[this.length - 1] === 'y') {
    return `${this.substr(0, this.length - 1)}ies`;
  }

  return `${this}s`;
}

function stringPresence() {
  return this.isBlank() ? null : this;
}

function stringStrip() {
  return this.replace(/^\s+|\s+$/g, '');
}

function stringTitleize() {
  return this
    .replace(/_/g, ' ')
    .replace(/\b[a-z]/g, char => char.toUpperCase());
}

function stringUnderscore() {
  return this
    .replace(/[a-z][A-Z]/, match => `${match[0]}_${match[1]}`)
    .replace('::', '/')
    .toLowerCase();
}

Object.defineProperties(String.prototype, {
  capitalize: { value: stringCapitalize },
  dasherize: { value: stringDasherize },
  humanize: { value: stringHumanize },
  isBlank: { value: stringIsBlank },
  parameterize: { value: stringParameterize },
  phoneFormat: { value: stringPhoneFormat },
  pluralize: { value: stringPluralize },
  presence: { value: stringPresence },
  strip: { value: stringStrip },
  titleize: { value: stringTitleize },
  underscore: { value: stringUnderscore },
});

function momentToHumanDate(time = false) {
  const year = this.year() !== moment().year() ? '/YY' : '';

  return this.format(`M/D${year}${(time ? ' h:mm A' : '')}`);
}

moment.fn.toHumanDate = momentToHumanDate;

if (!Element.prototype.matches) {
  Object.defineProperty(Element.prototype, 'matches', {
    value: Element.prototype.msMatchesSelector
      || Element.prototype.webkitMatchesSelector,
  });
}

if (!Array.prototype.flatMap) {
  Array.prototype.flatMap = (...args) => Array.prototype.map.apply(this, ...args).flat(1);
}
