export default class Page {
  public static initializeFns: (() => void)[] = [];

  public static addEventListenersFns: (() => void)[] = [];

  public initialize(): void {
    (this.constructor as typeof Page).initializeFns.forEach((fn) => { fn.apply(this); });
  }

  public addEventListeners(): void {
    (this.constructor as typeof Page).addEventListenersFns.forEach((fn) => { fn.apply(this); });
  }
}
