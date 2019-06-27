"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compact = (arr, strings = true) => arr
    .filter(element => !(element === undefined || element === null || (strings && element === '')));
exports.first = (arr) => arr[0];
exports.last = (arr) => arr[arr.length - 1];
// eslint-disable-next-line arrow-parens
exports.remove = (arr, object) => {
    const index = arr.indexOf(object);
    if (index !== -1) {
        arr.splice(index, 1);
    }
    return arr;
};
exports.toSentence = (arr) => {
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
};
