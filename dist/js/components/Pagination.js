"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = __importDefault(require("../Component"));
const utilities_1 = require("../utilities");
const settings = {
    nextText: 'Next →',
    previousText: '← Previous',
};
// Just add 'page='
const getPreppedPaginationURL = () => {
    const url = window.location.search.replace(/[?&]page=\d+/, '');
    if (url[0] === '?') {
        return `${window.location.pathname}${url}&`;
    }
    if (url[0] === '&') {
        return `${window.location.pathname}?${url.slice(1, url.length)}&`;
    }
    return `${window.location.pathname}?`;
};
class Pagination extends Component_1.default {
    static getCurrentPage() {
        const matchData = window.location.search.match(/[?&]page=(\d+)/);
        return matchData ? parseInt(matchData[0], 10) : 1;
    }
    constructor(info) {
        super();
        this.currentPage = info.currentPage;
        this.totalPages = info.totalPages;
        this.totalEntries = info.totalEntries;
        this.perPage = info.perPage;
        this.base = getPreppedPaginationURL();
    }
    generate() {
        const ul = document.createElement('ul');
        ul.classList.add('pagination');
        if (this.totalPages === 1) {
            return ul;
        }
        ul.appendChild(this.previousLink());
        this.windowedPageNumbers().forEach((page) => {
            const li = document.createElement('li');
            if (typeof page === 'string') {
                li.classList.add('unavailable');
                li.innerHTML = '<span class=\'gap\'>…</span>';
            }
            else if (page === this.currentPage) {
                li.classList.add('current');
                li.innerHTML = utilities_1.linkTo(String(page), '#');
            }
            else {
                li.innerHTML = utilities_1.linkTo(String(page), `${this.base}page=${page}`);
            }
            ul.appendChild(li);
        });
        ul.appendChild(this.nextLink());
        return ul;
    }
    previousLink() {
        const li = document.createElement('li');
        li.classList.add('previous_page');
        if (this.currentPage === 1) {
            li.classList.add('unavailable');
            li.innerHTML = `<a href='#'>${settings.previousText}</a>`;
        }
        else {
            li.innerHTML = utilities_1.linkTo(settings.previousText, `${this.base}page=${this.currentPage - 1}`, { rel: 'prev' });
        }
        return li;
    }
    nextLink() {
        const li = document.createElement('li');
        li.classList.add('next_page');
        if (this.currentPage === this.totalPages) {
            li.classList.add('unavailable');
            li.innerHTML = `<a href='#'>${settings.nextText}</a>`;
        }
        else {
            li.innerHTML = utilities_1.linkTo(settings.nextText, `${this.base}page=${this.currentPage + 1}`, { rel: 'next' });
        }
        return li;
    }
    windowedPageNumbers() {
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
        }
        else {
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
        }
        else if (pages[pages.length - 1] + 1 <= this.totalPages) {
            for (let i = pages[pages.length - 1] + 1; i <= this.totalPages; i += 1) {
                pages.push(i);
            }
        }
        return pages;
    }
}
exports.default = Pagination;
