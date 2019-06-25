// Link elements bound by rails-ujs
export const linkClickSelector = `
  a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]`;

// Button elements bound by rails-ujs
export const buttonClickSelector = {
  exclude: "form button",
  selector: "button[data-remote]:not([form]), button[data-confirm]:not([form])",
};

// Select elements bound by rails-ujs
export const inputChangeSelector = "select[data-remote], input[data-remote], textarea[data-remote]";

// Form elements bound by rails-ujs
export const formSubmitSelector = "form";

// Form input elements bound by rails-ujs
export const formInputClickSelector = `
  form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]),
  input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])`;

// Form input elements disabled during form submission
export const formDisableSelector = `
  input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled,
  input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled`;

// Form input elements re-enabled after form submission
export const formEnableSelector = `
  input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled,
  input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled`;

// Form file input elements
export const fileInputSelector = "input[name][type=file]:not([disabled])";

// Link onClick disable selector with possible reenable after remote submission
export const linkDisableSelector = "a[data-disable-with], a[data-disable]";

// Button onClick disable selector with possible reenable after remote submission
export const buttonDisableSelector = "button[data-remote][data-disable-with], button[data-remote][data-disable]";
