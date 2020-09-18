"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSentence = void 0;
// eslint-disable-next-line import/prefer-default-export
function toSentence(arr) {
    switch (arr.length) {
        case 0:
            return '';
        case 1:
            return String(arr[0]);
        case 2:
            return `${arr[0]} and ${arr[1]}`;
        default:
            return `${arr.slice(0, -1).join(', ')}, and ${arr[arr.length - 1]}`;
    }
}
exports.toSentence = toSentence;
