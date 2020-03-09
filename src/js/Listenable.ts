import { pull } from 'lodash';

// A simple polyfill for objects that aren't DOM nodes to receive events.
export default abstract class Listenable {
  private listeners: { [s: string]: Array<(...args: any[]) => void> };

  constructor() {
    this.listeners = {};
  }

  public addEventListener(type: string, listener: (...args: any[]) => void): void {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }

    this.listeners[type].push(listener);
  }

  public removeEventListener(type: string, listener: (...args: any[]) => void): void {
    pull(this.listeners[type], listener);
  }

  public dispatchEvent(event: Event): boolean {
    if (!(event.type && this.listeners[event.type])) {
      return true;
    }

    this.listeners[event.type].forEach((listener) => {
      listener.apply(this, [event]);
    });

    return true;
  }
}
