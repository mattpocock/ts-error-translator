const withTM = require("next-transpile-modules")(["@ts-error-messages/engine"]);

module.exports = withTM({
  reactStrictMode: true,
});
