import $ from 'jquery';
import Awesomplete from 'awesomplete';

import Component from '../component';

class Suggestion extends String {
  constructor(datum, displayValue) {
    super(displayValue);

    this.datum = datum;
  }

  item(value, index) {
    return Awesomplete.$.create('li', {
      innerHTML: this.highlightedHTML(value),
      role: 'option',
      'aria-selected': 'false',
      id: `awesomplete_list_${this.count}_item_${index}`,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  highlight(input, text) {
    if (input.trim() === '') {
      return text;
    }

    return text.replace(RegExp(Awesomplete.$.regExpEscape(input.trim()), 'gi'), '<mark>$&</mark>');
  }
}

class Autocomplete extends Component {
  constructor(input, types) {
    super();

    this.input = input;

    let defaultTypes = types;

    if (Array.isArray(types)) {
      defaultTypes = {
        plain: {
          list: types.map(value => ({ value })),
        },
      };
    }

    this.sources = Object.keys(defaultTypes).map((key) => {
      const options = defaultTypes[key];
      return Object.deepExtend({}, this.constructor.types[key], options);
    });

    if (this.sources.length === undefined) {
      this.sources = [this.sources];
    }

    const existing = $(this.input).data('awesomplete');

    if (existing) {
      existing.sources = this.sources;

      return;
    }

    this.awesomplete = new Awesomplete(this.input, {
      minChars: 0,
      maxItems: 25,
      data: data => data,
      filter: () => true,
      item: (suggestion, value, index) => suggestion.item(value, index),
      sort: false, // Items are fed in the intended order
      replace: suggestion => suggestion.label,
      suggestion: Suggestion,
    });

    $(this.input)
      .data('awesomplete', this)
      .on('keyup', this.onKeyup.bind(this).debounce())
      .on('focus', this.onFocus.bind(this));
  }

  blanked() {
    if (this.input.value && this.input.value.trim() !== '') {
      return;
    }

    this.awesomplete.close();

    $(this.input).trigger('blanked.autocomplete');
  }

  onFocus() {
    this.items = [];
    this.value = this.input.value && this.input.value.trim();

    this.sources
      .filter(source => source.list !== undefined)
      .forEach((source) => {
        source.list.forEach((datum) => {
          if (source.filter(datum, this.value)) {
            this.items.push(source.suggestion(datum));
          }
        }, this);
      }, this);

    this.awesomplete.list = this.items;
  }

  onKeyup(e) {
    const keyCode = e.which || e.keyCode;
    const value = this.input.value && this.input.value.trim();

    if (value === '' && this.value !== '') {
      this.blanked();

      return;
    }

    // Ignore: Tab, Enter, Esc, Left, Up, Right, Down
    if ([9, 13, 27, 37, 38, 39, 40].includes(keyCode)) {
      return;
    }

    // Don't perform the same search twice in a row
    if (value === this.value || value.length < 3) {
      return;
    }

    this.value = value;
    this.items = [];

    this.sources.forEach((source) => {
      if (source.url != null) {
        this.performSearch(source);
      } else if (source.list != null) {
        source.list.forEach((datum) => {
          if (source.filter(datum, this.value)) {
            this.items.push(source.suggestion(datum));
          }
        }, this);

        this.awesomplete.list = this.items;
      }
    }, this);
  }

  performSearch(source) {
    $.get(source.url({ search: this.value, commit: 1, format: 'json' }))
      .done((response) => {
        response.forEach((item) => {
          this.items.push(source.suggestion(item));
        }, this);

        this.awesomplete.list = this.items;
      });
  }

  highlight(text) {
    if (!text) {
      return '';
    }

    return text.replace(RegExp(`(${this.value.split(/\s+/).join('|')})`, 'gi'), '<mark>$&</mark>');
  }

  replace(suggestion) {
    this.awesomplete.replace(suggestion);
  }

  static addType(name, func) {
    Autocomplete.types[name] = func;
  }

  static addTypes(types) {
    Object.getOwnPropertyNames(types).forEach((name) => {
      this.addType(name, types[name]);
    }, this);
  }

  static create(input, types) {
    return new this(input, types);
  }
}

Autocomplete.types = {
  plain: {
    displayKey: 'value',
    item: object => `<li>${this.highlight(object.value)}</li>`,
    filter: (object, userInput) => {
      const search = userInput.trim().toLowerCase();

      return object.value.toLowerCase().indexOf(search) >= 0;
    },
  },
};

export { Suggestion };

export default Autocomplete;
