import { loadCSPNonce } from './utils/csp';
import { refreshCSRFTokens } from './utils/csrf';

import startConfirmFeature from './features/confirm';
import startDisableFeature from './features/disable';
import startMethodFeature from './features/method';

let railsLoaded = false;

export default (): void => {
  // Cut down on the number of issues from people inadvertently including
  // rails-ujs twice by detecting and raising an error when it happens.
  if (railsLoaded) {
    throw new Error('rails-ujs has already been loaded!');
  }

  startConfirmFeature();
  startDisableFeature();
  startMethodFeature();

  document.addEventListener('DOMContentLoaded', refreshCSRFTokens);
  document.addEventListener('DOMContentLoaded', loadCSPNonce);

  railsLoaded = true;
};
