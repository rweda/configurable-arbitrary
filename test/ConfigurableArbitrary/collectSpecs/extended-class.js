const test = require("ava");
const sinon = require("sinon");
const rewire = require("rewire");
const jsc = require("jsverify");

test("calls up the tree", t => {
  const ConfigurableArbitrary = rewire("ConfigurableArbitrary");
  class ExtendedArbitrary extends ConfigurableArbitrary {}

  sinon.spy(ConfigurableArbitrary, "collectSpecs");
  ExtendedArbitrary.collectSpecs();
  t.true(ConfigurableArbitrary.collectSpecs.calledTwice);
});

test("uses arbitraries defined in options", t => {
  const ConfigurableArbitrary = rewire("ConfigurableArbitrary");
  class ExtendedArbitrary extends ConfigurableArbitrary {}

  t.deepEqual(
    ExtendedArbitrary.collectSpecs({ str: jsc.string }),
    { str: jsc.string }
  );
});

test("local properties can override options", t => {
  const final = jsc.array(jsc.string);
  const ConfigurableArbitrary = rewire("ConfigurableArbitrary");
  class ExtendedArbitrary extends ConfigurableArbitrary {
    static spec() {
      return {
        str: final,
      };
    }
  }

  t.deepEqual(
    ExtendedArbitrary.collectSpecs({ str: jsc.string }),
    { str: final }
  );
});
