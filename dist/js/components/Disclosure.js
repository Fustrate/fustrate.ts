"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = __importDefault(require("../Component"));
const event_1 = require("../rails/utils/event");
const utilities_1 = require("../utilities");
class Disclosure extends Component_1.default {
    static initialize() {
        event_1.delegate(document.body, '.disclosure-title', 'click', this.toggleDisclosure);
    }
    static toggleDisclosure(event) {
        const disclosure = event.target.closest('.disclosure');
        if (!disclosure) {
            return false;
        }
        const isOpen = disclosure.classList.contains('open');
        disclosure.classList.toggle('open');
        utilities_1.triggerEvent(disclosure, `${(isOpen ? 'closed' : 'opened')}.disclosure`);
        return false;
    }
}
exports.default = Disclosure;
