import { deepExtend, isPlainObject } from "../object";
import BasicObject from "../src/js/basic_object";

import assert = require("assert");

describe("#deepExtend()", () => {
  // TODO
});

describe("#isPlainObject()", () => {
  it("null is not a plain object", () => {
    assert(!isPlainObject(null));
  });

  it("an array is not a plain object", () => {
    assert(!isPlainObject([]));
    assert(!isPlainObject([1, 2, 3]));
  });

  it("undefined is not a plain object", () => {
    assert(!isPlainObject(undefined));
  });

  it("{} is a plain object", () => {
    assert(isPlainObject({}));
    assert(isPlainObject({ abc: 123, def: 456 }));
  });

  it("new Object() is a plain object", () => {
    assert(isPlainObject(new Object()));
  });

  it("BasicObject is not a plain object", () => {
    class Thing extends BasicObject {
    }

    assert(!isPlainObject(new Thing(false)));
  });
});
