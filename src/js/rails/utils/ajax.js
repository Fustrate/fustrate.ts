import { cspNonce } from './csp';
import { CSRFProtection } from './csrf';

const AcceptHeaders = {
  '*': '*/*',
  text: 'text/plain',
  html: 'text/html',
  xml: 'application/xml, text/xml',
  json: 'application/json, text/javascript',
  script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript',
};

const prepareOptions = (options) => {
  options.url = options.url || window.location.href;
  options.type = options.type.toUpperCase();

  // append data to url if it's a GET request
  if (options.type === 'GET' && options.data) {
    if (options.url.indexOf('?') < 0) {
      options.url += `?${options.data}`;
    } else {
      options.url += `&${options.data}`;
    }
  }

  // Use "*" as default dataType
  if (!AcceptHeaders[options.dataType]) {
    options.dataType = '*';
  }

  options.accept = AcceptHeaders[options.dataType];

  if (options.dataType !== '*') {
    options.accept += ', */*; q=0.01';
  }

  return options;
};

const createXHR = (options, done) => {
  const xhr = new XMLHttpRequest();

  // Open and setup xhr
  xhr.open(options.type, options.url, true);
  xhr.setRequestHeader('Accept', options.accept);

  // Set Content-Type only when sending a string
  // Sending FormData will automatically set Content-Type to multipart/form-data
  if (typeof options.data === 'string') {
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  }

  if (!options.crossDomain) {
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  }

  // Add X-CSRF-Token
  CSRFProtection(xhr);

  xhr.withCredentials = !!options.withCredentials;
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      done(xhr);
    }
  };

  return xhr;
};

const processResponse = (response, type) => {
  if (typeof response === 'string' && typeof type === 'string') {
    if (type.match(/\bjson\b/)) {
      try {
        response = JSON.parse(response);
      } catch (error) {
        // Do nothing
      }
    } else if (type.match(/\b(?:java|ecma)script\b/)) {
      const script = document.createElement('script');

      script.setAttribute('nonce', cspNonce());
      script.text = response;

      document.head.appendChild(script).parentNode.removeChild(script);
    } else if (type.match(/\bxml\b/)) {
      const parser = new DOMParser();

      type = type.replace(/;.+/, ''); // remove something like ';charset=utf-8'

      try {
        response = parser.parseFromString(response, type);
      } catch (error) {
        // Do nothing
      }
    }
  }

  return response;
};

const ajax = (options) => {
  options = prepareOptions(options);

  const xhr = createXHR(options, () => {
    const response = processResponse(xhr.response || xhr.responseText, xhr.getResponseHeader('Content-Type'));

    if (xhr.status) { // 100 == 2
      if (options.success) {
        options.success(response, xhr.statusText, xhr);
      }
    } else if (options.error) {
      options.error(response, xhr.statusText, xhr);
    }

    if (options.complete) {
      options.complete(xhr, xhr.statusText);
    }
  });

  if (options.beforeSend && !options.beforeSend(xhr, options)) {
    return false;
  }

  if (xhr.readyState === XMLHttpRequest.OPENED) {
    xhr.send(options.data);
  }

  return true;
};

// Default way to get an element's href. May be overridden at Rails.href.
const href = element => element.href;

// Determines if the request is a cross domain request.
const isCrossDomain = (url) => {
  const originAnchor = document.createElement('a');
  originAnchor.href = window.location.href;

  const urlAnchor = document.createElement('a');

  try {
    urlAnchor.href = url;

    // If URL protocol is false or is a string containing a single colon
    // *and* host are false, assume it is not a cross-domain request
    // (should only be the case for IE7 and IE compatibility mode).
    // Otherwise, evaluate protocol and host of the URL against the origin
    // protocol and host.
    return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host)
      || (`${originAnchor.protocol}//${originAnchor.host}` === `${urlAnchor.protocol}//${urlAnchor.host}`));
  } catch (e) {
    // If there is an error parsing the URL, assume it is crossDomain.
    return true;
  }
};

export { ajax, href, isCrossDomain };
