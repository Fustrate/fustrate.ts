import $ from 'jquery';
import Awesomplete from 'awesomplete';

import Component from '../component';
import { triggerEvent } from '../utilities';

class AutocompleteSuggestion extends String {
  constructor(datum, displayValue) {
    super(displayValue);

    this.datum = datum;
  }

  // eslint-disable-next-line class-methods-use-this
  highlight(input, text) {
    if (input.trim() === '') {
      return text;
    }

    return text.replace(RegExp(Awesomplete.$.regExpEscape(input.trim()), 'gi'), '<mark>$&</mark>');
  }

  item(text) {
    return Awesomplete.$.create('li', {
      innerHTML: this.highlightedHTML(text),
      role: 'option',
      'aria-selected': 'false',
    });
  }
}

class AutocompleteSource {
  /* eslint-disable no-unused-vars, class-methods-use-this */
  matches(datum) {
    return true;
  }

  filter(datum, value) {
    return true;
  }

  suggestion(datum) {
    return new AutocompleteSuggestion(datum);
  }
  /* eslint-enable no-unused-vars, class-methods-use-this */

  matchingData(searchTerm) {
    if (!this.list) {
      return [];
    }

    return this.list.filter(datum => this.filter(datum, searchTerm), this);
  }
}

class Autocomplete extends Component {
  constructor(input, options = {}) {
    super();

    this.input = input;
    this.extractOptions(options);

    this.awesomplete = new Awesomplete(this.input, {
      minChars: 0,
      maxItems: 25,
      filter: () => true,
      item: (suggestion, value, index) => suggestion.item(value, index),
      sort: false, // Items are fed in the intended order
      replace: suggestion => suggestion.label,
      suggestion: datum => this.suggestionForDatum(datum),
    });

    $(this.input)
      .data('awesomplete', this)
      .on('awesomplete-selectcomplete', this.onSelect.bind(this))
      .on('keyup', this.onKeyup.bind(this).debounce())
      .on('focus', this.onFocus.bind(this));
  }

  extractOptions(options) {
    if (options.sources) {
      this.sources = options.sources;
    } else if (options.list) {
      this.sources = [new AutocompleteSource({ list: options.list })];
    }
  }

  sourceForDatum(datum) {
    if (this.sources.length === 1) {
      return this.sources[0];
    }

    return this.sources.find(source => source.matches(datum));
  }

  suggestionForDatum(datum) {
    return this.sourceForDatum(datum).suggestion(datum);
  }

  blanked() {
    if (this.input.value && this.input.value.trim() !== '') {
      return;
    }

    this.awesomplete.close();

    triggerEvent(this.input, 'blanked.autocomplete');
  }

  onSelect(event) {
    triggerEvent(this.input, 'selected.autocomplete', { suggestion: event.text });
  }

  onFocus() {
    this.value = this.input.value ? this.input.value.trim() : '';

    const items = [];
    const searchTerm = this.value.toLowerCase();

    // If we have plain text sources, show them immediately
    this.sources
      .filter(source => source.list !== undefined)
      .forEach((source) => {
        items.concat(source.matchingData(searchTerm));
      });

    this.items = items;
    this.awesomplete.list = items;
  }

  onKeyup(e) {
    const keyCode = e.which || e.keyCode;
    const value = this.input.value ? this.input.value.trim() : '';

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

    const searchTerm = this.value.toLowerCase();

    this.sources.forEach((source) => {
      if (source.url) {
        this.performSearch(source);
      } else if (source.list) {
        this.items.concat(source.matchingData(searchTerm));

        this.awesomplete.list = this.items;
      }
    }, this);
  }

  performSearch(source) {
    $.get(source.url({ search: this.value, commit: 1, format: 'json' }))
      .done((response) => {
        response.forEach((item) => {
          this.items.push(item);
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

  resetValue(event) {
    event.stopPropagation();
    event.preventDefault();

    const value = this.awesomplete.container.parentElement.querySelector('.autocomplete-value');

    if (value) {
      value.remove();
    }

    this.input.value = '';
    this.awesomplete.container.style.display = '';

    this.input.focus();

    return false;
  }

  static addType(name, func) {
    Autocomplete.types[name] = func;
  }

  static addTypes(types) {
    Object.getOwnPropertyNames(types).forEach((name) => {
      this.addType(name, types[name]);
    }, this);
  }

  static create(input, options) {
    return new this(input, options);
  }
}

class PlainAutocompleteSuggestion extends AutocompleteSuggestion {
  constructor(datum) {
    super(datum, datum);
  }

  highlightedHTML(value) {
    return this.highlight(value, this.datum);
  }
}

class PlainAutocompleteSource extends AutocompleteSource {
  constructor(list) {
    super();

    this.list = list;
  }

  static filter(suggestion, userInput) {
    return suggestion.value.toLowerCase().indexOf(userInput) >= 0;
  }

  static suggestion(datum) { return new PlainAutocompleteSuggestion(datum); }
}

export {
  AutocompleteSuggestion,
  AutocompleteSource,
  PlainAutocompleteSuggestion,
  PlainAutocompleteSource,
};

export default Autocomplete;
