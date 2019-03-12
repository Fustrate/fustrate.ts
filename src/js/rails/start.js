import { refreshCSRFTokens } from './utils/csrf';
import { loadCSPNonce } from './utils/csp';

import startConfirmFeature from './features/confirm';
import startDisableFeature from './features/disable';
import startMethodFeature from './features/method';
import startRemoteFeature from './features/remote';

const start = () => {
  // Cut down on the number of issues from people inadvertently including
  // rails-ujs twice by detecting and raising an error when it happens.
  if (window.rails_loaded) {
    throw new Error('rails-ujs has already been loaded!');
  }

  startConfirmFeature();
  startDisableFeature();
  startMethodFeature();
  startRemoteFeature();

  document.addEventListener('DOMContentLoaded', refreshCSRFTokens);
  document.addEventListener('DOMContentLoaded', loadCSPNonce);

  window.rails_loaded = true;
};

export default start;
