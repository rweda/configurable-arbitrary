# Changelog

## [Unreleased]
[Unreleased]: https://github.com/rweda/configurable-arbitrary/compare/v0.0.1...HEAD

### Modified

- Prevented `ConfigurableArbitrary#arb` from swallowing too many errors in `try`/`catch` block.

## [0.0.2] - 2017-07-14

[Code][0.0.2] ([Diff][0.0.2-diff]) | [Changelog][0.0.2-log]

Docs, examples, bugfixes, and utilities.

### Added

- `webpage` example
- `ConfigurableArbitrary` utilities:
  - `defaultArbitrary`
  - `smapobj`
- Configuration for Travis to test on Node 7 and 8 (#4)

### Modified

- Fixed `isArbitrary` to handle `null` (threw error as `typeof null === "object"`)
- Fixed partially failing test (#2)

[0.0.2]: https://github.com/rweda/configurable-arbitrary/tree/v0.0.2
[0.0.2-diff]: https://github.com/rweda/configurable-arbitrary/compare/v0.0.1...v0.0.2
[0.0.2-log]:  https://github.com/rweda/configurable-arbitrary/blob/master/CHANGELOG.md#002---2017-07-14

## [0.0.1] - 2017-07-11

[Code][0.0.1] ([Diff][0.0.1-diff]) | [Changelog][0.0.1-log]

Initial release.  Implemented core configuration API.

### Added
- `ConfigurableArbitrary`
  - Main flow: `build`, `options`, `arb`, and `transform`
  - Helper functions: `collectOptions`, `collectSpecs`

[0.0.1]: https://github.com/rweda/configurable-arbitrary/tree/v0.0.1
[0.0.1-diff]: https://github.com/rweda/configurable-arbitrary/compare/eb77ef1ac0a8d0e6e666312a293e8a77de17d179...0.0.1
[0.0.1-log]:  https://github.com/rweda/configurable-arbitrary/blob/master/CHANGELOG.md#001---2017-07-11
