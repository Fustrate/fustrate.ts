const triggerEvent = (element, name, data) => {
  let event;

  if (window.CustomEvent) {
    event = new CustomEvent(name, { detail: data });
  } else {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(name, true, true, data);
  }

  element.dispatchEvent(event);
};

export {
  triggerEvent,
};
