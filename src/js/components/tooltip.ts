import TooltipJS, { Options } from 'tooltip.js';
import Component from '../component';

export default class Tooltip extends Component {
  public static create(reference: HTMLElement, options: Options = {}): TooltipJS {
    if (options.container === undefined) {
      options.container = document.body;
    }

    if (!options.placement) {
      options.placement = 'bottom';
    }

    return new TooltipJS(reference, options);
  }
}
