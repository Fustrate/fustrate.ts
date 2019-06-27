import TooltipJS, { Options } from 'tooltip.js';
import Component from '../Component';
export default class Tooltip extends Component {
    static create(reference: HTMLElement, options?: Options): TooltipJS;
}
