import { delegate, fire, stopEverything } from '../utils/event';

import {
  linkClickSelector,
  inputChangeSelector,
  buttonClickSelector,
  formSubmitSelector,
  formInputClickSelector,
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
const allowAction = (element) => {
  const message = element.getAttribute('data-confirm');

  if (!message) {
    return true;
  }

  let answer = false;
  let callback;

  if (fire(element, 'confirm')) {
    try {
      // eslint-disable-next-line no-alert
      answer = window.confirm(message, element);
    } catch (e) {
      // Do noeting
    }
    callback = fire(element, 'confirm:complete', [answer]);
  }

  return answer && callback;
};

const handleConfirm = (e) => {
  if (!allowAction(this)) {
    stopEverything(e);
  }
};

export { handleConfirm };

export default () => {
  delegate(document, linkClickSelector, 'click', handleConfirm);
  delegate(document, inputChangeSelector, 'change', handleConfirm);
  delegate(document, buttonClickSelector, 'click', handleConfirm);
  delegate(document, formSubmitSelector, 'submit', handleConfirm);
  delegate(document, formInputClickSelector, 'click', handleConfirm);
};
