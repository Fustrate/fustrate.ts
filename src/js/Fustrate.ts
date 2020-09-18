import moment from 'moment';

import type Page from './Page';

require('./polyfills');

export default class Fustrate {
  protected static instance: Page;

  public static start(instance?: Page): void {
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

  protected static initialize(): void {
    this.wrapTables();
    this.updateMomentLocales();
  }

  protected static wrapTables(): void {
    document.querySelectorAll<HTMLTableElement>('table').forEach((table) => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('responsive-table');

      if (table.parentNode) {
        table.parentNode.insertBefore(wrapper, table);
      }

      wrapper.appendChild(table);
    });
  }

  protected static updateMomentLocales(): void {
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
