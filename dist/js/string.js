"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.underscore = exports.presence = exports.pluralize = exports.phoneFormat = exports.parameterize = exports.isPresent = exports.isBlank = exports.humanize = void 0;
exports.humanize = (str) => (str
    .replace(/[a-z][A-Z]/, (match) => `${match[0]} ${match[1]}`)
    .replace(/_/g, ' ')
    .toLowerCase());
exports.isBlank = (str) => (typeof str === 'string' && str.trim() === '')
    || str == null;
exports.isPresent = (str) => !exports.isBlank(str);
exports.parameterize = (str) => (str
    .replace(/[a-z][A-Z]/, (match) => `${match[0]}_${match[1]}`)
    .replace(/[^a-zA-Z0-9\-_]+/, '-') // Turn unwanted chars into the separator
    .replace(/-{2,}/, '-') // No more than one of the separator in a row
    .replace(/^-|-$/, '') // Remove leading/trailing separator.
    .toLowerCase());
exports.phoneFormat = (str) => {
    if (/^1?\d{10}$/.test(str)) {
        return str.replace(/1?(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
    if (/^\d{7}$/.test(str)) {
        return str.replace(/(\d{3})(\d{4})/, '$1-$2');
    }
    return str;
};
// This is far too simple for most cases, but it works for the few things we need
exports.pluralize = (str) => {
    if (str[str.length - 1] === 'y') {
        return `${str.substr(0, str.length - 1)}ies`;
    }
    return `${str}s`;
};
exports.presence = (str) => (exports.isBlank(str) ? undefined : str);
exports.underscore = (str) => (str
    .replace(/[a-z][A-Z]/, (match) => `${match[0]}_${match[1]}`)
    .replace('::', '/')
    .toLowerCase());
