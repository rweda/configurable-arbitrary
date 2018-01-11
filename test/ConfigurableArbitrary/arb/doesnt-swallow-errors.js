const test = require("ava");
const sinon = require("sinon");
const ConfigurableArbitrary = require("ConfigurableArbitrary");

test.before("make 'collectSpecs' throw an error", () => {
  sinon
    .stub(ConfigurableArbitrary, "collectSpecs")
    .throws(new TypeError("Don't swallow me!"));
});

test("doesn't swallow errors from '#collectSpecs()'", t => {
  t.plan(2);
  const err = t.throws(() => ConfigurableArbitrary.arb(), TypeError);
  t.is(err.message, "Don't swallow me!");
});
