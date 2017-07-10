const test = require("ava");
const sinon = require("sinon");
const rewire = require("rewire");


test.beforeEach(t => {
  const ConfigurableArbitrary = rewire("ConfigurableArbitrary");
  class OneExtension extends ConfigurableArbitrary {
    static get opts() { return { bool: true, one: 1 }; }
  }
  class TwoExtensions extends OneExtension {
    static get opts() { return { bool: false, two: 2 }; }
  }
  t.context.ConfigurableArbitrary = ConfigurableArbitrary;
  t.context.OneExtension = OneExtension;
  t.context.TwoExtensions = TwoExtensions;
});

test("can be called directly on 'ConfigurableArbitrary'", t => {
  const ConfigurableArbitrary = t.context.ConfigurableArbitrary;
  t.deepEqual(ConfigurableArbitrary.collectOptions(), []);
});

test("traverses up to 'ConfigurableArbitrary' after extending once", t => {
  const { ConfigurableArbitrary, OneExtension } = t.context;
  sinon.spy(ConfigurableArbitrary, "collectOptions");
  OneExtension.collectOptions();
  t.is(ConfigurableArbitrary.collectOptions.callCount, 2);
});

test("traverses up to 'ConfigurableArbitrary' after extending twice", t => {
  const { ConfigurableArbitrary, TwoExtensions } = t.context;
  sinon.spy(ConfigurableArbitrary, "collectOptions");
  TwoExtensions.collectOptions();
  t.is(ConfigurableArbitrary.collectOptions.callCount, 3);
});

test("provides options from each layer", t => {
  const { OneExtension, TwoExtensions } = t.context;
  t.deepEqual(
    TwoExtensions.collectOptions(),
    [ OneExtension.opts, TwoExtensions.opts ]
  );
});

test("omits layers that don't define options", t => {
  const { ConfigurableArbitrary } = t.context;
  class FirstOptions extends ConfigurableArbitrary {
    static get opts() { return { first: true }; }
  }
  class NoOpts extends FirstOptions {}
  class SecondOptions extends NoOpts {
    static get opts() { return { second: true }; }
  }
  t.deepEqual(SecondOptions.collectOptions(), [ FirstOptions.opts, SecondOptions.opts ]);
});
