import i18n from 'i18n-js';
import en from './en.json';
import vn from './vi.json';

i18n.defaultLocale = 'vn';
i18n.locale = 'vn';
i18n.translations = {en, vn};

i18n.fallbacks = true;
i18n.missingTranslation = function () {
  // eslint-disable-next-line prefer-rest-params
  return arguments[0];
};

// i18n.translations = { fr, en };
// console.log(Localization.locale);

export default i18n;
