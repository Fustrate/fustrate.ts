"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// jQuery: scrollTop, css, animate, show, height, hide, fadeIn, fadeOut, detach
const jquery_1 = __importDefault(require("jquery"));
const lodash_1 = require("lodash");
const Component_1 = __importDefault(require("../Component"));
const object_1 = require("../object");
const event_1 = require("../rails/utils/event");
const utilities_1 = require("../utilities");
const defaultSettings = {
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
let openModals = [];
// We only want to add the global listeners once
let addedGlobalListeners = false;
let overlay;
function createButton(options) {
    const button = document.createElement('button');
    button.classList.add('expand');
    if (typeof options === 'string') {
        button.classList.add(options);
        button.setAttribute('data-button', options);
        button.textContent = utilities_1.escapeHTML(options);
    }
    else {
        button.classList.add(options.type);
        button.setAttribute('data-button', options.name);
        button.textContent = utilities_1.escapeHTML(options.text || lodash_1.startCase(options.name));
    }
    return button;
}
function toggleBackground(visible = true) {
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.classList.add('modal-overlay');
    }
    if (visible) {
        if (!utilities_1.isVisible(overlay)) {
            utilities_1.hide(overlay);
            document.body.appendChild(overlay);
            jquery_1.default(overlay).fadeIn(fadeSpeed);
        }
    }
    else {
        jquery_1.default(overlay).fadeOut(fadeSpeed, () => {
            jquery_1.default(overlay).detach();
        });
    }
}
function closeTopmostModalOnEsc(event) {
    if (event.which === 27 && openModals.length > 0) {
        openModals[openModals.length - 1].close();
    }
}
class Modal extends Component_1.default {
    constructor(settings) {
        super();
        this.locked = false;
        this.fields = {};
        this.buttons = {};
        this.settings = object_1.deepExtend(defaultSettings, this.constructor.settings, settings);
        this.modal = this.createModal();
        this.setTitle(this.settings.title, this.settings.icon);
        this.setContent(this.settings.content || '', false);
        this.setButtons(this.settings.buttons, false);
        this.reloadUIElements();
        this.addEventListeners();
        this.initialize();
    }
    static hideAllModals() {
        openModals.forEach((modal) => {
            modal.hide();
        });
        openModals = [];
    }
    static get settings() {
        return { buttons: [], title: '' };
    }
    // Close the top-most modal if the background is clicked
    static backgroundClicked() {
        const modal = openModals[openModals.length - 1];
        // Don't continue to close if we're not supposed to
        if (modal && !modal.locked && modal.constructor.closeOnBackgroundClick) {
            modal.close();
        }
        return false;
    }
    initialize() {
        // Perform setup
    }
    reloadUIElements() {
        this.fields = {};
        this.buttons = {};
        this.modal.querySelectorAll('[data-field]').forEach((element) => {
            this.fields[element.dataset.field] = element;
        });
        this.modal.querySelectorAll('[data-button]').forEach((element) => {
            this.buttons[element.dataset.button] = element;
        });
    }
    setTitle(title, icon) {
        const iconToUse = icon !== false && icon == null ? this.constructor.icon : icon;
        this.modal.querySelector('.modal-title span')
            .innerHTML = iconToUse ? `${utilities_1.icon(iconToUse)} ${title}` : title;
    }
    setContent(content, reload = true) {
        let modalContent = content;
        if (typeof content === 'string') {
            modalContent = content;
        }
        else {
            modalContent = content();
        }
        this.modal.querySelector('.modal-content').innerHTML = modalContent;
        this.cachedHeight = undefined;
        if (reload) {
            this.reloadUIElements();
        }
    }
    setButtons(buttons, reload = true) {
        const row = document.createElement('div');
        row.classList.add('row');
        const klass = `large-${12 / buttons.length}`;
        buttons.forEach((buttonData) => {
            const columns = document.createElement('div');
            columns.classList.add('columns', klass);
            columns.append(createButton(buttonData));
            row.append(columns);
        });
        const buttonsContainer = this.modal.querySelector('.modal-buttons');
        buttonsContainer.textContent = '';
        buttonsContainer.append(row);
        this.cachedHeight = undefined;
        if (reload) {
            this.reloadUIElements();
        }
    }
    addEventListeners() {
        this.modal.querySelector('.modal-close')
            .addEventListener('click', this.closeButtonClicked.bind(this));
        if (!addedGlobalListeners) {
            event_1.delegate(document.body, '.modal-overlay', 'click', this.constructor.backgroundClicked);
            event_1.delegate(document.body, '.modal-overlay', 'touchstart', this.constructor.backgroundClicked);
            document.body.addEventListener('keyup', closeTopmostModalOnEsc);
            addedGlobalListeners = true;
        }
        if (this.buttons.cancel) {
            this.buttons.cancel.addEventListener('click', this.cancel.bind(this));
        }
    }
    focusFirstInput() {
        if (/iPad|iPhone|iPod/g.test(navigator.userAgent)) {
            // Focus requires a slight physical scroll on iOS 8.4
            return;
        }
        const [firstInput] = Array.from(this.modal.querySelectorAll('input, select, textarea'))
            .filter(element => utilities_1.isVisible(element)
            && !element.disabled
            && (element instanceof HTMLSelectElement || !element.readOnly));
        if (firstInput) {
            firstInput.focus();
        }
    }
    open() {
        if (this.locked || this.modal.classList.contains('open')) {
            return;
        }
        this.locked = true;
        if (openModals.includes(this)) {
            lodash_1.pull(openModals, this);
        }
        openModals.push(this);
        event_1.fire(this.modal, 'modal:opening');
        if (openModals.length > 1) {
            // Hide the modal immediately previous to this one.
            openModals[openModals.length - 2].hide();
        }
        else {
            // There are no open modals - show the background overlay
            toggleBackground(true);
        }
        const windowScrollTop = jquery_1.default(window).scrollTop() || 0;
        const css = this.settings.css.open;
        css.top = `${windowScrollTop - this.height}px`;
        const endCss = {
            opacity: 1,
            top: `${windowScrollTop + (this.settings.distanceFromTop || 25)}px`,
        };
        setTimeout((() => {
            this.modal.classList.add('open');
            jquery_1.default(this.modal).css(css).animate(endCss, 250, 'linear', () => {
                this.locked = false;
                event_1.fire(this.modal, 'modal:opened');
                this.focusFirstInput();
            });
        }), 125);
    }
    close(openPrevious = true) {
        if (this.locked || !this.modal.classList.contains('open')) {
            return;
        }
        this.locked = true;
        if (!openPrevious || openModals.length === 1) {
            toggleBackground(false);
        }
        // Remove the top-most modal (this one) from the stack
        openModals.pop();
        const windowScrollTop = jquery_1.default(window).scrollTop() || 0;
        const endCss = {
            opacity: 0,
            top: `${-windowScrollTop - this.height}px`,
        };
        setTimeout((() => {
            jquery_1.default(this.modal).animate(endCss, 250, 'linear', () => {
                this.locked = false;
                jquery_1.default(this.modal).css(this.settings.css.close);
                event_1.fire(this.modal, 'modal:closed');
                if (openPrevious) {
                    this.openPreviousModal();
                }
                else {
                    this.constructor.hideAllModals();
                }
            });
            this.modal.classList.remove('open');
        }), 125);
    }
    // Just hide the modal immediately and don't bother with an overlay
    hide() {
        this.locked = false;
        this.modal.classList.remove('open');
        jquery_1.default(this.modal).css(this.settings.css.close);
    }
    // User clicked the Cancel button, if one exists.
    cancel() {
        this.close();
    }
    openPreviousModal() {
        if (openModals.length > 0) {
            openModals[openModals.length - 1].open();
        }
    }
    get height() {
        if (this.cachedHeight) {
            return this.cachedHeight;
        }
        this.cachedHeight = jquery_1.default(this.modal).show().height();
        jquery_1.default(this.modal).hide();
        return this.cachedHeight;
    }
    createModal() {
        // Join and split in case any of the classes include spaces
        const classes = this.defaultClasses().join(' ').split(' ');
        const element = utilities_1.elementFromString(template);
        element.classList.add(...classes);
        document.body.appendChild(element);
        return element;
    }
    defaultClasses() {
        return lodash_1.compact([this.settings.size || '', this.settings.type || '']);
    }
    closeButtonClicked(event) {
        event_1.stopEverything(event);
        this.close();
        return false;
    }
}
Modal.closeOnBackgroundClick = true;
exports.default = Modal;
