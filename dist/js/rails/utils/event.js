"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const m = Element.prototype.matches
    || Element.prototype.matchesSelector
    || Element.prototype.mozMatchesSelector
    || Element.prototype.msMatchesSelector
    || Element.prototype.oMatchesSelector
    || Element.prototype.webkitMatchesSelector;
// Checks if the given native dom element matches the selector
// element::
//   native DOM element
// selector::
//   css selector string or
//   a javascript object with `selector` and `exclude` properties
//   Examples: 'form', { selector: 'form', exclude: 'form[data-remote='true']'}
const matches = (element, selector, exclude) => {
    if (exclude) {
        return m.call(element, selector) && !m.call(element, exclude);
    }
    return m.call(element, selector);
};
// Triggers a custom event on an element and returns false if the event result is false
// obj::
//   a native DOM element
// name::
//   string that corresponds to the event you want to trigger
//   e.g. 'click', 'submit'
// data::
//   data you want to pass when you dispatch an event
exports.fire = (obj, name, data) => {
    const event = new CustomEvent(name, { bubbles: true, cancelable: true, detail: data });
    obj.dispatchEvent(event);
    return !event.defaultPrevented;
};
// Helper function, needed to provide consistent behavior in IE
exports.stopEverything = (e) => {
    if (e.target) {
        exports.fire(e.target, 'ujs:everythingStopped');
    }
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
};
// Delegates events
// to a specified parent `element`, which fires event `handler`
// for the specified `selector` when an event of `eventType` is triggered
// element::
//   parent element that will listen for events e.g. document
// selector::
//   css selector; or an object that has `selector` and `exclude` properties (see: Rails.matches)
// eventType::
//   string representing the event e.g. 'submit', 'click'
// handler::
//   the event handler to be called
exports.delegate = (element, selector, eventType, handler) => {
    element.addEventListener(eventType, (event) => {
        let { target } = event;
        while (target instanceof Element && !matches(target, selector)) {
            target = target.parentNode;
        }
        if (target instanceof Element && handler.call(target, event) === false) {
            event.preventDefault();
            event.stopPropagation();
        }
    });
};
