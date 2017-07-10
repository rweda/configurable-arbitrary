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

}

module.exports = ConfigurableArbitrary;
