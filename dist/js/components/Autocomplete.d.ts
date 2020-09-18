import Awesomplete from 'awesomplete';
import Component from '../Component';
interface AutocompleteSelectEvent extends Event {
    text?: string;
}
export declare class AutocompleteSuggestion extends String {
    datum: any;
    constructor(datum: any, displayValue?: string);
    highlight(input: string, text: string): string;
    item(text: string): HTMLElement;
    highlightedHTML(value: string): string;
}
export declare class PlainAutocompleteSuggestion extends AutocompleteSuggestion {
    constructor(datum: string);
}
export declare class AutocompleteSource {
    matches(datum: string): boolean;
    filter(suggestion: string, userInput: string): boolean;
    suggestion(datum: any): AutocompleteSuggestion;
    matchingData(searchTerm: string): AutocompleteSuggestion[];
}
export declare class PlainAutocompleteSource extends AutocompleteSource {
    list: string[];
    constructor(list: string[]);
    filter(suggestion: string, userInput: string): boolean;
    suggestion(datum: string): PlainAutocompleteSuggestion;
    matchingData(searchTerm: string): PlainAutocompleteSuggestion[];
}
export declare class RemoteAutocompleteSource extends AutocompleteSource {
    url(...args: any[]): string;
}
interface AutocompleteOptions {
    source?: AutocompleteSource;
    sources?: AutocompleteSource[];
    list?: string[];
}
export declare class Autocomplete extends Component {
    awesomplete: Awesomplete;
    input: HTMLInputElement;
    value: string;
    sources: AutocompleteSource[];
    static create<T extends typeof Autocomplete>(input: HTMLInputElement, options: AutocompleteOptions): InstanceType<T>;
    constructor(input: HTMLInputElement, options: AutocompleteOptions);
    extractOptions(options: AutocompleteOptions): void;
    sourceForDatum(datum: string): AutocompleteSource | undefined;
    suggestionForDatum(datum: string): AutocompleteSuggestion | undefined;
    blanked(): void;
    onSelect(event: AutocompleteSelectEvent): void;
    onFocus(): void;
    onKeyup(event: KeyboardEvent): void;
    highlight(text?: string): string;
    replace(suggestion: string): void;
}
export declare class PlainAutocomplete extends Autocomplete {
    static create<T extends typeof PlainAutocomplete>(input: HTMLInputElement, options: AutocompleteOptions): InstanceType<T>;
    onSelect(event: AutocompleteSelectEvent): void;
}
export {};
