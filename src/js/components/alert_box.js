import $ from 'jquery';

import Component from '../component';

const fadeSpeed = 300;

class AlertBox extends Component {
  static initialize() {
    $('.alert-box').on('click', '.close', this.closeAlertBox);
  }

  static closeAlertBox(event) {
    const alertBox = event.currentTarget.closest('.alert-box');

    $(alertBox).fadeOut(fadeSpeed, alertBox.remove);

    return false;
  }
}

export default AlertBox;
