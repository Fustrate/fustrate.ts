import $ from 'jquery';

import Component from '../component';
import { delegate } from '../rails/utils/event';

const fadeSpeed = 300;

class AlertBox extends Component {
  static initialize() {
    delegate(document.body, '.alert-box .close', 'click', this.closeAlertBox);
  }

  static closeAlertBox(event) {
    const alertBox = event.currentTarget.closest('.alert-box');

    $(alertBox).fadeOut(fadeSpeed, alertBox.remove);

    return false;
  }
}

export default AlertBox;
