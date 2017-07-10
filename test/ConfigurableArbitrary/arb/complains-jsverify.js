const test = require("ava");
const proxyquire = require("proxyquire");
const ConfigurableArbitrary = proxyquire("ConfigurableArbitrary", {
  jsverify: null,
});

test("complains if can't require 'jsverify'", t => {
  const err = t.throws(() => ConfigurableArbitrary.arb(), Error);
  t.not(err.message.indexOf("optionalDependency"), -1);
});
