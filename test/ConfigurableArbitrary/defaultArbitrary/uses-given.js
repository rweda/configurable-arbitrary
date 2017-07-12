const test = require("ava");
const jsc = require("jsverify");
const ConfigurableArbitrary = require("ConfigurableArbitrary");

function withArb(t, arbName, fallback) {
  const arb = jsc[arbName];
  t.is(ConfigurableArbitrary.defaultArbitrary(arb, fallback), arb);
}

withArb.title = (title, arbName, fallback) =>
  `when 'given' is an Arbitrary (jsc.${arbName}) and 'fallback' is ${title}`;

test("arbitrary", withArb, "string", jsc.string);
test("null", withArb, "string", null);
test("string", withArb, "string", "testing");
