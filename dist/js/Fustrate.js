"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
require('./polyfills');
class Fustrate {
    static start(Klass) {
        if (Klass) {
            this.instance = new Klass();
        }
        document.addEventListener('DOMContentLoaded', () => {
            var _a;
            this.initialize();
            (_a = this.instance) === null || _a === void 0 ? void 0 : _a.initialize();
        });
    }
    static initialize() {
        this.wrapTables();
        this.updateMomentLocales();
    }
    static wrapTables() {
        document.querySelectorAll('table').forEach((table) => {
            var _a;
            const wrapper = document.createElement('div');
            wrapper.classList.add('responsive-table');
            (_a = table.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        });
    }
    static updateMomentLocales() {
        moment_1.default.updateLocale('en', {
            calendar: {
                lastDay: '[Yesterday at] LT',
                lastWeek: 'dddd [at] LT',
                nextDay: '[Tomorrow at] LT',
                nextWeek: '[next] dddd [at] LT',
                sameDay: '[Today at] LT',
                sameElse: 'L',
            },
            longDateFormat: {
                L: 'M/D/YY',
                LL: 'MMMM D, YYYY',
                LLL: 'MMMM D, YYYY h:mm A',
                LLLL: 'dddd, MMMM D, YYYY h:mm A',
                LT: 'h:mm A',
                LTS: 'h:mm:ss A',
            },
        });
    }
}
exports.default = Fustrate;
