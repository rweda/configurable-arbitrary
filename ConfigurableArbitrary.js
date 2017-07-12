const merge = require("lodash.merge");
const pickBy = require("lodash.pickby");

const smapKey = Symbol("smap stimulus");

/**
 * A "factory" for JSVerify generators that can be configured or composed to better meet the needs of individual tests.
*/
class ConfigurableArbitrary {

  /**
   * Executes this Arbitrary "factory" given configuration options.
   * By default, merges given options with defaults defined in any classes in the current inheritance chain,
   * generates options from any given arbitraries and passes that object into `jsc.record` to create an
   * Arbitrary<Object>, and optionally transforms that generated object with any transformations defined in
   * {@link ConfigurableArbitrary.transform}.
   * @param {Object} opts options to configure the arbitrary.
   * @return {Arbitrary<Object>} by default, returns an Arbitrary object, but the return type can be changed by
   *   {@link ConfigurableArbitrary.transform}.
   */
  static build(opts) {
    return this.transform(this.arb(this.options(opts)));
  }

  /**
   * Determines if the given input is a JSVerify `arbitrary`.
   * @param {Any} input the value to check.
   * @return {Boolean} `true` if input looks like a JSVerify `arbitrary`.
   * @see https://github.com/jsverify/jsverify#types
  */
  static isArbitrary(input) {
    return input !== null
      && (typeof input === "object" || typeof input === "function")
      && typeof input.generator === "function";
  }

  /**
   * Collect all options for this arbitrary.  Merges options defined in each inherited class under 'opts'.
   * @param {Object} opts run-time options handed to this {@link ConfigurableArbitrary}.  Take priority over options
   *   defined in previous layers.
   * @return {Object} the merged options taking each layer of options into consideration.
  */
  static options(opts) {
    return merge(...this.collectOptions(), opts);
  }

  /**
   * Convert the options merged into a JSVerify `arbitrary`.
   * By default, a `jsc.record` is used to package arbitraries found, starting with any arbitraries in 'opts'.
   * Then the inheritance tree is traversed by {@link ConfigurableArbitrary.collectSpecs}, from the base class to
   * the last extended class.
   * Each class in the tree that defines a `spec` method is provided with `opts`, and expected to return a flat object.
   * Any arbitraries returned are passed to `jsc.record`.  Any functions returned are called with `val, opts`,
   * with the current arbitrary (if one is defined) and the entire option set, and can return arbitraries.
   * @param {Object} opts the current program options.
   * @return {Arbitrary} an arbitrary created based on the options passed in.
   * @see https://github.com/jsverify/jsverify#types
  */
  static arb(opts) {
    try {
      return require("jsverify").record(this.collectSpecs(opts));
    }
    catch (err) {
      throw new Error("'jsverify' is listed as an optionalDependency.  Make sure it's installed before calling 'arb'.");
    }
  }

  /**
   * Can be used to transform the outputted `arbitrary`, such as using `smap`.  Defined as a 'noop' in the abstract
   * class that preforms no transformations.
   * @param {Arbitrary} arb the raw arbitrary that can be transformed
   * @return {Arbitrary} the arbitrary after any transformations have been preformed.
   * @abstract
   * @see https://github.com/jsverify/jsverify#arbitrary-data
  */
  static transform(arb) { return arb; }

  /**
   * Provides the options defined in this layer and all previous layers of extended classes.
   * @return {Object[]} an array of the options from each layer below this class, starting with the lowest class in the
   *   inheritance chain.
   * @private
  */
  static collectOptions() {
    if(this === ConfigurableArbitrary) { return []; }
    const parent = Object.getPrototypeOf(this);
    if(!this.hasOwnProperty("opts")) {
      return parent.collectOptions.call(parent);
    }
    return [ ...parent.collectOptions.call(parent), this.opts ];
  }

  /**
   * Creates an object of arbitraries for {@link ConfigurableArbitrary.arb}.  Uses arbitraries from `opts` and inherited
   * classes, then evaluates the current `spec` method (if defined), passing the given `opts`.
   * Any arbitraries returned from `spec` override existing arbitraries.  Functions returned by `spec` are passed
   * the previous arbitrary value with the same name as well as all options, and expected to return an arbitrary.
   * If `spec` is defined but doesn't return an object, evaulation is skipped and a message is logged.
   * @param {Object} opts the program options
   * @return {Object<String, Arbitrary>} arbitraries to give to {@link ConfigurableArbitrary.arb}.
   * @private
  */
  static collectSpecs(opts) {
    if(this === ConfigurableArbitrary) {
      return typeof opts === "object" && !Array.isArray(opts) ? pickBy(opts, this.isArbitrary) : {};
    }
    const parent = Object.getPrototypeOf(this);
    const spec = parent.collectSpecs.call(parent, opts);
    if(!this.hasOwnProperty("spec") || typeof this.spec !== "function") {
      return spec;
    }
    const local = this.spec(opts);
    if(typeof local !== "object" || Array.isArray(local)) {
      console.warn(`spec() returned a '${typeof local}', expected 'object'.  Skipping arbitraries.`);
      return spec;
    }
    for(const k in local) {
      let val = local[k];
      if(typeof val === "function") { val = val(spec[k], opts); }
      if(this.isArbitrary(val)) { spec[k] = val; }
    }
    return spec;
  }

  /**
   * Utility method to configure a default arbitrary if a lower level hasn't provided an arbitrary.
   * @param {Arbitrary|Any} given the value to use if it's an arbitrary.
   * @param {Arbitrary|Function<Arbitrary>} fallback an Arbitrary or a function that returns an Arbitrary to use if the
   *   given value isn't an arbitrary.
   * @return {Arbitrary} `given` if arbitrary, otherwise `fallback`.
  */
  static defaultArbitrary(given, fallback) {
    if(this.isArbitrary(given)) { return given; }
    if(!this.isArbitrary(fallback) && typeof fallback === "function") { fallback = fallback(); }
    return fallback;
  }

  /**
   * A simple `smap` that works when returning an object.  Stores a copy of the stimulus in a "hidden" key of the object
   * (stored under a `Symbol` to prevent collisions) that is retrieved in the reverse map function.
   * @param {Arbitrary} arb the incoming arbitrary that should be `smap`ed
   * @param {Function<Object>} cb a forward mapping function that returns an object.
   * @return {Arbitrary<Object>} the result of the `smap`ed arbitrary.
   * @see https://github.com/jsverify/jsverify#arbitrary-data
  */
  static smapobj(arb, cb) {
    function forward(...data) {
      let obj = cb(...data);
      if(typeof obj[smapKey] !== "undefined") {
        throw new Error(`object returned to 'smap' already has a '${String(smapKey)}'`);
      }
      obj[smapKey] = data[0];
      return obj;
    }

    function reverse(obj) {
      if(typeof obj[smapKey] === "undefined" || obj[smapKey] === null) {
        throw new Error(`Reverse 'smap' must be given an object with a '${String(smapKey)}'`);
      }
      return obj[smapKey];
    }

    return arb.smap(forward, reverse);
  }

}

module.exports = ConfigurableArbitrary;
