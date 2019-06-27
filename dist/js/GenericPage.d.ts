import Page from './Page';
export default class GenericPage extends Page {
    fields: {
        [s: string]: HTMLElement;
    };
    buttons: {
        [s: string]: HTMLElement;
    };
    initialize(): void;
    addEventListeners(): void;
    reloadUIElements(): void;
    setHeader(text: string): void;
    refresh(): void;
    callAllMethodsBeginningWith(prefix: string): void;
}
