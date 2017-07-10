const test = require("ava");
const ConfigurableArbitrary = require("ConfigurableArbitrary");

const optName = "testedOption";
const initialValue = 15;
const finalValue = 20;

function overrides(t, initial, final) {

  function add(name, opts) {
    if(name === initial) { opts[optName] = initialValue; }
    if(name === final) { opts[optName] = finalValue; }
  }

  const baseOpts = {};
  const extendedOpts = {};
  const runtime = {};

  add("base", baseOpts);
  add("extended", extendedOpts);
  add("runtime", runtime);

  class BaseClass extends ConfigurableArbitrary {
    static get opts() {
      return baseOpts;
    }
  }

  class ExtendedClass extends ConfigurableArbitrary {
    static get opts() {
      return extendedOpts;
    }
  }

  const options = ExtendedClass.options(runtime);
  t.is(options[optName], finalValue);

}

overrides.title = (title, initial, final) => `'${final}' options override '${initial}' options`;

test(overrides, "base", "extended");
test(overrides, "base", "runtime");
test(overrides, "extended", "runtime");
