import { delegate, fire } from '@rails/ujs';

import Component from '../Component';

export default class Disclosure extends Component {
  public static initialize(): void {
    delegate(document.body, '.disclosure-title', 'click', this.toggleDisclosure);
  }

  public static toggleDisclosure(event: MouseEvent): false {
    const disclosure = (event.target as HTMLElement)?.closest('.disclosure');

    if (!disclosure) {
      return false;
    }

    const isOpen = disclosure.classList.contains('open');

    disclosure.classList.toggle('open');

    fire(disclosure, `${(isOpen ? 'closed' : 'opened')}.disclosure`);

    return false;
  }
}
