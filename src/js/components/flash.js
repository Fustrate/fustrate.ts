import $ from 'jquery';

import Component from '../component';
import { icon as createIcon } from '../utilities';

const settings = {
  fadeInSpeed: 500,
  fadeOutSpeed: 2000,
  displayTime: 4000,
};

export class Flash extends Component {
  constructor(message, { type, icon } = {}) {
    super();

    const bar = $(`<div class="flash ${type != null ? type : 'info'}"></div>`)
      .html(icon ? `${createIcon(icon)} ${message}` : message)
      .hide()
      .prependTo(document.getElementById('flashes'))
      .fadeIn(settings.fadeInSpeed)
      .delay(settings.displayTime)
      .fadeOut(settings.fadeOutSpeed, () => bar.remove());
  }

  static show(message, { type, icon } = {}) {
    return new this(message, { type, icon });
  }
}

export class InfoFlash extends Flash {
  constructor(message, { icon } = {}) {
    super(message, { type: 'info', icon });
  }
}

export class SuccessFlash extends Flash {
  constructor(message, { icon } = {}) {
    super(message, { type: 'success', icon });
  }
}

export class ErrorFlash extends Flash {
  constructor(message, { icon } = {}) {
    super(message, { type: 'error', icon });
  }
}
