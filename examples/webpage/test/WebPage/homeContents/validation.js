const jsc = require("jsverify");
jsc.ava = require("ava-verify");

const mockery = require("mockery");
mockery.registerSubstitute("configurable-arbitrary", "ConfigurableArbitrary");
mockery.enable({
  warnOnUnregistered: false,
});

const ArbitraryWebPage = require("examples/webpage/ArbitraryWebPage");

jsc.ava({
  suite: "throws Error if 'category' isn't 'homepage'",
}, [ ArbitraryWebPage.build({ category: [ "static", "blog-post" ] }) ], (t, page) => {
  t.throws(() => page.homeContents());
});
