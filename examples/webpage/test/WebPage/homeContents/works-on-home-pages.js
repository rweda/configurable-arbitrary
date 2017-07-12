const jsc = require("jsverify");
jsc.ava = require("ava-verify");

const mockery = require("mockery");
mockery.registerSubstitute("configurable-arbitrary", "ConfigurableArbitrary");
mockery.enable({
  warnOnUnregistered: false,
});

const ArbitraryWebPage = require("examples/webpage/ArbitraryWebPage");

jsc.ava({
  suite: "returns body when 'category' === 'homepage'",
}, [ ArbitraryWebPage.build({ category: "homepage" }) ], (t, page) => {
  t.is(typeof page.homeContents(), "string");
});
