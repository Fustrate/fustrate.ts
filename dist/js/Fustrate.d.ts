import Page from './Page';
export default class Fustrate {
    static start(Klass: typeof Page): void;
    static initialize(): void;
    protected static instance: Page;
    constructor();
}
