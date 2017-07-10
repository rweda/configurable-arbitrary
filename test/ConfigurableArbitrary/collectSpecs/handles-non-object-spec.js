const test = require("ava");
const sinon = require("sinon");
const ConfigurableArbitrary = require("ConfigurableArbitrary");

test.beforeEach(() => {
  sinon.stub(console, "warn");
});

test.afterEach.always(() => {
  console.warn.restore();
});

class ArrayArbitrary extends ConfigurableArbitrary {

  static spec() { return []; }

}

class NoReturnArbitrary extends ConfigurableArbitrary {

  static spec() {}

}

class IntArbitrary extends ConfigurableArbitrary {

  static spec() { return 1; }

}

test.serial("handles arrays", t => {
  t.plan(3);
  t.deepEqual(ArrayArbitrary.collectSpecs(), {});
  t.true(console.warn.calledOnce);
  t.not(console.warn.firstCall.args[0].indexOf("object"), -1);
});

test.serial("handles no return value", t => {
  t.plan(2);
  t.deepEqual(NoReturnArbitrary.collectSpecs(), {});
  t.not(console.warn.firstCall.args[0].indexOf("undefined"), -1);
});

test.serial("handles integers", t => {
  t.plan(2);
  t.deepEqual(IntArbitrary.collectSpecs(), {});
  t.not(console.warn.firstCall.args[0].indexOf("number"), -1);
});
