"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tooltip_js_1 = __importDefault(require("tooltip.js"));
const Component_1 = __importDefault(require("../Component"));
class Tooltip extends Component_1.default {
    static create(reference, options = {}) {
        if (options.container === undefined) {
            options.container = document.body;
        }
        if (!options.placement) {
            options.placement = 'bottom';
        }
        return new tooltip_js_1.default(reference, options);
    }
}
exports.default = Tooltip;
