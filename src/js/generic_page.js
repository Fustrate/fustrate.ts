class GenericPage {
  constructor(root) {
    this.root = root || document.body;
  }

  initialize() {
    this.reloadUIElements();

    this.callAllMethodsBeginningWith('initialize');

    this.addEventListeners();
  }

  addEventListeners() {
    this.callAllMethodsBeginningWith('addEventListeners');
  }

  reloadUIElements() {
    this.fields = {};
    this.buttons = {};

    [...this.root.querySelectorAll('[data-field]')]
      .filter(element => !element.matches('.modal [data-field]'))
      .forEach((element) => {
        this.fields[element.dataset.field] = element;
      });

    [...this.root.querySelectorAll('[data-button]')]
      .filter(element => !element.matches('.modal [data-button]'))
      .forEach((element) => {
        this.buttons[element.dataset.button] = element;
      });
  }

  setHeader(text) {
    this.root.querySelector('.header > span').textContent = text;
  }

  refresh() {
    this.callAllMethodsBeginningWith('refresh');
  }

  callAllMethodsBeginningWith(string) {
    Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((name) => {
      if (name !== string && name.indexOf(string) === 0) {
        this[name].apply(this);
      }
    });
  }
}

export default GenericPage;
