import i18n from 'i18next';
import commonTranslations from './en/common.json';
import components from './en/components.json';
import enums from './en/enums.json';
import pages from './en/pages.json';

import { initReactI18next } from 'react-i18next';

export const resources = {
  en: {
    common: commonTranslations,
    components,
    enums,
    pages,
  },
} as const;

i18n.use(initReactI18next).init({
  lng: 'en',
  ns: ['common', 'components', 'enums', 'pages'],
  defaultNS: 'common',
  nsSeparator: ':',
  interpolation: {
    escapeValue: false,
  },
  resources,
});
