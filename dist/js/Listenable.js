"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pull_1 = __importDefault(require("lodash/pull"));
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
        pull_1.default(this.listeners[type], listener);
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
