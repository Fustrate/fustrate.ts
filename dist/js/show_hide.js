"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hide = exports.show = exports.toggle = exports.isVisible = void 0;
// A few select tags that we're most likely to show or hide
const defaultDisplayMap = {
    A: 'inline',
    BUTTON: 'inline',
    DIV: 'block',
    FORM: 'block',
    IMG: 'inline',
    INPUT: 'inline',
    LABEL: 'inline',
    P: 'block',
    PRE: 'block',
    SECTION: 'block',
    SELECT: 'inline',
    SPAN: 'inline',
    TABLE: 'block',
    TEXTAREA: 'inline',
};
function getDefaultDisplay(element) {
    var _a;
    const { nodeName } = element;
    let display = defaultDisplayMap[nodeName];
    if (display) {
        return display;
    }
    const { ownerDocument } = element;
    const temp = ownerDocument.body.appendChild(ownerDocument.createElement(nodeName));
    ({ display } = temp.style);
    (_a = temp.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(temp);
    if (display === 'none') {
        display = 'block';
    }
    defaultDisplayMap[nodeName] = display;
    return display;
}
function toggleElement(element, makeVisible) {
    if (makeVisible == null) {
        makeVisible = element.style.display === 'none';
    }
    element.style.display = makeVisible ? getDefaultDisplay(element) : 'none';
    if (makeVisible) {
        element.classList.remove('js-hide');
    }
}
exports.isVisible = (elem) => !!(elem.offsetWidth
    || elem.offsetHeight
    || elem.getClientRects().length);
exports.toggle = (element, showOrHide) => {
    if (element instanceof NodeList) {
        element.forEach((elem) => {
            toggleElement(elem, showOrHide !== undefined ? showOrHide : !exports.isVisible(elem));
        });
    }
    else {
        toggleElement(element, showOrHide !== undefined ? showOrHide : !exports.isVisible(element));
    }
};
exports.show = (element) => {
    exports.toggle(element, true);
};
exports.hide = (element) => {
    exports.toggle(element, false);
};
