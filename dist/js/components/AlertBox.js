"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ujs_1 = require("@rails/ujs");
const Component_1 = __importDefault(require("../Component"));
const utilities_1 = require("../utilities");
class AlertBox extends Component_1.default {
    static initialize() {
        ujs_1.delegate(document.body, '.alert-box .close', 'click', this.closeAlertBox);
    }
    static closeAlertBox(event) {
        var _a;
        const alertBox = (_a = event.target) === null || _a === void 0 ? void 0 : _a.closest('.alert-box');
        if (!alertBox) {
            return false;
        }
        utilities_1.animate(alertBox, 'fadeOut', () => {
            alertBox.remove();
        }, undefined, 'faster');
        return false;
    }
}
exports.default = AlertBox;
