declare global {
  interface Element {
    matchesSelector: (selectors: string) => boolean;
    mozMatchesSelector: (selectors: string) => boolean;
    msMatchesSelector: (selectors: string) => boolean;
    oMatchesSelector: (selectors: string) => boolean;
  }
}

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
const matches = (element: Element, selector: string, exclude?: string): boolean => {
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
export const fire = (obj: EventTarget, name: string, data?: any): boolean => {
  const event = new CustomEvent(name, { bubbles: true, cancelable: true, detail: data });

  obj.dispatchEvent(event);

  return !event.defaultPrevented;
};

// Helper function, needed to provide consistent behavior in IE
export const stopEverything = (e: Event): void => {
  if (e.target) {
    fire(e.target, 'ujs:everythingStopped');
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
export const delegate = (
  element: EventTarget,
  selector: string,
  eventType: string,
  handler: (...args: any) => boolean | void,
): void => {
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
