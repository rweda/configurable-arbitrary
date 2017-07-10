const test = require("ava");
const ConfigurableArbitrary = require("ConfigurableArbitrary");

class TheArbitrary extends ConfigurableArbitrary {

  static spec() {
    return {
      foo: 1,
    };
  }

}

test("omits non-Arbitrary items from spec inside extended class", t => {
  const out = TheArbitrary.collectSpecs();
  t.is(typeof out.foo, "undefined");
});
