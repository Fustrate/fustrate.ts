import assert = require("assert");
import utilities = require("../utilities");

describe("animate", () => {
  // TODO
});

describe("applyMixin", () => {
  // TODO
});

describe("debounce", () => {
  // TODO
});

describe("elementFromString", () => {
  it("creates a bare element", () => {
    assert(utilities.elementFromString("<input>") instanceof HTMLInputElement);
  });
});

describe("escapeHTML", () => {
  // TODO
});

describe("hms", () => {
  it("formats zero properly", () => {
    assert.strictEqual(utilities.hms(0), "0:00:00");
    assert.strictEqual(utilities.hms(0, "-"), "-");
  });

  it("formats positive numbers", () => {
    assert.strictEqual(utilities.hms(1), "0:00:01");
    assert.strictEqual(utilities.hms(61), "0:01:01");
    assert.strictEqual(utilities.hms(5025), "1:23:45");
    assert.strictEqual(utilities.hms(86400), "24:00:00");
  });

  it("formats negative numbers", () => {
    assert.strictEqual(utilities.hms(-1), "-0:00:01");
    assert.strictEqual(utilities.hms(-61), "-0:01:01");
    assert.strictEqual(utilities.hms(-5025), "-1:23:45");
    assert.strictEqual(utilities.hms(-86400), "-24:00:00");
  });
});

describe("icon", () => {
  // TODO
});

describe("label", () => {
  // TODO
});

describe("multilineEscapeHTML", () => {
  // TODO
});

describe("linkTo", () => {
  // TODO
});

describe("redirectTo", () => {
  // TODO
});

describe("triggerEvent", () => {
  // TODO
});

describe("isVisible", () => {
  // TODO
});

describe("toggle", () => {
  // TODO
});

describe("show", () => {
  // TODO
});

describe("hide", () => {
  // TODO
});

describe("toHumanDate", () => {
  // TODO
});
