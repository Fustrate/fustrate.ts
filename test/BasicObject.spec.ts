import assert from 'assert';
import BasicObject from '../src/js/BasicObject';

class Record extends BasicObject {
}

describe('::buildList', () => {
  it('builds an array of objects', () => {
    const records = Record.buildList<Record>([{ id: 5 }, { id: 10 }, { id: 15 }]);

    assert.strictEqual(records.length, 3);
    assert(records[0] instanceof Record);
    assert.strictEqual(records[1].id, 10);
  });

  it('builds an array of objects with extra attributes', () => {
    const parent = new Record();
    const records = Record.buildList<Record>([{ id: 5 }], { parent });

    assert(records[0].parent === parent);
  });
});

describe('#extractFromData', () => {
});
