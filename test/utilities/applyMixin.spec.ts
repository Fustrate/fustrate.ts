import assert from 'assert';
// import { applyMixin } from '../../src/js/utilities';
import Page from '../../src/js/page';
import Mixin from '../../src/js/mixin';

class Eventable extends Mixin {
  public static useComparisonModal: boolean = false;

  public addEvent(type: string, note: string): string {
    return `${type}: ${note}`;
  }

  // public initialize(): void {
  //   this.useComparisonModal = true;
  // }
}

class BasicPage extends Page implements Eventable {
  // Eventable
  public addEvent(type: string, note: string): string;
}

function applyMixins(derivedCtor: typeof Page, baseCtors: (typeof Mixin)[]) {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      if (name === 'initialize') {
        const oldInitialize = baseCtor.prototype.initialize;

        baseCtor.prototype.initialize = () => {
          oldInitialize.call(this);
          Object.getOwnPropertyDescriptor(baseCtor.prototype, name).value.call(this);
        };
      } else if (name === 'addEventListeners') {
        const oldAddEventListeners = baseCtor.prototype.addEventListeners;

        baseCtor.prototype.addEventListeners = () => {
          oldAddEventListeners.call(this);
          Object.getOwnPropertyDescriptor(baseCtor.prototype, name).value.call(this);
        };
      } else {
        Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
      }
    });
  });
}

applyMixins(BasicPage, [Eventable]);

describe('applyMixin', () => {
  it('applies a basic mixin', () => {
    const page = new BasicPage();

    assert.strictEqual(page.addEvent('Testing', '123'), 'Testing: 123');
  });
});
