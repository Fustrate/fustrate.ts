/* eslint-disable @typescript-eslint/no-unused-vars */
import Awesomplete from 'awesomplete';

import { fire } from '@rails/ujs';
import debounce from 'lodash/debounce';
import includes from 'lodash/includes';

import ajax from '../ajax';
import Component from '../Component';

interface AutocompleteSelectEvent extends Event {
  text?: string;
}

export class AutocompleteSuggestion extends String {
  public datum: any;

  constructor(datum: any, displayValue?: string) {
    super(displayValue);

    this.datum = datum;
  }

  public highlight(input: string, text: string): string {
    if (input.trim() === '') {
      return text;
    }

    return text.replace(RegExp(Awesomplete.$.regExpEscape(input.trim()), 'gi'), '<mark>$&</mark>');
  }

  public item(text: string): HTMLElement {
    return Awesomplete.$.create('li', {
      'aria-selected': 'false',
      innerHTML: this.highlightedHTML(text),
      role: 'option',
    });
  }

  public highlightedHTML(value: string): string {
    return this.highlight(value, this.toString());
  }
}

export class PlainAutocompleteSuggestion extends AutocompleteSuggestion {
  constructor(datum: string) {
    super(datum, datum);
  }
}

export class AutocompleteSource {
  public matches(datum: string): boolean {
    return true;
  }

  public filter(suggestion: string, userInput: string): boolean {
    return true;
  }

  public suggestion(datum: any): AutocompleteSuggestion {
    return new AutocompleteSuggestion(datum);
  }

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
    return includes(suggestion, userInput);
  }

  public suggestion(datum: string): PlainAutocompleteSuggestion {
    return new PlainAutocompleteSuggestion(datum);
  }

  public matchingData(searchTerm: string): PlainAutocompleteSuggestion[] {
    return this.list.filter((datum) => this.filter(datum, searchTerm), this).map((datum) => this.suggestion(datum));
  }
}

export class RemoteAutocompleteSource extends AutocompleteSource {
  public url(...args: any[]): string {
    throw new Error('Invalid url constructor.');
  }
}

interface AutocompleteOptions {
  source?: AutocompleteSource;
  sources?: AutocompleteSource[];
  list?: string[];
}

export class Autocomplete extends Component {
  public awesomplete: Awesomplete;

  public input: HTMLInputElement;

  public value = '';

  public sources: AutocompleteSource[] = [];

  public static create<T extends typeof Autocomplete>(
    input: HTMLInputElement,
    options: AutocompleteOptions,
  ): InstanceType<T> {
    return new this(input, options) as InstanceType<T>;
  }

  constructor(input: HTMLInputElement, options: AutocompleteOptions) {
    super();

    this.input = input;
    this.extractOptions(options);

    this.awesomplete = new Awesomplete(this.input, {
      filter: () => true,
      item: (suggestion: AutocompleteSuggestion, value: string) => suggestion.item(value),
      maxItems: 25,
      minChars: 0,
      sort: false, // Items are fed in the intended order
      suggestion: (datum: string) => this.suggestionForDatum(datum),
    });

    // Fix for Chrome ignoring autocomplete='off', but does it break Firefox?
    this.input.setAttribute('autocomplete', 'awesomplete');

    this.input.addEventListener('awesomplete-selectcomplete', this.onSelect.bind(this));
    this.input.addEventListener('keyup', debounce(this.onKeyup.bind(this), 250));
    this.input.addEventListener('focus', this.onFocus.bind(this));
  }

  public extractOptions(options: AutocompleteOptions): void {
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

    return this.sources.find((source) => source.matches(datum));
  }

  public suggestionForDatum(datum: string): AutocompleteSuggestion | undefined {
    const source = this.sourceForDatum(datum);

    return source ? source.suggestion(datum) : undefined;
  }

  public blanked(): void {
    if (this.input.value && this.input.value.trim() !== '') {
      return;
    }

    this.awesomplete.close();

    fire(this.input, 'blanked.autocomplete');
  }

  public onSelect(event: AutocompleteSelectEvent): void {
    fire(this.input, 'selected.autocomplete', { suggestion: event.text });

    // It's obviously not still an error if we just selected a value from the dropdown.
    this.input.classList.remove('error');
  }

  public onFocus(): void {
    this.value = this.input.value ? this.input.value.trim() : '';

    let suggestions: AutocompleteSuggestion[] = [];
    const searchTerm = this.value.toLowerCase();

    // If we have plain text sources, show them immediately
    this.sources
      .filter((source) => source instanceof PlainAutocompleteSource)
      .forEach((source) => {
        suggestions = suggestions.concat(source.matchingData(searchTerm));
      }, this);

    this.awesomplete.list = suggestions.map((suggestion) => String(suggestion));
  }

  public onKeyup(event: KeyboardEvent): void {
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
        ajax.get(source.url({ search: value, commit: 1, format: 'json' })).then((response) => {
          list = list.concat(response.data);

          this.awesomplete.list = list.map((item) => String(item));
        });
      } else if (source instanceof PlainAutocompleteSource) {
        const searchTerm = value.toLowerCase();

        list = list.concat(source.matchingData(searchTerm));
      }
    }, this);

    this.awesomplete.list = list.map((item) => String(item));
  }

  public highlight(text?: string): string {
    if (!text) {
      return '';
    }

    return text.replace(RegExp(`(${this.value.split(/\s+/).join('|')})`, 'gi'), '<mark>$&</mark>');
  }

  public replace(suggestion: string): void {
    if (this.awesomplete.input instanceof HTMLInputElement) {
      this.awesomplete.input.value = suggestion.toString();
    }
  }
}

export class PlainAutocomplete extends Autocomplete {
  public static create<T extends typeof PlainAutocomplete>(
    input: HTMLInputElement,
    options: AutocompleteOptions,
  ): InstanceType<T> {
    return super.create(input, options);
  }

  public onSelect(event: AutocompleteSelectEvent): void {
    super.onSelect(event);

    this.input.value = (event.text || '').toString();
  }
}
