import en from '../locales/en';
import esMX from '../locales/es-MX';

export type Locale = string | 'en' | 'es-MX' | 'en-US';

export function getTranslations(locale?: Locale) {
  switch (locale) {
    case 'en':
    case 'en-US':
      return en;
    case 'es-MX':
      return esMX;
    default:
      return en;
  }
}
