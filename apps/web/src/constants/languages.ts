export interface Language {
  flag: string; // e.g. 🇺🇸
  name: string; // e.g. English
  id: string; // e.g. en-US
}

export const languages: Language[] = [
  {
    flag: '🇺🇸',
    name: 'English',
    id: 'en',
  },
  {
    flag: '🇲🇽',
    name: 'Español (MEX)',
    id: 'es-MX',
  },
];
