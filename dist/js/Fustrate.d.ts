import type Page from './Page';
export default class Fustrate {
    protected static instance: Page;
    static start(Klass?: typeof Page): void;
    protected static initialize(): void;
    protected static wrapTables(): void;
    protected static updateMomentLocales(): void;
}
