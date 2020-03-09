"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
// A simple polyfill for objects that aren't DOM nodes to receive events.
class Listenable {
    constructor() {
        this.listeners = {};
    }
    addEventListener(type, listener) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(listener);
    }
    removeEventListener(type, listener) {
        lodash_1.pull(this.listeners[type], listener);
    }
    dispatchEvent(event) {
        if (!(event.type && this.listeners[event.type])) {
            return true;
        }
        this.listeners[event.type].forEach((listener) => {
            listener.apply(this, [event]);
        });
        return true;
    }
}
exports.default = Listenable;
