"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ujs_1 = require("@rails/ujs");
const Component_1 = __importDefault(require("../Component"));
class Disclosure extends Component_1.default {
    static initialize() {
        ujs_1.delegate(document.body, '.disclosure-title', 'click', this.toggleDisclosure);
    }
    static toggleDisclosure(event) {
        var _a;
        const disclosure = (_a = event.target) === null || _a === void 0 ? void 0 : _a.closest('.disclosure');
        if (!disclosure) {
            return false;
        }
        const isOpen = disclosure.classList.contains('open');
        disclosure.classList.toggle('open');
        ujs_1.fire(disclosure, `${(isOpen ? 'closed' : 'opened')}.disclosure`);
        return false;
    }
}
exports.default = Disclosure;
