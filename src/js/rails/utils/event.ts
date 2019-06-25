import { matches } from "./dom";

// Polyfill for CustomEvent in IE9+
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
let { CustomEvent } = window;

if (typeof CustomEvent !== "function") {
  CustomEvent = (event, params) => {
    const evt = document.createEvent("CustomEvent");

    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);

    return evt;
  };

  CustomEvent.prototype = window.Event.prototype;

  // Fix setting `defaultPrevented` when `preventDefault()` is called
  // http://stackoverflow.com/questions/23349191/event-preventdefault-is-not-working-in-ie-11-for-custom-events
  const { preventDefault } = CustomEvent.prototype;

  CustomEvent.prototype.preventDefault = () => {
    const result = preventDefault.call(this);

    if (this.cancelable && !this.defaultPrevented) {
      Object.defineProperty(this, "defaultPrevented", { get: () => true });
    }

    return result;
  };
}

// Triggers a custom event on an element and returns false if the event result is false
// obj::
//   a native DOM element
// name::
//   string that corresponds to the event you want to trigger
//   e.g. 'click', 'submit'
// data::
//   data you want to pass when you dispatch an event
export const fire = (obj: EventTarget, name: string, data?: any): boolean => {
  const event = new CustomEvent(name, { bubbles: true, cancelable: true, detail: data });

  obj.dispatchEvent(event);

  return !event.defaultPrevented;
};

// Helper function, needed to provide consistent behavior in IE
export const stopEverything = (e: Event): void => {
  fire(e.target, "ujs:everythingStopped");

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
export const delegate = (element: Element,
                         selector: string,
                         eventType: string,
                         handler: (...args: any) => void): void => {
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
