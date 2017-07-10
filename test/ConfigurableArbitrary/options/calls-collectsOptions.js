const test = require("ava");
const sinon = require("sinon");
const ConfigurableArbitrary = require("ConfigurableArbitrary");

test("calls 'collectOptions'", t => {

  class Mockable extends ConfigurableArbitrary {}

  sinon.spy(Mockable, "collectOptions");
  Mockable.options();
  t.true(Mockable.collectOptions.calledOnce);

});
