/**
 * Abstraction of internazionalitation library
 * with date support
 *
 * Use:
 * import t from '... lang'
 *
 * t('name') // Simple
 * t('name', {name: Terry, lastname: Bransom}) // with parameters
 * t('published_on', {date: new Date()}) // date
 *
 * Translations are on /public/translations if it were necessary you can
 * import translation as JSON from the database.
 */

import i18next from 'i18next';

import {
  SUPPORTED_LOCALES,
  FALLBACK_LOCALE,
  LOCALE_QUERY_PARAM,
  DEFAULT_TRANSLATION_URL_SCHEMA
} from '../../config/i18n';

import { formatDate } from './utils';

/**
 * @param {Object.<string, mixed>} opt options
 * @param {function} onSuccess
 * @param {function(string)} onError
 */
const initI18next = (opt, onSuccess, onError) => {
  i18next.init(opt, (err) => {
    if (err && onError) {
      onError(err);
    }

    onSuccess();
  });
};

/**
 * A singleton with a supported property
 * and a couple of helpful methods for checking
 * support and locale output
 *
 * Taken from: https://phraseapp.com/blog/posts/javascript-i18n-i18next-moment-js/
 */
const lang = {
  /**
   * Load library and translation files
   *
   * @param {?Object<string, mixed>} opt
   * @param {?string} opt.locale defaults to fallback
   * @param {?string} opt.loadTranslationsFrom defaults to configured value.
   *                                           accepts `{locale}` placeholder e.g.
   *                                           '/assets/translations/{locale}.json'
   * @param {?bool} debug defaults to false
   * @return Promise
   */
  init(opt) {
    // handle fallback
    const locale = this.active(opt.locale || this.getLocaleFromUserRequest());

    if (!this.isSupported(locale)) {
      return Promise.reject(new Error(`${locale} locale is not supported.`));
    }

    // we'll pass these to I18next
    const commonOpt = {
      lng: locale,
      debug: opt.debug || false,
      interpolation: opt.interpolation || {
        format(value, format) {
          if (value instanceof Date) {
            return formatDate(value, format, locale);
          }

          return value;
        }
      }
    };

    const fileUrlSchema = opt.loadTranslationsFrom || DEFAULT_TRANSLATION_URL_SCHEMA;
    // we create the locale URL from the given locale option,
    // then we make an AJAX call to retrieve the translation
    // file. once it's loaded, we pass its JSON on to i18next
    // and initialize it.
    return new Promise((resolve, reject) => {
      fetch(fileUrlSchema.replace(/{locale}/, locale))
        .then(response => response.json())
        .then((responseJson) => {
          const resources = {};
          resources[locale] = responseJson;

          initI18next(
            { resources, ...commonOpt },
            () => resolve(),
            err => reject(err)
          );
        })
        .catch(err => reject(err));
    });
  },

  /** @type {Array, <string>} */
  get supported() {
    return Object.keys(SUPPORTED_LOCALES);
  },

  /**
   * @param {string} localeCode
   * @return {bool}
   */
  isSupported(localeCode) {
    return !!SUPPORTED_LOCALES[localeCode];
  },

  /**
   * Name of the locale in its own language
   *
   * @param {string} localeCode
   * @return {string}
   */
  nameFor(localeCode) {
    return SUPPORTED_LOCALES[localeCode];
  },

  /** @return {string} */
  get fallback() {
    return FALLBACK_LOCALE;
  },

  /**
   * Get or set the active locale
   *
   * @param {?string} newLocaleCode
   * @return {string}
   */
  active(newLocaleCode = i18next.language) {
    if (newLocaleCode && this.isSupported(newLocaleCode)) {
      i18next.language = newLocaleCode;
    }

    return i18next.language || this.fallback;
  },

  /**
   * Returns current locale based on URL
   * i.e. http://localhost:3000/en/any_path
   * returns 'en' same for /es/ /ru/ etc.
   * If the language path doesn't exist it tries
   * to get the ?locale=en query parameter.
   * @return {string}
   */
  getLocaleFromUserRequest() {
    const pathNameArray = window.location.pathname.split('/');
    const segment = pathNameArray[1];

    if (Object.prototype.hasOwnProperty.call(SUPPORTED_LOCALES, segment)) {
      return segment;
    }
    return new URLSearchParams(window.location.search).get(LOCALE_QUERY_PARAM);
  },

  /**
   * Retrieve a translation for the active locale
   *
   * @param {string} key
   * @param {?Object<string, mixed>} opt
   * @param {?number} opt.count
   * @return {string}
   */
  t(key, opt) {
    return i18next.t(key, opt);
  }
};

export default lang.t;
export { lang };
