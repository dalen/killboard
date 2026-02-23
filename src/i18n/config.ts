import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import commonTranslations from './en/common.json';
import components from './en/components.json';
import enums from './en/enums.json';
import pages from './en/pages.json';

export const resources = {
  en: {
    common: commonTranslations,
    components,
    enums,
    pages,
  },
} as const;

void i18n.use(initReactI18next).init({
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
  lng: 'en',
  ns: ['common', 'components', 'enums', 'pages'],
  nsSeparator: ':',
  resources,
});
