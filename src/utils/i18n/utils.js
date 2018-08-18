/* eslint import/prefer-default-export: 0 */
import { lang } from './lang';
import { FALLBACK_LOCALE } from '../../config/i18n';

export function formatDate(value, format, locale) {
  const options = {};

  format.split(';').forEach((part) => {
    const [key, values] = part.split(':');
    options[key.trim()] = values.trim();
  });

  try {
    return new Intl.DateTimeFormat(locale, options).format(value);
  } catch (error) {
    throw new Error('Error', error);
  }
}

/**
 * Get path for locale switcher component
 * @param {string} currentLang
 * @param {string} pathname
 * @param {string} nextLang
 * @returns {string}
 */
export function getPath(currentLang, pathname, nextLang) {
  if (currentLang === 'en' && nextLang !== 'en') {
    return `/${nextLang}${pathname}`;
  }
  if (nextLang === 'en') {
    return pathname.substr(3);
  }
  return pathname;
}

/**
 * Get Link with language
 * i.e: /es/login
 * @param {string} pathname
 * @returns {string}
 */
export function getLink(pathname) {
  if (lang.active() !== FALLBACK_LOCALE) {
    return `/${lang.active()}/${pathname}`;
  }
  return pathname;
}
