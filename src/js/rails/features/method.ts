import { isCrossDomain } from '../utils/ajax';
import { csrfParam, csrfToken } from '../utils/csrf';
import { delegate, stopEverything } from '../utils/event';

import { linkClickSelector } from '../utils/selectors';

// Handles 'data-method' on links such as:
// <a href='/users/5' data-method='delete' rel='nofollow' data-confirm='Are you sure?'>Delete</a>
export const handleMethod = (event) => {
  const link = event.target;
  const { method } = link.dataset;

  if (!method) {
    return;
  }

  const { href } = link;
  const token = csrfToken();
  const param = csrfParam();
  const form = document.createElement('form');

  let formContent = `<input name="_method" value="${method}" type="hidden" />`;

  if (param && token && !isCrossDomain(href)) {
    formContent += `<input name="${param}" value="${token}" type="hidden" />`;
  }

  // Must trigger submit by click on a button, else 'submit' event handler won't work!
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit
  formContent += '<input type="submit" />';

  form.method = 'post';
  form.action = href;
  form.target = link.target;
  form.innerHTML = formContent;
  form.style.display = 'none';

  document.body.appendChild(form);
  (form.querySelector('[type="submit"]') as HTMLInputElement).click();

  stopEverything(event);
};

export default () => {
  delegate(document, linkClickSelector, 'click', handleMethod);
};
