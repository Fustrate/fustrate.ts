import Component from '../Component';
export default class Tabs extends Component {
    private tabs;
    static initialize(): void;
    constructor(tabs: HTMLUListElement);
    activateTab(tab: HTMLElement | null, changeHash?: boolean): void;
}
