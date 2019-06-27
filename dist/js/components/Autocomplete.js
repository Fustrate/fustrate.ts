"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const awesomplete_1 = __importDefault(require("awesomplete"));
const ajax_1 = require("../ajax");
const Component_1 = __importDefault(require("../Component"));
const utilities_1 = require("../utilities");
class AutocompleteSuggestion extends String {
    constructor(datum, displayValue) {
        super(displayValue);
        this.datum = datum;
    }
    highlight(input, text) {
        if (input.trim() === '') {
            return text;
        }
        return text.replace(RegExp(awesomplete_1.default.$.regExpEscape(input.trim()), 'gi'), '<mark>$&</mark>');
    }
    item(text, index) {
        return awesomplete_1.default.$.create('li', {
            'aria-selected': 'false',
            innerHTML: this.highlightedHTML(text),
            role: 'option',
        });
    }
    highlightedHTML(value) {
        return this.highlight(value, this.toString());
    }
}
exports.AutocompleteSuggestion = AutocompleteSuggestion;
class PlainAutocompleteSuggestion extends AutocompleteSuggestion {
    constructor(datum) {
        super(datum, datum);
    }
}
exports.PlainAutocompleteSuggestion = PlainAutocompleteSuggestion;
class AutocompleteSource {
    // eslint-disable-next-line no-unused-vars
    matches(datum) {
        return true;
    }
    // eslint-disable-next-line no-unused-vars
    filter(suggestion, userInput) {
        return true;
    }
    suggestion(datum) {
        return new AutocompleteSuggestion(datum);
    }
    // eslint-disable-next-line no-unused-vars
    matchingData(searchTerm) {
        return [];
    }
}
exports.AutocompleteSource = AutocompleteSource;
class PlainAutocompleteSource extends AutocompleteSource {
    constructor(list) {
        super();
        this.list = list;
    }
    filter(suggestion, userInput) {
        return suggestion.toLowerCase().indexOf(userInput) >= 0;
    }
    suggestion(datum) {
        return new PlainAutocompleteSuggestion(datum);
    }
    matchingData(searchTerm) {
        return this.list.filter(datum => this.filter(datum, searchTerm), this).map(datum => this.suggestion(datum));
    }
}
exports.PlainAutocompleteSource = PlainAutocompleteSource;
class RemoteAutocompleteSource extends AutocompleteSource {
}
exports.RemoteAutocompleteSource = RemoteAutocompleteSource;
class Autocomplete extends Component_1.default {
    constructor(input, options) {
        super();
        this.value = '';
        this.sources = [];
        this.input = input;
        this.extractOptions(options);
        this.awesomplete = new awesomplete_1.default(this.input, {
            filter: () => true,
            item: (suggestion, value, index) => suggestion.item(value, index),
            maxItems: 25,
            minChars: 0,
            replace: suggestion => suggestion.label,
            sort: false,
            suggestion: datum => this.suggestionForDatum(datum),
        });
        // Fix for Chrome ignoring autocomplete='off', but does it break Firefox?
        this.input.setAttribute('autocomplete', 'awesomplete');
        this.input.addEventListener('awesomplete-selectcomplete', this.onSelect.bind(this));
        this.input.addEventListener('keyup', utilities_1.debounce(this.onKeyup.bind(this)));
        this.input.addEventListener('focus', this.onFocus.bind(this));
    }
    static create(input, options) {
        return new this(input, options);
    }
    extractOptions(options) {
        if (options.source) {
            this.sources = [options.source];
        }
        else if (options.sources) {
            this.sources = options.sources;
        }
        else if (options.list) {
            this.sources = [new PlainAutocompleteSource(options.list)];
        }
    }
    sourceForDatum(datum) {
        if (this.sources.length === 1) {
            return this.sources[0];
        }
        return this.sources.find(source => source.matches(datum));
    }
    suggestionForDatum(datum) {
        const source = this.sourceForDatum(datum);
        return source ? source.suggestion(datum) : undefined;
    }
    blanked() {
        if (this.input.value && this.input.value.trim() !== '') {
            return;
        }
        this.awesomplete.close();
        utilities_1.triggerEvent(this.input, 'blanked.autocomplete');
    }
    onSelect(event) {
        utilities_1.triggerEvent(this.input, 'selected.autocomplete', { suggestion: event.text });
        // It's obviously not still an error if we just selected a value from the dropdown.
        this.input.classList.remove('error');
    }
    onFocus() {
        this.value = this.input.value ? this.input.value.trim() : '';
        let suggestions = [];
        const searchTerm = this.value.toLowerCase();
        // If we have plain text sources, show them immediately
        this.sources
            .filter(source => source instanceof PlainAutocompleteSource)
            .forEach((source) => {
            suggestions = suggestions.concat(source.matchingData(searchTerm));
        }, this);
        this.awesomplete.list = suggestions.map(suggestion => String(suggestion));
    }
    onKeyup(event) {
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
        let list = [];
        this.sources.forEach((source) => {
            if (source instanceof RemoteAutocompleteSource) {
                ajax_1.get(source.url({ search: value, commit: 1, format: 'json' })).then((response) => {
                    list = list.concat(response.data);
                    this.awesomplete.list = list.map(item => String(item));
                });
            }
            else if (source instanceof PlainAutocompleteSource) {
                const searchTerm = value.toLowerCase();
                list = list.concat(source.matchingData(searchTerm));
            }
        }, this);
        this.awesomplete.list = list.map(item => String(item));
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
}
exports.Autocomplete = Autocomplete;
class PlainAutocomplete extends Autocomplete {
    static create(input, options) {
        return super.create(input, options);
    }
    onSelect(event) {
        super.onSelect(event);
        this.input.value = event.text.toString();
    }
}
exports.PlainAutocomplete = PlainAutocomplete;
