"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountingFormat = (num) => (num < 0
    ? `($${(num * -1).toFixed(2)})`
    : `$${num.toFixed(2)}`);
exports.truncate = (num, digits = 2) => num.toFixed(digits).replace(/\.?0+$/, '');
exports.bytesToString = (num) => {
    if (num < 1000) {
        return `${num} B`;
    }
    if (num < 1000000) {
        return `${exports.truncate(num / 1000)} kB`;
    }
    if (num < 1000000000) {
        return `${exports.truncate(num / 1000000)} MB`;
    }
    return `${exports.truncate(num / 1000000000)} GB`;
};
exports.ordinalize = (num) => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const remainder = num % 100;
    return num + (suffixes[(remainder - 20) % 10] || suffixes[remainder] || 'th');
};
