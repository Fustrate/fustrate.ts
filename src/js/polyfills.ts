if (!Array.prototype.flat) {
  Array.prototype.flat = function flatPolyfill(depth) {
    const flattened = [];

    function flatten(array, toDepth) {
      array.forEach((element) => {
        if (Array.isArray(element) && toDepth > 0) {
          flatten(element, toDepth - 1);
        } else {
          flattened.push(element);
        }
      });
    }

    flatten(this, Math.floor(depth) || 1);

    return flattened;
  };
}

if (!Array.prototype.flatMap) {
  Array.prototype.flatMap = function flatMapPolyfill(...args) {
    return Array.prototype.map.apply(this, ...args).flat(1);
  };
}

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
