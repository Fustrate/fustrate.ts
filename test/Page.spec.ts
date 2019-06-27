import assert from 'assert';
import Page from '../src/js/Page';
import Mixin from '../src/js/Mixin';

class Countable extends Mixin {
  public static useComparisonModal: boolean = false;

  public numbers: number[];

  public addNumber(num: number): void {
    this.numbers.push(num);
  }

  public initialize(): void {
    this.numbers.push(99);
  }
}

class Eventable extends Mixin {
  public static useComparisonModal: boolean = false;

  public events: string[];

  public addEvent(type: string, note: string): void {
    this.events.push(`${type}: ${note}`);
  }

  public initialize(): void {
    this.events.push('hello');
  }
}

class BasicPage extends Page implements Countable, Eventable {
  // Countable
  public numbers: number[] = [];
  public addNumber(num: number): void {
    Countable.prototype.addNumber.call(this, num);
    Countable.prototype.addNumber.call(this, num);
  }

  // Eventable
  public static useComparisonModal: boolean;
  public events: string[] = [];
  public addEvent(type: string, note: string): string;
}

BasicPage.addMixins(Countable, Eventable);

describe('::addMixins', () => {
  it('applies a basic mixin', () => {
    const page = new BasicPage();

    page.addEvent('Testing', '123');

    assert.deepStrictEqual(page.events, ['Testing: 123']);
  });

  it('respects an overridden method', () => {
    const page = new BasicPage();

    page.addNumber(4);

    assert.deepStrictEqual(page.numbers, [4, 4]);
  });

  it('runs all initializers from mixins', () => {
    const page = new BasicPage();

    page.initialize();

    page.addNumber(4);

    assert.deepStrictEqual(page.numbers, [99, 4, 4]);
    assert.deepStrictEqual(page.events, ['hello']);
  });
});
