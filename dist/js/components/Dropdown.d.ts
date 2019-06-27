import Component from '../Component';
export default class Dropdown extends Component {
    private static popper;
    static initialize(): void;
    static open(event: MouseEvent): boolean;
    static hide(): void;
}
