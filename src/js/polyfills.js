// Polyfills for useful methods
if (!Element.prototype.matches) {
  Object.defineProperty(Element.prototype, 'matches', {
    value: Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector,
  });
}

if (!Array.prototype.flatMap) {
  Array.prototype.flatMap = (...args) => Array.prototype.map.apply(this, ...args).flat(1);
}
