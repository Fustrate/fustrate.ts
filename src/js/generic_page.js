class GenericPage {
  constructor(root) {
    this.root = root;
  }

  initialize() {
    this.reloadUIElements();
    this.addEventListeners();
  }

  addEventListeners() {
    Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((name) => {
      // Edge returns true for /one.+two/.test('onetwo'), 2017-10-21
      if (/^add..*EventListeners$/.test(name)) {
        this[name].apply(this);
      }
    });
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

  // Calls all methods matching /refresh.+/
  refresh() {
    Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((name) => {
      if (name !== 'refresh' && name.indexOf('refresh') === 0) {
        this[name].apply(this);
      }
    });
  }
}

export default GenericPage;
