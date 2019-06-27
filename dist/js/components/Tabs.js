"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = __importDefault(require("../Component"));
const event_1 = require("../rails/utils/event");
class Tabs extends Component_1.default {
    static initialize() {
        Array.from(document.querySelectorAll('ul.tabs')).forEach((ul) => new Tabs(ul));
    }
    constructor(tabs) {
        super();
        this.tabs = tabs;
        event_1.delegate(this.tabs, 'li > a', 'click', (event) => {
            event_1.stopEverything(event);
            this.activateTab(event.target, true);
            return false;
        });
        if (window.location.hash) {
            this.activateTab(this.tabs.querySelector(`li > a[href='${window.location.hash}']`), false);
        }
        else {
            const tabWithActiveClass = this.tabs.querySelector('li > a.active');
            if (tabWithActiveClass) {
                this.activateTab(tabWithActiveClass, false);
            }
            else {
                // Open the first tab by default
                this.activateTab(this.tabs.querySelector('li > a'), false);
            }
        }
    }
    activateTab(tab, changeHash = false) {
        if (!tab) {
            return;
        }
        const link = tab.closest('a');
        if (!link) {
            return;
        }
        Array.from(this.tabs.querySelectorAll('.active')).forEach((sibling) => {
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
            tabContent.parentElement.querySelectorAll('> *').forEach((sibling) => {
                sibling.classList.toggle('active', sibling === tabContent);
            });
        }
    }
}
exports.default = Tabs;
