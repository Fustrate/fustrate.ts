import { remove } from "./array";

// A simple polyfill for objects that aren't DOM nodes to receive events.
export default class Listenable {
  constructor() {
    this.listeners = {};
  }

  public addEventListener(type, listener): void {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }

    this.listeners[type].push(listener);
  }

  public removeEventListener(type, listener): void {
    remove(this.listeners[type], listener);
  }

  public dispatchEvent(event): boolean {
    if (!(event.type && this.listeners[event.type])) {
      return true;
    }

    this.listeners[event.type].forEach((listener) => {
      listener.apply(this, event);
    });

    return true;
  }
}
