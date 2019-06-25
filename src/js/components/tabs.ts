import Component from '../component';
import { delegate, stopEverything } from '../rails/utils/event';

export default class Tabs extends Component {
  public static initialize() {
    Array.from(document.querySelectorAll('ul.tabs')).forEach(ul => new Tabs(ul));
  }

  constructor(tabs) {
    super();

    this.tabs = tabs;

    delegate(this.tabs, 'li > a', 'click', (event) => {
      stopEverything(event);

      this.activateTab(event.target, true);

      return false;
    });

    if (window.location.hash) {
      this.tabs.querySelector(`li > a[href='${window.location.hash}']`);

      this.activateTab(this.tabs.querySelector(`li > a[href='${window.location.hash}']`), false);
    } else {
      const tabWithActiveClass = this.tabs.querySelector('li > a.active');

      if (tabWithActiveClass) {
        this.activateTab(tabWithActiveClass, false);
      } else {
        // Open the first tab by default
        this.activateTab(this.tabs.querySelector('li > a'), false);
      }
    }
  }

  public activateTab(tab, changeHash) {
    if (!tab) {
      return;
    }

    const link = tab.closest('a');

    Array.from(this.tabs.querySelectorAll('.active')).forEach((sibling) => {
      sibling.classList.remove('active');
    });

    link.classList.add('active');
    const hash = link.getAttribute('href').split('#')[1];

    if (changeHash) {
      window.location.hash = hash;
    }

    const tabContent = document.getElementById(hash);

    tabContent.classList.add('active');

    Array.from(tabContent.parentElement.children).forEach((sibling) => {
      if (sibling !== tabContent) {
        sibling.classList.remove('active');
      }
    });
  }
}
