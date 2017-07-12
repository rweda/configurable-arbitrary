const test = require("ava");
const jsc = require("jsverify");
const ConfigurableArbitrary = require("ConfigurableArbitrary");

test("causes forward 'smap' to throw an error", t => {
  let origin = jsc.record({ foo: jsc.string });
  let first = ConfigurableArbitrary.smapobj(origin, obj => obj);
  let second = ConfigurableArbitrary.smapobj(first, obj => obj);
  t.throws(() => second.generator(50));
});
