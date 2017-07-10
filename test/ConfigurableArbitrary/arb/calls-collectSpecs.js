const test = require("ava");
const sinon = require("sinon");
const ConfigurableArbitrary = require("ConfigurableArbitrary");

test("calls 'collectSpecs'", t => {
  sinon.spy(ConfigurableArbitrary, "collectSpecs");
  ConfigurableArbitrary.arb();
  t.true(ConfigurableArbitrary.collectSpecs.calledOnce);
});
