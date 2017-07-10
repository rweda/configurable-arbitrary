const test = require("ava");
const sinon = require("sinon");
const jsc = require("jsverify");
const merge = require("lodash.merge");
const rewire = require("rewire");

const _true = jsc.constant(true);
const _arr = jsc.array(jsc.string);

test.beforeEach(t => {
  const ConfigurableArbitrary = require("ConfigurableArbitrary");

  const baseFn = sinon.stub().returns( jsc.string );

  class BaseArbitrary extends ConfigurableArbitrary {
    static spec() {
      return {
        base: _true,
        baseFn,
        val: jsc.string,
      };
    }
  }

  class MiddleArbitrary extends BaseArbitrary {}

  class LastArbitrary extends MiddleArbitrary {
    static spec() {
      return {
        last: _true,
        val: _arr,
      }
    }
  }

  merge(t.context, { ConfigurableArbitrary, baseFn, BaseArbitrary, MiddleArbitrary, LastArbitrary });

});

test("properties from base are passed through", t => {
  const { LastArbitrary } = t.context;
  t.is(LastArbitrary.collectSpecs().base, _true);
});

test("properties from last arbitrary are passed through", t => {
  const { LastArbitrary } = t.context;
  t.is(LastArbitrary.collectSpecs().last, _true);
});

test("'LastArbitrary' overrides properties from 'BaseArbitrary'", t => {
  const { LastArbitrary } = t.context;
  t.is(LastArbitrary.collectSpecs().val, _arr);
});

test("Inherited 'spec' sections are not called", t => {
  const { baseFn, LastArbitrary } = t.context;
  LastArbitrary.collectSpecs();
  t.true(baseFn.calledOnce);
});
