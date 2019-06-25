import {
  $, getData, matches, setData,
} from '../utils/dom';
import { delegate, stopEverything } from '../utils/event';
import { formElements } from '../utils/form';

import {
  buttonClickSelector, buttonDisableSelector, formDisableSelector, formEnableSelector, formInputClickSelector,
  formSubmitSelector, inputChangeSelector, linkClickSelector, linkDisableSelector,
} from '../utils/selectors';

// Replace element's html with the 'data-disable-with' after storing original html
// and prevent clicking on it
const disableLinkElement = (element) => {
  if (getData(element, 'ujs:disabled')) {
    return;
  }

  const replacement = element.getAttribute('data-disable-with');

  if (replacement) {
    setData(element, 'ujs:enable-with', element.innerHTML); // store enabled state
    element.innerHTML = replacement;
  }

  element.addEventListener('click', stopEverything); // prevent further clicking

  setData(element, 'ujs:disabled', true);
};

// Restore element to its original state which was disabled by 'disableLinkElement' above
const enableLinkElement = (element) => {
  const originalText = getData(element, 'ujs:enable-with');

  if (originalText) {
    element.innerHTML = originalText; // set to old enabled state
    setData(element, 'ujs:enable-with', null); // clean up cache
  }

  element.removeEventListener('click', stopEverything); // enable element
  setData(element, 'ujs:disabled', null);
};

const disableFormElement = (element) => {
  if (getData(element, 'ujs:disabled')) {
    return;
  }

  const replacement = element.getAttribute('data-disable-with');

  if (replacement) {
    if (matches(element, 'button')) {
      setData(element, 'ujs:enable-with', element.innerHTML);
      element.innerHTML = replacement;
    } else {
      setData(element, 'ujs:enable-with', element.value);
      element.value = replacement;
    }
  }

  element.disabled = true;
  setData(element, 'ujs:disabled', true);
};

// Disables form elements:
//  - Caches element value in 'ujs:enable-with' data store
//  - Replaces element text with value of 'data-disable-with' attribute
//  - Sets disabled property to true
const disableFormElements = (form) => {
  formElements(form, formDisableSelector).forEach(disableFormElement);
};

const enableFormElement = (element) => {
  const originalText = getData(element, 'ujs:enable-with');

  if (originalText) {
    if (matches(element, 'button')) {
      element.innerHTML = originalText;
    } else {
      element.value = originalText;
    }

    setData(element, 'ujs:enable-with', null); // clean up cache
  }

  element.disabled = false;
  setData(element, 'ujs:disabled', null);
};

// Re-enables disabled form elements:
//  - Replaces element text with cached value from 'ujs:enable-with' data store (created in
//    `disableFormElements`)
//  - Sets disabled property to false
const enableFormElements = (form) => {
  formElements(form, formEnableSelector).forEach(enableFormElement);
};

const isXhrRedirect = (event) => {
  if (!event.detail) {
    return false;
  }

  const [xhr] = event.detail;

  return xhr ? xhr.getResponseHeader('X-Xhr-Redirect') : false;
};

export const handleDisabledElement = (e) => {
  if (this.disabled) {
    stopEverything(e);
  }
};

// Unified function to enable an element (link, button and form)
export const enableElement = (e) => {
  let element;

  if (e instanceof Event) {
    if (isXhrRedirect(e)) {
      return;
    }

    element = e.target;
  } else {
    element = e;
  }

  if (matches(element, linkDisableSelector)) {
    enableLinkElement(element);
  } else if (matches(element, buttonDisableSelector) || matches(element, formEnableSelector)) {
    enableFormElement(element);
  } else if (matches(element, formSubmitSelector)) {
    enableFormElements(element);
  }
};

// Unified function to disable an element (link, button and form)
export const disableElement = (e) => {
  const element = e instanceof Event ? e.target : e;

  if (matches(element, linkDisableSelector)) {
    disableLinkElement(element);
  } else if (matches(element, buttonDisableSelector) || matches(element, formDisableSelector)) {
    disableFormElement(element);
  } else if (matches(element, formSubmitSelector)) {
    disableFormElements(element);
  }
};

export default () => {
  // This event works the same as the load event, except that it fires every
  // time the page is loaded.
  // See https://github.com/rails/jquery-ujs/issues/357
  // See https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching
  window.addEventListener('pageshow', () => {
    $(formEnableSelector).forEach((el) => {
      if (getData(el, 'ujs:disabled')) {
        enableElement(el);
      }
    });

    $(linkDisableSelector).forEach((el) => {
      if (getData(el, 'ujs:disabled')) {
        enableElement(el);
      }
    });
  });

  delegate(document, linkDisableSelector, 'ajax:complete', enableElement);
  delegate(document, linkDisableSelector, 'ajax:stopped', enableElement);
  delegate(document, buttonDisableSelector, 'ajax:complete', enableElement);
  delegate(document, buttonDisableSelector, 'ajax:stopped', enableElement);
  delegate(document, formSubmitSelector, 'ajax:complete', enableElement);

  delegate(document, linkClickSelector, 'click', disableElement);
  delegate(document, buttonClickSelector, 'click', disableElement);
  // Normal mode submit
  // Slight timeout so that the submit button gets properly serialized
  delegate(document, formSubmitSelector, 'submit', (e) => {
    setTimeout(() => disableElement(e), 13);
  });
  delegate(document, formSubmitSelector, 'ajax:send', disableElement);

  delegate(document, linkClickSelector, 'click', handleDisabledElement);
  delegate(document, buttonClickSelector, 'click', handleDisabledElement);
  delegate(document, inputChangeSelector, 'change', handleDisabledElement);
  delegate(document, formSubmitSelector, 'submit', handleDisabledElement);
  delegate(document, formInputClickSelector, 'click', handleDisabledElement);
};
