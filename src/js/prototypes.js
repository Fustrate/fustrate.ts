// Replicate a few common prototype methods on default objects
import moment from 'moment';

moment.fn.toHumanDate = (time = false) => {
  const year = this.year() !== moment().year() ? '/YY' : '';

  return this.format(`M/D${year}${(time ? ' h:mm A' : '')}`);
};

if (!Element.prototype.matches) {
  Object.defineProperty(Element.prototype, 'matches', {
    value: Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector,
  });
}

if (!Array.prototype.flatMap) {
  Array.prototype.flatMap = (...args) => Array.prototype.map.apply(this, ...args).flat(1);
}
