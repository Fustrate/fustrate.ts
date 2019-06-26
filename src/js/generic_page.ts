import Page from './page';

export default class GenericPage extends Page {
  public fields: { [s: string]: HTMLElement } = {};

  public buttons: { [s: string]: HTMLElement } = {};

  private allMethodNamesList?: string[];

  public initialize() {
    this.reloadUIElements();

    this.callAllMethodsBeginningWith('initialize');

    this.addEventListeners();
  }

  public addEventListeners() {
    this.callAllMethodsBeginningWith('addEventListeners');
  }

  public reloadUIElements() {
    this.fields = {};
    this.buttons = {};

    Array.from(document.querySelectorAll<HTMLElement>('[data-field]'))
      .filter(element => !element.matches('.modal [data-field]'))
      .forEach((element) => {
        this.fields[element.dataset.field as string] = element;
      });

    Array.from(document.querySelectorAll<HTMLElement>('[data-button]'))
      .filter(element => !element.matches('.modal [data-button]'))
      .forEach((element) => {
        this.buttons[element.dataset.button as string] = element;
      });
  }

  public setHeader(text: string): void {
    document.querySelector<HTMLSpanElement>('.header > span').textContent = text;
  }

  public refresh(): void {
    this.callAllMethodsBeginningWith('refresh');
  }

  public callAllMethodsBeginningWith(prefix: string): void {
    if (!this.allMethodNamesList) {
      this.allMethodNamesList = this.getAllMethodNames();
    }

    this.allMethodNamesList.forEach((name) => {
      if (name !== prefix && name.indexOf(prefix) === 0) {
        (this[name] as () => void).apply(this);
      }
    });
  }

  private getAllMethodNames(): string[] {
    let props: string[] = [];
    let klass = this;

    while (klass) {
      props = props.concat(Object.getOwnPropertyNames(klass));

      klass = Object.getPrototypeOf(klass);
    }

    return props.sort().filter(name => typeof this[name] === 'function');
  }
}
