let nonce = null;

export const loadCSPNonce = () => {
  const meta = document.querySelector('meta[name=csp-nonce]');

  nonce = meta && meta.content;

  return nonce;
};

// Returns the Content-Security-Policy nonce for inline scripts.
export const cspNonce = () => nonce || loadCSPNonce();
