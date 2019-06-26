import { $ } from './dom';

// Up-to-date Cross-Site Request Forgery token
export const csrfToken = (): string | undefined => {
  const meta: HTMLMetaElement = document.querySelector('meta[name=csrf-token]');

  return meta ? meta.content : undefined;
};

// URL param that must contain the CSRF token
export const csrfParam = (): string | undefined => {
  const meta: HTMLMetaElement = document.querySelector('meta[name=csrf-param]');

  return meta ? meta.content : undefined;
};

// Make sure that every Ajax request sends the CSRF token
export const CSRFProtection = (xhr: XMLHttpRequest) => {
  const token: string = csrfToken();

  if (token) {
    xhr.setRequestHeader('X-CSRF-Token', token);
  }
};

// Make sure that all forms have actual up-to-date tokens (cached forms contain old ones)
export const refreshCSRFTokens = (): void => {
  const token = csrfToken();
  const param = csrfParam();

  if (token && param) {
    $(`form input[name="${param}"]`).forEach((input) => {
      (input as HTMLInputElement).value = token;
    });
  }
};
