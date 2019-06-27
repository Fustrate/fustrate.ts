// jQuery: fadeOut
import $ from 'jquery';

import Component from '../component';
import { delegate } from '../rails/utils/event';

const fadeSpeed = 300;

export default class AlertBox extends Component {
  public static initialize() {
    delegate(document.body, '.alert-box .close', 'click', this.closeAlertBox);
  }

  public static closeAlertBox(event: MouseEvent) {
    const alertBox = (event.target! as HTMLElement).closest('.alert-box')!;

    $(alertBox as HTMLElement).fadeOut(fadeSpeed, alertBox.remove);

    return false;
  }
}
