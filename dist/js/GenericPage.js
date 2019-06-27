"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Page_1 = __importDefault(require("./Page"));
class GenericPage extends Page_1.default {
    constructor() {
        super(...arguments);
        this.fields = {};
        this.buttons = {};
    }
    initialize() {
        this.reloadUIElements();
        super.initialize();
        this.addEventListeners();
    }
    addEventListeners() {
        super.addEventListeners();
    }
    reloadUIElements() {
        this.fields = {};
        this.buttons = {};
        Array.from(document.querySelectorAll('[data-field]'))
            .filter(element => !element.matches('.modal [data-field]'))
            .forEach((element) => {
            this.fields[element.dataset.field] = element;
        });
        Array.from(document.querySelectorAll('[data-button]'))
            .filter(element => !element.matches('.modal [data-button]'))
            .forEach((element) => {
            this.buttons[element.dataset.button] = element;
        });
    }
    setHeader(text) {
        const headerSpan = document.querySelector('.header > span');
        if (headerSpan) {
            headerSpan.textContent = text;
        }
    }
    refresh() {
        this.callAllMethodsBeginningWith('refresh');
    }
    callAllMethodsBeginningWith(prefix) {
        Object.getOwnPropertyNames(this).forEach((name) => {
            if (name !== prefix && name.indexOf(prefix) === 0) {
                const descriptor = Object.getOwnPropertyDescriptor(this, name);
                if (descriptor && typeof descriptor.value === 'function') {
                    descriptor.value.call(this);
                }
            }
        });
    }
}
exports.default = GenericPage;
