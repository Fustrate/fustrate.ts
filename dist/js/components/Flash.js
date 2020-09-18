"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorFlash = exports.SuccessFlash = exports.InfoFlash = exports.Flash = void 0;
const Component_1 = __importDefault(require("../Component"));
const utilities_1 = require("../utilities");
const createFlashBar = (message, type, icon) => {
    const bar = document.createElement('div');
    bar.classList.add('flash', type || 'info');
    bar.innerHTML = icon ? `${utilities_1.icon(icon)} ${message}` : message;
    const flashes = document.getElementById('flashes') || document.body;
    flashes.insertBefore(bar, flashes.firstChild);
    return bar;
};
class Flash extends Component_1.default {
    static show(message, type, icon) {
        return new this(message, type, icon);
    }
    constructor(message, type, icon) {
        super();
        const bar = createFlashBar(message, type, icon);
        utilities_1.animate(bar, 'fadeIn', () => {
            utilities_1.animate(bar, 'fadeOut', () => {
                bar.remove();
            }, 4, 'slow');
        }, undefined, 'faster');
    }
}
exports.Flash = Flash;
class InfoFlash extends Flash {
    constructor(message, icon) {
        super(message, 'info', icon);
    }
}
exports.InfoFlash = InfoFlash;
class SuccessFlash extends Flash {
    constructor(message, icon) {
        super(message, 'success', icon);
    }
}
exports.SuccessFlash = SuccessFlash;
class ErrorFlash extends Flash {
    constructor(message, icon) {
        super(message, 'error', icon);
    }
}
exports.ErrorFlash = ErrorFlash;
