class ConfigurableArbitrary {

  static isArbitrary(input) {
    return (typeof input === "object" || typeof input === "function") && typeof input.generator === "function";
  }

}

module.exports = ConfigurableArbitrary;
