// jQuery: hide, fadeIn, delay, fadeOut
import $ from 'jquery';

import Component from '../component';
import { icon as createIcon } from '../utilities';

const settings = {
  displayTime: 4000,
  fadeInSpeed: 500,
  fadeOutSpeed: 2000,
};

const createFlashBar = (message: string, type?: string, icon?: string): HTMLDivElement => {
  const bar = document.createElement('div');

  bar.classList.add('flash', type || 'info');
  bar.innerHTML = icon ? `${createIcon(icon)} ${message}` : message;

  const flashes = document.getElementById('flashes') || document.body;

  flashes.insertBefore(bar, flashes.firstChild);

  return bar;
};

export class Flash extends Component {
  public static show(message: string, type?: string, icon?: string) {
    return new this(message, type, icon);
  }

  constructor(message: string, type?: string, icon?: string) {
    super();

    const bar = createFlashBar(message, type, icon);

    $(bar)
      .hide()
      .fadeIn(settings.fadeInSpeed)
      .delay(settings.displayTime)
      .fadeOut(settings.fadeOutSpeed, () => bar.remove());
  }
}

export class InfoFlash extends Flash {
  constructor(message: string, icon?: string) {
    super(message, 'info', icon);
  }
}

export class SuccessFlash extends Flash {
  constructor(message: string, icon?: string) {
    super(message, 'success', icon);
  }
}

export class ErrorFlash extends Flash {
  constructor(message: string, icon?: string) {
    super(message, 'error', icon);
  }
}
