import { delegate, fire, stopEverything } from '../utils/event';

import {
  // buttonClickSelector,
  formInputClickSelector,
  formSubmitSelector,
  inputChangeSelector,
  linkClickSelector,
} from '../utils/selectors';

// For 'data-confirm' attribute:
// - Fires `confirm` event
// - Shows the confirmation dialog
// - Fires the `confirm:complete` event
//
// Returns `true` if no function stops the chain and user chose yes `false` otherwise.
// Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the
//   confirmation dialog.
// Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes
//   this function
// return false. The `confirm:complete` event is fired whether or not the user answered true or
//   false to the dialog.
const allowAction = (element: HTMLElement) => {
  const message = element.dataset.confirm;

  if (!message) {
    return true;
  }

  let answer = false;
  let callback;

  if (fire(element, 'confirm')) {
    try {
      // eslint-disable-next-line no-alert
      answer = window.confirm(message);
    } catch (e) {
      // Do noeting
    }
    callback = fire(element, 'confirm:complete', [answer]);
  }

  return answer && callback;
};

export const handleConfirm = (e: Event) => {
  if (e.target instanceof HTMLElement && !allowAction(e.target)) {
    stopEverything(e);
  }
};

export default () => {
  delegate(document, linkClickSelector, 'click', handleConfirm);
  delegate(document, inputChangeSelector, 'change', handleConfirm);
  // delegate(document, buttonClickSelector, 'click', handleConfirm);
  delegate(document, formSubmitSelector, 'submit', handleConfirm);
  delegate(document, formInputClickSelector, 'click', handleConfirm);
};
