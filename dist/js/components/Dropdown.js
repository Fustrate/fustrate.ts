"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const popper_js_1 = __importDefault(require("popper.js"));
const Component_1 = __importDefault(require("../Component"));
const event_1 = require("../rails/utils/event");
class Dropdown extends Component_1.default {
    static initialize() {
        event_1.delegate(document.body, '.has-dropdown', 'click', this.open.bind(this));
    }
    static open(event) {
        // Hide any visible dropdowns before showing this one
        this.hide();
        if (!(event.target instanceof Element) || !event.target.nextElementSibling) {
            return false;
        }
        this.popper = new popper_js_1.default(event.target, event.target.nextElementSibling, {
            modifiers: {
                flip: {
                    behavior: ['bottom', 'top'],
                },
            },
            placement: 'bottom-start',
        });
        document.body.addEventListener('click', this.hide.bind(this));
        return false;
    }
    static hide() {
        if (this.popper) {
            this.popper.destroy();
        }
        document.body.removeEventListener('click', this.hide.bind(this));
    }
}
exports.default = Dropdown;
