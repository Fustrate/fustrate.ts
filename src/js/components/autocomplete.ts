import Awesomplete from 'awesomplete';

import { get } from '../ajax';
import Component from '../component';
import { debounce, triggerEvent } from '../utilities';

interface AutocompleteSelectEvent extends Event {
  text: string;
}

export class AutocompleteSuggestion extends String {
  public datum: any;

  constructor(datum: any, displayValue?: string) {
    super(displayValue);

    this.datum = datum;
  }

  public highlight(input: string, text: string) {
    if (input.trim() === '') {
      return text;
    }

    return text.replace(RegExp(Awesomplete.$.regExpEscape(input.trim()), 'gi'), '<mark>$&</mark>');
  }

  public item(text: string, index: number) {
    return Awesomplete.$.create('li', {
      'aria-selected': 'false',
      innerHTML: this.highlightedHTML(text),
      role: 'option',
    });
  }

  public highlightedHTML(value: string) {
    return this.highlight(value, this.toString());
  }
}

export class PlainAutocompleteSuggestion extends AutocompleteSuggestion {
  constructor(datum: string) {
    super(datum, datum);
  }
}

export class AutocompleteSource {
  // eslint-disable-next-line no-unused-vars
  public matches(datum: string) {
    return true;
  }

  // eslint-disable-next-line no-unused-vars
  public filter(suggestion: string, userInput: string): boolean {
    return true;
  }

  public suggestion(datum: any): AutocompleteSuggestion {
    return new AutocompleteSuggestion(datum);
  }

  // eslint-disable-next-line no-unused-vars
  public matchingData(searchTerm: string): AutocompleteSuggestion[] {
    return [];
  }
}

export class PlainAutocompleteSource extends AutocompleteSource {
  public list: string[];

  constructor(list: string[]) {
    super();

    this.list = list;
  }

  public filter(suggestion: string, userInput: string): boolean {
    return suggestion.toLowerCase().indexOf(userInput) >= 0;
  }

  public suggestion(datum: string): PlainAutocompleteSuggestion {
    return new PlainAutocompleteSuggestion(datum);
  }

  public matchingData(searchTerm: string): PlainAutocompleteSuggestion[] {
    return this.list.filter(datum => this.filter(datum, searchTerm), this).map(datum => this.suggestion(datum));
  }
}

export class RemoteAutocompleteSource extends AutocompleteSource {
  public url: (...args: any[]) => string;
}

interface AutocompleteOptions {
  source?: AutocompleteSource;
  sources?: AutocompleteSource[];
  list?: string[];
}

export class Autocomplete extends Component {
  public awesomplete: Awesomplete;

  public input: HTMLInputElement;

  public value: string = '';

  public sources: AutocompleteSource[] = [];

  public static create(input: HTMLInputElement, options: AutocompleteOptions) {
    return new this(input, options);
  }

  constructor(input: HTMLInputElement, options: AutocompleteOptions) {
    super();

    this.input = input;
    this.extractOptions(options);

    this.awesomplete = new Awesomplete(this.input, {
      filter: () => true,
      item: (suggestion: AutocompleteSuggestion, value: string, index: number) => suggestion.item(value, index),
      maxItems: 25,
      minChars: 0,
      replace: suggestion => suggestion.label,
      sort: false, // Items are fed in the intended order
      suggestion: datum => this.suggestionForDatum(datum),
    });

    // Fix for Chrome ignoring autocomplete='off', but does it break Firefox?
    this.input.setAttribute('autocomplete', 'awesomplete');

    this.input.addEventListener('awesomplete-selectcomplete', this.onSelect.bind(this));
    this.input.addEventListener('keyup', debounce(this.onKeyup.bind(this)));
    this.input.addEventListener('focus', this.onFocus.bind(this));
  }

  public extractOptions(options: AutocompleteOptions) {
    if (options.source) {
      this.sources = [options.source];
    } else if (options.sources) {
      this.sources = options.sources;
    } else if (options.list) {
      this.sources = [new PlainAutocompleteSource(options.list)];
    }
  }

  public sourceForDatum(datum: string): AutocompleteSource | undefined {
    if (this.sources.length === 1) {
      return this.sources[0];
    }

    return this.sources.find(source => source.matches(datum));
  }

  public suggestionForDatum(datum: string): AutocompleteSuggestion | undefined {
    const source = this.sourceForDatum(datum);

    return source ? source.suggestion(datum) : undefined;
  }

  public blanked() {
    if (this.input.value && this.input.value.trim() !== '') {
      return;
    }

    this.awesomplete.close();

    triggerEvent(this.input, 'blanked.autocomplete');
  }

  public onSelect(event: AutocompleteSelectEvent) {
    triggerEvent(this.input, 'selected.autocomplete', { suggestion: event.text });

    // It's obviously not still an error if we just selected a value from the dropdown.
    this.input.classList.remove('error');
  }

  public onFocus() {
    this.value = this.input.value ? this.input.value.trim() : '';

    let suggestions: AutocompleteSuggestion[] = [];
    const searchTerm = this.value.toLowerCase();

    // If we have plain text sources, show them immediately
    this.sources
      .filter(source => source instanceof PlainAutocompleteSource)
      .forEach((source) => {
        suggestions = suggestions.concat(source.matchingData(searchTerm));
      }, this);

    this.awesomplete.list = suggestions.map(suggestion => String(suggestion));
  }

  public onKeyup(event: KeyboardEvent) {
    const keyCode = event.which || event.keyCode;
    const value = this.input.value ? this.input.value.trim() : '';

    if (value === '' && this.value !== '') {
      this.blanked();

      return;
    }

    // Don't perform the same search twice in a row, and ignore:
    //   Tab, Enter, Esc, Left, Up, Right, Down
    if (value === this.value || value.length < 3 || [9, 13, 27, 37, 38, 39, 40].includes(keyCode)) {
      return;
    }

    this.value = value;
    let list: (string | AutocompleteSuggestion)[] = [];

    this.sources.forEach((source) => {
      if (source instanceof RemoteAutocompleteSource) {
        get(source.url({ search: value, commit: 1, format: 'json' })).then((response) => {
          list = list.concat(response.data);

          this.awesomplete.list = list.map(item => String(item));
        });
      } else if (source instanceof PlainAutocompleteSource) {
        const searchTerm = value.toLowerCase();

        list = list.concat(source.matchingData(searchTerm));
      }
    }, this);

    this.awesomplete.list = list.map(item => String(item));
  }

  public highlight(text?: string) {
    if (!text) {
      return '';
    }

    return text.replace(RegExp(`(${this.value.split(/\s+/).join('|')})`, 'gi'), '<mark>$&</mark>');
  }

  public replace(suggestion: string) {
    this.awesomplete.replace(suggestion);
  }
}

export class PlainAutocomplete extends Autocomplete {
  public static create(input: HTMLInputElement, options: AutocompleteOptions) {
    return super.create(input, options);
  }

  public onSelect(event: AutocompleteSelectEvent) {
    super.onSelect(event);

    this.input.value = event.text.toString();
  }
}
