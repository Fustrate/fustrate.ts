import 'array-flat-polyfill';

// IE11 Polyfill
require('es6-promise').polyfill();


if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function forEachPolyfill(callback, thisArg) {
    thisArg = thisArg || window;

    for (let i = 0; i < this.length; i += 1) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector
    || Element.prototype.webkitMatchesSelector;
}
