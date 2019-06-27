import Mixin from './Mixin';
export default class Page {
    private static addEventListenersFns;
    private static initializeFns;
    constructor(...args: any[]);
    initialize(): void;
    addEventListeners(): void;
    static addMixins(...mixins: (typeof Mixin)[]): void;
}
