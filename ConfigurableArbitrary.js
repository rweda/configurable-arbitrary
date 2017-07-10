const merge = require("lodash.merge");

/**
 * A "factory" for JSVerify generators that can be configured or composed to better meet the needs of individual tests.
*/
class ConfigurableArbitrary {

  /**
   * Determines if the given input is a JSVerify `arbitrary`.
   * @param {Any} input the value to check.
   * @return {Boolean} `true` if input looks like a JSVerify `arbitrary`.
   * @see https://github.com/jsverify/jsverify#types
  */
  static isArbitrary(input) {
    return (typeof input === "object" || typeof input === "function") && typeof input.generator === "function";
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
   * Provides the options defined in this layer and all previous layers of extended classes.
   * @return {Object[]} an array of the options from each layer below this class, starting with the lowest class in the
   *   inheritance chain.
  */
  static collectOptions() {
    if(this === ConfigurableArbitrary) { return []; }
    const parent = Object.getPrototypeOf(this);
    if(!this.hasOwnProperty("opts")) {
      return parent.collectOptions.call(parent);
    }
    return [ ...parent.collectOptions.call(parent), this.opts ];
  }

}

module.exports = ConfigurableArbitrary;
