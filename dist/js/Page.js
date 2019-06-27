"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Page {
    constructor(...args) { }
    initialize() {
        this.constructor.initializeFns.forEach((fn) => { fn.call(this); });
    }
    addEventListeners() {
        this.constructor.addEventListenersFns.forEach((fn) => { fn.call(this); });
    }
    static addMixins(...mixins) {
        mixins.forEach((mixin) => {
            // Don't do anything with methods that are already implemented on the Page subclass.
            Object.getOwnPropertyNames(mixin.prototype)
                .filter(name => !Object.getOwnPropertyDescriptor(this.prototype, name))
                .forEach((name) => {
                const descriptor = Object.getOwnPropertyDescriptor(mixin.prototype, name);
                if (!descriptor) {
                    return;
                }
                if (name === 'initialize') {
                    this.initializeFns.push(descriptor.value);
                }
                else if (name === 'addEventListeners') {
                    this.addEventListenersFns.push(descriptor.value);
                }
                else {
                    Object.defineProperty(this.prototype, name, descriptor);
                }
            });
        });
    }
}
Page.addEventListenersFns = [];
Page.initializeFns = [];
exports.default = Page;
