let nonce: string | null;

export const loadCSPNonce = (): string | null => {
  const meta: HTMLMetaElement | null = document.querySelector('meta[name=csp-nonce]');

  nonce = meta && meta.content;

  return nonce;
};

// Returns the Content-Security-Policy nonce for inline scripts.
export const cspNonce = (): string | null => nonce || loadCSPNonce();
