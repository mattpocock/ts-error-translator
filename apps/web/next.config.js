const withTM = require('next-transpile-modules')([
  '@total-typescript/error-translation-engine',
]);

module.exports = withTM({
  reactStrictMode: true,
});
