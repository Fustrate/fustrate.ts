import $ from 'jquery';

import Component from '../component';

class Dropdown extends Component {
  static initialize() {
    $(document.body).on('click.dropdowns', '.has-dropdown', this.open);
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
      top = button.offsetTop - dropdown.offsetHeight - 2;
    } else {
      top = button.offsetTop + button.offsetHeight + 2;
    }

    if (button.offsetLeft > (document.body.offsetWidth / 2)) {
      left = 'inherit';
      right = document.body.offsetWidth - button.offsetLeft - button.offsetWidth;
    } else {
      right = 'inherit';
      left = button.offsetLeft;
    }

    this.showDropdown(dropdown, { left, top, right });

    return false;
  }

  static showDropdown(dropdown, css) {
    dropdown.classList.add('visible');

    dropdown.style.display = 'none';
    dropdown.style.left = css.left;
    dropdown.style.top = css.top;
    dropdown.style.right = css.right;

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

export default Dropdown;
