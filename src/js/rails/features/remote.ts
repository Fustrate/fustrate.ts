import { ajax, isCrossDomain } from "../utils/ajax";
import { getData, matches, setData } from "../utils/dom";
import { delegate, fire, stopEverything } from "../utils/event";
import { serializeElement } from "../utils/form";

import { formInputClickSelector, linkClickSelector } from "../utils/selectors";

// TODO
const buttonClickSelector = "";
const formSubmitSelector = "";
const inputChangeSelector = "";

// Checks "data-remote" if true to handle the request through a XHR request.
const isRemote = (element) => {
  const value = element.getAttribute("data-remote");

  return value && value !== "false";
};

// Submits "remote" forms and links with ajax
export const handleRemote = (e) => {
  const element = this;

  if (!isRemote(element)) {
    return true;
  }

  if (!fire(element, "ajax:before")) {
    fire(element, "ajax:stopped");

    return false;
  }

  const withCredentials = element.getAttribute("data-with-credentials");
  const dataType = element.getAttribute("data-type") || "script";

  let method;
  let url;
  let data;

  if (matches(element, formSubmitSelector)) {
    // memoized value from clicked submit button
    const button = getData(element, "ujs:submit-button");
    method = getData(element, "ujs:submit-button-formmethod") || element.method;
    url = getData(element, "ujs:submit-button-formaction") || element.getAttribute("action") || window.location.href;

    // strip query string if it's a GET request
    if (method.toUpperCase() === "GET") {
      url = url.replace(/\?.*$/, "");
    }

    if (element.enctype === "multipart/form-data") {
      data = new FormData(element);

      if (button) {
        data.append(button.name, button.value);
      }
    } else {
      data = serializeElement(element, button);
    }

    setData(element, "ujs:submit-button", null);
    setData(element, "ujs:submit-button-formmethod", null);
    setData(element, "ujs:submit-button-formaction", null);
  } else if (matches(element, buttonClickSelector) || matches(element, inputChangeSelector)) {
    method = element.getAttribute("data-method");
    url = element.getAttribute("data-url");
    data = serializeElement(element, element.getAttribute("data-params"));
  } else {
    method = element.getAttribute("data-method");
    url = element.href;
    data = element.getAttribute("data-params");
  }

  ajax({
    // stopping the "ajax:beforeSend" event will cancel the ajax request
    beforeSend: (xhr, options) => {
      if (fire(element, "ajax:beforeSend", [xhr, options])) {
        return fire(element, "ajax:send", [xhr]);
      }

      fire(element, "ajax:stopped");
      return false;
    },
    complete: (...args) => fire(element, "ajax:complete", ...args),
    crossDomain: isCrossDomain(url),
    data,
    dataType,
    error: (...args) => fire(element, "ajax:error", ...args),
    success: (...args) => fire(element, "ajax:success", ...args),
    type: method || "GET",
    url,
    withCredentials: withCredentials && withCredentials !== "false",
  });

  return stopEverything(e);
};

export const formSubmitButtonClick = () => {
  const button = this;
  const { form } = button;

  if (!form) {
    return;
  }

  // Register the pressed submit button
  if (button.name) {
    setData(form, "ujs:submit-button", { name: button.name, value: button.value });
  }

  // Save attributes from button
  setData(form, "ujs:formnovalidate-button", button.formNoValidate);
  setData(form, "ujs:submit-button-formaction", button.getAttribute("formaction"));
  setData(form, "ujs:submit-button-formmethod", button.getAttribute("formmethod"));
};

export const preventInsignificantClick = (e) => {
  const link = this;
  const method = (link.getAttribute("data-method") || "GET").toUpperCase();
  const data = link.getAttribute("data-params");
  const metaClick = e.metaKey || e.ctrlKey;
  const insignificantMetaClick = metaClick && method === "GET" && !data;
  const primaryMouseKey = e.button === 0;

  if (!primaryMouseKey || insignificantMetaClick) {
    e.stopImmediatePropagation();
  }
};

export default () => {
  delegate(document, linkClickSelector, "click", handleRemote);
  delegate(document, buttonClickSelector, "click", handleRemote);
  delegate(document, inputChangeSelector, "change", handleRemote);
  delegate(document, formSubmitSelector, "submit", handleRemote);

  delegate(document, linkClickSelector, "click", preventInsignificantClick);
  delegate(document, buttonClickSelector, "click", preventInsignificantClick);
  delegate(document, formInputClickSelector, "click", preventInsignificantClick);

  delegate(document, formInputClickSelector, "click", formSubmitButtonClick);
};
