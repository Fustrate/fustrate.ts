import Component from '../Component';
export default class DropZone extends Component {
    static create<T extends typeof DropZone>(this: T, target: HTMLElement, callback: (files: File[]) => void): InstanceType<T>;
    constructor(target: HTMLElement, callback: (files: File[]) => void);
}
