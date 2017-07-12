const jsc = require("jsverify");
//const ConfigurableArbitrary = require("configurable-arbitrary");
const ConfigurableArbitrary = require("configurable-arbitrary");
const WebPage = require("./WebPage");

/**
 * The IDs for the site categories indexed by category name.
 * @typedef {Object<String, Number>} examples/webpage.ArbitraryWebPage.CategoryOptions
*/

/**
 * @typedef {Object} examples/webpage.ArbitraryWebPage.Options
 * @property {Arbitrary<String>} title overrides the default title generator (`jsc.nestring`)
 * @property {Arbitrary<String>} body overrides the default body generator (`jsc.nestring`)
 * @property {examples/webpage.ArbitraryWebPage.CategoryOptions} categories the possible categories to choose from
 * @property {(Arbitrary<Number>|String|String[])} category a generator to override the default category generator,
 *   the name of one of the site categories, or an array of potential site categories.  If `null`, uses any of the
 *   default categories.
*/

/**
 * @memberof examples/webpage
*/
class ArbitraryWebPage extends ConfigurableArbitrary {

  static get opts() {
    return {

      categories: { "homepage": 0, "static": 1, "blog-post": 2 },

      category: null,

      title: jsc.string,

      body: jsc.string,

    };
  }

  /**
   * @param {examples/webpage.ArbitraryWebPage.Options} opts options to configure generation.
  */
  static spec(opts) {
    return {

      category: current => this.defaultArbitrary(current, () => this.category(opts.category, opts.categories)),

    };
  }

  /**
   * @param {Record} arb the generated record.
  */
  static transform(arb) {
    return this.smapobj(arb, opts => {
      return new WebPage(opts.category, opts.title, opts.body);
    });
  }

  /**
   * Provides an arbitrary out of the options given.
   * @param {String|String[]} pick one or more valid category names that should be used
   * @param {examples/webpage.ArbitraryWebPage.CategoryOptions} categories the possible categories to use.
   * @return {Arbitrary<Number>} will generate category ids that match the picked categories.
  */
  static category(pick, categories) {
    if(typeof pick === "string") {
      return jsc.constant(categories[pick]);
    }
    let opts = [];
    for(let category in categories) {
      if(Array.isArray(pick) && pick.indexOf(category) === -1) { continue; }
      opts.push(jsc.constant(categories[category]));
    }
    return jsc.oneof(opts);
  }

}

module.exports = ArbitraryWebPage;
