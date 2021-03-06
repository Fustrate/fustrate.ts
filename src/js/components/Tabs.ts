import { delegate, stopEverything } from '@rails/ujs';

import Component from '../Component';

export default class Tabs extends Component {
  private tabs: HTMLUListElement;

  public static initialize(): void {
    Array.from(document.querySelectorAll<HTMLUListElement>('ul.tabs')).forEach((ul: HTMLUListElement) => new Tabs(ul));
  }

  constructor(tabs: HTMLUListElement) {
    super();

    this.tabs = tabs;

    delegate(this.tabs, 'li > a', 'click', (event) => {
      stopEverything(event);

      this.activateTab(event.target as HTMLAnchorElement, true);

      return false;
    });

    if (window.location.hash) {
      this.activateTab(this.tabs.querySelector<HTMLAnchorElement>(`li > a[href='${window.location.hash}']`), false);
    } else {
      const tabWithActiveClass = this.tabs.querySelector<HTMLAnchorElement>('li > a.active');

      if (tabWithActiveClass) {
        this.activateTab(tabWithActiveClass, false);
      } else {
        // Open the first tab by default
        this.activateTab(this.tabs.querySelector<HTMLAnchorElement>('li > a'), false);
      }
    }
  }

  public activateTab(tab: HTMLElement | null, changeHash = false): void {
    if (!tab) {
      return;
    }

    const link = tab.closest('a');

    if (!link) {
      return;
    }

    Array.from(this.tabs.querySelectorAll<HTMLElement>('.active')).forEach((sibling) => {
      sibling.classList.remove('active');
    });

    link.classList.add('active');
    const href = link.getAttribute('href');

    if (!href) {
      return;
    }

    const hash = href.split('#')[1];

    if (changeHash) {
      window.location.hash = hash;
    }

    const tabContent = document.getElementById(hash);

    if (tabContent && tabContent.parentElement) {
      tabContent.classList.add('active');

      tabContent.parentElement.querySelectorAll('> *').forEach((sibling: Element) => {
        sibling.classList.toggle('active', sibling === tabContent);
      });
    }
  }
}
