"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlainObject = (obj) => {
    // Do the inexpensive checks first.
    if (typeof obj !== 'object' || Array.isArray(obj) || obj === null) {
        return false;
    }
    // This is a getter on BasicObject - any sort of basic record shouldn't be iterated
    return !obj.isBasicObject;
};
exports.deepExtend = (...objects) => {
    const out = {};
    objects.filter(obj => obj).forEach((obj) => {
        Object.getOwnPropertyNames(obj).forEach((key) => {
            out[key] = exports.isPlainObject(obj[key]) ? exports.deepExtend(out[key] || {}, obj[key]) : obj[key];
        });
    });
    return out;
};
