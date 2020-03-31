import Component from '../Component';
interface ModalSettingsCss {
    close: {
        [s: string]: any;
    };
    open: {
        [s: string]: any;
    };
}
interface ModalButton {
    text: string;
    type: string;
    name: string;
}
interface ModalSettings {
    title: string;
    buttons: (string | ModalButton)[];
    content?: string;
    css?: ModalSettingsCss;
    distanceFromTop?: number;
    icon?: string;
    size?: string;
    type?: string;
}
export default class Modal extends Component {
    modal: HTMLElement;
    settings: ModalSettings;
    locked: boolean;
    fields: {
        [s: string]: HTMLElement;
    };
    buttons: {
        [s: string]: HTMLElement;
    };
    private cachedHeight?;
    private static closeOnBackgroundClick;
    private static icon?;
    static hideAllModals(): void;
    static get settings(): ModalSettings;
    protected static backgroundClicked(): boolean;
    constructor(settings: ModalSettings);
    initialize(): void;
    reloadUIElements(): void;
    setTitle(title: string, icon?: string | false): void;
    setContent(content: string | (() => string), reload?: boolean): void;
    setButtons(buttons: (string | ModalButton)[], reload?: boolean): void;
    addEventListeners(): void;
    focusFirstInput(): void;
    open(): void;
    close(openPrevious?: boolean): void;
    hide(): void;
    cancel(): void;
    openPreviousModal(): void;
    protected get height(): number;
    protected createModal(): HTMLDivElement;
    protected defaultClasses(): string[];
    protected closeButtonClicked(event: MouseEvent): boolean;
}
export {};
