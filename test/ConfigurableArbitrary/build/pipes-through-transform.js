const test = require("ava");
const sinon = require("sinon");
const jsc = require("jsverify");
const ConfigurableArbitrary = require("ConfigurableArbitrary");

test("calls transform with the created Arbitrary", t => {
  t.plan(3);
  let otherObj = { test: true, foo: "bar" };
  sinon.stub(ConfigurableArbitrary, "transform").returns(otherObj);
  t.is(ConfigurableArbitrary.build({ int: jsc.number }), otherObj);
  t.true(ConfigurableArbitrary.transform.calledOnce);
  t.true(ConfigurableArbitrary.isArbitrary(ConfigurableArbitrary.transform.firstCall.args[0]));
});
