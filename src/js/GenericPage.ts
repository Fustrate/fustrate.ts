import startsWith from 'lodash/startsWith';

import Page from './Page';

export default class GenericPage extends Page {
  public fields: { [s: string]: HTMLElement } = {};

  public buttons: { [s: string]: HTMLElement } = {};

  public initialize(): void {
    this.reloadUIElements();

    super.initialize();

    this.addEventListeners();
  }

  public addEventListeners(): void {
    super.addEventListeners();
  }

  public reloadUIElements(): void {
    this.fields = {};
    this.buttons = {};

    Array.from(document.querySelectorAll<HTMLElement>('[data-field]'))
      .filter((element) => !element.matches('.modal [data-field]'))
      .forEach((element) => {
        this.fields[element.dataset.field as string] = element;
      });

    Array.from(document.querySelectorAll<HTMLElement>('[data-button]'))
      .filter((element) => !element.matches('.modal [data-button]'))
      .forEach((element) => {
        this.buttons[element.dataset.button as string] = element;
      });
  }

  public setHeader(text: string): void {
    const headerSpan = document.querySelector<HTMLSpanElement>('.header > span');

    if (headerSpan) {
      headerSpan.textContent = text;
    }
  }

  public refresh(): void {
    this.callAllMethodsBeginningWith('refresh');
  }

  public callAllMethodsBeginningWith(prefix: string): void {
    Object.getOwnPropertyNames(this).forEach((name) => {
      if (name !== prefix && startsWith(prefix, name)) {
        const descriptor = Object.getOwnPropertyDescriptor(this, name);

        if (descriptor && typeof descriptor.value === 'function') {
          (descriptor.value as () => void).call(this);
        }
      }
    });
  }
}
