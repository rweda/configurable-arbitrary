const test = require("ava");
const sinon = require("sinon");
const jsc = require("jsverify");
const ConfigurableArbitrary = require("ConfigurableArbitrary");

test("when 'given' is not an Arbitrary", t => {
  let output = jsc.string;
  t.is(ConfigurableArbitrary.defaultArbitrary(null, () => output), output);
});

test("doesn't call function if 'given' is an Arbitrary", t => {
  let callback = sinon.spy();
  ConfigurableArbitrary.defaultArbitrary(jsc.bool, callback);
  t.false(callback.called);
});
