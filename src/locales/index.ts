import en from './en';
import de from './de';

export type TranslationKeys = typeof en;

export const languages = {
  en,
  de
};

export const languageNames = {
  en: 'English',
  de: 'Deutsch'
};

export type LanguageCode = keyof typeof languages; 