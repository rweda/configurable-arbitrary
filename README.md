<h1 style="text-align: center" align="center">ConfigurableArbitrary</h1>
<p stile="text-align: center" align="center">
  <a href="https://www.npmjs.com/package/configurable-arbitrary">
    <img src="https://img.shields.io/npm/v/configurable-arbitrary.svg">
  </a>
  <a href="https://travis-ci.org/rweda/configurable-arbitrary">
    <img src="https://img.shields.io/travis/rweda/configurable-arbitrary.svg" />
  </a>
  <a href="https://codecov.io/gh/rweda/configurable-arbitrary">
    <img src="https://img.shields.io/codecov/c/gh/rweda/configurable-arbitrary.svg" />
  </a>
</p>
<p style="text-align: center; font-size: 120%;" align="center">
  Configurable.  Extendable.  Modular.  Concise.
</p>

ConfigurableArbitrary helps you write intermediate and final data structures for [JSVerify][jsverify], a powerful
[QuickCheck][] library for [Node.JS][].

## Background

JSVerify has a built-in type `Arbitrary`, which can generate stimulus for testing.  JSVerify ships with arbitraries for
primitive data types (string, number, etc.) and you can create your own generators.

However, JSVerify arbitraries can't be configured.  Instead, JSVerify has seperate arbitraries for different use cases,
including `nestring` to ensure the string has contents, and `asciistring` to ensure that characters can only come from
the ASCII character set.

Shipping different arbitraries for primitive types works, but becomes impossible when dealing with larger data types.
That's where ConfigurableArbitrary steps in.

## Overview

ConfigurableArbitrary is base class that goes from run-time configuration to an Arbitrary, intended for creating object
instances and other complex data types.

This process is broken into three stages to allow flexibility through stage-specific configuration or stages to be fully
overridden.

Users should extend the [`ConfigurableArbitrary`][] class to provide properties or replace classes.
[`ConfigurableArbitrary`][] comes with methods for each stage, starting with [`ConfigurableArbitrary.build`][].
The class also contains internal methods to help some of the stages, and some basic utilities that simplify option
definitions.

### Stage 1: Configuration

Out of the box, `ConfigurableArbitrary` comes without any configuration options.
However, the class is setup to parse any options you'd like to define.

By default, these options won't be used in the final output.  They are just to provide options to the actual generator.

The first stage involves merging option defaults from the extended class
(and any other class between the final class and `ConfigurableArbitrary`), and merging these with the user-defined
options.

Each sub-class of `ConfigurableArbitrary` can define an `opts` property that will be merged into the run-time
configuration:

```js
const ConfigurableArbitrary = require("configurable-arbitrary");

class URLArbitrary extends ConfigurableArbitrary {
  static get opts() {
    return {
      
      protocols: [ "http://", "https://" ],
      
      protocol: null,
      
      domain: null,
      
      path: null,
      
      title: null,
      
    };
  }
}
```

### Stage 2: Arbitrary Specification

Because `ConfigurableArbitrary` was created with objects and complex data types in mind, it assumes that most users will
want multiple Arbitrary values to configure.

Even for our simple `URLArbitrary` above, which will just output a single string and the page title, the configuration
is split into several chunks so that users can override specific sections of the URL while leaving the other sections
unchanged.

By default, `ConfigurableArbitrary` will collect each `Arbitrary` that is needed for the 

Each sub-class of `ConfigurableArbitrary` can define a `spec` method, which will be merged into an object that is passed
to `jsverify.record`, which will merge them into an object so they can be passed as a single variable.

The `spec` object will be pre-populated with any options that already are `Arbitrary` objects.

```js
const jsc = require("jsverify");

class URLArbitrary extends ConfigurableArbitrary {
  static spec(opts) {
    return {
      
      protocol: protocol => this.defaultArbitrary(protocol, () => this.protocol(opts.protocols)),
      
      domain: domain => this.defaultArbitrary(domain, jsc.nestring),
      
      path: path => this.defaultArbitrary(path, jsc.string),
      
      title: title => this.defaultArbitrary(title, jsc.string),
      
    };
  }
  
  static protocol(protocols) {
    return jsc.oneof(protocols.map(protocol => jsc.constant(protocol)));
  }
}
```

This example uses [`ConfigurableArbitrary.defaultArbitrary`][], which uses previously-defined arbitraries
(such as arbitraries coming from run-time options) if they exist, otherwise it uses the defined arbitrary for this
stage.

### Stage 3: Transformations

`ConfigurableArbitrary` lets you define a `transform` method that is passed the `Arbitrary` created by  `jsc.record()`
in the previous step.
By default, `ConfigurableArbitrary` uses a no-op/identity function that does not apply any transformation.

Unlike `opts` and `spec` which traverse the inheritance tree and merge all intermediate classes, `transform` is only
called on the final step, and you must manually call `super` to get the result from intermediate classes.

```js
class URLArbitrary extends ConfigurableArbitrary {
  static transform(arb) {
    return this.smapobj(arb, (opts) => {
      return {
        url: `${opts.protocol}${opts.domain}${opts.path}`,
        title: opts.title,
      };
    });
  }
}
```

This example uses [`ConfigurableArbitrary.smapobj`][], which automatically preforms a two-way mapping which is
[needed for jsverify][jsc-smap].

### Usage of URLArbitrary

Now that we've defined the `URLArbitrary`, we can use it in testing.

```js
const jsc = require("jsverify");
jsc.ava = require("ava-verify");

const arb = URLArbitrary.build({
  path: jsc.constant("/"),
  title: jsc.constant("Google"),
});

jsc.ava({
  suite: "Creates URLs",
}, [ arb ], (t, url) => {
  t.not(url.url.indexOf("://"), -1);
});
```

This test is running via our [ava-verify][] plugin for the AVA test runner, but the arbitrary will work in any JSVerify
test platform.

[jsverify]: https://github.com/jsverify/jsverify
[jsc-types]: https://github.com/jsverify/jsverify#types
[jsc-smap]: https://github.com/jsverify/jsverify#arbitrary-data
[QuickCheck]: https://en.wikipedia.org/wiki/QuickCheck
[Node.js]: https://nodejs.org/en/
[ava-verify]: https://github.com/rweda/ava-verify
[`ConfigurableArbitrary`]: http://configurable-arbitrary.surge.sh/docs/ConfigurableArbitrary.html
[`ConfigurableArbitrary.build`]: http://configurable-arbitrary.surge.sh/docs/ConfigurableArbitrary.html#.build
[`ConfigurableArbitrary.defaultArbitrary`]: http://configurable-arbitrary.surge.sh/docs/ConfigurableArbitrary.html#.defaultArbitrary
[`ConfigurableArbitrary.smapobj`]: http://configurable-arbitrary.surge.sh/docs/ConfigurableArbitrary.html#.smapobj
