// jQuery: scrollTop, css, animate, show, height, hide, fadeIn, fadeOut, detach
import $ from 'jquery';
import { pull, compact } from 'lodash/array';
import { startCase } from 'lodash/string';

import Component from '../Component';
import { deepExtend } from '../object';
import { delegate, fire, stopEverything } from '../rails/utils/event';
import {
  elementFromString,
  escapeHTML,
  hide,
  icon as createIcon,
  isVisible,
} from '../utilities';

interface ModalSettingsCss {
  close: { [s: string]: any };
  open: { [s: string]: any };
}

interface ModalButton {
  text: string;
  type: string;
  name: string;
}

interface ModalSettings {
  title: string;
  buttons: (string | ModalButton)[];
  content?: string;
  css?: ModalSettingsCss;
  distanceFromTop?: number;
  icon?: string;
  size?: string;
  type?: string;
}

const defaultSettings: ModalSettings = {
  buttons: [],
  css: {
    close: {
      display: 'none',
      opacity: 1,
      visibility: 'hidden',
    },
    open: {
      display: 'block',
      opacity: 0,
      visibility: 'visible',
    },
  },
  distanceFromTop: 25,
  size: 'tiny',
  title: '',
};

const fadeSpeed = 250;

const template = `
  <div class="modal">
    <div class="modal-title">
      <span></span>
      <a href="#" class="modal-close">&#215;</a>
    </div>
    <div class="modal-content"></div>
    <div class="modal-buttons"></div>
  </div>`;

// A stack of currently-open modals
let openModals: Modal[] = [];

// We only want to add the global listeners once
let addedGlobalListeners = false;

let overlay: HTMLDivElement;

function createButton(options: string | ModalButton): HTMLButtonElement {
  const button = document.createElement('button');
  button.classList.add('expand');

  if (typeof options === 'string') {
    button.classList.add(options);
    button.setAttribute('data-button', options);
    button.textContent = escapeHTML(options);
  } else {
    button.classList.add(options.type);
    button.setAttribute('data-button', options.name);
    button.textContent = escapeHTML(options.text || startCase(options.name));
  }

  return button;
}

function toggleBackground(visible = true) {
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.classList.add('modal-overlay');
  }

  if (visible) {
    if (!isVisible(overlay)) {
      hide(overlay);

      document.body.appendChild(overlay);

      $(overlay).fadeIn(fadeSpeed);
    }
  } else {
    $(overlay).fadeOut(fadeSpeed, () => {
      $(overlay).detach();
    });
  }
}

function closeTopmostModalOnEsc(event: KeyboardEvent) {
  if (event.which === 27 && openModals.length > 0) {
    openModals[openModals.length - 1].close();
  }
}

type FormFields = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export default class Modal extends Component {
  public modal: HTMLElement;

  public settings: ModalSettings;

  public locked: boolean = false;

  public fields: { [s: string]: HTMLElement } = {};

  public buttons: { [s: string]: HTMLElement } = {};

  private cachedHeight?: number;

  private static closeOnBackgroundClick = true;

  private static icon?: string;

  public static hideAllModals() {
    openModals.forEach((modal) => {
      modal.hide();
    });

    openModals = [];
  }

  public static get settings(): ModalSettings {
    return { buttons: [], title: '' };
  }

  // Close the top-most modal if the background is clicked
  protected static backgroundClicked() {
    const modal = openModals[openModals.length - 1];

    // Don't continue to close if we're not supposed to
    if (modal && !modal.locked && (modal.constructor as typeof Modal).closeOnBackgroundClick) {
      modal.close();
    }

    return false;
  }

  constructor(settings: ModalSettings) {
    super();

    this.settings = deepExtend(
      defaultSettings,
      (this.constructor as typeof Modal).settings,
      settings,
    ) as ModalSettings;

    this.modal = this.createModal();

    this.setTitle(this.settings.title, this.settings.icon);
    this.setContent(this.settings.content || '', false);
    this.setButtons(this.settings.buttons, false);
    this.reloadUIElements();
    this.addEventListeners();
    this.initialize();
  }

  public initialize() {
    // Perform setup
  }

  public reloadUIElements() {
    this.fields = {};
    this.buttons = {};

    this.modal.querySelectorAll<HTMLElement>('[data-field]').forEach((element) => {
      this.fields[element.dataset.field as string] = element;
    });

    this.modal.querySelectorAll<HTMLElement>('[data-button]').forEach((element) => {
      this.buttons[element.dataset.button as string] = element;
    });
  }

  public setTitle(title: string, icon?: string | false) {
    const iconToUse = icon !== false && icon == null ? (this.constructor as typeof Modal).icon : icon;

    this.modal.querySelector<HTMLSpanElement>('.modal-title span')!
      .innerHTML = iconToUse ? `${createIcon(iconToUse)} ${title}` : title;
  }

  public setContent(content: string | (() => string), reload: boolean = true) {
    let modalContent = content;

    if (typeof content === 'string') {
      modalContent = content;
    } else {
      modalContent = content();
    }

    this.modal.querySelector<HTMLSpanElement>('.modal-content')!.innerHTML = modalContent;

    this.cachedHeight = undefined;

    if (reload) {
      this.reloadUIElements();
    }
  }

  public setButtons(buttons: (string | ModalButton)[], reload: boolean = true) {
    const row = document.createElement('div');
    row.classList.add('row');

    const klass = `large-${12 / buttons.length}`;

    buttons.forEach((buttonData) => {
      const columns = document.createElement('div');

      columns.classList.add('columns', klass);
      columns.append(createButton(buttonData));

      row.append(columns);
    });

    const buttonsContainer = this.modal.querySelector<HTMLDivElement>('.modal-buttons')!;

    buttonsContainer.textContent = '';
    buttonsContainer.append(row);

    this.cachedHeight = undefined;

    if (reload) {
      this.reloadUIElements();
    }
  }

  public addEventListeners() {
    this.modal.querySelector<HTMLAnchorElement>('.modal-close')!
      .addEventListener('click', this.closeButtonClicked.bind(this));

    if (!addedGlobalListeners) {
      delegate(document.body, '.modal-overlay', 'click', (this.constructor as typeof Modal).backgroundClicked);
      delegate(document.body, '.modal-overlay', 'touchstart', (this.constructor as typeof Modal).backgroundClicked);
      document.body.addEventListener('keyup', closeTopmostModalOnEsc);

      addedGlobalListeners = true;
    }

    if (this.buttons.cancel) {
      this.buttons.cancel.addEventListener('click', this.cancel.bind(this));
    }
  }

  public focusFirstInput() {
    if (/iPad|iPhone|iPod/g.test(navigator.userAgent)) {
      // Focus requires a slight physical scroll on iOS 8.4
      return;
    }

    const [firstInput] = Array.from(this.modal.querySelectorAll<FormFields>('input, select, textarea'))
      .filter(element => isVisible(element)
        && !element.disabled
        && (element instanceof HTMLSelectElement || !element.readOnly));

    if (firstInput) {
      (firstInput as HTMLElement).focus();
    }
  }

  public open() {
    if (this.locked || this.modal.classList.contains('open')) {
      return;
    }

    this.locked = true;

    if (openModals.includes(this)) {
      pull(openModals, this);
    }

    openModals.push(this);

    fire(this.modal, 'modal:opening');

    if (openModals.length > 1) {
      // Hide the modal immediately previous to this one.
      openModals[openModals.length - 2].hide();
    } else {
      // There are no open modals - show the background overlay
      toggleBackground(true);
    }

    const windowScrollTop = $(window).scrollTop() || 0;

    const css = this.settings.css!.open;
    css.top = `${windowScrollTop - this.height}px`;

    const endCss = {
      opacity: 1,
      top: `${windowScrollTop + this.settings.distanceFromTop}px`,
    };

    setTimeout((() => {
      this.modal.classList.add('open');

      $(this.modal).css(css).animate(endCss, 250, 'linear', () => {
        this.locked = false;

        fire(this.modal, 'modal:opened');

        this.focusFirstInput();
      });
    }), 125);
  }

  public close(openPrevious = true) {
    if (this.locked || !this.modal.classList.contains('open')) {
      return;
    }

    this.locked = true;

    if (!openPrevious || openModals.length === 1) {
      toggleBackground(false);
    }

    // Remove the top-most modal (this one) from the stack
    openModals.pop();

    const windowScrollTop = $(window).scrollTop() || 0;

    const endCss = {
      opacity: 0,
      top: `${-windowScrollTop - this.height}px`,
    };

    setTimeout((() => {
      $(this.modal).animate(endCss, 250, 'linear', () => {
        this.locked = false;

        $(this.modal).css(this.settings.css!.close);
        fire(this.modal, 'modal:closed');

        if (openPrevious) {
          this.openPreviousModal();
        } else {
          (this.constructor as typeof Modal).hideAllModals();
        }
      });

      this.modal.classList.remove('open');
    }), 125);
  }

  // Just hide the modal immediately and don't bother with an overlay
  public hide() {
    this.locked = false;

    this.modal.classList.remove('open');

    $(this.modal).css(this.settings.css!.close);
  }

  // User clicked the Cancel button, if one exists.
  public cancel() {
    this.close();
  }

  public openPreviousModal(): void {
    if (openModals.length > 0) {
      openModals[openModals.length - 1].open();
    }
  }

  protected get height(): number {
    if (this.cachedHeight) {
      return this.cachedHeight;
    }

    this.cachedHeight = $(this.modal).show().height();

    $(this.modal).hide();

    return this.cachedHeight as number;
  }

  protected createModal(): HTMLDivElement {
    // Join and split in case any of the classes include spaces
    const classes = this.defaultClasses().join(' ').split(' ');

    const element: HTMLDivElement = elementFromString(template);
    element.classList.add(...classes);

    document.body.appendChild(element);

    return element;
  }

  protected defaultClasses(): string[] {
    return compact<string>([this.settings.size || '', this.settings.type || '']);
  }

  protected closeButtonClicked(event: MouseEvent) {
    stopEverything(event);

    this.close();

    return false;
  }
}
