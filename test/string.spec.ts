import assert from 'assert';
import {
  humanize, isBlank, isPresent, parameterize, phoneFormat, pluralize, presence, underscore,
} from '../src/js/string';

describe('#humanize()', () => {
  it('dasherizes a string', () => {
    assert.strictEqual(humanize('helloWorld_test'), 'hello world test');
  });
});

describe('#isBlank()', () => {
  it('dasherizes a string', () => {
    assert(isBlank(''));
    assert(isBlank(' \t\n '));
    assert(isBlank(null));
    assert(isBlank(undefined));

    assert(!isBlank('a'));
    assert(!isBlank(' \ta\n '));
  });
});

describe('#isPresent()', () => {
  it('dasherizes a string', () => {
    assert(!isPresent(''));
    assert(!isPresent(' \t\n '));
    assert(!isPresent(null));
    assert(!isPresent(undefined));

    assert(isPresent('a'));
    assert(isPresent(' \ta\n '));
  });
});

describe('#parameterize()', () => {
  it('parameterizes a string', () => {
    assert.strictEqual(parameterize('helloWorld'), 'hello_world');
    assert.strictEqual(parameterize(',,a'), 'a');
    assert.strictEqual(parameterize('b,,'), 'b');
    assert.strictEqual(parameterize('a,,,b'), 'a-b');
  });
});

describe('#phoneFormat()', () => {
  it('formats a phone number', () => {
    assert.strictEqual(phoneFormat('6618675309'), '(661) 867-5309');
    assert.strictEqual(phoneFormat('8675309'), '867-5309');
    assert.strictEqual(phoneFormat('411'), '411');
    assert.strictEqual(phoneFormat('07734'), '07734');
  });
});

describe('#pluralize()', () => {
  it('pluralizes a string', () => {
    assert.strictEqual(pluralize('library'), 'libraries');
    assert.strictEqual(pluralize('squirrel'), 'squirrels');
    // assert.strictEqual(pluralize("goose"), "geese");
    // assert.strictEqual(pluralize("ox"), "oxen");
  });
});

describe('#presence()', () => {
  it('checks the presence of a string', () => {
    assert.strictEqual(presence('hello world'), 'hello world');

    assert.strictEqual(presence(''), undefined);
    assert.strictEqual(presence(null), undefined);
    assert.strictEqual(presence(undefined), undefined);
  });
});

describe('#underscore()', () => {
  it('underscores a string', () => {
    assert.strictEqual(underscore('Subreddit::Sidebar'), 'subreddit/sidebar');
    assert.strictEqual(underscore('helloWorld'), 'hello_world');
  });
});
