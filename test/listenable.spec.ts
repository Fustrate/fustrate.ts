import Listenable from '../src/js/listenable';

var assert = require('assert');

class Thing extends Listenable {
}

describe('Listenable', () => {
  it('adds an event listener', () => {
    const thing = new Thing();
    var received = false;

    thing.addEventListener('hello', (event) => {
      assert.equal(event.detail, 'world');

      received = true;
    });

    const event = new CustomEvent('hello', { bubbles: true, cancelable: true, detail: 'world' });

    thing.dispatchEvent(event);

    assert(received);
  });

  it('removes an event listener', () => {
    const thing = new Thing();
    var received = false;

    const callback = () => {
      received = true;
    };

    thing.addEventListener('hello', callback);
    thing.removeEventListener('hello', callback);

    const event = new CustomEvent('hello', { bubbles: true, cancelable: true, detail: 'world' });

    thing.dispatchEvent(event);

    assert(!received);
  });
});
