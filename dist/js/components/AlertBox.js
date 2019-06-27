"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// jQuery: fadeOut
const jquery_1 = __importDefault(require("jquery"));
const Component_1 = __importDefault(require("../Component"));
const event_1 = require("../rails/utils/event");
const fadeSpeed = 300;
class AlertBox extends Component_1.default {
    static initialize() {
        event_1.delegate(document.body, '.alert-box .close', 'click', this.closeAlertBox);
    }
    static closeAlertBox(event) {
        const alertBox = event.target.closest('.alert-box');
        jquery_1.default(alertBox).fadeOut(fadeSpeed, alertBox.remove);
        return false;
    }
}
exports.default = AlertBox;
