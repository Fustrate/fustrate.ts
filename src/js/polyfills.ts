// Supports: Edge (All), Internet Explorer (All)
import 'array-flat-polyfill';

// Supports: Internet Explorer (All)
import 'custom-event-polyfill';
import 'nodelist-foreach-polyfill';

// Supports: Internet Explorer 11
require('es6-promise').polyfill();

// Supports: Internet Explorer (All)
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector
    || Element.prototype.webkitMatchesSelector;
}
