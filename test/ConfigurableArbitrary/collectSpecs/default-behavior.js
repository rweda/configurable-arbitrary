const test = require("ava");
const ConfigurableArbitrary = require("ConfigurableArbitrary");
const jsc = require("jsverify");

test("produces an empty object if unconfigured", t => {
  t.deepEqual(ConfigurableArbitrary.collectSpecs(), {});
});

test("provides arbitraries defined in the options", t => {
  t.deepEqual(
    ConfigurableArbitrary.collectSpecs({ str: jsc.string }),
    { str: jsc.string }
  );
});

test("filters out options that aren't arbitrary", t => {
  t.deepEqual(
    ConfigurableArbitrary.collectSpecs({ str: jsc.string, bool: false, num: jsc.number }),
    { str: jsc.string, num: jsc.number }
  );
});
