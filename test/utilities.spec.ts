// import {
//   animate,
//   applyMixin,
//   debounce,
//   elementFromString,
//   escapeHTML,
//   hms,
//   icon,
//   label,
//   multilineEscapeHTML,
//   linkTo,
//   redirectTo,
//   triggerEvent,
//   isVisible,
//   toggle,
//   show,
//   hide,
//   toHumanDate,
// } from '../utilities';
const utilities = require('../utilities');

var assert = require('assert');

describe('animate', () => {
});

describe('applyMixin', () => {
});

describe('debounce', () => {
});

describe('elementFromString', () => {
  it('creates a bare element', () => {
    assert(utilities.elementFromString('<input>') instanceof HTMLInputElement);
  });
});

describe('escapeHTML', () => {
});

describe('hms', () => {
  it('formats zero properly', () => {
    assert.strictEqual(utilities.hms(0), '0:00:00');
    assert.strictEqual(utilities.hms(0, '-'), '-');
  });

  it('formats positive numbers', () => {
    assert.strictEqual(utilities.hms(1), '0:00:01');
    assert.strictEqual(utilities.hms(61), '0:01:01');
    assert.strictEqual(utilities.hms(5025), '1:23:45');
    assert.strictEqual(utilities.hms(86400), '24:00:00');
  });

  it('formats negative numbers', () => {
    assert.strictEqual(utilities.hms(-1), '-0:00:01');
    assert.strictEqual(utilities.hms(-61), '-0:01:01');
    assert.strictEqual(utilities.hms(-5025), '-1:23:45');
    assert.strictEqual(utilities.hms(-86400), '-24:00:00');
  });
});

describe('icon', () => {
});

describe('label', () => {
});

describe('multilineEscapeHTML', () => {
});

describe('linkTo', () => {
});

describe('redirectTo', () => {
});

describe('triggerEvent', () => {
});

describe('isVisible', () => {
});

describe('toggle', () => {
});

describe('show', () => {
});

describe('hide', () => {
});

describe('toHumanDate', () => {
});

