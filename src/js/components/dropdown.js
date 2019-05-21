import Popper from 'popper.js';

import Component from '../component';
import { delegate } from '../rails/utils/event';

export default class Dropdown extends Component {
  static initialize() {
    delegate(document.body, '.has-dropdown', 'click', this.open.bind(this));
  }

  static open(event) {
    // Hide any visible dropdowns before showing this one
    this.hide();

    this.popper = new Popper(document.querySelector('.panel'), event.target.nextElementSibling, {
      placement: 'bottom-start',
      modifiers: {
        flip: {
          behavior: ['bottom', 'top'],
        },
      },
    });

    return false;
  }

  static hide() {
    if (this.popper) {
      this.popper.destroy();
    }
  }
}
