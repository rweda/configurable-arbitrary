# ConfigurableArbitrary
<p stile="text-align: center" align="center">
  <a href="https://www.npmjs.com/package/configurable-arbitrary">
    <img src="https://img.shields.io/npm/v/configurable-arbitrary.svg">
  </a>
  <a href="(https://travis-ci.org/rweda/configurable-arbitrary">
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

[jsverify]: https://github.com/jsverify/jsverify
[jsc-types]: https://github.com/jsverify/jsverify#types
[QuickCheck]: https://en.wikipedia.org/wiki/QuickCheck
[Node.js]: https://nodejs.org/en/
