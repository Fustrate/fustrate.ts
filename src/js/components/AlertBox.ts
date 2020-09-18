import { delegate } from '@rails/ujs';

import Component from '../Component';
import { animate } from '../utilities';

export default class AlertBox extends Component {
  public static initialize(): void {
    delegate(document.body, '.alert-box .close', 'click', this.closeAlertBox);
  }

  public static closeAlertBox(event: MouseEvent): false {
    const alertBox: HTMLElement | null = (event.target as HTMLElement)?.closest('.alert-box');

    if (!alertBox) {
      return false;
    }

    animate(alertBox, 'fadeOut', () => {
      alertBox.remove();
    }, undefined, 'faster');

    return false;
  }
}
