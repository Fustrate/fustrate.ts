import { matches } from "./dom";

const toArray = <T>(e: T[]): T[] => Array.prototype.slice.call(e);

export const serializeElement = (element, additionalParam) => {
  let inputs = [element];

  if (matches(element, "form")) {
    inputs = toArray(element.elements);
  }

  const params = [];

  inputs.forEach((input) => {
    if (!input.name || input.disabled) {
      return;
    }

    if (matches(input, "select")) {
      toArray(input.options).forEach((option) => {
        if (option.selected) {
          params.push({ name: input.name, value: option.value });
        }
      });
    } else if (input.checked || ["radio", "checkbox", "submit"].indexOf(input.type) === -1) {
      params.push({ name: input.name, value: input.value });
    }
  });

  if (additionalParam) {
    params.push(additionalParam);
  }

  return params
    .map((param) => (param.name ? `${encodeURIComponent(param.name)}=${encodeURIComponent(param.value)}` : param))
    .join("&");
};

// Helper function that returns form elements that match the specified CSS selector
// If form is actually a "form" element this will return associated elements outside the form that
// have the html form attribute set
export const formElements = (form: HTMLElement, selector) => {
  if (form instanceof HTMLFormElement) {
    return toArray(form.elements).filter((el) => matches(el, selector));
  }

  return toArray(form.querySelectorAll(selector));
};
