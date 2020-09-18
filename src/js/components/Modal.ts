import escape from 'lodash/escape';
import startCase from 'lodash/startCase';
import compact from 'lodash/compact';
import pull from 'lodash/pull';
import { delegate, fire, stopEverything } from '@rails/ujs';

import Component from '../Component';
import { isVisible } from '../show_hide';
import { animate, elementFromString, icon as createIcon } from '../utilities';

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
  icon?: string;
  size?: string;
  type?: string;
}

type FormFields = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

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
  size: 'tiny',
  title: '',
};

const template = `
  <div class="modal" role="dialog" aria-modal="true">
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

let modalCount = 0;

function createButton(options: string | ModalButton): string {
  const button = document.createElement('button');
  button.classList.add('expand');

  if (typeof options === 'string') {
    button.classList.add(options);
    button.setAttribute('data-button', options);
    button.textContent = escape(options);
  } else {
    button.classList.add(options.type);
    button.setAttribute('data-button', options.name);
    button.textContent = escape(options.text || startCase(options.name));
  }

  return button.outerHTML;
}

function toggleBackground(visible = true) {
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.classList.add('modal-overlay');
  }

  if (visible) {
    if (!isVisible(overlay)) {
      document.body.appendChild(overlay);

      animate(overlay, 'fadeIn', undefined, undefined, 'fast');
    }
  } else {
    animate(overlay, 'fadeOut', () => {
      overlay.parentNode?.removeChild(overlay);
    }, undefined, 'faster');
  }
}

export default class Modal extends Component {
  public modal!: HTMLElement;
  public modalId: number;

  public settings: ModalSettings;

  public locked = false;

  public fields: { [s: string]: HTMLElement } = {};
  public buttons: { [s: string]: HTMLElement } = {};

  private static closeOnBackgroundClick = true;

  private promise?: Promise<any>;
  private resolve?: (value?: any) => void;
  private reject?: (reason?: any) => void;

  public static hideAllModals(): void {
    openModals.forEach((modal) => {
      modal.hide();
    });

    openModals = [];
  }

  public static get settings(): ModalSettings {
    return { buttons: [], title: '' };
  }

  // Close the top-most modal if the background is clicked
  protected static backgroundClicked(): boolean {
    const modal = openModals[openModals.length - 1];

    // Don't continue to close if we're not supposed to
    if (modal && !modal.locked && (modal.constructor as typeof Modal).closeOnBackgroundClick) {
      modal.close();
    }

    return false;
  }

  constructor(settings?: ModalSettings) {
    super();

    modalCount += 1;
    this.modalId = modalCount;

    this.settings = { ...defaultSettings, ...(settings || {}) };
  }

  public setup(): void {
    this.modal = this.createModal();

    this.setTitle(this.settings.title, this.settings.icon);
    this.setContent(this.settings.content || '', false);
    this.setButtons(this.settings.buttons, false);
    this.reloadUIElements();
    this.addEventListeners();
    this.initialize();
  }

  static build<T extends typeof Modal>(this: T): InstanceType<T> {
    const modal = new this();

    modal.setup();

    return modal as InstanceType<T>;
  }

  public initialize(): void {
    // Perform setup
  }

  public reloadUIElements(): void {
    this.fields = {};
    this.buttons = {};

    this.modal.querySelectorAll<HTMLElement>('[data-field]').forEach((element) => {
      this.fields[element.dataset.field as string] = element;
    });

    this.modal.querySelectorAll<HTMLElement>('[data-button]').forEach((element) => {
      this.buttons[element.dataset.button as string] = element;
    });
  }

  public setTitle(title: string, icon?: string): void {
    const element = this.modal.querySelector<HTMLSpanElement>('.modal-title span');

    if (element) {
      element.innerHTML = icon ? `${createIcon(icon)} ${title}` : title;
    }
  }

  public setContent(content: string | (() => string), reload = true): void {
    const modalContent = typeof content === 'string' ? content : content();

    const element = this.modal.querySelector<HTMLSpanElement>('.modal-content');

    if (element) {
      element.innerHTML = modalContent;
    }

    if (reload) {
      this.reloadUIElements();
    }
  }

  public setButtons(buttons: (string | ModalButton)[], reload = true): void {
    const buttonsContainer = this.modal.querySelector<HTMLDivElement>('.modal-buttons');

    if (!buttonsContainer) {
      return;
    }

    if (buttons.length < 1) {
      buttonsContainer.innerHTML = '';

      return;
    }

    const list: string[] = [];

    buttons.forEach((button) => {
      if (button === 'spacer') {
        list.push('<div class="spacer"></div>');
      } else if (typeof button === 'string') {
        list.push(`<button class="${button}" data-button="${button}">${startCase(button)}</button>`);
      } else {
        Object.keys(button).forEach((name) => {
          list.push(createButton(name));
        }, this);
      }
    });

    buttonsContainer.innerHTML = list.join(' ');

    if (reload) {
      this.reloadUIElements();
    }
  }

  public addEventListeners(): void {
    this.modal.querySelector<HTMLAnchorElement>('.modal-close')
      ?.addEventListener('click', this.closeButtonClicked.bind(this));

    if (!addedGlobalListeners) {
      delegate(document.body, '.modal-overlay', 'click', (this.constructor as typeof Modal).backgroundClicked);
      delegate(document.body, '.modal-overlay', 'touchstart', (this.constructor as typeof Modal).backgroundClicked);
      document.body.addEventListener('keyup', (this.constructor as typeof Modal).keyPressed);

      addedGlobalListeners = true;
    }

    this.buttons.cancel?.addEventListener('click', this.cancel.bind(this));
  }

  public focusFirstInput(): void {
    if (/iPad|iPhone|iPod/g.test(navigator.userAgent)) {
      // Focus requires a slight physical scroll on iOS 8.4
      return;
    }

    const [firstInput] = Array.from(this.modal.querySelectorAll<FormFields>('input, select, textarea'))
      .filter((element) => isVisible(element)
        && !element.disabled
        && (element instanceof HTMLSelectElement || !element.readOnly));

    firstInput.focus();
  }

  public open(reopening?: boolean): Promise<any> {
    if (this.promise && (this.locked || this.modal.classList.contains('open'))) {
      return this.promise;
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

    const { top } = document.body.getBoundingClientRect();

    this.modal.style.top = `${25 - top}px`;

    setTimeout(() => {
      this.modal.classList.add('open');

      animate(this.modal, 'fadeInDown', () => {
        this.locked = false;

        fire(this.modal, 'modal:opened');

        this.focusFirstInput();
      });
    }, 125);

    if (reopening && this.promise) {
      return this.promise;
    }

    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });

    return this.promise;
  }

  public close(openPrevious = true): void {
    if (this.locked || !this.modal.classList.contains('open')) {
      return;
    }

    this.locked = true;

    if (!openPrevious || openModals.length === 1) {
      toggleBackground(false);
    }

    // Remove the top-most modal (this one) from the stack
    openModals.pop();

    setTimeout(() => {
      animate(this.modal, 'fadeOutUp', () => {
        fire(this.modal, 'modal:closed');

        this.modal.classList.remove('open');

        this.locked = false;
      });

      if (openPrevious) {
        this.openPreviousModal();
      } else {
        (this.constructor as typeof Modal).hideAllModals();
      }
    }, 125);
  }

  // Just hide the modal immediately and don't bother with an overlay
  public hide(): void {
    this.locked = false;

    this.modal.classList.remove('open');
  }

  // User clicked the Cancel button, if one exists.
  public cancel(): void {
    this.close();
  }

  public openPreviousModal(): void {
    if (openModals.length > 0) {
      openModals[openModals.length - 1].open(true);
    }
  }

  protected createModal(): HTMLDivElement {
    // Join and split in case any of the classes include spaces
    const classes = this.defaultClasses().join(' ').split(' ');

    const element = elementFromString<HTMLDivElement>(template);
    element.classList.add(...classes);

    // Accessibility
    element.setAttribute('aria-labelledby', `modal_${this.modalId}_title`);
    element.querySelector('.modal-title span')?.setAttribute('id', `modal_${this.modalId}_title`);

    document.body.appendChild(element);

    return element;
  }

  protected defaultClasses(): string[] {
    return compact([this.settings.size, this.settings.type]);
  }

  protected closeButtonClicked(event: MouseEvent): false {
    stopEverything(event);

    this.close();

    return false;
  }

  static keyPressed(event: KeyboardEvent): void {
    if (event.which === 27 && openModals.length > 0) {
      openModals[openModals.length - 1].close();
    }
  }
}
