// jQuery: hide, fadeIn, delay, fadeOut
import $ from 'jquery';

import Component from '../component';
import { icon as createIcon } from '../utilities';

const settings = {
  displayTime: 4000,
  fadeInSpeed: 500,
  fadeOutSpeed: 2000,
};

export class Flash extends Component {
  public static show(message, { type, icon } = {}) {
    return new this(message, { type, icon });
  }

  public static createFlashBar(message, { type, icon } = {}) {
    const bar = document.createElement('div');

    bar.classList.add('flash', type || 'info');
    bar.innerHTML = icon ? `${createIcon(icon)} ${message}` : message;

    const flashes = document.getElementById('flashes');

    flashes.insertBefore(bar, flashes.firstChild);

    return bar;
  }

  constructor(message: string, { type, icon } = {}) {
    super();

    const bar = this.constructor.createFlashBar(message, { type, icon });

    $(bar)
      .hide()
      .fadeIn(settings.fadeInSpeed)
      .delay(settings.displayTime)
      .fadeOut(settings.fadeOutSpeed, () => bar.remove());
  }
}

export class InfoFlash extends Flash {
  constructor(message: string, { icon } = {}) {
    super(message, { type: 'info', icon });
  }
}

export class SuccessFlash extends Flash {
  constructor(message: string, { icon } = {}) {
    super(message, { type: 'success', icon });
  }
}

export class ErrorFlash extends Flash {
  constructor(message: string, { icon } = {}) {
    super(message, { type: 'error', icon });
  }
}
