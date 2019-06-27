import Component from '../component';
import { delegate } from '../rails/utils/event';
import { triggerEvent } from '../utilities';

export default class Disclosure extends Component {
  public static initialize() {
    delegate(document.body, '.disclosure-title', 'click', this.toggleDisclosure);
  }

  public static toggleDisclosure(event: MouseEvent) {
    const disclosure = (event.target! as HTMLElement).closest('.disclosure');

    if (!disclosure) {
      return false;
    }

    const isOpen = disclosure.classList.contains('open');

    disclosure.classList.toggle('open');

    triggerEvent(disclosure, `${(isOpen ? 'closed' : 'opened')}.disclosure`);

    return false;
  }
}
