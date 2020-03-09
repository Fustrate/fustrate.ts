import assert from 'assert';
import { toSentence } from '../src/js/array';

describe('toSentence', () => {
  it('joins words and stuff', () => {
    assert.strictEqual(toSentence([1, 2, 3]), '1, 2, and 3');
    assert.strictEqual(toSentence([1, 2]), '1 and 2');
    assert.strictEqual(toSentence([1]), '1');
    assert.strictEqual(toSentence([]), '');
  });
});
