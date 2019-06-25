export default class GenericPage {
  public root: HTMLElement;
  public fields: { [s: string]: HTMLElement };
  public buttons: { [s: string]: HTMLElement };

  private allMethodNamesList?: string[];

  constructor(root) {
    this.root = root || document.body;
  }

  public initialize() {
    this.reloadUIElements();

    this.callAllMethodsBeginningWith("initialize");

    this.addEventListeners();
  }

  public addEventListeners() {
    this.callAllMethodsBeginningWith("addEventListeners");
  }

  public reloadUIElements() {
    this.fields = {};
    this.buttons = {};

    Array.from(this.root.querySelectorAll("[data-field]"))
      .filter((element) => !element.matches(".modal [data-field]"))
      .forEach((element) => {
        this.fields[element.dataset.field] = element;
      });

    Array.from(this.root.querySelectorAll("[data-button]"))
      .filter((element) => !element.matches(".modal [data-button]"))
      .forEach((element) => {
        this.buttons[element.dataset.button] = element;
      });
  }

  public setHeader(text: string): void {
    this.root.querySelector(".header > span").textContent = text;
  }

  public refresh(): void {
    this.callAllMethodsBeginningWith("refresh");
  }

  public callAllMethodsBeginningWith(prefix: string): void {
    if (!this.allMethodNamesList) {
      this.allMethodNamesList = this.getAllMethodNames();
    }

    this.allMethodNamesList.forEach((name) => {
      if (name !== prefix && name.indexOf(prefix) === 0) {
        this[name].apply(this);
      }
    });
  }

  private getAllMethodNames(): string[] {
    let props = string[];
    let klass = this;

    while (klass) {
      props = props.concat(Object.getOwnPropertyNames(klass));

      klass = Object.getPrototypeOf(klass);
    }

    return props.sort().filter((name) => typeof this[name] === "function");
  }
}
