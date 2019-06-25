import assert from 'assert';
import {
  elementFromString, hms,
  // animate, applyMixin, debounce, escapeHTML, icon, label, multilineEscapeHTML, linkTo, redirectTo, triggerEvent,
  // isVisible, toggle, show, hide, toHumanDate,
} from '../utilities';

describe('animate', () => {
  // TODO
});

describe('applyMixin', () => {
  // TODO
});

describe('debounce', () => {
  // TODO
});

describe('elementFromString', () => {
  it('creates a bare element', () => {
    assert(elementFromString('<input>') instanceof HTMLInputElement);
  });

  it('creates an element with attributes', () => {
    const element = elementFromString('<input type="datetime-local" class="date">');

    assert(element instanceof HTMLInputElement);
    assert.strictEqual(element.type, 'datetime-local');
    assert(element.classList.contains('date'));
  });

  it('creates an element with children', () => {
    const element = elementFromString('<tr><td></td><td><input></td><td></td></tr>');

    assert(element instanceof HTMLTableRowElement);
    assert.strictEqual(element.children.length, 3);
    assert(element.querySelector('input') instanceof HTMLInputElement);
  });
});

describe('escapeHTML', () => {
  // TODO
});

describe('hms', () => {
  it('formats zero properly', () => {
    assert.strictEqual(hms(0), '0:00:00');
    assert.strictEqual(hms(0, '-'), '-');
  });

  it('formats positive numbers', () => {
    assert.strictEqual(hms(1), '0:00:01');
    assert.strictEqual(hms(61), '0:01:01');
    assert.strictEqual(hms(5025), '1:23:45');
    assert.strictEqual(hms(86400), '24:00:00');
  });

  it('formats negative numbers', () => {
    assert.strictEqual(hms(-1), '-0:00:01');
    assert.strictEqual(hms(-61), '-0:01:01');
    assert.strictEqual(hms(-5025), '-1:23:45');
    assert.strictEqual(hms(-86400), '-24:00:00');
  });
});

describe('icon', () => {
  // TODO
});

describe('label', () => {
  // TODO
});

describe('multilineEscapeHTML', () => {
  // TODO
});

describe('linkTo', () => {
  // TODO
});

describe('redirectTo', () => {
  // TODO
});

describe('triggerEvent', () => {
  // TODO
});

describe('isVisible', () => {
  // TODO
});

describe('toggle', () => {
  // TODO
});

describe('show', () => {
  // TODO
});

describe('hide', () => {
  // TODO
});

describe('toHumanDate', () => {
  // TODO
});
