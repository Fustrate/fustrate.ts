import Component from '../Component';
export default class DropZone extends Component {
    static create(target: HTMLElement, callback: (files: File[]) => void): DropZone;
    constructor(target: HTMLElement, callback: (files: File[]) => void);
}
