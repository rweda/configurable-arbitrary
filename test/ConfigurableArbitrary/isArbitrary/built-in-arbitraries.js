const test = require("ava");
const jsc = require("jsverify");
jsc.ava = require("ava-verify");
const ConfigurableArbitrary = require("ConfigurableArbitrary");

function passes(t, arb, opts) {
  arb = jsc[arb];
  if(opts) { arb = arb(opts); }
  t.true(ConfigurableArbitrary.isArbitrary(arb));
}

passes.title = (title, arb, opts) => `jsc.${title || arb} returns true`;

test(passes, "string");
test(passes, "number");
test(passes, "nat");
test("constant(1)", passes, "constant", 1);
test(passes, "json");
test("record({ foo: jsc.string })", passes, "record", { foo: jsc.string });
