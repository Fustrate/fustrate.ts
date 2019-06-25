import Component from '../component';
import { linkTo } from '../utilities';

const settings = {
  nextText: 'Next →',
  previousText: '← Previous',
};

export default class Pagination extends Component {
  protected static getCurrentPage(): number {
    const matchData = window.location.search.match(/[?&]page=(\d+)/);

    return matchData ? parseInt(matchData[0], 10) : 1;
  }

  // Just add 'page='
  protected static getPreppedPaginationURL(): string {
    const url = window.location.search.replace(/[?&]page=\d+/, '');

    if (url[0] === '?') {
      return `${window.location.pathname}${url}&`;
    }

    if (url[0] === '&') {
      return `${window.location.pathname}?${url.slice(1, url.length)}&`;
    }

    return `${window.location.pathname}?`;
  }

  public currentPage: number;

  public totalPages: number;

  public totalEntries: number;

  public perPage: number;

  constructor({
    currentPage, totalPages, totalEntries, perPage,
  }) {
    super();

    this.currentPage = currentPage;
    this.totalPages = totalPages;
    this.totalEntries = totalEntries;
    this.perPage = perPage;

    this.base = this.constructor.getPreppedPaginationURL();
  }

  public generate(): HTMLUListElement {
    const ul = document.createElement('ul');
    ul.classList.add('pagination');

    if (this.totalPages === 1) {
      return ul;
    }

    ul.appendChild(this.previousLink());

    this.windowedPageNumbers().forEach((page) => {
      const li = document.createElement('li');

      if (page === this.currentPage) {
        li.classList.add('current');
        li.innerHTML = linkTo(page, '#');
      } else if (page === 'gap') {
        li.classList.add('unavailable');
        li.innerHTML = '<span class=\'gap\'>…</span>';
      } else {
        li.innerHTML = this.link(page, page);
      }

      ul.appendChild(li);
    });

    ul.appendChild(this.nextLink());

    return ul;
  }

  protected link(text: string, page: number, ...args): string {
    return linkTo(text, `${this.base}page=${page}`, ...args);
  }

  protected previousLink(): HTMLLIElement {
    const li = document.createElement('li');
    li.classList.add('previous_page');

    if (this.currentPage === 1) {
      li.classList.add('unavailable');
      li.innerHTML = `<a href='#'>${settings.previousText}</a>`;
    } else {
      li.innerHTML = this.link(settings.previousText, this.currentPage - 1, { rel: 'prev' });
    }

    return li;
  }

  protected nextLink(): HTMLLIElement {
    const li = document.createElement('li');
    li.classList.add('next_page');

    if (this.currentPage === this.totalPages) {
      li.classList.add('unavailable');
      li.innerHTML = `<a href='#'>${settings.nextText}</a>`;
    } else {
      li.innerHTML = this.link(settings.nextText, this.currentPage + 1, { rel: 'next' });
    }

    return li;
  }

  protected windowedPageNumbers(): Array<string | number> {
    let pages = [];

    let windowFrom = this.currentPage - 4;
    let windowTo = this.currentPage + 4;

    if (windowTo > this.totalPages) {
      windowFrom -= windowTo - this.totalPages;
      windowTo = this.totalPages;
    }

    if (windowFrom < 1) {
      windowTo += 1 - windowFrom;
      windowFrom = 1;

      if (windowTo > this.totalPages) {
        windowTo = this.totalPages;
      }
    }

    if (windowFrom > 4) {
      pages = [1, 2, 'gap'];
    } else {
      for (let i = 1; i < windowFrom; i += 1) {
        pages.push(i);
      }
    }

    for (let i = windowFrom; i < windowTo; i += 1) {
      pages.push(i);
    }

    if (this.totalPages - 3 > pages[pages.length - 1]) {
      pages.push('gap');
      pages.push(this.totalPages - 1);
      pages.push(this.totalPages);
    } else if (pages[pages.length - 1] + 1 <= this.totalPages) {
      for (let i = pages[pages.length - 1] + 1; i <= this.totalPages; i += 1) {
        pages.push(i);
      }
    }

    return pages;
  }
}
