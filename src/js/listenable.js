import { remove } from './array';

// A simple polyfill for objects that aren't DOM nodes to receive events.
export default class Listenable {
  constructor() {
    this.listeners = {};
  }

  addEventListener(type, listener) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }

    this.listeners[type].push(listener);
  }

  removeEventListener(type, listener) {
    remove(this.listeners[type], listener);
  }

  dispatchEvent(event) {
    if (!(event.type && this.listeners[event.type])) {
      return this;
    }

    this.listeners[event.type].forEach((listener) => {
      listener.apply(this, event);
    });

    return this;
  }
}
