import $ from 'jquery';

import Component from '../component';
import { triggerEvent } from '../utilities';

class Disclosure extends Component {
  static initialize() {
    $('body').on('click', '.disclosure-title', this.toggleDisclosure);
  }

  static toggleDisclosure(event) {
    const disclosure = event.currentTarget.closest('.disclosure');
    const isOpen = disclosure.classList.contains('open');

    disclosure.classList.toggle('open');
    triggerEvent(disclosure, `${(isOpen ? 'closed' : 'opened')}.disclosure`);

    return false;
  }
}

export default Disclosure;
