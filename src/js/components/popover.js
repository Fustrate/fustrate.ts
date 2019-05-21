import $ from 'jquery';

import Component from '../component';
import { delegate } from '../rails/utils/event';
import { get } from '../ajax';

const cache = {};

export default class Popover extends Component {
  static initialize() {
    this.container = document.body;

    delegate(document.body, '[data-popover-url]', 'click', this.togglePopover);

    document.body.addEventListener('click', this.hidePopover);
  }

  static togglePopover(event) {
    const path = event.target.dataset.popoverUrl;
    // Hide if the url is the same, hide and show a new one if it's different
    const createNew = (!this.popover) || (this.popover.dataset.popoverUrl !== path);

    this.hidePopover(event);

    if (createNew) {
      this.createPopover(event);
    }

    return false;
  }

  static createPopover(event) {
    const path = event.target.dataset.popoverUrl;

    this.popover = document.createElement('div');
    this.popover.classList.add('popover');
    this.popover.dataset.popoverUrl = path;

    document.body.appendChild(this.popover);

    if (cache[path]) {
      this.setContent(cache[path], event);
      $(this.popover).fadeIn(100);
    } else {
      get(path, { responseType: 'text' }).then((html) => {
        cache[path] = html;
        this.setContent(html, event);
      });
    }
  }

  static setContent(html, event) {
    this.popover.innerHTML = html;

    const rect = event.target.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();

    const windowHeight = document.body.offsetHeight;
    const offsetTop = rect.top + document.body.scrollTop;
    const height = event.target.offsetHeight;
    const distanceFromTop = offsetTop - document.body.scrollTop;
    const distanceFromBottom = windowHeight + document.body.scrollTop - offsetTop - height;

    this.popover.style.left = containerRect.left + document.body.scrollLeft + 20;
    this.popover.style.right = document.body.offsetWidth - rect.left - document.body.scrollLeft
      + 10;
    this.popover.style.overflow = 'scroll';

    if (distanceFromTop < distanceFromBottom) {
      this.popover.style.top = offsetTop - Math.min(distanceFromTop, 0) + 10;
      this.popover.style.maxHeight = distanceFromBottom + height - 20;
    } else {
      this.popover.style.bottom = windowHeight - event.target.offsetTop - height
        - Math.min(distanceFromBottom, 0) - 40;
      this.popover.style.maxHeight = distanceFromTop - 10;
    }
  }

  static hidePopover(event) {
    // If there is no popover, or we're inside a popover, ignore this event.
    if (!this.popover || event.target.closest('.popover')) {
      return;
    }

    this.popover.style.display = 'none';
    this.popover.remove();

    this.popover = undefined;
  }
}
