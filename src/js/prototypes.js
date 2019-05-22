// Replicate a few common prototype methods on default objects
import moment from 'moment';
import BasicObject from './basic_object';

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
