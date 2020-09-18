"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const escape_1 = __importDefault(require("lodash/escape"));
const startCase_1 = __importDefault(require("lodash/startCase"));
const compact_1 = __importDefault(require("lodash/compact"));
const pull_1 = __importDefault(require("lodash/pull"));
const ujs_1 = require("@rails/ujs");
const Component_1 = __importDefault(require("../Component"));
const show_hide_1 = require("../show_hide");
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
let openModals = [];
// We only want to add the global listeners once
let addedGlobalListeners = false;
let overlay;
let modalCount = 0;
function createButton(options) {
    const button = document.createElement('button');
    button.classList.add('expand');
    if (typeof options === 'string') {
        button.classList.add(options);
        button.setAttribute('data-button', options);
        button.textContent = escape_1.default(options);
    }
    else {
        button.classList.add(options.type);
        button.setAttribute('data-button', options.name);
        button.textContent = escape_1.default(options.text || startCase_1.default(options.name));
    }
    return button.outerHTML;
}
function toggleBackground(visible = true) {
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.classList.add('modal-overlay');
    }
    if (visible) {
        if (!show_hide_1.isVisible(overlay)) {
            document.body.appendChild(overlay);
            utilities_1.animate(overlay, 'fadeIn', undefined, undefined, 'fast');
        }
    }
    else {
        utilities_1.animate(overlay, 'fadeOut', () => {
            var _a;
            (_a = overlay.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(overlay);
        }, undefined, 'faster');
    }
}
class Modal extends Component_1.default {
    constructor(settings) {
        super();
        this.locked = false;
        this.fields = {};
        this.buttons = {};
        modalCount += 1;
        this.modalId = modalCount;
        this.settings = Object.assign(Object.assign({}, defaultSettings), (settings || {}));
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
    setup() {
        this.modal = this.createModal();
        this.setTitle(this.settings.title, this.settings.icon);
        this.setContent(this.settings.content || '', false);
        this.setButtons(this.settings.buttons, false);
        this.reloadUIElements();
        this.addEventListeners();
        this.initialize();
    }
    static build() {
        const modal = new this();
        modal.setup();
        return modal;
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
        const element = this.modal.querySelector('.modal-title span');
        if (element) {
            element.innerHTML = icon ? `${utilities_1.icon(icon)} ${title}` : title;
        }
    }
    setContent(content, reload = true) {
        const modalContent = typeof content === 'string' ? content : content();
        const element = this.modal.querySelector('.modal-content');
        if (element) {
            element.innerHTML = modalContent;
        }
        if (reload) {
            this.reloadUIElements();
        }
    }
    setButtons(buttons, reload = true) {
        const buttonsContainer = this.modal.querySelector('.modal-buttons');
        if (!buttonsContainer) {
            return;
        }
        if (buttons.length < 1) {
            buttonsContainer.innerHTML = '';
            return;
        }
        const list = [];
        buttons.forEach((button) => {
            if (button === 'spacer') {
                list.push('<div class="spacer"></div>');
            }
            else if (typeof button === 'string') {
                list.push(`<button class="${button}" data-button="${button}">${startCase_1.default(button)}</button>`);
            }
            else {
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
    addEventListeners() {
        var _a, _b;
        (_a = this.modal.querySelector('.modal-close')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', this.closeButtonClicked.bind(this));
        if (!addedGlobalListeners) {
            ujs_1.delegate(document.body, '.modal-overlay', 'click', this.constructor.backgroundClicked);
            ujs_1.delegate(document.body, '.modal-overlay', 'touchstart', this.constructor.backgroundClicked);
            document.body.addEventListener('keyup', this.constructor.keyPressed);
            addedGlobalListeners = true;
        }
        (_b = this.buttons.cancel) === null || _b === void 0 ? void 0 : _b.addEventListener('click', this.cancel.bind(this));
    }
    focusFirstInput() {
        if (/iPad|iPhone|iPod/g.test(navigator.userAgent)) {
            // Focus requires a slight physical scroll on iOS 8.4
            return;
        }
        const [firstInput] = Array.from(this.modal.querySelectorAll('input, select, textarea'))
            .filter((element) => show_hide_1.isVisible(element)
            && !element.disabled
            && (element instanceof HTMLSelectElement || !element.readOnly));
        firstInput.focus();
    }
    open(reopening) {
        if (this.promise && (this.locked || this.modal.classList.contains('open'))) {
            return this.promise;
        }
        this.locked = true;
        if (openModals.includes(this)) {
            pull_1.default(openModals, this);
        }
        openModals.push(this);
        ujs_1.fire(this.modal, 'modal:opening');
        if (openModals.length > 1) {
            // Hide the modal immediately previous to this one.
            openModals[openModals.length - 2].hide();
        }
        else {
            // There are no open modals - show the background overlay
            toggleBackground(true);
        }
        const { top } = document.body.getBoundingClientRect();
        this.modal.style.top = `${25 - top}px`;
        setTimeout(() => {
            this.modal.classList.add('open');
            utilities_1.animate(this.modal, 'fadeInDown', () => {
                this.locked = false;
                ujs_1.fire(this.modal, 'modal:opened');
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
        setTimeout(() => {
            utilities_1.animate(this.modal, 'fadeOutUp', () => {
                ujs_1.fire(this.modal, 'modal:closed');
                this.modal.classList.remove('open');
                this.locked = false;
            });
            if (openPrevious) {
                this.openPreviousModal();
            }
            else {
                this.constructor.hideAllModals();
            }
        }, 125);
    }
    // Just hide the modal immediately and don't bother with an overlay
    hide() {
        this.locked = false;
        this.modal.classList.remove('open');
    }
    // User clicked the Cancel button, if one exists.
    cancel() {
        this.close();
    }
    openPreviousModal() {
        if (openModals.length > 0) {
            openModals[openModals.length - 1].open(true);
        }
    }
    createModal() {
        var _a;
        // Join and split in case any of the classes include spaces
        const classes = this.defaultClasses().join(' ').split(' ');
        const element = utilities_1.elementFromString(template);
        element.classList.add(...classes);
        // Accessibility
        element.setAttribute('aria-labelledby', `modal_${this.modalId}_title`);
        (_a = element.querySelector('.modal-title span')) === null || _a === void 0 ? void 0 : _a.setAttribute('id', `modal_${this.modalId}_title`);
        document.body.appendChild(element);
        return element;
    }
    defaultClasses() {
        return compact_1.default([this.settings.size, this.settings.type]);
    }
    closeButtonClicked(event) {
        ujs_1.stopEverything(event);
        this.close();
        return false;
    }
    static keyPressed(event) {
        if (event.which === 27 && openModals.length > 0) {
            openModals[openModals.length - 1].close();
        }
    }
}
exports.default = Modal;
Modal.closeOnBackgroundClick = true;
