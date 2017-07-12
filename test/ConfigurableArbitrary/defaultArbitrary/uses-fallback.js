const test = require("ava");
const jsc = require("jsverify");
const ConfigurableArbitrary = require("ConfigurableArbitrary");

function withoutArb(t, given, fallback) {
  t.is(ConfigurableArbitrary.defaultArbitrary(given, fallback), fallback);
}

withoutArb.title = (title, given, fallback) =>
  `if 'given' is ${title}`;

test("null", withoutArb, null, jsc.string);
test("string", withoutArb, "testing", jsc.bool);
test("function returning Arbitrary", withoutArb, () => jsc.string, jsc.bool);
test("null, and fallback isn't an Arbitrary (1)", withoutArb, null, 1);
