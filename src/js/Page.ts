import Mixin from './Mixin';

export default class Page {
  private static addEventListenersFns: (() => void)[] = [];
  private static initializeFns: (() => void)[] = [];

  // constructor(...args: any[]) {}

  public initialize(): void {
    (this.constructor as typeof Page).initializeFns.forEach((fn) => { fn.call(this); });
  }

  public addEventListeners(): void {
    (this.constructor as typeof Page).addEventListenersFns.forEach((fn) => { fn.call(this); });
  }

  public static addMixins(...mixins: (typeof Mixin)[]): void {
    mixins.forEach((mixin) => {
      // Don't do anything with methods that are already implemented on the Page subclass.
      Object.getOwnPropertyNames(mixin.prototype)
        .filter((name) => !Object.getOwnPropertyDescriptor(this.prototype, name))
        .forEach((name) => {
          const descriptor = Object.getOwnPropertyDescriptor(mixin.prototype, name);

          if (!descriptor) {
            return;
          }

          if (name === 'initialize') {
            this.initializeFns.push(descriptor.value as () => void);
          } else if (name === 'addEventListeners') {
            this.addEventListenersFns.push(descriptor.value as () => void);
          } else {
            Object.defineProperty(this.prototype, name, descriptor);
          }
        });
    });
  }
}
