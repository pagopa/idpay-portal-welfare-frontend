import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import it from './it.json';

const i18nInstance = initReactI18next ? i18n.use(initReactI18next) : i18n;

void i18nInstance.init({
  resources: {
    it: { translation: it },
  },
  lng: 'it',
  fallbackLng: 'it',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
