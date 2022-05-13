const withTM = require('next-transpile-modules')(['@ts-error-messages/engine']);

module.exports = withTM({
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'es-MX'],
    defaultLocale: 'en',
  },
});
