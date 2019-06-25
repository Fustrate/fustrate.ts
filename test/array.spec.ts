import { compact, first, last, remove, toSentence } from '../src/js/array';

var assert = require('assert');

describe('first', () => {
  it('returns the first element', () => {
    assert.equal(first([1, 2, 3]), 1);
    assert.equal(first([]), null);
  });
});
