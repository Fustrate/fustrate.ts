// jQuery: scrollTop, css, animate, show, height, hide, fadeIn, fadeOut, detach
import $ from 'jquery';

import { remove } from '../array';
import Component from '../component';
import { deepExtend } from '../object';
import { delegate, fire, stopEverything } from '../rails/utils/event';
import { titleize } from '../string';
import {
  elementFromString,
  escapeHTML,
  hide,
  icon as createIcon,
  isVisible,
} from '../utilities';

interface ModalSettings {
  buttons?: any[];
  content?: string;
  css?: { [s: string]: any };
  distanceFromTop?: number;
  icon?: string;
  size?: string;
  title?: string;
  type?: string;
}

interface ModalButton {
  text: string;
  type: string;
  name: string;
}

const defaultSettings: ModalSettings = {
  buttons: [],
  content: undefined,
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
  icon: undefined,
  size: 'tiny',
  title: null,
  type: null,
};

const fadeSpeed = 250;

const template = `
  <div class='modal'>
    <div class='modal-title'>
      <span></span>
      <a href='#' class='modal-close'>&#215;</a>
    </div>
    <div class='modal-content'></div>
    <div class='modal-buttons'></div>
  </div>`;

// A stack of currently-open modals
let openModals: Modal[] = [];

// We only want to add the global listeners once
let addedGlobalListeners = false;

let overlay;

function createButton(options: string | ModalButton): HTMLButtonElement {
  const button = document.createElement('button');
  button.classList.add('expand');
  button.setAttribute('data-button', options.name);

  if (typeof options === 'string') {
    button.classList.add(options.name);
    button.textContent = escapeHTML(options);
  } else {
    button.classList.add(options.type);
    button.textContent = escapeHTML(options.text || titleize(options.name));
  }

  return button;
}

export default class Modal extends Component {
  public modal: HTMLElement;

  public settings: ModalSettings;

  private deferred: Promise<any>;

  private cachedHeight?: number;

  public locked: boolean = false;

  public fields: { [s: string]: HTMLElement } = {};

  public buttons: { [s: string]: HTMLElement } = {};

  public static icon?: string;

  public static hideAllModals() {
    openModals.forEach((modal) => {
      modal.hide();
    });

    openModals = [];
  }

  public static get settings() { return {}; }

  protected static toggleBackground(visible = true) {
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

  protected static get closeOnBackgroundClick() {
    return true;
  }

  // Close the top-most modal if the background is clicked
  protected static backgroundClicked() {
    const modal = openModals[openModals.length - 1];

    // Don't continue to close if we're not supposed to
    if (modal && !modal.locked && modal.constructor.closeOnBackgroundClick) {
      modal.close();
    }

    return false;
  }

  protected static keyPressed(event) {
    if (event.which === 27 && openModals.length > 0) {
      openModals[openModals.length - 1].close();
    }
  }

  constructor(settings: ModalSettings) {
    super();

    this.settings = deepExtend(
      {},
      defaultSettings,
      (this.constructor as typeof Modal).settings || {},
      settings != null ? settings : {},
    );

    this.modal = this.createModal();

    this.setTitle(this.settings.title, this.settings.icon);
    this.setContent(this.settings.content, false);
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

    this.modal.querySelectorAll('[data-field]').forEach((element: HTMLElement) => {
      this.fields[element.dataset.field] = element;
    });

    this.modal.querySelectorAll('[data-button]').forEach((element: HTMLElement) => {
      this.buttons[element.dataset.button] = element;
    });
  }

  public setTitle(title: string, icon?: string | false) {
    const iconToUse = icon !== false && icon == null ? (this.constructor as typeof Modal).icon : icon;

    this.modal.querySelector<HTMLSpanElement>('.modal-title span')
      .innerHTML = iconToUse ? `${createIcon(iconToUse)} ${title}` : title;
  }

  public setContent(content: string | (() => string), reload: boolean = true) {
    let modalContent = content;

    if (typeof content === 'string') {
      modalContent = content;
    } else {
      modalContent = content();
    }

    this.modal.querySelector<HTMLSpanElement>('.modal-content').innerHTML = modalContent;

    this.cachedHeight = undefined;

    if (reload) {
      this.reloadUIElements();
    }
  }

  public setButtons(buttons: (string | ModalButton)[], reload: boolean = true) {
    const list = buttons.map(data => createButton(data));

    const klass = `large-${12 / list.length}`;
    const columns = list.map(element => `<div class='columns ${klass}'>${element}</div>`);

    this.modal.querySelector('.modal-buttons').innerHTML = `<div class='row'>${columns.join('')}</div>`;

    this.cachedHeight = undefined;

    if (reload) {
      this.reloadUIElements();
    }
  }

  public addEventListeners() {
    this.modal.querySelector('.modal-close').addEventListener('click', this.closeButtonClicked.bind(this));

    if (!addedGlobalListeners) {
      delegate(document.body, '.modal-overlay', 'click', (this.constructor as typeof Modal).backgroundClicked);
      delegate(document.body, '.modal-overlay', 'touchstart', (this.constructor as typeof Modal).backgroundClicked);
      document.body.addEventListener('keyup', (this.constructor as typeof Modal).keyPressed);

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

    const [firstInput] = Array.from(this.modal.querySelectorAll('input, select, textarea'))
      .filter((element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => isVisible(element)
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
      remove(openModals, this);
    }

    openModals.push(this);

    fire(this.modal, 'modal:opening');

    if (typeof this.cachedHeight === 'undefined') {
      this.cacheHeight();
    }

    if (openModals.length > 1) {
      // Hide the modal immediately previous to this one.
      openModals[openModals.length - 2].hide();
    } else {
      // There are no open modals - show the background overlay
      (this.constructor as typeof Modal).toggleBackground(true);
    }

    const css = this.settings.css.open;
    css.top = `${$(window).scrollTop() - this.cachedHeight}px`;

    const endCss = {
      opacity: 1,
      top: `${$(window).scrollTop() + this.settings.distanceFromTop}px`,
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
      return Promise.reject();
    }

    this.locked = true;

    if (!openPrevious || openModals.length === 1) {
      (this.constructor as typeof Modal).toggleBackground(false);
    }

    // Remove the top-most modal (this one) from the stack
    openModals.pop();

    const endCss = {
      opacity: 0,
      top: `${-$(window).scrollTop() - this.cachedHeight}px`,
    };

    return new Promise((resolve) => {
      setTimeout((() => {
        $(this.modal).animate(endCss, 250, 'linear', () => {
          this.locked = false;

          $(this.modal).css(this.settings.css.close);
          fire(this.modal, 'modal:closed');

          resolve();

          if (openPrevious) {
            this.openPreviousModal();
          } else {
            (this.constructor as typeof Modal).hideAllModals();
          }
        });

        this.modal.classList.remove('open');
      }), 125);
    });
  }

  // Just hide the modal immediately and don't bother with an overlay
  public hide() {
    this.locked = false;

    this.modal.classList.remove('open');

    $(this.modal).css(this.settings.css.close);
  }

  public cancel() {
    // Reject any deferrals
    if (this.deferred != null) {
      this.deferred.reject();
    }

    this.close();
  }

  public openPreviousModal() {
    if (openModals.length > 0) {
      openModals[openModals.length - 1].open();
    }
  }

  protected cacheHeight() {
    this.cachedHeight = $(this.modal).show().height();

    $(this.modal).hide();
  }

  protected createModal() {
    // Join and split in case any of the classes include spaces
    const classes = this.defaultClasses().join(' ').split(' ');

    const element = elementFromString(template);
    element.classList.add(...classes);

    document.body.appendChild(element);

    return element;
  }

  protected defaultClasses() {
    return [this.settings.size, this.settings.type].filter(klass => klass !== null);
  }

  protected closeButtonClicked(event) {
    stopEverything(event);

    this.close();

    return false;
  }
}
