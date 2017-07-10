const test = require("ava");
const jsc = require("jsverify");
const ConfigurableArbitrary = require("ConfigurableArbitrary");

test("produces an Arbitrary", t => {
  const out = ConfigurableArbitrary.build();
  t.true(ConfigurableArbitrary.isArbitrary(out));
});

test("uses options to configure Arbitrary", t => {
  const arb = ConfigurableArbitrary.build({ str: jsc.nestring });
  const gen = arb.generator(50);
  t.is(typeof gen.str, "string");
});
