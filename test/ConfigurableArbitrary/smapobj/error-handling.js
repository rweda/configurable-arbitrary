const test = require("ava");
const jsc = require("jsverify");
const ConfigurableArbitrary = require("ConfigurableArbitrary");

test("shrink throws if not given the 'smap'ed object", t => {
  const origin = jsc.record({ foo: jsc.string });
  const smapped = ConfigurableArbitrary.smapobj(origin, obj => obj);
  const err = t.throws(() => smapped.shrink({ foo: "asdf" }));
  t.not(err.message.indexOf("Reverse 'smap' must be given"), -1);
});
