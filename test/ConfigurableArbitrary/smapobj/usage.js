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

if(require("semver").gt(process.versions.node, '8.0.0')) {
  // `util.inspect` will show Symbols in output only in Node 8+.  For other versions, skip this test.
  // The functionality is still checked in later tests - `shrink` won't work without this symbol.
  // But if we're on 8+, then we can check earlier.
  test("stores original record in a Symbol", t => {
    const { end } = t.context;
    const generated = end.generator(50);
    t.not(util.inspect(generated).indexOf("Symbol(smap stimulus)"), -1);
  });
}

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
  const { end } = t.context;
  const runs = 50;
  // Tracks the number of generated values that were unshrinkable
  let short = 0;
  /**
   * Uses the generator to create stimulus.
   * If the stimulus is shrinkable, shrinks, ensures shrunk value is not the initial value, and the shrunk value is
   * shorter.
   * If unshrinkable, increments `short` and continues.
  */
  function reverseTransform() {
    const generated = end.generator(50);
    if(generated.b.length <= 1) { ++short; return; }
    const smaller = end.shrink(generated).headValue;
    t.notDeepEqual(generated, smaller);
    t.true(smaller.b.length < generated.b.length);
  }
  for (let run = 0; run < runs; ++run) { reverseTransform(); }
  t.plan(((runs - short) * 2) + 2);
  t.true(short > 1,
    `expected at least two tests to generate unshrinkable stimulus.  Only ${short} stimuli were unshrinkable`);
  t.true(short < runs - 2,
    `expected at least two tests to generated shrinkable stimuli.  Only ${runs - short} were shrinkable`);
});
