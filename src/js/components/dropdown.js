import $ from 'jquery';

import Component from '../component';

export default class Dropdown extends Component {
  static initialize() {
    $(document.body).on('click.dropdowns', '.has-dropdown', this.open.bind(this));
  }

  static open(event) {
    let left;
    let right;
    let top;

    // Hide any visible dropdowns before showing this one
    this.hide();

    const button = event.currentTarget;
    const dropdown = button.nextElementSibling;

    this.locked = true;

    if (button.offsetTop > (document.body.offsetHeight / 2)) {
      top = `${button.offsetTop - dropdown.offsetHeight - 2}px`;
    } else {
      top = `${button.offsetTop + button.offsetHeight + 2}px`;
    }

    if (button.offsetLeft > (document.body.offsetWidth / 2)) {
      left = 'inherit';
      right = `${document.body.offsetWidth - button.offsetLeft - button.offsetWidth}px`;
    } else {
      right = 'inherit';
      left = `${button.offsetLeft}px`;
    }

    this.showDropdown(dropdown, { left, top, right });

    return false;
  }

  static showDropdown(dropdown, { left, top, right }) {
    dropdown.classList.add('visible');

    dropdown.style.display = 'none';
    dropdown.style.left = left;
    dropdown.style.top = top;
    dropdown.style.right = right;

    $(dropdown).fadeIn(200, () => {
      this.locked = false;
      $(document.body).one('click', this.hide);
    });
  }

  static hide() {
    if (this.locked) {
      return;
    }

    const visibleDropdown = document.querySelector('.dropdown.visible');

    if (visibleDropdown) {
      visibleDropdown.classList.remove('visible');
    }

    $(visibleDropdown).fadeOut(200);
  }
}
