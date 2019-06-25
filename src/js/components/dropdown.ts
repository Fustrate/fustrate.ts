import Popper from 'popper.js';

import Component from '../component';
import { delegate } from '../rails/utils/event';

export default class Dropdown extends Component {
  public static initialize() {
    delegate(document.body, '.has-dropdown', 'click', this.open.bind(this));

    this.boundHide = this.hide.bind(this);
  }

  public static open(event) {
    // Hide any visible dropdowns before showing this one
    this.hide();

    this.popper = new Popper(event.target, event.target.nextElementSibling, {
      modifiers: {
        flip: {
          behavior: ['bottom', 'top'],
        },
      },
      placement: 'bottom-start',
    });

    document.body.addEventListener('click', this.boundHide);

    return false;
  }

  public static hide() {
    if (this.popper) {
      this.popper.destroy();
    }

    document.body.removeEventListener('click', this.boundHide);
  }
}
