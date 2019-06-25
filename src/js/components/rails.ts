// @rails/ujs isn't working for me right now. Check back later.
export default class Rails {
  public static get csrfToken(): string | null {
    const meta: HTMLMetaElement = document.querySelector('meta[name=csrf-token]');

    return meta ? meta.content : null;
  }

  // URL param that must contain the CSRF token
  public static get csrfParam(): string | null {
    const meta: HTMLMetaElement = document.querySelector('meta[name=csrf-param]');

    return meta ? meta.content : null;
  }

  // Make sure that every Ajax request sends the CSRF token
  public static CSRFProtection(xhr: XMLHttpRequest) {
    const token = Rails.csrfToken;

    if (token != null) {
      xhr.setRequestHeader('X-CSRF-Token', token);
    }
  }

  // Make sure that all forms have actual up-to-date tokens (cached forms contain old ones)
  public static refreshCSRFTokens() {
    const token = Rails.csrfToken;
    const param = Rails.csrfParam;

    if (token != null && param != null) {
      document.querySelectorAll(`form input[name="${param}"]`).forEach((input) => {
        input.value = token;
      });
    }
  }
}
