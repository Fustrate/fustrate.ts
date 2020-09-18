"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Supports: Edge (All), Internet Explorer (All)
require('core-js/features/array/flat');
require('core-js/features/array/flat-map');
// Supports: Internet Explorer (All)
require('custom-event-polyfill');
require('core-js/features/dom-collections/for-each');
require('core-js/features/array/from');
// Supports: Internet Explorer 11
require('core-js/features/promise');
require('core-js/features/symbol');
// Supports: Internet Explorer (All)
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}
