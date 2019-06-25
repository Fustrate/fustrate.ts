import assert = require("assert");
import strings = require("../string");

describe("#capitalize()", () => {
  it("capitalizes a string", () => {
    assert.strictEqual(strings.capitalize("hello world"), "Hello world");
    assert.strictEqual(strings.capitalize("HELLO WORLD"), "HELLO WORLD");
  });
});

describe("#dasherize()", () => {
  it("dasherizes a string", () => {
    assert.strictEqual(strings.dasherize("hello_world"), "hello-world");
  });
});

describe("#humanize()", () => {
  it("dasherizes a string", () => {
    assert.strictEqual(strings.humanize("helloWorld_test"), "hello world test");
  });
});

describe("#isBlank()", () => {
  it("dasherizes a string", () => {
    assert(strings.isBlank(""));
    assert(strings.isBlank(" \t\n "));
    assert(strings.isBlank(null));
    assert(strings.isBlank(undefined));

    assert(!strings.isBlank("a"));
    assert(!strings.isBlank(" \ta\n "));
  });
});

describe("#isPresent()", () => {
  it("dasherizes a string", () => {
    assert(!strings.isPresent(""));
    assert(!strings.isPresent(" \t\n "));
    assert(!strings.isPresent(null));
    assert(!strings.isPresent(undefined));

    assert(strings.isPresent("a"));
    assert(strings.isPresent(" \ta\n "));
  });
});

describe("#parameterize()", () => {
  it("parameterizes a string", () => {
    assert.strictEqual(strings.parameterize("helloWorld"), "hello_world");
    assert.strictEqual(strings.parameterize(",,a"), "a");
    assert.strictEqual(strings.parameterize("b,,"), "b");
    assert.strictEqual(strings.parameterize("a,,,b"), "a-b");
  });
});

describe("#phoneFormat()", () => {
  it("formats a phone number", () => {
    assert.strictEqual(strings.phoneFormat("6618675309"), "(661) 867-5309");
    assert.strictEqual(strings.phoneFormat("8675309"), "867-5309");
    assert.strictEqual(strings.phoneFormat("411"), "411");
    assert.strictEqual(strings.phoneFormat("07734"), "07734");
  });
});

describe("#pluralize()", () => {
  it("pluralizes a string", () => {
    assert.strictEqual(strings.pluralize("library"), "libraries");
    assert.strictEqual(strings.pluralize("squirrel"), "squirrels");
    // assert.strictEqual(strings.pluralize("goose"), "geese");
    // assert.strictEqual(strings.pluralize("ox"), "oxen");
  });
});

describe("#presence()", () => {
  it("checks the presence of a string", () => {
    assert.strictEqual(strings.presence("hello world"), "hello world");

    assert.strictEqual(strings.presence(""), undefined);
    assert.strictEqual(strings.presence(null), undefined);
    assert.strictEqual(strings.presence(undefined), undefined);
  });
});

describe("#strip()", () => {
  it("strips a string", () => {
    assert.strictEqual(strings.strip("hello world"), "hello world");
    assert.strictEqual(strings.strip("   hello world"), "hello world");
    assert.strictEqual(strings.strip("\thello world "), "hello world");
    assert.strictEqual(strings.strip("hello world\t"), "hello world");
    assert.strictEqual(strings.strip("\nhello\nworld"), "hello\nworld");
  });
});

describe("#titleize()", () => {
  it("titleizes a string", () => {
    assert.strictEqual(strings.titleize("hello world"), "Hello World");
    assert.strictEqual(strings.titleize("hello_world"), "Hello World");
    // assert.strictEqual(strings.titleize("it's a surprise"), "It's A Surprise");
  });
});

describe("#underscore()", () => {
  it("underscores a string", () => {
    assert.strictEqual(strings.underscore("Subreddit::Sidebar"), "subreddit/sidebar");
    assert.strictEqual(strings.underscore("helloWorld"), "hello_world");
  });
});
