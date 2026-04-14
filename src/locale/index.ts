import i18n from './i18n';
import './i18nSelfcare';

export const t = (key: string, options?: Record<string, unknown>): string =>
  (i18n as any).t(key, options);

export default i18n;
