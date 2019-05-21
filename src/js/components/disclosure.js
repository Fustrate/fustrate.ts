import Component from '../component';
import { triggerEvent } from '../utilities';
import { delegate } from '../rails/utils/event';

export default class Disclosure extends Component {
  static initialize() {
    delegate(document.body, '.disclosure-title', 'click', this.toggleDisclosure);
  }

  static toggleDisclosure(event) {
    const disclosure = event.currentTarget.closest('.disclosure');
    const isOpen = disclosure.classList.contains('open');

    disclosure.classList.toggle('open');
    triggerEvent(disclosure, `${(isOpen ? 'closed' : 'opened')}.disclosure`);

    return false;
  }
}
