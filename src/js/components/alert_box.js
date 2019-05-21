import $ from 'jquery';

import Component from '../component';
import { delegate } from '../rails/utils/event';

const fadeSpeed = 300;

export default class AlertBox extends Component {
  static initialize() {
    delegate(document.body, '.alert-box .close', 'click', this.closeAlertBox);
  }

  static closeAlertBox(event) {
    const alertBox = event.target.closest('.alert-box');

    $(alertBox).fadeOut(fadeSpeed, alertBox.remove);

    return false;
  }
}
