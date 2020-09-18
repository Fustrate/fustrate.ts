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
    icon?: string;
    size?: string;
    type?: string;
}
export default class Modal extends Component {
    modal: HTMLElement;
    modalId: number;
    settings: ModalSettings;
    locked: boolean;
    fields: {
        [s: string]: HTMLElement;
    };
    buttons: {
        [s: string]: HTMLElement;
    };
    private static closeOnBackgroundClick;
    private promise?;
    private resolve?;
    private reject?;
    static hideAllModals(): void;
    static get settings(): ModalSettings;
    protected static backgroundClicked(): boolean;
    constructor(settings?: ModalSettings);
    setup(): void;
    static build<T extends typeof Modal>(this: T): InstanceType<T>;
    initialize(): void;
    reloadUIElements(): void;
    setTitle(title: string, icon?: string): void;
    setContent(content: string | (() => string), reload?: boolean): void;
    setButtons(buttons: (string | ModalButton)[], reload?: boolean): void;
    addEventListeners(): void;
    focusFirstInput(): void;
    open(reopening?: boolean): Promise<any>;
    close(openPrevious?: boolean): void;
    hide(): void;
    cancel(): void;
    openPreviousModal(): void;
    protected createModal(): HTMLDivElement;
    protected defaultClasses(): string[];
    protected closeButtonClicked(event: MouseEvent): false;
    static keyPressed(event: KeyboardEvent): void;
}
export {};
