import Component from '../Component';
import { animate, icon as createIcon } from '../utilities';

const createFlashBar = (message: string, type?: string, icon?: string): HTMLDivElement => {
  const bar = document.createElement('div');

  bar.classList.add('flash', type || 'info');
  bar.innerHTML = icon ? `${createIcon(icon)} ${message}` : message;

  const flashes = document.getElementById('flashes') || document.body;

  flashes.insertBefore(bar, flashes.firstChild);

  return bar;
};

export class Flash extends Component {
  public static show<T extends typeof Flash>(this: T, message: string, type?: string, icon?: string): InstanceType<T> {
    return new this(message, type, icon) as InstanceType<T>;
  }

  constructor(message: string, type?: string, icon?: string) {
    super();

    const bar = createFlashBar(message, type, icon);

    animate(bar, 'fadeIn', () => {
      animate(bar, 'fadeOut', () => {
        bar.remove();
      }, 4, 'slow');
    }, undefined, 'faster');
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
