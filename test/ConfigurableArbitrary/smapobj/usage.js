const util = require("util");
const test = require("ava");
const jsc = require("jsverify");
const ConfigurableArbitrary = require("ConfigurableArbitrary");

test.beforeEach("creates smap example", t => {
  const start = jsc.record({ a: jsc.nestring });
  const end = ConfigurableArbitrary.smapobj(start, (obj) => {
    return { b: obj.a };
  });
  t.context.start = start;
  t.context.end = end;
});

test("uses forward transformation", t => {
  t.plan(2);
  const { end } = t.context;
  const generated = end.generator(50);
  t.is(typeof generated.b, "string");
  t.is(typeof generated.a, "undefined");
});

test("stores original record in a Symbol", t => {
  const { end } = t.context;
  const generated = end.generator(50);
  t.not(util.inspect(generated).indexOf("Symbol(smap stimulus)"), -1);
});

test("stored Symbol does not show up in 'Object.keys()'", t => {
  const { end } = t.context;
  const generated = end.generator(50);
  t.is(Object.keys(generated).length, 1);
});

test("stored Symbol does not show up in 'for in' loop", t => {
  const { end } = t.context;
  const generated = end.generator(50);
  const keys = [];
  for(const k in generated) {
    if(!generated.hasOwnProperty(k)) { continue; }
    keys.push(k);
  }
  t.is(keys.length, 1);
});

test("uses reverse transformation to shrink", t => {
  t.plan(2);
  const { end } = t.context;
  const generated = end.generator(50);
  const smaller = end.shrink(generated).headValue;
  t.notDeepEqual(generated, smaller);
  t.true(smaller.b.length < generated.b.length);
});
