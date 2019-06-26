import Component from '../component';
import { delegate, stopEverything } from '../rails/utils/event';

export default class Tabs extends Component {
  private tabs: HTMLUListElement;

  public static initialize() {
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

  public activateTab(tab: HTMLElement | null, changeHash: boolean = false) {
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
    const hash = link.getAttribute('href').split('#')[1];

    if (changeHash) {
      window.location.hash = hash;
    }

    const tabContent = document.getElementById(hash);

    if (tabContent) {
      tabContent.classList.add('active');

      Array.from(tabContent.parentElement.children).forEach((sibling: HTMLElement) => {
        if (sibling !== tabContent) {
          sibling.classList.remove('active');
        }
      });
    }
  }
}
