"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require('moment');
require('./polyfills');
// const Rails = require('@rails/ujs');
class Fustrate {
    static start(instance) {
        if (instance) {
            this.instance = instance;
        }
        document.addEventListener('DOMContentLoaded', () => {
            this.initialize();
            if (this.instance) {
                this.instance.initialize();
            }
        });
    }
    static initialize() {
        this.wrapTables();
        this.updateMomentLocales();
    }
    static wrapTables() {
        document.querySelectorAll('table').forEach((table) => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('responsive-table');
            if (table.parentNode) {
                table.parentNode.insertBefore(wrapper, table);
            }
            wrapper.appendChild(table);
        });
    }
    static updateMomentLocales() {
        moment.updateLocale('en', {
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
