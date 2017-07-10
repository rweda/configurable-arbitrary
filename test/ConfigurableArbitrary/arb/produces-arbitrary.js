const test = require("ava");
const ConfigurableArbitrary = require("ConfigurableArbitrary");
const jsc = require("jsverify");

test("produces an Arbitrary without contents by default", t => {
  t.true(ConfigurableArbitrary.isArbitrary(ConfigurableArbitrary.arb()));
});

test("produces an Arbitrary with the defined contents", t => {
  t.plan(2);
  const arb = ConfigurableArbitrary.arb({ str: jsc.nestring });
  const obj = arb.generator(50);
  t.is(typeof obj.str, "string");
  t.true(obj.str.length > 0);
});
